<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

interface VersionMeta {
  name: string
  label: string
  createdAt: string
}

const emit = defineEmits<{
  restore: [name: string]
}>()

const versions = ref<VersionMeta[]>([])
const showSaveForm = ref(false)
const saveName = ref('')
const saveLabel = ref('')
const saving = ref(false)
const confirmDelete = ref<string | null>(null)
const dropdownOpen = ref(false)
const dropdownWrapRef = ref<HTMLElement | null>(null)

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value
}

function closeDropdown() {
  dropdownOpen.value = false
}

function onClickOutside(e: MouseEvent) {
  if (dropdownWrapRef.value && !dropdownWrapRef.value.contains(e.target as Node))
    closeDropdown()
}

async function fetchVersions() {
  try {
    const res = await fetch('/api/versions')
    if (res.ok)
      versions.value = await res.json()
  }
  catch (err) {
    console.error('Failed to load versions:', err)
  }
}

async function handleSave() {
  const name = saveName.value.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-')
  const label = saveLabel.value.trim()
  if (!name || !label)
    return

  saving.value = true
  try {
    const res = await fetch('/api/versions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, label }),
    })
    if (res.ok) {
      saveName.value = ''
      saveLabel.value = ''
      showSaveForm.value = false
      await fetchVersions()
    }
  }
  finally {
    saving.value = false
  }
}

async function handleDelete(name: string) {
  const res = await fetch(`/api/versions/${name}`, { method: 'DELETE' })
  if (res.ok) {
    confirmDelete.value = null
    await fetchVersions()
    if (!versions.value.length)
      closeDropdown()
  }
}

async function handleRestore(name: string) {
  const res = await fetch(`/api/versions/${name}/restore`, { method: 'POST' })
  if (res.ok) {
    closeDropdown()
    emit('restore', name)
  }
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

onMounted(() => {
  fetchVersions()
  document.addEventListener('click', onClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside)
})
</script>

<template>
  <div class="version-bar">
    <div class="version-bar-left">
      <span class="version-bar-title">Versions</span>
      <span v-if="versions.length" class="version-count">{{ versions.length }} saved</span>
    </div>

    <div class="version-bar-actions">
      <button class="btn btn-save btn-sm" @click="showSaveForm = !showSaveForm">
        {{ showSaveForm ? 'Cancel' : 'Save Version' }}
      </button>

      <div v-if="versions.length" ref="dropdownWrapRef" class="version-dropdown-wrap">
        <button class="btn btn-cancel btn-sm" @click="toggleDropdown">
          Saved Versions ▾
        </button>
        <div v-if="dropdownOpen" class="version-dropdown">
          <div
            v-for="v in versions"
            :key="v.name"
            class="version-item"
          >
            <div class="version-item-info">
              <div class="version-item-label">
                {{ v.label }}
              </div>
              <div class="version-item-date">
                {{ formatDate(v.createdAt) }}
              </div>
            </div>
            <div class="version-item-actions">
              <template v-if="confirmDelete === v.name">
                <button class="btn btn-danger btn-xs" @click="handleDelete(v.name)">
                  Confirm
                </button>
                <button class="btn btn-cancel btn-xs" @click="confirmDelete = null">
                  Cancel
                </button>
              </template>
              <template v-else>
                <button class="btn btn-restore btn-xs" @click="handleRestore(v.name)">
                  Restore
                </button>
                <button class="btn btn-danger btn-xs" @click="confirmDelete = v.name">
                  Delete
                </button>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showSaveForm" class="version-save-form">
      <input
        v-model="saveLabel"
        type="text"
        placeholder="Version label (e.g. Brainstorm A)"
        class="version-input"
      >
      <input
        v-model="saveName"
        type="text"
        placeholder="Slug (e.g. brainstorm-a)"
        class="version-input version-input-slug"
      >
      <button class="btn btn-save btn-sm" :disabled="saving || !saveLabel.trim() || !saveName.trim()" @click="handleSave">
        {{ saving ? 'Saving…' : 'Save' }}
      </button>
    </div>
  </div>
</template>
