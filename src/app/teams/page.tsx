import { getTeams } from "@/app/actions/teams"
import { getUsers } from "@/app/actions/users"
import { getSubscriptions } from "@/app/actions/subscriptions"
import { TeamsClient } from "@/components/teams/TeamsClient"

export default async function TeamsPage() {
  const [teamsResult, usersResult, subsResult] = await Promise.all([
    getTeams(),
    getUsers(),
    getSubscriptions(),
  ])

  const teams = teamsResult.success ? teamsResult.data : []
  const users = usersResult.success ? usersResult.data : []
  const subscriptions = subsResult.success ? subsResult.data : []

  return <TeamsClient teams={teams} allUsers={users} allSubscriptions={subscriptions} />
}
