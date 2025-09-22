<script setup lang="ts">
import { useCounterStore } from '~/stores/counter'

const counter = useCounterStore()
</script>

<template>
  <UContainer>
    <UPage>
      <UPageHeader title="Counter Store" description="Pinia store example with reactive state management" />

      <UPageBody>
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">
              Counter Value
            </h3>
          </template>

          <div class="space-y-4 text-center">
            <div class="text-primary text-4xl font-bold">
              {{ counter.count }}
            </div>

            <div class="flex justify-center gap-3">
              <UButton
                icon="i-lucide-minus"
                color="error"
                variant="outline"
                @click="counter.decrement"
              >
                Decrement
              </UButton>

              <UButton
                icon="i-lucide-plus"
                color="primary"
                variant="solid"
                @click="counter.increment"
              >
                Increment
              </UButton>
            </div>
          </div>
        </UCard>
      </UPageBody>
    </UPage>
  </UContainer>
</template>
