<script setup lang="ts">
import { appName } from '~/constants'
</script>

<template>
  <UHeader>
    <template #left>
      <ULink to="/">
        {{ appName }}
      </ULink>
    </template>

    <template #right>
      <AppHeaderUser />
      <UColorModeButton />
    </template>

    <template #body>
      <AppHeaderUser />
    </template>
  </UHeader>
</template>
