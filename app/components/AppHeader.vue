<script setup lang="ts">
import { appName } from '~/constants'

const { data: session, status, signOut } = useAuth()

const items = computed(() => [
  {
    label: 'Home',
    to: '/',
  },
  {
    label: 'Counter Store',
    to: '/counter',
  },
  {
    label: 'Pageview API',
    to: '/pageview',
  },
])

async function logout() {
  await signOut({ callbackUrl: '/login' })
}
</script>

<template>
  <UHeader>
    <template #left>
      <NuxtLink to="/">
        {{ appName }}
      </NuxtLink>
      <TemplateMenu />
    </template>

    <UNavigationMenu
      :items="items"
      variant="link"
    />

    <template #right>
      <div v-if="status === 'authenticated'" class="flex items-center space-x-4">
        <span class="text-sm text-gray-600">
          Welcome, {{ session?.name || session?.username }}
        </span>
        <UButton
          variant="ghost"
          @click="logout"
        >
          Logout
        </UButton>
      </div>
      <UColorModeButton />
    </template>

    <template #body>
      <UNavigationMenu
        :items="items"
        orientation="vertical"
        class="-mx-2.5"
      />

      <div v-if="status === 'authenticated'" class="mt-4 border-t border-gray-200 pt-4">
        <div class="mb-2 text-sm text-gray-600">
          Welcome, {{ session?.name || session?.username }}
        </div>
        <UButton
          variant="outline"
          class="w-full"
          @click="logout"
        >
          Logout
        </UButton>
      </div>
    </template>
  </UHeader>
</template>
