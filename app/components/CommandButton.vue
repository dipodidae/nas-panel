<script setup lang="ts">
import { useCommandStore } from '@/stores/command'

const props = withDefaults(defineProps<{
  command: string
  label?: string
  icon?: string
  confirm?: boolean
}>(), {
  label: '',
  icon: 'i-lucide-terminal',
  confirm: false,
})

const commandStore = useCommandStore()
const showConfirm = ref(false)

function run() {
  if (props.confirm) {
    showConfirm.value = true
    return
  }
  commandStore.trigger(props.command)
}

function confirmRun() {
  showConfirm.value = false
  commandStore.trigger(props.command)
}

function cancelRun() {
  showConfirm.value = false
}

const starting = computed(() => commandStore.isStarting(props.command))
</script>

<template>
  <div class="inline-flex items-center">
    <UButton :icon="icon" :loading="starting" :disabled="starting" @click="run">
      <slot>{{ label || props.command }}</slot>
    </UButton>
    <ConfirmDialogCommand
      v-if="confirm"
      v-model:open="showConfirm"
      :command="props.command"
      @confirm="confirmRun"
      @cancel="cancelRun"
    />
  </div>
</template>
