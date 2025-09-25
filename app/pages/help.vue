<script setup lang="ts">
definePageMeta({
  middleware: ['sidebase-auth'],
})

useHead({ title: 'Help' })

const { data: page, pending, error } = await useAsyncData('help', () =>
  queryCollection('content').path('/help').first())
</script>

<template>
  <UContainer>
    <UPage>
      <UPageHeader title="Help" description="Guide & reference for using the panel." />
      <UPageBody>
        <div v-if="pending" class="text-sm text-neutral-500">
          Loading…
        </div>
        <div v-else-if="error" class="text-sm text-red-500">
          Failed to load help content.
        </div>
        <div v-else-if="!page" class="text-sm text-neutral-500">
          No help content found.
        </div>
        <ContentRenderer v-else :value="page" />
      </UPageBody>
    </UPage>
  </UContainer>
</template>
