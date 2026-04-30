import { defineHandler } from "nitro";
import { getOrgData } from "~/server/utils/orgSeed.ts";

export default defineHandler(async (event) => {
  const data = await getOrgData();

  // Flatten all members across all sections with section key attached
  const members: Array<{
    sectionKey: string;
    sectionLabel: string;
    sectionIndex: number;
    id: string;
    name: string;
    role: string;
    tags: string[];
    color: string;
    status?: string;
  }> = [];

  for (const [sectionKey, section] of Object.entries(data.sections)) {
    section.members.forEach((member, sectionIndex) => {
      members.push({
        sectionKey,
        sectionLabel: section.label,
        sectionIndex,
        ...member,
      });
    });
  }

  return members;
});
