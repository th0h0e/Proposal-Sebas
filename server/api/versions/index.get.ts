import { defineHandler } from 'nitro'
import { getVersions } from '~/server/utils/orgSeed.ts'

export default defineHandler(async () => {
  const versions = await getVersions()
  return versions.map(v => ({ name: v.name, label: v.label, createdAt: v.createdAt }))
})
