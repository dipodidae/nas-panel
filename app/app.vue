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
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
