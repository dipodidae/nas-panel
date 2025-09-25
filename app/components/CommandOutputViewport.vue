<script setup lang="ts">
interface OutputLine {
  ts: number
  kind: 'stdout' | 'stderr' | 'meta'
  text: string
}

const props = defineProps<{
  lines: OutputLine[]
  // Accept full superset including runtime statuses mapped through to simplified UI states
  status: 'idle' | 'connecting' | 'streaming' | 'closed' | 'error' | 'running' | 'exited'
  follow: boolean
}>()

const container = ref<HTMLDivElement | null>(null)

// Auto-scroll when follow enabled
watch(() => [props.lines.length, props.follow] as const, () => {
  if (!props.follow)
    return
  requestAnimationFrame(() => {
    const el = container.value
    if (el)
      el.scrollTop = el.scrollHeight
  })
})
</script>

<template>
  <div ref="container" class="border-border/50 h-72 overflow-auto rounded-md border bg-black/80 p-2 font-mono text-xs">
    <template v-if="props.lines.length === 0 && props.status !== 'error'">
      <div class="text-neutral-400 italic">
        Waiting for output...
      </div>
    </template>
    <CommandOutputLine
      v-for="(l, i) in props.lines"
      :key="`${l.ts}-${i}`"
      :line="l"
    />
  </div>
</template>

<style scoped>
</style>
