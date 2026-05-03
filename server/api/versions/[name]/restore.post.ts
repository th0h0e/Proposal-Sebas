import { defineHandler, HTTPError } from 'nitro'
import { restoreVersion } from '~/server/utils/orgSeed.ts'

export default defineHandler(async (event) => {
  const name = event.context.params?.name
  if (!name)
    throw HTTPError.create({ status: 400, message: 'Missing version name' })
  const data = await restoreVersion(name)
  return { success: true, data }
})
