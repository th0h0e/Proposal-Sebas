import { useStorage } from 'nitro/storage'

interface Principal {
  id: string
  name: string
  title: string
  role: string
  type: string
  note: string
}

interface Member {
  id: string
  name: string
  role: string
  tags: string[]
  color: string
  status?: string
}

interface PipelineConfig {
  header: string
  subtitle: string
  steps: string[]
}

interface OrgData {
  principals: Principal[]
  sections: Record<string, { label: string, sublabel?: string, members: Member[] }>
  columns: { key: string, header: string, colorClass: string, sections: string[] }[]
  pipeline: PipelineConfig
}

interface SavedVersion {
  name: string
  label: string
  createdAt: string
  data: OrgData
}

const defaultPrincipals: Principal[] = [
  {
    id: 'pr-colm',
    name: 'Colm Dillane',
    title: 'Co-Founder · Creative Director',
    role: 'Founder',
    type: 'founder-a',
    note: 'KidSuper. Creative vision, art direction, brand. NY HQ as global base.',
  },
  {
    id: 'pr-seb',
    name: 'Sebastian Boon',
    title: 'Co-Founder · Strategy & EU Operations',
    role: 'Founder',
    type: 'founder-b',
    note: 'EU bridge. Structure, partnerships, business development.',
  },
  {
    id: 'pr-matty',
    name: 'Matty Bauerschmidt',
    title: 'Creative Producer',
    role: 'Core Team',
    type: 'core',
    note: 'Killer creative producer. Translates big ideas into executed projects.',
  },
  {
    id: 'pr-andre',
    name: 'Andre Marques',
    title: 'Head of Structure & Management',
    role: 'Core Team',
    type: 'core',
    note: 'Makes sure Sebastian (and the agency) can stay focused on creative work.',
  },
  {
    id: 'pr-max',
    name: 'Max Grapperhaus',
    title: 'Film & Production Partner',
    role: 'Network',
    type: 'core',
    note: 'Owner, Trip to the Moon Films. Key production collaborator.',
  },
  {
    id: 'pr-malvin',
    name: 'Malvin Wix',
    title: 'Agency Structure Advisor',
    role: 'Network',
    type: 'core',
    note: 'Owner, d3pot-works. Expertise in building this exact company model.',
  },
]

const defaultSections: OrgData['sections'] = {
  'creative-directors': {
    label: 'Creative Directors',
    members: [
      { id: 'cd1', name: 'Colm Dillane', role: 'Creative Director', tags: ['KidSuper'], color: 'red' },
      { id: 'cd2', name: 'TBH', role: 'Second Creative Director', tags: [], color: 'red', status: 'TBH' },
    ],
  },
  'creative-freelance': {
    label: 'Freelance Network',
    sublabel: 'Designers, Photographers, Editors',
    members: [
      { id: 'cf1', name: 'Freelance Designers', role: 'On-demand · Global Network', tags: ['EU', 'US'], color: 'yellow' },
      { id: 'cf2', name: 'Photographers', role: 'Per-project', tags: [], color: 'yellow' },
      { id: 'cf3', name: 'Video Editors', role: 'Per-project', tags: [], color: 'yellow' },
    ],
  },
  'production-list': {
    label: 'Production',
    members: [
      { id: 'p1', name: 'Matty Bauerschmidt', role: 'Creative Producer', tags: ['US'], color: 'green' },
      { id: 'p2', name: 'Max Grapperhaus', role: 'Film Partner · Trip to the Moon', tags: ['EU'], color: 'green' },
      { id: 'p3', name: 'Project Manager', role: 'TBH', tags: [], color: 'green', status: 'TBH' },
    ],
  },
  'kidsuper-list': {
    label: 'KidSuper In-House',
    sublabel: 'NY Global HQ',
    members: [
      { id: 'k1', name: 'KidSuper Studio', role: 'NY Global HQ · In-house resource', tags: ['NY'], color: 'yellow' },
      { id: 'k2', name: 'KidSuper Archive', role: 'Portfolio & World-building base', tags: [], color: 'yellow' },
    ],
  },
  'clients-list': {
    label: 'Brand Partners',
    sublabel: 'EU & US Clients',
    members: [
      { id: 'cl1', name: 'Brand Clients (US)', role: 'Commercial partnerships', tags: ['US'], color: 'blue' },
      { id: 'cl2', name: 'Brand Clients (EU)', role: 'European accounts', tags: ['EU'], color: 'blue' },
    ],
  },
  'pr-list': {
    label: 'PR & Community',
    members: [
      { id: 'pr1', name: 'PR Consultant', role: 'Reputation & Press', tags: [], color: 'blue', status: 'TBH' },
      { id: 'pr2', name: 'Content / Podcast Lead', role: 'YouTube, Podcast, Social', tags: [], color: 'blue', status: 'TBH' },
    ],
  },
  'pipeline-inbound': {
    label: 'Inbound Leads',
    sublabel: 'Incoming requests & inquiries',
    members: [
      { id: 'pi1', name: 'Direct Inquiries', role: 'Website · DMs · Referrals', tags: ['US', 'EU'], color: 'orange' },
      { id: 'pi2', name: 'Agent / Rep Leads', role: 'Talent reps · Middlemen', tags: [], color: 'orange' },
      { id: 'pi3', name: 'Repeat Clients', role: 'Returning brand partners', tags: ['KidSuper'], color: 'orange' },
    ],
  },
  'pipeline-active': {
    label: 'Active Pitches',
    sublabel: 'Proposals & negotiations',
    members: [
      { id: 'pa1', name: 'Pitch Lead', role: 'Creative pitch development', tags: [], color: 'orange', status: 'TBH' },
      { id: 'pa2', name: 'Budget & Scope', role: 'Scoping · Pricing · Timeline', tags: [], color: 'orange', status: 'TBH' },
    ],
  },
  'pipeline-won': {
    label: 'Won Projects',
    sublabel: 'Signed · In production',
    members: [
      { id: 'pw1', name: 'Project Tracker', role: 'Active project oversight', tags: [], color: 'orange', status: 'TBH' },
    ],
  },
  'pipeline-inbound': {
    label: 'Inbound Requests',
    sublabel: 'Incoming leads & inquiries',
    members: [
      { id: 'pi1', name: 'Direct Referrals', role: 'Warm leads from network', tags: ['EU', 'US'], color: 'orange' },
      { id: 'pi2', name: 'Inbound via KidSuper', role: 'Brand-driven inquiries', tags: ['NY'], color: 'orange' },
      { id: 'pi3', name: 'Cold Outreach', role: 'Proactive pitching', tags: [], color: 'orange', status: 'TBH' },
    ],
  },
  'pipeline-qualified': {
    label: 'Qualified Leads',
    sublabel: 'Vetted & scoped',
    members: [
      { id: 'pq1', name: 'Pitch Deck Lead', role: 'Create & send proposals', tags: [], color: 'orange', status: 'TBH' },
      { id: 'pq2', name: 'Scope & Budget Review', role: 'Define deliverables & timeline', tags: [], color: 'orange' },
    ],
  },
  'pipeline-active': {
    label: 'Active Pitches',
    sublabel: 'Proposals sent · Negotiating',
    members: [
      { id: 'pa1', name: 'Pitch Tracking', role: 'Follow-ups & status updates', tags: [], color: 'orange' },
      { id: 'pa2', name: 'Deal Closing', role: 'Contract & onboarding', tags: [], color: 'orange', status: 'TBH' },
    ],
  },
  'ops-management': {
    label: 'Structure & Management',
    members: [
      { id: 'om1', name: 'Andre Marques', role: 'Structure & Management', tags: ['EU'], color: 'purple' },
      { id: 'om2', name: 'Malvin Wix', role: 'Advisor · Agency Structure', tags: [], color: 'purple' },
    ],
  },
  'ops-legal': {
    label: 'Legal & Finance',
    sublabel: 'On-demand / Retainer',
    members: [
      { id: 'ol1', name: 'Legal Counsel', role: 'Deal templates · IP · Contracts', tags: [], color: 'purple', status: 'TBH' },
      { id: 'ol2', name: 'Finance / Accounting', role: 'Small capital mgmt', tags: [], color: 'purple', status: 'TBH' },
    ],
  },
  'ops-digital': {
    label: 'Digital & Archive',
    members: [
      { id: 'od1', name: 'Website Lead', role: 'Archive site · Branding', tags: [], color: 'purple', status: 'TBH' },
      { id: 'od2', name: 'Brand Designer', role: 'Logo · Visual Identity', tags: [], color: 'purple', status: 'TBH' },
    ],
  },
}

const defaultPipeline: OrgData['pipeline'] = {
  header: 'Client Pipeline',
  subtitle: 'Steps & procedures for acquiring clients',
  steps: ['pipeline-inbound', 'pipeline-qualified', 'pipeline-active'],
}

const defaultColumns: OrgData['columns'] = [
  {
    key: 'creative',
    header: 'Creative',
    colorClass: 'col-creative',
    sections: ['creative-directors', 'creative-freelance'],
  },
  {
    key: 'production',
    header: 'Production',
    colorClass: 'col-network',
    sections: ['production-list', 'kidsuper-list'],
  },
  {
    key: 'comms',
    header: 'Client Relations',
    colorClass: 'col-comms',
    sections: ['clients-list', 'pr-list'],
  },
  {
    key: 'ops',
    header: 'Operations',
    colorClass: 'col-ops',
    sections: ['ops-management', 'ops-legal', 'ops-digital'],
  },
]

const defaultOrgData: OrgData = {
  principals: defaultPrincipals,
  sections: defaultSections,
  columns: defaultColumns,
  pipeline: defaultPipeline,
}

export type { Member, OrgData, PipelineConfig, Principal, SavedVersion }
export { defaultOrgData }

export async function ensureSeeded() {
  const storage = useStorage('org')
  const existing = await storage.getItem<OrgData>('chart')
  if (!existing) {
    await storage.setItem('chart', defaultOrgData)
  }
}

export async function getOrgData(): Promise<OrgData> {
  const storage = useStorage('org')
  await ensureSeeded()
  const data = (await storage.getItem<OrgData>('chart'))!

  if (!data.pipeline) {
    const pipelineCol = data.columns.find(c => c.key === 'pipeline')
    if (pipelineCol) {
      data.columns = data.columns.filter(c => c.key !== 'pipeline')
      data.pipeline = {
        header: pipelineCol.header,
        subtitle: 'Steps & procedures for acquiring clients',
        steps: pipelineCol.sections,
      }
    }
    else {
      data.pipeline = defaultPipeline
    }
    await storage.setItem('chart', data)
  }

  return data
}

export async function saveOrgData(data: OrgData): Promise<void> {
  const storage = useStorage('org')
  await storage.setItem('chart', data)
}

export async function getVersions(): Promise<SavedVersion[]> {
  const storage = useStorage('org')
  const keys = await storage.getKeys('versions')
  const versions: SavedVersion[] = []
  for (const key of keys) {
    const version = await storage.getItem<SavedVersion>(key)
    if (version)
      versions.push(version)
  }
  return versions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function saveVersion(name: string, label: string): Promise<SavedVersion> {
  const storage = useStorage('org')
  const data = await getOrgData()
  const version: SavedVersion = {
    name,
    label,
    createdAt: new Date().toISOString(),
    data,
  }
  await storage.setItem(`versions:${name}`, version)
  return version
}

export async function deleteVersion(name: string): Promise<void> {
  const storage = useStorage('org')
  await storage.removeItem(`versions:${name}`)
}

export async function restoreVersion(name: string): Promise<OrgData> {
  const storage = useStorage('org')
  const version = await storage.getItem<SavedVersion>(`versions:${name}`)
  if (!version)
    throw new Error(`Version "${name}" not found`)
  await storage.setItem('chart', version.data)
  return version.data
}
