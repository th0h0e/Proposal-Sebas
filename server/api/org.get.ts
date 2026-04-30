import { defineHandler } from 'nitro'
import { getOrgData } from '~/server/utils/orgSeed.ts'

export default defineHandler(async (_event) => {
  const data = await getOrgData()
  return data
})
