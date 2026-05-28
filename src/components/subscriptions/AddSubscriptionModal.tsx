"use client"

import { SubscriptionFormModal } from "@/components/subscriptions/SubscriptionFormModal"
import type { SerializedVendor } from "@/types"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  vendors: SerializedVendor[]
}

export function AddSubscriptionModal(props: Props) {
  return <SubscriptionFormModal mode="create" {...props} />
}
