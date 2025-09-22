<script setup lang="ts">
const { data: session, status, signOut } = useAuth()

const displayName = computed(() => {
  const s = session.value as any
  return s?.name || s?.username || 'User'
})

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
