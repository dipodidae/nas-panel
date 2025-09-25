<script setup lang="ts">
definePageMeta({
  middleware: ['sidebase-auth'],
})
</script>

<template>
  <UContainer>
    <UPage>
      <UPageHeader
        title="Settings"
        description="Configure SSH access used for remote command execution."
      />
      <UPageBody>
        <div class="space-y-6">
          <SshSettingsCard />
        </div>
      </UPageBody>
    </UPage>
  </UContainer>
</template>
