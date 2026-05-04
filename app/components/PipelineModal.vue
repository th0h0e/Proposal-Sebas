<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  stepCount: number
}>()

const emit = defineEmits<{
  close: []
  addStep: [data: { label: string, sublabel?: string, insertAfter?: number }]
  deleteStep: [index: number]
}>()

const mode = ref<'manage' | 'add'>('manage')
const addLabel = ref('')
const addSublabel = ref('')
const addPosition = ref<number>(props.stepCount - 1)
const confirmDeleteIndex = ref<number | null>(null)

function submitAdd() {
  const label = addLabel.value.trim()
  if (!label)
    return
  emit('addStep', {
    label,
    sublabel: addSublabel.value.trim() || undefined,
    insertAfter: addPosition.value,
  })
  mode.value = 'manage'
  addLabel.value = ''
  addSublabel.value = ''
}

function requestDelete(index: number) {
  confirmDeleteIndex.value = index
}

function confirmDelete() {
  if (confirmDeleteIndex.value != null) {
    emit('deleteStep', confirmDeleteIndex.value)
    confirmDeleteIndex.value = null
  }
}

function cancelDelete() {
  confirmDeleteIndex.value = null
}

function switchToAdd() {
  addPosition.value = props.stepCount - 1
  mode.value = 'add'
}

function backToManage() {
  mode.value = 'manage'
  addLabel.value = ''
  addSublabel.value = ''
  confirmDeleteIndex.value = null
}
</script>

<template>
  <div class="modal-overlay active" @click.self="emit('close')">
    <div class="modal">
      <template v-if="mode === 'manage'">
        <h3>Manage Pipeline Steps</h3>
        <div class="pipeline-modal-steps">
          <div v-for="(_, index) in stepCount" :key="index" class="pipeline-modal-step">
            <div class="pipeline-modal-step-num">
              {{ index + 1 }}
            </div>
            <div class="pipeline-modal-step-label">
              Step {{ index + 1 }}
            </div>
            <div class="pipeline-modal-step-actions">
              <template v-if="confirmDeleteIndex === index">
                <button class="btn btn-danger btn-xs" @click="confirmDelete">
                  Confirm
                </button>
                <button class="btn btn-cancel btn-xs" @click="cancelDelete">
                  Cancel
                </button>
              </template>
              <button
                v-else
                class="btn btn-danger btn-xs"
                :disabled="stepCount <= 1"
                @click="requestDelete(index)"
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button class="btn btn-save" @click="switchToAdd">
            + Add Step
          </button>
          <div style="flex: 1" />
          <button class="btn btn-cancel" @click="emit('close')">
            Close
          </button>
        </div>
      </template>

      <template v-else>
        <h3>Add Pipeline Step</h3>

        <label>Step Name</label>
        <input
          v-model="addLabel"
          type="text"
          placeholder="e.g. Discovery Call"
          @keyup.enter="submitAdd"
        >

        <label>Subtitle <span style="font-weight: 400; text-transform: none">(optional)</span></label>
        <input
          v-model="addSublabel"
          type="text"
          placeholder="e.g. Initial client meeting"
          @keyup.enter="submitAdd"
        >

        <label>Insert After</label>
        <select v-model="addPosition">
          <option v-for="(_, i) in stepCount" :key="i" :value="i">
            Step {{ i + 1 }}
          </option>
          <option :value="stepCount - 1">
            At end
          </option>
        </select>

        <div class="modal-actions">
          <button class="btn btn-cancel" @click="backToManage">
            Back
          </button>
          <div style="flex: 1" />
          <button class="btn btn-save" :disabled="!addLabel.trim()" @click="submitAdd">
            Add Step
          </button>
        </div>
      </template>
    </div>
  </div>
</template>
