<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/',
  },
})

useHead({ title: 'Login' })
</script>

<template>
  <LoginForm />
</template>
