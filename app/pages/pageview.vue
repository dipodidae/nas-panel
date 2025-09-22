<script setup lang="ts">
const { data, refresh } = await useFetch('/api/pageview')

async function handleRefresh() {
  await refresh()
}
</script>

<template>
  <UContainer>
    <UPage>
      <UPageHeader title="Server API" description="Example of server-side API integration with pageview tracking" />

      <UPageBody>
        <UCard>
          <template #header>
            <h3 class="flex items-center gap-2 text-lg font-semibold">
              <UIcon name="i-lucide-activity" />
              Pageview Statistics
            </h3>
          </template>

          <div class="space-y-4">
            <div v-if="data" class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <UCard class="bg-primary-50 dark:bg-primary-950">
                <div class="text-center">
                  <div class="text-primary text-2xl font-bold">
                    {{ data.pageview }}
                  </div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">
                    Total Pageviews
                  </div>
                </div>
              </UCard>

              <UCard class="bg-success-50 dark:bg-success-950">
                <div class="text-center">
                  <div class="text-success text-sm font-medium">
                    {{ new Date(data.startAt).toLocaleString() }}
                  </div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">
                    Server Started
                  </div>
                </div>
              </UCard>
            </div>

            <div class="flex justify-center">
              <UButton
                icon="i-lucide-refresh-cw"
                color="primary"
                variant="outline"
                loading-auto
                @click="handleRefresh"
              >
                Refresh Data
              </UButton>
            </div>
          </div>
        </UCard>
      </UPageBody>
    </UPage>
  </UContainer>
</template>
