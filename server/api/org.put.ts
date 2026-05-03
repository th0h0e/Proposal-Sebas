import type { OrgData } from '~/server/utils/orgSeed.ts'
import { defineHandler, HTTPError } from 'nitro'
import { getOrgData, saveOrgData } from '~/server/utils/orgSeed.ts'

export default defineHandler(async (event) => {
  const body = await event.req.json()

  if (!body || !body.principals || !body.sections) {
    throw HTTPError.create({ status: 400, message: 'Invalid org data structure' })
  }

  // Preserve columns if not sent
  const existing = await getOrgData()
  const data: OrgData = {
    principals: body.principals,
    sections: body.sections,
    columns: body.columns || existing.columns,
    pipeline: body.pipeline || existing.pipeline,
  }

  await saveOrgData(data)
  return { success: true, data }
})
