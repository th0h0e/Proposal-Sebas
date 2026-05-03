<script setup lang="ts">
import type { Member } from '../types.ts'

defineProps<{
  member: Member
}>()

const tagColorMap: Record<string, string> = {
  EU: 'tag-blue',
  US: 'tag-red',
  KidSuper: 'tag-yellow',
  NY: 'tag-green',
}
</script>

<template>
  <div class="card" :class="member.color">
    <div class="card-name">
      {{ member.name }}
    </div>
    <div class="card-role">
      {{ member.role }}
    </div>
    <div v-if="member.tags?.length" class="tags">
      <span
        v-for="tag in member.tags"
        :key="tag"
        class="tag"
        :class="tagColorMap[tag] || 'tag-green'"
      >
        {{ tag }}
      </span>
    </div>
    <span v-if="member.status" class="status-badge">{{ member.status }}</span>
  </div>
</template>
