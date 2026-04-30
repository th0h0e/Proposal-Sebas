<script setup lang="ts">
import MemberCard from "./MemberCard.vue";

interface Member {
  id: string;
  name: string;
  role: string;
  tags: string[];
  color: string;
  status?: string;
}

interface Section {
  label: string;
  sublabel?: string;
  members: Member[];
}

interface Column {
  key: string;
  header: string;
  colorClass: string;
  sections: string[];
}

const props = defineProps<{
  column: Column;
  sections: Record<string, Section>;
}>();

const emit = defineEmits<{
  editMember: [member: Member, sectionKey: string];
}>();

const colorMap: Record<string, string> = {
  "creative-directors": "red",
  "creative-freelance": "yellow",
  "production-list": "green",
  "kidsuper-list": "yellow",
  "clients-list": "blue",
  "pr-list": "blue",
  "ops-management": "purple",
  "ops-legal": "purple",
  "ops-digital": "purple",
};

function sectionColor(key: string): string {
  const firstMember = props.sections[key]?.members?.[0];
  return firstMember?.color || colorMap[key] || "yellow";
}
</script>

<template>
  <div class="col" :class="column.colorClass">
    <div class="col-header">{{ column.header }}</div>

    <div
      v-for="sectionKey in column.sections"
      :key="sectionKey"
      class="section-box"
      :class="sectionColor(sectionKey)"
    >
      <div class="section-label">{{ sections[sectionKey]?.label }}</div>
      <div
        v-if="sections[sectionKey]?.sublabel"
        class="section-sublabel"
      >
        {{ sections[sectionKey].sublabel }}
      </div>

      <MemberCard
        v-for="member in sections[sectionKey]?.members"
        :key="member.id"
        :member="member"
        @click="emit('editMember', member, sectionKey)"
      />
    </div>
  </div>
</template>
