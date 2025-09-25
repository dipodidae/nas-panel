<script setup lang="ts">
const commandStore = useCommandStore()
const { connected } = useSshSettings()
// Button disabled if not connected and not currently testing (allow user to test first)
const disabled = computed(() => !connected.value)
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <CommandButton :disabled="disabled" command="docker-restart" icon="i-lucide-refresh-ccw" label="Restart Docker Compose" confirm />
    <CommandButton :disabled="disabled" command="host-reboot" color="warning" icon="i-lucide-power" label="Reboot Host" confirm />
    <span v-if="commandStore.activeCommandId" class="text-muted text-xs">ID: {{ commandStore.activeCommandId }}</span>
    <span v-if="disabled" class="text-xs text-amber-500">SSH not connected</span>
  </div>
</template>
