<script setup lang="ts">
defineProps<{
  dark: boolean
}>()

defineEmits<{
  toggleDark: []
}>()
</script>

<template>
  <header class="org-header">
    <div>
      <h1>SUPERKIDS</h1>
      <div class="founders">
        Built by Colm Dillane &amp; Sebastian Boon &nbsp;·&nbsp; New York /
        Europe
      </div>
    </div>
    <div class="tagline">
      "A studio for ideas that haven't learned their limits yet."
    </div>

    <div class="dark-toggle-wrap">
      <span class="dark-toggle-label">{{ dark ? "Dark" : "Light" }}</span>
      <label class="dark-toggle">
        <input
          type="checkbox"
          :checked="dark"
          aria-label="Toggle dark mode"
          @change="$emit('toggleDark')"
        >
        <span class="dark-toggle-track" />
        <span class="dark-toggle-icon sun">☀</span>
        <span class="dark-toggle-icon moon">☾</span>
      </label>
    </div>
  </header>
</template>
