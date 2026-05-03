@AGENTS.md

## SuperKids Agency — Org Chart App

Interactive org chart for **SuperKids**, a creative agency co-founded by **Colm Dillane** (KidSuper) and **Sebastian Boon**. Built with Vue 3 + Nitro v3 + Vite.

### Key Tech

- **Frontend**: Vue 3 SPA, `vue-draggable-plus` for drag-and-drop, TypeScript
- **Backend**: Nitro v3 REST API with file-system storage (`.data/org/chart`)
- **Styling**: `app/assets/orgchart.css` (light + dark mode via `body.dark` class)
- **Linting**: ESLint with `@antfu/eslint-config` (2-space indent, single quotes, no semi)
- **Fonts**: Space Grotesk + Bebas Neue (Google Fonts)

### Structure

```
app/                        # Vue SPA
  entry-client.ts           # Mounts Vue app
  app.vue                   # Root: data-fetching, modal state, dark mode
  components/
    OrgHeader.vue           # Sticky header + dark toggle
    PrincipalsSection.vue   # "Core Principals" card grid
    SectionColumn.vue       # Board column with VueDraggable
    MemberCard.vue          # Person/role card
    EditModal.vue           # Edit/delete/duplicate modal
  assets/orgchart.css       # All org chart styles
server/
  utils/orgSeed.ts          # Types (Principal, Member, OrgData), seed data, storage helpers
  api/
    org.get.ts / org.put.ts          # Full org CRUD
    org/reorder.put.ts               # Persist drag-and-drop reorder
    members/ (CRUD + duplicate)      # Per-member endpoints
    principals/ (GET + PUT)          # Per-principal endpoints
```

### Data Model

- **OrgData** = `principals[]` + `sections{key → {label, sublabel?, members[]}}` + `columns[]`
- **Principal**: id, name, title, role, type (founder-a/founder-b/core), note
- **Member**: id, name, role, tags[], color, status? (TBH/Considering/Contract/On Leave)
- **Column**: key, header, colorClass, sections[] (ordered section keys)

### 5 Board Columns

| Column | Color | Sections |
|---|---|---|
| Creative | red | Creative Directors, Freelance Network |
| Production | green | Production, KidSuper In-House |
| Client Relations | blue | Brand Partners, PR & Community |
| Client Pipeline | orange | Inbound Requests, Qualified Leads, Active Pitches |
| Operations | purple | Structure & Management, Legal & Finance, Digital & Archive |

### API Endpoints

`GET/PUT /api/org` · `PUT /api/org/reorder` · `GET/POST /api/members` · `PUT/DELETE /api/members/:id` · `POST /api/members/:id/duplicate` · `GET /api/principals` · `PUT /api/principals/:id`

### Notes

- Types are duplicated between `app.vue` and `orgSeed.ts` — no shared types file
- `SuperKids.html` is a standalone static prototype (pre-Vue, ignored by ESLint)
- Dark mode toggle persists to `localStorage('superkids-dark')`
