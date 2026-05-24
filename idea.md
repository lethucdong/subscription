You are a senior product designer and frontend engineer.

Create a modern SaaS Subscription Management web app PoC focused heavily on UI/UX, visual clarity, dashboard experience, and smooth interactions.

IMPORTANT:
- This is ONLY a frontend/UI prototype (PoC)
- Do NOT focus on backend architecture
- Do NOT build complex authentication
- Do NOT use real database
- Use local JSON/mock data only
- The goal is to create an impressive and realistic product UI/UX

# Product Goal

A modern subscription management dashboard that helps teams manage:

- subscriptions
- vendors
- products
- plans
- renewals
- seat/licenses
- team usage

The experience should feel like:
- Linear
- Stripe
- Vercel
- Notion

Minimal, premium, clean, modern.

# Tech Stack

Use:
- Next.js
- TypeScript
- TailwindCSS
- shadcn/ui
- Framer Motion
- Recharts

Use mock JSON data.

NO backend required.

# Main Requirements

# 1. Beautiful Dashboard

Create a visually impressive dashboard.

Include:

## Top Summary Cards
- Total Monthly Cost
- Active Subscriptions
- Upcoming Renewals
- Vendors Count
- Unused Seats

Cards should:
- have soft shadows
- glassmorphism/light blur effects
- smooth hover animations
- premium spacing
- responsive layout

---

## Spending Analytics

Add charts:
- monthly spending
- spending by vendor
- spending by team

Use Recharts.

---

## Renewal Timeline

Create a timeline/calendar section showing:
- today renewals
- upcoming renewals
- expired subscriptions

Use color system:
- red = urgent
- yellow = warning
- green = healthy

---

## Seat Usage Overview

Show subscriptions with seat usage:

Examples:
- ChatGPT Team → 8/10 seats
- Figma Team → 5/5 seats
- Adobe CC → 14/20 seats

Use:
- animated progress bars
- capacity warnings
- hover interactions

---

# 2. Subscription Detail Page

Create a beautiful detail page.

Include:

## Header
- product logo
- product name
- vendor
- renewal date
- status badge

---

## Billing Information Card
- amount
- billing cycle
- auto renew
- next payment

---

## Seat Management Section
Show:
- used seats
- available seats
- assigned users

Use:
- avatars
- progress visualization
- animated transitions

Buttons:
- Assign User
- Remove User

---

## Activity Timeline
Show:
- renewals
- seat changes
- plan updates

Use modern timeline UI.

---

# 3. Vendor Page

Create a vendor overview page.

Example:
- OpenAI
- Adobe
- Figma

Show:
- total spending
- active products
- subscriptions
- team usage
- upcoming renewals

Use modern analytics cards.

---

# 4. UX/UI Direction

IMPORTANT:
Focus strongly on:
- spacing
- typography
- modern card layouts
- dashboard hierarchy
- clean information architecture

The UI must feel:
- premium
- calm
- modern
- productivity-focused

Use:
- rounded-2xl
- subtle borders
- layered backgrounds
- sticky headers
- smooth transitions
- skeleton loading states
- empty states
- hover states
- dark mode

---

# 5. Navigation

Create:
- collapsible sidebar
- modern top navbar
- global search input
- notification bell
- user profile dropdown

Sidebar items:
- Dashboard
- Subscriptions
- Vendors
- Teams
- Analytics
- Settings

---

# 6. Mock Data

Use local JSON files.

Create realistic sample data:
- OpenAI
- Adobe
- Figma
- Notion
- Slack

Include:
- monthly plans
- yearly plans
- seat limits
- assigned members
- renewal schedules

---

# 7. Motion & Interactions

Use Framer Motion.

Add:
- smooth page transitions
- animated cards
- animated charts
- hover effects
- loading skeletons
- sidebar animations

Keep animations subtle and premium.

---

# 8. Responsive Design

Must work beautifully on:
- desktop
- tablet
- mobile

Mobile version should:
- collapse sidebar
- stack cards elegantly
- preserve premium feel

---

# 9. Design Quality

The final result should look like a real startup SaaS product landing inside:
- Dribbble
- Behance
- SaaS design inspiration websites

Avoid:
- generic admin template look
- bootstrap style
- outdated enterprise UI
- crowded screens

Prioritize:
- whitespace
- visual hierarchy
- clean interactions
- premium feel

---

# 10. Deliverables

Generate:
- complete frontend project structure
- reusable components
- mock JSON data
- responsive pages
- modern UI system
- polished dashboard experience

The final result should feel production-quality visually, even though it is only a frontend PoC.