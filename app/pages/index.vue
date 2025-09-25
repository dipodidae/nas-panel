<script setup lang="ts">
import { useCommandStore } from '@/stores/command'
import { useCommandCatalog } from '../../composables/useCommandCatalog'

const commandStore = useCommandStore()
const { commands, load, error } = useCommandCatalog()
await load()
</script>

<template>
  <UContainer>
    <UPage>
      <UPageHeader title="Commands" description="Often used commands on the server" />
      <UPageBody>
        <div class="space-y-6">
          <div class="flex flex-wrap gap-3 items-start">
            <template v-for="c in commands" :key="c.key">
              <CommandButton :command="c.key" :icon="c.icon" :label="c.label" :confirm="c.confirm" />
            </template>
          </div>
          <UAlert v-if="commandStore.lastError" color="error" variant="subtle" :title="commandStore.lastError" />
          <UAlert v-if="error" color="warning" variant="subtle" :title="error" />
          <div v-if="commandStore.activeCommandId" class="text-xs text-muted">ID: {{ commandStore.activeCommandId }}</div>
        </div>
      </UPageBody>
    </UPage>
  </UContainer>
</template>
