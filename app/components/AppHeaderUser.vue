<script setup lang="ts">
// explicit import for clarity
import { useUserDisplayName } from '../../composables/useUserDisplayName'

const { status, signOut } = useAuth()
const { displayName } = useUserDisplayName()

async function logout() {
  await signOut({ callbackUrl: '/login' })
}
</script>

<template>
  <div v-if="status === 'authenticated'" class="flex flex-row items-center gap-2 whitespace-nowrap">
    <div class="flex flex-1">
      Welcome, {{ displayName }}
    </div>
    <UButton
      variant="outline"
      class="shrink-0"
      @click="logout"
    >
      Logout
    </UButton>
  </div>
</template>
