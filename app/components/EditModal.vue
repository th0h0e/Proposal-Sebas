<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

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

const props = defineProps<{
  mode: 'principal' | 'member'
  principal: Principal | null
  member: Member | null
}>()

const emit = defineEmits<{
  close: []
  save: [data: { name: string, role: string, note: string, tags: string, status: string }]
  delete: [memberId: string]
}>()

const name = ref('')
const role = ref('')
const note = ref('')
const tags = ref('')
const status = ref('')

const title = computed(() =>
  props.mode === 'principal' ? 'Edit Principal' : 'Edit Member',
)

const showDelete = computed(() => props.mode === 'member' && props.member?.id)

onMounted(() => {
  if (props.mode === 'principal' && props.principal) {
    name.value = props.principal.name
    role.value = props.principal.title
    note.value = props.principal.note || ''
    tags.value = props.principal.role || ''
    status.value = ''
  }
  else if (props.mode === 'member' && props.member) {
    name.value = props.member.name
    role.value = props.member.role
    note.value = ''
    tags.value = props.member.tags?.join(', ') || ''
    status.value = props.member.status || ''
  }
})

function save() {
  emit('save', {
    name: name.value.trim(),
    role: role.value.trim(),
    note: note.value.trim(),
    tags: tags.value.trim(),
    status: status.value,
  })
}

const confirmDelete = ref(false)

function requestDelete() {
  confirmDelete.value = true
}

function confirmDeleteAction() {
  if (props.member)
    emit('delete', props.member.id)
}

function cancelDelete() {
  confirmDelete.value = false
}

function handleDelete() {
  requestDelete()
}
</script>

<template>
  <div class="modal-overlay active" @click.self="emit('close')">
    <div class="modal">
      <h3>{{ title }}</h3>

      <label>Name</label>
      <input v-model="name" type="text" placeholder="Full name">

      <label>Role / Title</label>
      <input v-model="role" type="text" placeholder="Job title">

      <label>
        Note <span style="font-weight: 400; text-transform: none">(optional)</span>
      </label>
      <textarea v-model="note" placeholder="Brief note or context..." />

      <label>Tags {{ mode === 'principal' ? '(role)' : '(comma-separated)' }}</label>
      <input
        v-model="tags"
        type="text"
        :placeholder="mode === 'principal' ? 'e.g. Founder, Core Team' : 'e.g. EU, US, Freelance'"
      >

      <label v-if="mode === 'member'">Status</label>
      <select v-if="mode === 'member'" v-model="status">
        <option value="">
          — none —
        </option>
        <option value="TBH">
          To Be Hired
        </option>
        <option value="Considering">
          Considering
        </option>
        <option value="Contract">
          Contract
        </option>
        <option value="On Leave">
          On Leave
        </option>
      </select>

      <div class="modal-actions">
        <template v-if="confirmDelete">
          <button class="btn btn-danger" @click="confirmDeleteAction">
            Confirm Delete
          </button>
          <button class="btn btn-cancel" @click="cancelDelete">
            Cancel
          </button>
        </template>
        <template v-else>
          <button v-if="showDelete" class="btn btn-danger" @click="handleDelete">
            Delete
          </button>
          <div style="flex: 1" />
          <button class="btn btn-cancel" @click="emit('close')">
            Cancel
          </button>
          <button class="btn btn-save" @click="save">
            Save
          </button>
        </template>
      </div>
    </div>
  </div>
</template>
