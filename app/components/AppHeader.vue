<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import { appName } from '~/constants'

const route = useRoute()

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: 'Home',
    to: '/',
    icon: 'i-lucide-home',
    active: route.path === '/',
  },
  {
    label: 'Settings',
    to: '/settings',
    icon: 'i-lucide-settings',
    active: route.path.startsWith('/settings'),
  },
])
</script>

<template>
  <UHeader>
    <template #title>
      <ULink to="/" class="flex items-center gap-1">
        <span class="font-bold">{{ appName }}</span>
      </ULink>
    </template>

    <template #right>
      <AppHeaderUser />
      <UColorModeButton />
    </template>

    <UNavigationMenu :items="items" />

    <template #body>
      <UNavigationMenu :items="items" orientation="vertical" class="-mx-2.5" />
    </template>
  </UHeader>
</template>
