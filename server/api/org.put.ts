import { defineHandler } from "nitro";
import { HTTPError } from "nitro";
import { saveOrgData, getOrgData } from "~/server/utils/orgSeed.ts";
import type { OrgData } from "~/server/utils/orgSeed.ts";

export default defineHandler(async (event) => {
  const body = await event.req.json();

  if (!body || !body.principals || !body.sections) {
    throw HTTPError.create({ status: 400, message: "Invalid org data structure" });
  }

  // Preserve columns if not sent
  const existing = await getOrgData();
  const data: OrgData = {
    principals: body.principals,
    sections: body.sections,
    columns: body.columns || existing.columns,
  };

  await saveOrgData(data);
  return { success: true, data };
});
