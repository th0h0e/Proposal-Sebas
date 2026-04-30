import { defineHandler } from "nitro";
import { HTTPError } from "nitro";
import { getOrgData, saveOrgData } from "~/server/utils/orgSeed.ts";
import type { Member } from "~/server/utils/orgSeed.ts";

export default defineHandler(async (event) => {
  const id = event.context.params?.id;
  if (!id) {
    throw HTTPError.create({ status: 400, message: "Missing member id" });
  }

  const body = (await event.req.json()) as Partial<Member> & { sectionKey?: string };
  const data = await getOrgData();

  // Find the member across all sections
  let found = false;
  for (const [sectionKey, section] of Object.entries(data.sections)) {
    const index = section.members.findIndex((m) => m.id === id);
    if (index !== -1) {
      const { sectionKey: _, ...memberData } = body;
      section.members[index] = { ...section.members[index], ...memberData, id };
      found = true;
      await saveOrgData(data);
      return { success: true, member: section.members[index] };
    }
  }

  if (!found) {
    throw HTTPError.create({ status: 404, message: "Member not found" });
  }
});
