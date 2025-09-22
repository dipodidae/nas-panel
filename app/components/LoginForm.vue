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

async function login(payload: FormSubmitEvent<Schema>) {
  await signIn({
    username: payload.data.username.trim(),
    password: payload.data.password,
  }, { callbackUrl: '/' })
}
</script>

<template>
  <UAuthForm
    :fields="fields"
    :schema="schema"
    @submit="login"
  />
</template>
