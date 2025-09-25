<script setup lang="ts">
// Displays latest test result & error
const { lastTest, error } = useSshSettings()
</script>

<template>
  <div class="space-y-2">
    <div v-if="lastTest" class="text-sm" :class="lastTest.success ? 'text-green-600' : 'text-red-600'">
      Test: {{ lastTest.message }}<span v-if="lastTest?.latencyMs"> ({{ lastTest?.latencyMs }} ms)</span>
    </div>
    <div v-if="error" class="text-sm text-red-600">
      {{ error }}
    </div>
  </div>
</template>

<style scoped>
</style>
