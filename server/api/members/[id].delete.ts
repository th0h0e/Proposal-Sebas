import { defineHandler, HTTPError } from 'nitro'
import { getOrgData, saveOrgData } from '~/server/utils/orgSeed.ts'

export default defineHandler(async (event) => {
  const id = event.context.params?.id
  if (!id) {
    throw HTTPError.create({ status: 400, message: 'Missing member id' })
  }

  const data = await getOrgData()

  // Find and remove the member across all sections
  let found = false
  for (const sectionKey of Object.keys(data.sections)) {
    const section = data.sections[sectionKey]
    const index = section.members.findIndex(m => m.id === id)
    if (index !== -1) {
      const removed = section.members.splice(index, 1)[0]
      found = true
      await saveOrgData(data)
      return { success: true, removed }
    }
  }

  if (!found) {
    throw HTTPError.create({ status: 404, message: 'Member not found' })
  }
})
