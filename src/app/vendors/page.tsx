import { getVendors } from "@/app/actions/vendors"
import { VendorsClient } from "@/components/vendors/VendorsClient"

export default async function VendorsPage() {
  const result = await getVendors()
  const vendors = result.success ? result.data : []

  return <VendorsClient vendors={vendors} />
}
