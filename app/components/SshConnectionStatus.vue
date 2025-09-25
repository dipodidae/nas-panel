<script setup lang="ts">
// Small focused component showing SSH connection health
const { connected, testing, lastHealthyAt } = useSshSettings()

// Use a stable, SSR-cached formatted time to avoid client/server locale differences.
const sinceTime = computed(() => {
  const ts = lastHealthyAt?.value
  if (!ts)
    return ''
  // Force 24h HH:mm:ss to remove timezone / locale variation between node & browser.
  return new Date(ts).toISOString().slice(11, 19) // HH:MM:SS
})

const tooltipLabel = computed(() => {
  if (testing.value)
    return 'Testing SSH…'
  if (connected.value)
    return sinceTime.value ? `SSH Connected (${sinceTime.value})` : 'SSH Connected'
  return 'SSH Disconnected'
})
</script>

<template>
  <UTooltip :text="tooltipLabel">
    <span v-if="testing" class="text-warning inline-flex items-center gap-1 text-xs font-medium">
      <UIcon name="i-lucide-loader-circle" class="size-4 animate-spin" />
    </span>
    <span v-else-if="connected" class="text-success inline-flex items-center gap-1 text-xs font-medium">
      <UIcon name="i-lucide-plug" class="size-4" />
    </span>
    <span v-else class="text-error inline-flex items-center gap-1 text-xs font-medium">
      <UIcon name="i-lucide-plug-zap" class="size-4" />
    </span>
  </UTooltip>
</template>
