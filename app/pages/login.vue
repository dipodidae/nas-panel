<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/',
  },
})
</script>

<template>
  <div>
    <div class="mb-4 text-center">
      <h2>Sign in to your account</h2>
    </div>
    <LoginForm />
  </div>
</template>
