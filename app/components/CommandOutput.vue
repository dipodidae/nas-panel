<script setup lang="ts">
const {
  lines,
  status,
  error,
  exitCode,
  follow,
  toggleFollow,
  clear,
  cancelActive,
  cancelling,
} = useCommandStream()

const store = useCommandStore()

// Human readable status
const statusLabel = computed(() => {
  if (error.value)
    return 'Error'
  switch (status.value) {
    case 'idle': return 'Idle'
    case 'connecting': return 'Connecting'
    case 'streaming': return 'Running'
    case 'closed': return 'Closed'
    default: return status.value
  }
})
</script>

<template>
  <div v-if="store.commandKey || store.activeCommandId" class="space-y-2">
    <div class="text-muted flex items-center gap-2 text-xs">
      <span>Status: {{ statusLabel }}</span>
      <span v-if="exitCode !== null" :class="exitCode === 0 ? 'text-green-500' : 'text-red-500'">Exit: {{ exitCode }}</span>
      <span v-if="store.activeCommandId">ID: {{ store.activeCommandId }}</span>
      <span v-if="error" class="text-red-500">{{ error }}</span>
      <div class="ml-auto flex items-center gap-1">
        <UTooltip text="Follow output">
          <UButton
            size="xs"
            variant="ghost"
            :color="follow ? 'primary' : 'neutral'"
            icon="i-lucide-eye"
            aria-label="Toggle follow"
            @click="toggleFollow"
          />
        </UTooltip>
        <UTooltip text="Clear buffer" :disabled="!lines.length">
          <UButton
            size="xs"
            variant="ghost"
            color="neutral"
            icon="i-lucide-eraser"
            :disabled="!lines.length"
            aria-label="Clear output"
            @click="clear"
          />
        </UTooltip>
        <UTooltip v-if="status === 'streaming'" text="Graceful cancel (SIGTERM)">
          <UButton
            size="xs"
            variant="ghost"
            color="warning"
            :loading="cancelling"
            icon="i-lucide-square"
            aria-label="Cancel command"
            @click="cancelActive"
          />
        </UTooltip>
      </div>
    </div>
    <CommandOutputViewport :lines="lines" :status="status" :follow="follow" />
  </div>
</template>

<style scoped>
</style>
