<script setup lang="ts">
import type { Column, Member, Section } from '../types.ts'
import { VueDraggable } from 'vue-draggable-plus'
import MemberCard from './MemberCard.vue'

const props = defineProps<{
  column: Column
  sections: Record<string, Section>
}>()

const emit = defineEmits<{
  editMember: [member: Member, sectionKey: string]
  reorder: []
  updateMembers: [sectionKey: string, members: Member[]]
}>()

const colorMap: Record<string, string> = {
  'creative-directors': 'red',
  'creative-freelance': 'yellow',
  'production-list': 'green',
  'kidsuper-list': 'yellow',
  'clients-list': 'blue',
  'pr-list': 'blue',
  'ops-management': 'purple',
  'ops-legal': 'purple',
  'ops-digital': 'purple',
  'pipeline-inbound': 'orange',
  'pipeline-qualified': 'orange',
  'pipeline-active': 'orange',
}

function sectionColor(key: string): string {
  const firstMember = props.sections[key]?.members?.[0]
  return firstMember?.color || colorMap[key] || 'yellow'
}

function onDragEnd() {
  emit('reorder')
}
</script>

<template>
  <div class="col" :class="column.colorClass">
    <div class="col-header">
      {{ column.header }}
    </div>

    <div
      v-for="sectionKey in column.sections"
      :key="sectionKey"
      class="section-box"
      :class="sectionColor(sectionKey)"
    >
      <div class="section-label">
        {{ sections[sectionKey]?.label }}
      </div>
      <div
        v-if="sections[sectionKey]?.sublabel"
        class="section-sublabel"
      >
        {{ sections[sectionKey].sublabel }}
      </div>

      <VueDraggable
        :model-value="sections[sectionKey]?.members || []"
        group="org-members"
        :animation="150"
        ghost-class="drag-ghost"
        drag-class="drag-dragging"
        @update:model-value="(val: Member[]) => emit('updateMembers', sectionKey, val)"
        @end="onDragEnd"
      >
        <MemberCard
          v-for="member in sections[sectionKey]?.members"
          :key="member.id"
          :member="member"
          @click="emit('editMember', member, sectionKey)"
        />
      </VueDraggable>
    </div>
  </div>
</template>
