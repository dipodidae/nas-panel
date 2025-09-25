<script setup lang="ts">
const { data: page, pending, error } = await useAsyncData('ssh-public-key-help', () =>
  queryCollection('content').path('/snippets/ssh-public-key-help').first())
</script>

<template>
  <UCollapsible class="flex flex-col gap-2">
    <UButton
      color="neutral"
      variant="subtle"
      size="xs"
      class="group w-fit"
      trailing-icon="i-lucide-chevron-down"
      :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
      label="Public Key Setup Instructions"
    />
    <template #content>
      <div v-if="error" class="text-xs text-red-500">
        Failed to load help content.
      </div>
      <div v-else-if="pending" class="text-xs text-neutral-500">
        Loading…
      </div>
      <ContentRenderer
        v-else-if="page"
        :value="page as any"
        class="prose prose-sm dark:prose-invert max-w-none"
      />
      <div v-else class="text-xs text-neutral-500">
        No help content found.
      </div>
    </template>
  </UCollapsible>
</template>
