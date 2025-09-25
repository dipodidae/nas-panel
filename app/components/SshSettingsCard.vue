<script setup lang="ts">
const ssh = useSshSettings()
onMounted(() => ssh.load())
</script>

<template>
  <UCard>
    <template #header>
      <div class="font-medium">
        SSH Connection
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
</template>
