import { chromium } from "playwright"

const BASE = "http://localhost:3737"
const STAMP = Date.now().toString().slice(-6)
const VENDOR_NAME = `__verify_${STAMP}`
const VENDOR_NAME_EDITED = `__verify_${STAMP}_edited`

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } })

page.on("pageerror", (e) => console.log("PAGE ERROR:", e.message))
page.on("console", (m) => {
  if (m.type() === "error") console.log("CONSOLE ERROR:", m.text())
})

async function shot(name) {
  await page.screenshot({ path: `/tmp/verify-shots/${name}.png`, fullPage: false })
}

try {
  // ---- CREATE ----
  await page.goto(`${BASE}/vendors`, { waitUntil: "networkidle" })
  await shot("01-vendors-initial")

  await page.getByRole("button", { name: /Add Vendor/i }).first().click()
  await page.waitForSelector('text="Add Vendor"', { state: "visible" })
  await page.locator('input[placeholder*="Stripe"]').fill(VENDOR_NAME)
  await page.locator('select').first().selectOption("Productivity")
  await page.locator('input[placeholder*="example.com"]').fill("https://verify.test")
  await page.locator('textarea').fill("Verify-only vendor")
  await page.getByRole("button", { name: /^Add Vendor$/i }).last().click()

  // Wait for modal to close and vendor to appear
  await page.waitForFunction(
    (n) => Array.from(document.querySelectorAll("h3")).some((h) => h.textContent === n),
    VENDOR_NAME,
    { timeout: 10000 }
  )
  await shot("02-vendors-after-create")
  console.log(`CREATE_OK: vendor "${VENDOR_NAME}" visible`)

  // ---- EDIT ----
  const card = page.locator(`text="${VENDOR_NAME}"`).first().locator("xpath=ancestor::div[contains(@class,'rounded-2xl')][1]")
  await card.getByRole("button", { name: /Open menu/i }).click()
  await page.getByRole("button", { name: /^Edit$/i }).click()
  await page.waitForSelector('text="Edit Vendor"', { state: "visible" })

  const nameInput = page.locator('input[placeholder*="Stripe"]')
  await nameInput.fill(VENDOR_NAME_EDITED)
  await page.getByRole("button", { name: /Save Changes/i }).click()
  await page.waitForFunction(
    (n) => Array.from(document.querySelectorAll("h3")).some((h) => h.textContent === n),
    VENDOR_NAME_EDITED,
    { timeout: 10000 }
  )
  await shot("03-vendors-after-edit")
  console.log(`EDIT_OK: vendor renamed to "${VENDOR_NAME_EDITED}"`)

  // ---- DELETE ----
  page.once("dialog", (d) => d.accept())
  const editedCard = page.locator(`text="${VENDOR_NAME_EDITED}"`).first().locator("xpath=ancestor::div[contains(@class,'rounded-2xl')][1]")
  await editedCard.getByRole("button", { name: /Open menu/i }).click()
  await page.getByRole("button", { name: /^Delete$/i }).click()

  await page.waitForFunction(
    (n) => !Array.from(document.querySelectorAll("h3")).some((h) => h.textContent === n),
    VENDOR_NAME_EDITED,
    { timeout: 10000 }
  )
  await shot("04-vendors-after-delete")
  console.log(`DELETE_OK: vendor "${VENDOR_NAME_EDITED}" removed`)

  console.log("VENDOR_FLOW: PASS")
} catch (err) {
  await shot("99-vendor-error")
  console.log("VENDOR_FLOW: FAIL", err.message)
  process.exit(1)
} finally {
  await browser.close()
}
