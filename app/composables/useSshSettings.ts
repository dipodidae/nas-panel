// SSH settings composable
interface SshSettingsState {
  loading: boolean
  saving: boolean
  testing: boolean
  generating: boolean
  host: string
  username: string
  publicKey: string | null
  hasKey: boolean
  lastTest?: { success: boolean, message: string, latencyMs?: number }
  error: string | null
}

const sshState = reactive<SshSettingsState>({
  loading: false,
  saving: false,
  testing: false,
  generating: false,
  host: '',
  username: '',
  publicKey: null,
  hasKey: false,
  error: null,
})

export function useSshSettings() {
  async function load(force = false) {
    if (sshState.loading && !force)
      return
    sshState.loading = true
    try {
      const resp = await $fetch<{ ok: boolean, settings: SshSettingsPublic }>('/api/settings/ssh')
      if (resp.ok) {
        const s = resp.settings
        sshState.host = s.host || ''
        sshState.username = s.username || ''
        sshState.publicKey = s.publicKey
        sshState.hasKey = s.hasKey
        sshState.error = null
      }
      else {
        sshState.error = 'Failed to load settings'
      }
    }
    catch (e: any) {
      sshState.error = e?.message || 'Failed to load settings'
    }
    finally {
      sshState.loading = false
    }
  }

  async function save() {
    sshState.saving = true
    try {
      await $fetch('/api/settings/ssh', { method: 'POST', body: { host: sshState.host, username: sshState.username } })
    }
    catch (e: any) {
      sshState.error = e?.message || 'Save failed'
    }
    finally {
      sshState.saving = false
    }
  }

  async function generate(force = false) {
    sshState.generating = true
    try {
      const resp = await $fetch<SshGenerateResponse>(`/api/settings/ssh/key${force ? '?force=1' : ''}`, { method: 'POST' })
      if (resp.ok) {
        sshState.publicKey = resp.publicKey
        sshState.hasKey = true
      }
    }
    catch (e: any) {
      sshState.error = e?.message || 'Generate failed'
    }
    finally {
      sshState.generating = false
    }
  }

  async function test() {
    sshState.testing = true
    try {
      const resp = await $fetch<SshTestResponse>('/api/settings/ssh/test', { method: 'POST' })
      if (resp.ok) {
        sshState.lastTest = { success: resp.success, message: resp.message, latencyMs: resp.latencyMs }
      }
    }
    catch (e: any) {
      sshState.error = e?.message || 'Test failed'
    }
    finally {
      sshState.testing = false
    }
  }

  function downloadPublicKey() {
    if (!sshState.publicKey)
      return
    const blob = new Blob([`${sshState.publicKey}\n`], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'nas-panel.pub'
    a.click()
    URL.revokeObjectURL(url)
  }

  function copyPublicKey() {
    if (sshState.publicKey)
      navigator.clipboard.writeText(sshState.publicKey)
  }

  return { ...toRefs(sshState), load, save, generate, test, downloadPublicKey, copyPublicKey }
}
