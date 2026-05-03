export interface Principal {
  id: string
  name: string
  title: string
  role: string
  type: string
  note: string
}

export interface Member {
  id: string
  name: string
  role: string
  tags: string[]
  color: string
  status?: string
}

export interface Section {
  label: string
  sublabel?: string
  members: Member[]
}

export interface Column {
  key: string
  header: string
  colorClass: string
  sections: string[]
}

export interface PipelineConfig {
  header: string
  subtitle: string
  steps: string[]
}

export interface OrgData {
  principals: Principal[]
  sections: Record<string, Section>
  columns: Column[]
  pipeline: PipelineConfig
}
