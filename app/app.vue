<script setup lang="ts">
import { onMounted, ref } from 'vue'
import EditModal from './components/EditModal.vue'
import OrgHeader from './components/OrgHeader.vue'
import PrincipalsSection from './components/PrincipalsSection.vue'
import SectionColumn from './components/SectionColumn.vue'

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

interface Section {
  label: string
  sublabel?: string
  members: Member[]
}

interface Column {
  key: string
  header: string
  colorClass: string
  sections: string[]
}

interface OrgData {
  principals: Principal[]
  sections: Record<string, Section>
  columns: Column[]
}

const orgData = ref<OrgData | null>(null)
const loading = ref(true)

// Dark mode
const darkMode = ref(false)

function applyDarkMode(on: boolean) {
  darkMode.value = on
  document.body.classList.toggle('dark', on)
  localStorage.setItem('superkids-dark', on ? '1' : '0')
}

function toggleDark() {
  applyDarkMode(!darkMode.value)
}

// Modal state
const showModal = ref(false)
const editMode = ref<'principal' | 'member'>('member')
const editingPrincipal = ref<Principal | null>(null)
const editingMember = ref<Member | null>(null)
const editingSectionKey = ref<string>('')

async function fetchOrg() {
  try {
    const res = await fetch('/api/org')
    orgData.value = await res.json()
  }
  catch (err) {
    console.error('Failed to load org data:', err)
  }
  finally {
    loading.value = false
  }
}

function openPrincipalEdit(principal: Principal) {
  editMode.value = 'principal'
  editingPrincipal.value = { ...principal }
  editingMember.value = null
  showModal.value = true
}

function openMemberEdit(member: Member, sectionKey: string) {
  editMode.value = 'member'
  editingMember.value = { ...member }
  editingSectionKey.value = sectionKey
  editingPrincipal.value = null
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingPrincipal.value = null
  editingMember.value = null
}

async function handleSave(updatedData: {
  name: string
  role: string
  note: string
  tags: string
  status: string
}) {
  if (editMode.value === 'principal' && editingPrincipal.value) {
    const res = await fetch(`/api/principals/${editingPrincipal.value.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: updatedData.name,
        title: updatedData.role,
        note: updatedData.note,
        role: updatedData.tags,
      }),
    })
    if (res.ok)
      await fetchOrg()
  }
  else if (editMode.value === 'member' && editingMember.value) {
    const tags = updatedData.tags
      ? updatedData.tags
          .split(',')
          .map(t => t.trim())
          .filter(Boolean)
      : []

    const body: Record<string, unknown> = {
      name: updatedData.name,
      role: updatedData.role,
      tags,
    }
    if (updatedData.status)
      body.status = updatedData.status

    const res = await fetch(`/api/members/${editingMember.value.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (res.ok)
      await fetchOrg()
  }
  closeModal()
}

async function handleDelete(memberId: string) {
  const res = await fetch(`/api/members/${memberId}`, {
    method: 'DELETE',
  })
  if (res.ok)
    await fetchOrg()
  closeModal()
}

async function handleDuplicate(memberId: string) {
  const res = await fetch(`/api/members/${memberId}/duplicate`, {
    method: 'POST',
  })
  if (res.ok)
    await fetchOrg()
  closeModal()
}

onMounted(() => {
  const saved = localStorage.getItem('superkids-dark')
  if (saved === '1')
    applyDarkMode(true)
  fetchOrg()
})
</script>

<template>
  <div v-if="loading" class="loading">
    Loading org chart…
  </div>
  <div v-else-if="orgData">
    <OrgHeader :dark="darkMode" @toggle-dark="toggleDark" />
    <PrincipalsSection
      :principals="orgData.principals"
      @edit="openPrincipalEdit"
    />

    <div class="board-wrap">
      <div class="board-label">
        Organizational Structure
      </div>
      <div class="board">
        <div class="divider-label">
          ◀ Project-Based &nbsp; | &nbsp; Functional ▶
        </div>
        <div class="col-divider" />

        <SectionColumn
          v-for="col in orgData.columns"
          :key="col.key"
          :column="col"
          :sections="orgData.sections"
          @edit-member="openMemberEdit"
        />
      </div>
    </div>

    <EditModal
      v-if="showModal"
      :mode="editMode"
      :principal="editingPrincipal"
      :member="editingMember"
      @close="closeModal"
      @save="handleSave"
      @delete="handleDelete"
      @duplicate="handleDuplicate"
    />
  </div>
</template>
