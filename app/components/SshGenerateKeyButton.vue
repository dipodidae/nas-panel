<script setup lang="ts">
// SSH key generation / regeneration button + confirmation dialog
import ConfirmDialog from './ConfirmDialog.vue'

const ssh = useSshSettings()
const { hasKey, generating } = ssh

const showConfirm = ref(false)

const canGenerate = computed(() => !generating.value)

function onClick() {
  if (!hasKey.value) {
    ssh.generate(false)
    return
  }
  showConfirm.value = true
}
function confirmGenerate() {
  showConfirm.value = false
  ssh.generate(true)
}
function cancelGenerate() {
  showConfirm.value = false
}
</script>

<template>
  <div class="inline-flex items-center">
    <UButton
      color="warning"
      variant="soft"
      :loading="generating"
      :disabled="!canGenerate"
      @click="onClick"
    >
      <span v-if="!hasKey">Generate Keypair</span>
      <span v-else>Regenerate</span>
    </UButton>
    <ConfirmDialog
      v-model:open="showConfirm"
      title="Regenerate Keypair"
      message="Your existing private key will be replaced. Continue?"
      ok-label="Regenerate"
      cancel-label="Cancel"
      ok-color="warning"
      :destructive="true"
      @confirm="confirmGenerate"
      @cancel="cancelGenerate"
    >
      <p class="text-muted text-xs">
        Update the remote authorized_keys after regeneration.
      </p>
    </ConfirmDialog>
  </div>
</template>
