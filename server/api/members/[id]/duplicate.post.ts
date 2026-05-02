import { defineHandler, HTTPError } from 'nitro'
import { getOrgData, saveOrgData } from '~/server/utils/orgSeed.ts'

export default defineHandler(async (event) => {
  const id = event.context.params?.id
  if (!id) {
    throw HTTPError.create({ status: 400, message: 'Missing member id' })
  }

  const data = await getOrgData()

  // Find the member across all sections
  for (const [_sectionKey, section] of Object.entries(data.sections)) {
    const index = section.members.findIndex(m => m.id === id)
    if (index !== -1) {
      const original = section.members[index]
      const duplicate = {
        ...original,
        id: `${original.id}-copy-${Date.now()}`,
        name: `${original.name} (copy)`,
      }

      // Insert right after the original
      section.members.splice(index + 1, 0, duplicate)
      await saveOrgData(data)

      return { success: true, member: duplicate }
    }
  }

  throw HTTPError.create({ status: 404, message: 'Member not found' })
})
