<script setup lang="ts">
// Displays latest test result & error
const { lastTest, error } = useSshSettings()
</script>

<template>
  <div class="space-y-2">
    <div v-if="lastTest" class="text-sm" :class="lastTest.success ? 'text-success' : 'text-error'">
      Test: {{ lastTest.message }}<span v-if="lastTest?.latencyMs"> ({{ lastTest?.latencyMs }} ms)</span>
    </div>
    <div v-if="error" class="text-error text-sm">
      {{ error }}
    </div>
  </div>
</template>

<style scoped>
</style>
