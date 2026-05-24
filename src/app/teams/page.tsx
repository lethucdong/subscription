import { getTeams } from "@/app/actions/teams"
import { TeamsClient } from "@/components/teams/TeamsClient"

export const dynamic = "force-dynamic"

export default async function TeamsPage() {
  const result = await getTeams()
  const teams = result.success ? result.data : []

  return <TeamsClient teams={teams} />
}
