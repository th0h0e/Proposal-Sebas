import { defineHandler } from "nitro";
import { HTTPError } from "nitro";
import { getOrgData, saveOrgData } from "~/server/utils/orgSeed.ts";
import type { Member } from "~/server/utils/orgSeed.ts";

export default defineHandler(async (event) => {
  const body = (await event.req.json()) as { sectionKey: string; member: Member };

  if (!body.sectionKey || !body.member) {
    throw HTTPError.create({ status: 400, message: "Missing sectionKey or member data" });
  }

  const data = await getOrgData();
  const section = data.sections[body.sectionKey];

  if (!section) {
    throw HTTPError.create({ status: 404, message: `Section "${body.sectionKey}" not found` });
  }

  // Ensure the member has an id
  if (!body.member.id) {
    const prefix = body.sectionKey.split("-")[0].slice(0, 2);
    body.member.id = `${prefix}${Date.now()}`;
  }

  section.members.push(body.member);
  await saveOrgData(data);

  return { success: true, member: body.member };
});
