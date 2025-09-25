<script setup lang="ts">
const ssh = useSshSettings()

onMounted(() => ssh.load())

const [open, toggle] = useToggle()
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-start justify-between gap-2">
        <div class="font-medium">
          SSH Connection
        </div>
        <UButton size="xs" variant="ghost" color="neutral" icon="i-lucide-help-circle" aria-label="Help" @click="toggle()" />
      </div>
    </template>
    <SshConnectionForm />
    <div class="mt-4">
      <SshTestStatus />
    </div>
    <template #footer>
      <SshPublicKeyPanel />
    </template>
  </UCard>
  <SshSettingsHelpModal v-model:open="open" />
</template>
