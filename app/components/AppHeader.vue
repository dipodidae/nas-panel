<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import { appName } from '~/constants'

const route = useRoute()
// Connection status indicator handled by SshConnectionStatus component

const items = computed<NavigationMenuItem[]>(() => buildMenu(route.path))

// connectionStatus logic extracted into SshConnectionStatus component

function buildMenu(path: string): NavigationMenuItem[] {
  return [
    { label: 'Home', to: '/', icon: 'i-lucide-home', active: path === '/' },
    { label: 'Settings', to: '/settings', icon: 'i-lucide-settings', active: path.startsWith('/settings') },
    { label: 'Help', to: '/help', icon: 'i-lucide-help-circle', active: path.startsWith('/help') },
  ]
}
</script>

<template>
  <UHeader>
    <template #title>
      <ULink to="/" class="flex items-center gap-1">
        <span class="font-bold">{{ appName }}</span>
      </ULink>
    </template>

    <template #right>
      <div class="flex items-center gap-3">
        <SshConnectionStatus />
        <AppHeaderUser />
        <UColorModeButton />
      </div>
    </template>

    <UNavigationMenu :items="items" />

    <template #body>
      <UNavigationMenu :items="items" orientation="vertical" class="-mx-2.5" />
    </template>
  </UHeader>
</template>
