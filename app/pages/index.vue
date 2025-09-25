<script setup lang="ts">
const commandStore = useCommandStore()
const { commands, load, error } = useCommandCatalog()
await load()
useHead({ title: 'Home' })
</script>

<template>
  <UContainer>
    <UPage>
      <UPageHeader title="Commands" description="Often used commands on the server" />
      <UPageBody>
        <div class="space-y-6">
          <div class="flex flex-wrap items-start gap-3">
            <template v-for="c in commands" :key="c.key">
              <CommandButton :command="c.key" :icon="c.icon" :label="c.label" :confirm="c.confirm" />
            </template>
          </div>
          <UAlert v-if="commandStore.lastError" color="error" variant="subtle" :title="commandStore.lastError" />
          <UAlert v-if="error" color="warning" variant="subtle" :title="error" />
          <CommandOutput />
          <CommandHistory />
        </div>
      </UPageBody>
    </UPage>
  </UContainer>
</template>
