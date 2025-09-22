<template>
  <UContainer>
    <UPage>
      <UPageHeader title="Nuxt 4 Boilerplate" description="A modern starter template with Nuxt UI, Pinia, and server-side APIs" />

      <UPageBody>
        <div class="space-y-8">
          <UCard>
            <template #header>
              <h2 class="text-xl font-semibold">
                Welcome to your Nuxt 4 Boilerplate
              </h2>
            </template>

            <p class="mb-6 text-gray-600 dark:text-gray-400">
              This boilerplate includes everything you need to build modern web applications with Nuxt 4,
              featuring beautiful UI components, state management, and server-side functionality.
            </p>

            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <UCard class="transition-shadow hover:shadow-lg">
                <div class="flex items-start gap-4">
                  <div class="bg-primary-100 dark:bg-primary-900 rounded-lg p-2">
                    <UIcon name="i-lucide-bar-chart-3" class="text-primary h-6 w-6" />
                  </div>
                  <div class="flex-1">
                    <h3 class="mb-2 font-semibold">
                      Counter Store Demo
                    </h3>
                    <p class="mb-3 text-sm text-gray-600 dark:text-gray-400">
                      Explore Pinia state management with a simple counter example.
                      Demonstrates reactive state updates and component composition.
                    </p>
                    <UButton
                      to="/counter"
                      variant="outline"
                      size="sm"
                      trailing-icon="i-lucide-arrow-right"
                    >
                      View Counter
                    </UButton>
                  </div>
                </div>
              </UCard>

              <UCard class="transition-shadow hover:shadow-lg">
                <div class="flex items-start gap-4">
                  <div class="bg-success-100 dark:bg-success-900 rounded-lg p-2">
                    <UIcon name="i-lucide-activity" class="text-success h-6 w-6" />
                  </div>
                  <div class="flex-1">
                    <h3 class="mb-2 font-semibold">
                      Server API Integration
                    </h3>
                    <p class="mb-3 text-sm text-gray-600 dark:text-gray-400">
                      See how server-side APIs work with real-time pageview tracking.
                      Demonstrates Nitro server functions and data fetching.
                    </p>
                    <UButton
                      to="/pageview"
                      variant="outline"
                      size="sm"
                      trailing-icon="i-lucide-arrow-right"
                    >
                      View API Demo
                    </UButton>
                  </div>
                </div>
              </UCard>
            </div>
          </UCard>

          <UCard>
            <template #header>
              <h2 class="text-xl font-semibold">
                Features Included
              </h2>
            </template>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div class="flex items-center gap-3">
                <UIcon name="i-lucide-zap" class="h-5 w-5 text-yellow-500" />
                <span class="text-sm">Nuxt 4 with Vite</span>
              </div>
              <div class="flex items-center gap-3">
                <UIcon name="i-lucide-palette" class="h-5 w-5 text-purple-500" />
                <span class="text-sm">Nuxt UI Components</span>
              </div>
              <div class="flex items-center gap-3">
                <UIcon name="i-lucide-database" class="h-5 w-5 text-blue-500" />
                <span class="text-sm">Pinia State Management</span>
              </div>
              <div class="flex items-center gap-3">
                <UIcon name="i-lucide-server" class="h-5 w-5 text-green-500" />
                <span class="text-sm">Nitro Server Functions</span>
              </div>
              <div class="flex items-center gap-3">
                <UIcon name="i-lucide-shield-check" class="h-5 w-5 text-red-500" />
                <span class="text-sm">TypeScript First</span>
              </div>
              <div class="flex items-center gap-3">
                <UIcon name="i-lucide-smartphone" class="h-5 w-5 text-indigo-500" />
                <span class="text-sm">PWA Ready</span>
              </div>
            </div>
          </UCard>
        </div>
      </UPageBody>
    </UPage>
  </UContainer>
</template>
