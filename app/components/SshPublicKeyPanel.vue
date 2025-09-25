<script setup lang="ts">
// Public key display & actions
const ssh = useSshSettings()
const { publicKey, hasKey } = ssh
</script>

<template>
  <div class="space-y-2">
    <div class="text-sm font-medium">
      Public Key
    </div>
    <div v-if="publicKey" class="space-y-2">
      <UTextarea v-model="publicKey" readonly :rows="4" />
      <div class="flex gap-2">
        <UButton size="xs" variant="ghost" @click="ssh.copyPublicKey">
          Copy
        </UButton>
        <UButton size="xs" variant="ghost" @click="ssh.downloadPublicKey">
          Download
        </UButton>
      </div>
    </div>
    <div v-else class="text-xs text-neutral-500">
      <span v-if="hasKey === false">No key generated yet.</span>
      <span v-else>No key loaded.</span>
    </div>
  </div>
</template>

<style scoped>
</style>
