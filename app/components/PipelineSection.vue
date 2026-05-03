<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus'
import MemberCard from './MemberCard.vue'

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

interface Section {
  label: string
  sublabel?: string
  members: Member[]
}

defineProps<{
  pipeline: PipelineConfig
  sections: Record<string, Section>
}>()

const emit = defineEmits<{
  editMember: [member: Member, sectionKey: string]
  reorder: []
  updateMembers: [sectionKey: string, members: Member[]]
}>()

function onDragEnd() {
  emit('reorder')
}
</script>

<template>
  <div class="pipeline-wrap">
    <div class="pipeline-header">
      <div class="pipeline-title">
        {{ pipeline.header }}
      </div>
      <div class="pipeline-subtitle">
        {{ pipeline.subtitle }}
      </div>
    </div>

    <div class="pipeline">
      <template v-for="(stepKey, index) in pipeline.steps" :key="stepKey">
        <div v-if="index > 0" class="pipeline-arrow">
          <span class="arrow-line" />
          <span class="arrow-head">&#x25B6;</span>
          <span class="arrow-line" />
        </div>
        <div class="pipeline-step">
          <div class="pipeline-step-number">
            Step {{ index + 1 }}
          </div>
          <div class="section-box orange">
            <div class="section-label">
              {{ sections[stepKey]?.label }}
            </div>
            <div
              v-if="sections[stepKey]?.sublabel"
              class="section-sublabel"
            >
              {{ sections[stepKey].sublabel }}
            </div>

            <VueDraggable
              :model-value="sections[stepKey]?.members || []"
              group="pipeline"
              :animation="150"
              ghost-class="drag-ghost"
              drag-class="drag-dragging"
              @update:model-value="(val: Member[]) => emit('updateMembers', stepKey, val)"
              @end="onDragEnd"
            >
              <MemberCard
                v-for="member in sections[stepKey]?.members"
                :key="member.id"
                :member="member"
                @click="emit('editMember', member, stepKey)"
              />
            </VueDraggable>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
