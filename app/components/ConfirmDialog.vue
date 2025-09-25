<script setup lang="ts">
type ButtonColor = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral'

const props = withDefaults(defineProps<{
  title?: string
  message?: string
  okLabel?: string
  cancelLabel?: string
  okColor?: ButtonColor
  destructive?: boolean
}>(), {
  title: 'Confirm',
  message: 'Are you sure?',
  okLabel: 'OK',
  cancelLabel: 'Cancel',
  okColor: 'warning' as ButtonColor,
  destructive: false,
})

const emit = defineEmits<{ (e: 'confirm'): void, (e: 'cancel'): void }>()

// Use documented API: control open via v-model:open
const open = defineModel<boolean>('open', { required: true })

function confirm(close?: () => void) {
  if (close)
    close()
  else open.value = false
  emit('confirm')
}
function cancel(close?: () => void) {
  if (close)
    close()
  else open.value = false
  emit('cancel')
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="props.title"
    :dismissible="false"
    :ui="{
      body: 'bg-background/60 dark:bg-background/40',
      footer: 'flex justify-end gap-2 bg-background/60 dark:bg-background/30',
    }"
  >
    <template #body>
      <div class="space-y-2 text-sm">
        <p>{{ props.message }}</p>
        <slot />
      </div>
    </template>
    <template #footer="{ close }">
      <UButton size="xs" variant="ghost" color="neutral" @click="cancel(close)">
        {{ props.cancelLabel }}
      </UButton>
      <UButton size="xs" :color="okColor" icon="i-lucide-check" @click="confirm(close)">
        {{ props.okLabel }}
      </UButton>
    </template>
  </UModal>
</template>
