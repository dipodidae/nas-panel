<script setup lang="ts">
useHead({ title: 'Home' })
</script>

<template>
  <UContainer>
    <UPage>
      <UPageHeader title="NAS Panel" description="Server management dashboard" />
      <UPageBody>
        <div class="space-y-6">
          <UAlert color="info" variant="subtle" title="WebSocket commands removed" description="Command execution features have been removed. SSH connection functionality is preserved." />
        </div>
      </UPageBody>
    </UPage>
  </UContainer>
</template>
