<script setup lang="ts">
import { appName } from '~/constants'

useHead({
  title: appName,
  titleTemplate: `%s - ${appName}`,
})
</script>

<template>
  <VitePwaManifest />
  <UApp>
    <AppLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>E
</template>
