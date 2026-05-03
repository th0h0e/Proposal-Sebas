import { defineHandler, HTTPError } from 'nitro'
import { saveVersion } from '~/server/utils/orgSeed.ts'

export default defineHandler(async (event) => {
  const body = await event.req.json() as { name?: string, label?: string }
  if (!body.name || !body.label)
    throw HTTPError.create({ status: 400, message: 'Missing name or label' })
  const version = await saveVersion(body.name, body.label)
  return { success: true, version: { name: version.name, label: version.label, createdAt: version.createdAt } }
})
