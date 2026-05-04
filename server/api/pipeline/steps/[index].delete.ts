import { defineHandler, HTTPError } from 'nitro'
import { getOrgData, saveOrgData } from '~/server/utils/orgSeed.ts'

export default defineHandler(async (event) => {
  const index = Number(event.context.params?.index)

  if (Number.isNaN(index) || index < 0) {
    throw HTTPError.create({ status: 400, message: 'Invalid step index' })
  }

  const data = await getOrgData()

  if (index >= data.pipeline.steps.length) {
    throw HTTPError.create({ status: 404, message: 'Step index out of range' })
  }

  const stepKey = data.pipeline.steps[index]
  data.pipeline.steps.splice(index, 1)

  const section = data.sections[stepKey]
  if (section && section.members.length === 0) {
    delete data.sections[stepKey]
  }

  await saveOrgData(data)

  return { success: true }
})
