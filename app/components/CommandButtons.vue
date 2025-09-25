<script setup lang="ts">
const commandStore = useCommandStore()
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <CommandButton command="docker-restart" icon="i-lucide-refresh-ccw" label="Restart Docker Compose" confirm />
    <CommandButton command="host-reboot" color="warning" icon="i-lucide-power" label="Reboot Host" confirm />
    <span v-if="commandStore.activeCommandId" class="text-muted text-xs">ID: {{ commandStore.activeCommandId }}</span>
  </div>
</template>
