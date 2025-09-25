<script setup lang="ts">
interface HistoryItem {
  id: string
  key: string
  exitCode: number | null
  at: number
}

const props = defineProps<{ item: HistoryItem }>()

const exitClass = computed(() => {
  const code = props.item.exitCode
  if (code === 0)
    return 'text-success'
  if (code === null)
    return 'text-neutral'
  return 'text-error'
})

const timeString = computed(() => new Date(props.item.at).toLocaleTimeString())

const exitClassContent = computed<string>(() => props.item.exitCode === null ? '—' : String(props.item.exitCode))
</script>

<template>
  <li class="flex items-center justify-between gap-2 px-2 py-1 text-xs">
    <span class="max-w-[10rem] truncate font-mono" :title="item.key">{{ item.key }}</span>
    <span :class="exitClass">{{ exitClassContent }}</span>
    <span class="text-neutral-400 tabular-nums">{{ timeString }}</span>
  </li>
</template>
