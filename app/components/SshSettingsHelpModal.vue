<script setup lang="ts">
// Use the officially supported open binding
const open = defineModel<boolean>('open', { required: true })

// Load markdown snippet content
const { data: page, pending, error } = await useAsyncData('ssh-settings-help', () =>
  queryCollection('content').path('/snippets/ssh-settings-help').first())
</script>

<template>
  <UModal v-model:open="open" title="SSH Settings Help" :ui="{ content: 'max-w-3xl w-full', body: 'p-4 sm:p-6', footer: 'justify-end' }">
    <template #body>
      <div v-if="page && !pending && !error" class="prose dark:prose-invert max-w-none text-sm">
        <ContentRenderer :value="page" />
      </div>
      <div v-else class="text-sm text-neutral-500">
        <span v-if="pending">Loading…</span>
        <span v-else-if="error">Failed to load help content.</span>
        <span v-else>No help content found.</span>
      </div>
    </template>
    <template #footer="{ close }">
      <UButton size="xs" color="neutral" variant="ghost" @click="close">
        Close
      </UButton>
    </template>
  </UModal>
</template>
