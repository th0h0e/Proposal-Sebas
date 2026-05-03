@AGENTS.md

## SuperKids Agency — Org Chart App

Interactive org chart for **SuperKids**, a creative agency co-founded by **Colm Dillane** (KidSuper) and **Sebastian Boon**. Vue 3 + Nitro v3 + Vite.

### Key Tech

- **Frontend**: Vue 3 SPA, `vue-draggable-plus`, TypeScript
- **Backend**: Nitro v3 REST API, Cloudflare KV storage (production), fs storage (dev)
- **Deployment**: Cloudflare Workers (`cloudflare_module` preset)
- **Styling**: `app/assets/orgchart.css` (light + dark mode via `body.dark`)
- **Linting**: ESLint with `@antfu/eslint-config` (2-space indent, single quotes, no semi)
- **Fonts**: Space Grotesk + Bebas Neue (Google Fonts)

### Structure

```
app/
  types.ts                   # Shared interfaces (Principal, Member, Section, Column, PipelineConfig, OrgData)
  entry-client.ts            # Mounts Vue app
  app.vue                    # Root: data-fetching, modal state, dark mode
  components/
    OrgHeader.vue            # Sticky header + dark toggle
    VersionBar.vue           # Save/restore/delete named chart versions
    PrincipalsSection.vue    # "Core Principals" card grid
    SectionColumn.vue        # Board column with VueDraggable
    MemberCard.vue           # Person/role card
    PipelineSection.vue      # Client Pipeline (horizontal step-flow, below board)
    EditModal.vue            # Edit/delete/duplicate modal
  assets/orgchart.css        # All styles
server/
  utils/orgSeed.ts           # Server types, seed data, storage + version helpers
  api/
    org.get.ts / org.put.ts           # Full org CRUD
    org/reorder.put.ts                # Persist drag-and-drop reorder
    members/ (CRUD + duplicate)       # Per-member endpoints
    principals/ (GET + PUT)           # Per-principal endpoints
    versions/ (GET, POST)             # List / save versions
    versions/[name].delete.ts         # Delete version
    versions/[name]/restore.post.ts   # Restore version as active chart
```

### Data Model (`app/types.ts`)

- **OrgData** = `principals[]` + `sections{key → {label, sublabel?, members[]}}` + `columns[]` + `pipeline`
- **Principal**: id, name, title, role, type (founder-a/founder-b/core), note
- **Member**: id, name, role, tags[], color, status? (TBH/Considering/Contract/On Leave)
- **Column**: key, header, colorClass, sections[] (ordered section keys)
- **PipelineConfig**: header, subtitle, steps[] (section keys for the pipeline flow)

### Board Columns (4)

| Column | Color | Sections |
|---|---|---|
| Creative | red | Creative Directors, Freelance Network |
| Production | green | Production, KidSuper In-House |
| Client Relations | blue | Brand Partners, PR & Community |
| Operations | purple | Structure & Management, Legal & Finance, Digital & Archive |

Client Pipeline (orange: Inbound → Qualified → Active) is a separate horizontal section below the board.

### API Endpoints

`GET/PUT /api/org` · `PUT /api/org/reorder` · `GET/POST /api/members` · `PUT/DELETE /api/members/:id` · `POST /api/members/:id/duplicate` · `GET /api/principals` · `PUT /api/principals/:id` · `GET/POST /api/versions` · `DELETE /api/versions/:name` · `POST /api/versions/:name/restore`

### Notes

- Shared types live in `app/types.ts` — all components import from there
- Versions are stored as `versions:<name>` keys in the same `useStorage('org')` mount
- `SuperKids.html` is a standalone static prototype (pre-Vue, ignored by ESLint)
- Dark mode toggle persists to `localStorage('superkids-dark')`

### Deployment (Cloudflare Workers)

1. **Create KV namespace**: `pnpx wrangler kv namespace create ORG_KV` — copy the returned ID
2. **Set namespace ID**: Replace `<YOUR_KV_NAMESPACE_ID>` in `nitro.config.ts` → `cloudflare.wrangler.kv_namespaces[0].id`
3. **Login**: `pnpx wrangler login`
4. **Build**: `pnpm run build`
5. **Preview locally**: `pnpx wrangler dev` (uses KV emulation)
6. **Deploy**: `pnpx wrangler deploy`

Dev mode (`pnpm run dev`) still uses the `fs` driver with `.data/org/` — no KV needed locally.
