<script setup lang="ts">
const props = withDefaults(defineProps<{
  limit?: number
  showHeader?: boolean
}>(), {
  limit: 25,
  showHeader: true,
})

const commandStore = useCommandStore()

const recent = computed(() => commandStore.history.slice(0, props.limit))
</script>

<template>
  <div v-if="recent.length" class="space-y-1">
    <h3 v-if="showHeader" class="text-muted text-xs font-semibold tracking-wide uppercase">
      Recent
    </h3>
    <ul class="divide-border/30 border-border/40 bg-background/40 divide-y rounded-md border">
      <CommandHistoryItem v-for="h in recent" :key="h.id" :item="h" />
    </ul>
  </div>
</template>

<style scoped>
</style>
