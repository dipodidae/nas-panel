<template>
  <div class="flex min-h-screen flex-col">
    <div class="flex justify-end px-4 pt-4">
      <UColorModeButton />
    </div>
    <div class="flex flex-1 items-center justify-center px-4 pb-8">
      <UPageCard
        variant="subtle"
        class="w-full max-w-sm"
      >
        <slot />
      </UPageCard>
    </div>
  </div>
</template>
