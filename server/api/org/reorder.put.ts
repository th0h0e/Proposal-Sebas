import { defineHandler, HTTPError } from 'nitro'
import { getOrgData, saveOrgData } from '~/server/utils/orgSeed.ts'

export default defineHandler(async (_event) => {
  const body = (await _event.req.json()) as {
    sections: Record<string, { members: Array<{ id: string, name: string, role: string, tags: string[], color: string, status?: string }> }>
  }

  if (!body.sections) {
    throw HTTPError.create({ status: 400, message: 'Missing sections data' })
  }

  const data = await getOrgData()

  // Update each section's members from the reorder payload
  for (const [sectionKey, sectionData] of Object.entries(body.sections)) {
    if (data.sections[sectionKey]) {
      data.sections[sectionKey].members = sectionData.members
    }
  }

  await saveOrgData(data)

  return { success: true }
})
