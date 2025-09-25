<script setup lang="ts">
// Connection form: host/username & action buttons
// Key generation logic extracted to SshGenerateKeyButton component

const ssh = useSshSettings()
const { host, username, saving, testing, hasKey } = ssh

const canTest = computed(() => !testing.value && hasKey.value && host.value && username.value)
const canSave = computed(() => !saving.value && host.value && username.value)
</script>

<template>
  <div>
    <div class="grid gap-4 sm:grid-cols-2">
      <UFormField label="Host" name="host">
        <UInput v-model="host" placeholder="example.com" class="w-full" size="xl" />
      </UFormField>
      <UFormField label="Username" name="username" required>
        <UInput v-model="username" placeholder="user" class="w-full" size="xl" />
      </UFormField>
    </div>
    <div class="mt-4 flex flex-wrap gap-2">
      <UButton :loading="saving" :disabled="!canSave" @click="ssh.save">
        Save
      </UButton>
      <UButton color="neutral" variant="soft" :loading="testing" :disabled="!canTest" @click="ssh.test">
        Test Connection
      </UButton>
      <SshGenerateKeyButton />
    </div>
  </div>
</template>
