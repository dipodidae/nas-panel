<script setup lang="ts">
interface OutputLine {
  ts: number
  kind: 'stdout' | 'stderr' | 'meta'
  text: string
}

const props = defineProps<{ line: OutputLine }>()
</script>

<template>
  <div
    class="break-all whitespace-pre"
    :class="{
      'text-neutral-300': props.line.kind === 'stdout',
      'text-red-400': props.line.kind === 'stderr',
      'text-blue-400': props.line.kind === 'meta',
    }"
  >
    {{ props.line.text }}
  </div>
</template>

<style scoped>
</style>
