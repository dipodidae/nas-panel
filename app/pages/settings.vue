<script setup lang="ts">
definePageMeta({
  middleware: ['sidebase-auth'],
})

useHead({ title: 'Settings' })

const { data: page } = await useAsyncData('settings', () =>
  queryCollection('content').path('/settings').first())
</script>

<template>
  <UContainer>
    <UPage>
      <UPageHeader
        title="Settings"
        description="Configure SSH access used for remote command execution."
      />
      <UPageBody>
        <ContentRenderer v-if="page" :value="page" />
        <USeparator />
        <SshSettingsCard />
      </UPageBody>
    </UPage>
  </UContainer>
</template>
