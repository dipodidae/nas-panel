<script setup lang="ts">
// Small focused component showing SSH connection health
const { connected, testing, lastHealthyAt } = useSshSettings()

interface StatusMeta {
  icon: string
  label: string
  class: string
}

const status = computed<StatusMeta>(() => {
  if (testing.value) {
    return {
      icon: 'i-lucide-loader-circle',
      label: 'Testing SSH…',
      class: 'text-warning animate-spin',
    }
  }
  if (connected.value) {
    const ts = lastHealthyAt?.value
    const since = ts ? new Date(ts).toLocaleTimeString() : ''
    return {
      icon: 'i-lucide-plug',
      label: since ? `SSH Connected (${since})` : 'SSH Connected',
      class: 'text-success',
    }
  }
  return {
    icon: 'i-lucide-plug-zap',
    label: 'SSH Disconnected',
    class: 'text-error',
  }
})
</script>

<template>
  <UTooltip :text="status.label">
    <span class="inline-flex items-center gap-1 text-xs font-medium" :class="status.class">
      <UIcon :name="status.icon" class="size-4" />
    </span>
  </UTooltip>
</template>
