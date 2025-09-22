<script setup lang="ts">
definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/',
  },
})

const { signIn } = useAuth()

const credentials = ref({
  username: '',
  password: '',
})

const { status, error, execute } = await useAsyncData(
  'login',
  () => signIn({
    username: credentials.value.username,
    password: credentials.value.password,
  }, { callbackUrl: '/' }),
  { immediate: false },
)

async function login() {
  await execute()
}
</script>

<template>
  <!-- Using only Nuxt UI components (no manual Tailwind classes) -->
  <UContainer class="flex min-h-screen items-center justify-center">
    <UCard class="w-full max-w-sm">
      <template #header>
        <div class="text-center">
          <h2>Sign in to your account</h2>
        </div>
      </template>

      <UForm :state="credentials" class="space-y-4" @submit.prevent="login">
        <UFormGroup label="Username" name="username" required>
          <UInput v-model="credentials.username" placeholder="Username" autocomplete="username" />
        </UFormGroup>
        <UFormGroup label="Password" name="password" required>
          <UInput v-model="credentials.password" type="password" placeholder="Password" autocomplete="current-password" />
        </UFormGroup>

        <UAlert v-if="error" color="error" variant="subtle" :title="(error as any)?.message || 'Login failed. Please check your credentials.'" />

        <div class="space-y-2">
          <UButton :loading="status === 'pending'" type="submit" block>
            Sign in
          </UButton>
          <UAlert color="neutral" variant="subtle" title="Demo credentials: admin / admin123" />
        </div>
      </UForm>
    </UCard>
  </UContainer>
</template>
