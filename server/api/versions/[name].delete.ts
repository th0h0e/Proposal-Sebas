import { defineHandler, HTTPError } from 'nitro'
import { deleteVersion } from '~/server/utils/orgSeed.ts'

export default defineHandler(async (event) => {
  const name = event.context.params?.name
  if (!name)
    throw HTTPError.create({ status: 400, message: 'Missing version name' })
  await deleteVersion(name)
  return { success: true }
})
