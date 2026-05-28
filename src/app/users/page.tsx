import { getUsers } from "@/app/actions/users"
import { UsersClient } from "@/components/users/UsersClient"

export default async function UsersPage() {
  const result = await getUsers()
  const users = result.success ? result.data : []

  return <UsersClient users={users} />
}
