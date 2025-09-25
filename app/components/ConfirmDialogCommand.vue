<script setup lang="ts">
import ConfirmDialog from './ConfirmDialog.vue'

const props = defineProps<{ command: string }>()
const emit = defineEmits<{ (e: 'confirm'): void, (e: 'cancel'): void }>()
const open = defineModel<boolean>('open', { required: true })
const onConfirm = () => emit('confirm')
const onCancel = () => emit('cancel')
</script>

<template>
  <ConfirmDialog
    v-model:open="open"
    title="Confirm Command"
    message="Are you sure you want to run this command?"
    ok-label="Run"
    cancel-label="Cancel"
    ok-color="warning"
    :destructive="true"
    @confirm="onConfirm"
    @cancel="onCancel"
  >
    <p class="text-muted text-xs">
      Command: <code>{{ props.command }}</code>
    </p>
  </ConfirmDialog>
</template>
