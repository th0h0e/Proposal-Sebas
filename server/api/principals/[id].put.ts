import type { Principal } from '~/server/utils/orgSeed.ts'
import { defineHandler, HTTPError } from 'nitro'
import { getOrgData, saveOrgData } from '~/server/utils/orgSeed.ts'

export default defineHandler(async (event) => {
  const id = event.context.params?.id
  if (!id) {
    throw HTTPError.create({ status: 400, message: 'Missing principal id' })
  }

  const body = (await event.req.json()) as Partial<Principal>
  const data = await getOrgData()

  const index = data.principals.findIndex(p => p.id === id)
  if (index === -1) {
    throw HTTPError.create({ status: 404, message: 'Principal not found' })
  }

  data.principals[index] = { ...data.principals[index], ...body, id }

  await saveOrgData(data)
  return { success: true, principal: data.principals[index] }
})
