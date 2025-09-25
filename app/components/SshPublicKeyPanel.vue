<script setup lang="ts">
// Public key display & actions
const ssh = useSshSettings()
const { publicKey, hasKey } = ssh
</script>

<template>
  <UCard v-if="publicKey">
    <template #default>
      <UFormField name="publicKey" label="Public Key">
        <UTextarea
          v-model="publicKey" readonly :rows="6" class="w-full" color="secondary" :ui="{
            base: 'bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
          }"
        />
      </UFormField>
    </template>
    <template #footer>
      <UButton size="xs" variant="ghost" @click="ssh.copyPublicKey">
        Copy
      </UButton>
      <UButton size="xs" variant="ghost" @click="ssh.downloadPublicKey">
        Download
      </UButton>
    </template>
  </UCard>
  <div v-if="publicKey" class="mt-4">
    <SshPublicKeyHelp />
  </div>
  <div v-else class="text-xs text-neutral-500">
    <span v-if="hasKey === false">No key generated yet.</span>
    <span v-else>No key loaded.</span>
  </div>
</template>
