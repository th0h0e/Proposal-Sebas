import { defineHandler, HTTPError } from 'nitro'
import { getOrgData, saveOrgData } from '~/server/utils/orgSeed.ts'

export default defineHandler(async (event) => {
  const body = await event.req.json() as {
    label: string
    sublabel?: string
    insertAfter?: number
  }

  if (!body.label) {
    throw HTTPError.create({ status: 400, message: 'Missing label' })
  }

  const data = await getOrgData()

  const slug = body.label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  const sectionKey = `pipeline-${slug}-${Date.now()}`

  data.sections[sectionKey] = {
    label: body.label,
    sublabel: body.sublabel || '',
    members: [],
  }

  const insertIndex = body.insertAfter != null ? body.insertAfter + 1 : data.pipeline.steps.length
  data.pipeline.steps.splice(insertIndex, 0, sectionKey)

  await saveOrgData(data)

  return { success: true, stepKey: sectionKey }
})
