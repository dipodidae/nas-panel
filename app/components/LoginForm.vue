<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import * as z from 'zod'

const { signIn } = useAuth()

const fields = [
  {
    name: 'username',
    type: 'text' as const,
    label: 'username',
    placeholder: 'Enter your username',
    required: true,
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password' as const,
    placeholder: 'Enter your password',
  },
]

const schema = z.object({
  username: z.string().min(5, 'Must be at least 5 characters'),
  password: z.string().min(8, 'Must be at least 8 characters'),
})

type Schema = z.output<typeof schema>

// Latest credentials captured just before execute; doesn't need to be reactive
let pendingCredentials: { username: string, password: string } | null = null

function extractErrorMessage(err: any): string {
  if (!err)
    return 'Unknown error'
  // nuxt-auth / next-auth style error object sometimes is string
  if (typeof err === 'string')
    return err
  if (err?.error && typeof err.error === 'string')
    return err.error
  if (err?.data?.statusMessage)
    return err.data.statusMessage
  if (err?.data?.message)
    return err.data.message
  if (err?.statusMessage)
    return err.statusMessage
  if (typeof err.message === 'string')
    return err.message
  return 'Authentication failed'
}

// useAsyncData with manual execution: no request until user submits
const { error: loginFetchError, status, execute, clear } = await useAsyncData(
  'auth-login',
  async () => {
    if (!pendingCredentials)
      throw new Error('Missing credentials')

    return await signIn({
      username: pendingCredentials.username,
      password: pendingCredentials.password,
    }, { callbackUrl: '/', redirect: true })
  },
  { immediate: false },
)

async function login(payload: FormSubmitEvent<Schema>) {
  // Reset previous state
  clear()
  pendingCredentials = {
    username: payload.data.username.trim(),
    password: payload.data.password,
  }
  await execute()
}
</script>

<template>
  <UAuthForm
    :fields="fields"
    :schema="schema"
    :loading="status === 'pending'"
    :disabled="status === 'pending'"
    @submit="login"
  >
    <template #validation>
      <UAlert
        v-if="loginFetchError"
        color="error"
        icon="i-lucide-info"
        :title="extractErrorMessage(loginFetchError)"
      />
    </template>
  </UAuthForm>
</template>
