<script setup lang="ts">
interface Principal {
  id: string;
  name: string;
  title: string;
  role: string;
  type: string;
  note: string;
}

defineProps<{
  principals: Principal[];
}>();

const emit = defineEmits<{
  edit: [principal: Principal];
}>();
</script>

<template>
  <section class="principals">
    <div class="principals-title">Core Principals</div>
    <div class="principals-grid">
      <div
        v-for="principal in principals"
        :key="principal.id"
        class="principal-card"
        :class="principal.type"
        @click="emit('edit', principal)"
      >
        <div class="role-tag">{{ principal.role }}</div>
        <div class="p-name">{{ principal.name }}</div>
        <div class="p-title">{{ principal.title }}</div>
        <div v-if="principal.note" class="p-note">{{ principal.note }}</div>
      </div>
    </div>
  </section>
</template>
