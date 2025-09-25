<script setup lang="ts">
const { status, signOut } = useAuth()
const { displayName } = useUserDisplayName()

async function logout() {
  await signOut({ callbackUrl: '/login' })
}
</script>

<template>
  <div class="flex min-h-6 items-center">
    <template v-if="status === 'authenticated'">
      <div class="flex flex-row items-center gap-2 whitespace-nowrap">
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
  </div>
</template>
