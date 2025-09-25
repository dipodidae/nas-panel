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
      'text-neutral': props.line.kind === 'stdout',
      'text-errpr': props.line.kind === 'stderr',
      'text-succes': props.line.kind === 'meta',
    }"
  >
    {{ props.line.text }}
  </div>
</template>

<style scoped>
</style>
