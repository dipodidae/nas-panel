<script setup lang="ts">
const { lastTest, error } = useSshSettings()
</script>

<template>
  <div class="space-y-2">
    <UAlert v-if="lastTest" title="Last Test Result" :description="lastTest.message" type="info" variant="subtle" icon="fa:info" />
    <UAlert v-if="error" title="Error connecting" :description="error" type="error" variant="subtle" icon="fa-solid:times" />
  </div>
</template>
