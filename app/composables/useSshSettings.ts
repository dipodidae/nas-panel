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
  // Pull auth token (sidebase/nuxt-auth) so we can attach it explicitly.
  // In theory the module can inject this automatically, but we are currently
  // seeing 401 "Missing Authorization header" responses, so we add it here.
  const { token } = useAuth() as any
  const toast = useToast()

  function authHeaders(): Record<string, string> {
    if (token?.value)
      return { Authorization: `Bearer ${token.value}` }
    return {}
  }

  async function load(force = false) {
    if (sshState.loading && !force)
      return
    sshState.loading = true
    try {
      const resp = await $fetch<{ ok: boolean, settings: SshSettingsPublic }>('/api/settings/ssh', { headers: authHeaders() })
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
      await $fetch('/api/settings/ssh', { method: 'POST', body: { host: sshState.host, username: sshState.username }, headers: authHeaders() })
      toast.add({ title: 'SSH settings saved', color: 'success', icon: 'i-lucide-check-circle' })
    }
    catch (e: any) {
      sshState.error = e?.message || 'Save failed'
      toast.add({ title: sshState.error || 'Save failed', color: 'error', icon: 'i-lucide-x-circle' })
    }
    finally {
      sshState.saving = false
    }
  }

  async function generate(force = false) {
    sshState.generating = true
    try {
      const resp = await $fetch<SshGenerateResponse>(`/api/settings/ssh/key${force ? '?force=1' : ''}`, { method: 'POST', headers: authHeaders() })
      if (resp.ok) {
        sshState.publicKey = resp.publicKey
        sshState.hasKey = true
        toast.add({ title: resp.publicKey ? (force ? 'SSH key regenerated' : 'SSH key generated') : 'SSH key generated', color: 'success', icon: 'i-lucide-key' })
      }
    }
    catch (e: any) {
      sshState.error = e?.message || 'Generate failed'
      toast.add({ title: sshState.error || 'Generate failed', color: 'error', icon: 'i-lucide-x-circle' })
    }
    finally {
      sshState.generating = false
    }
  }

  async function test() {
    sshState.testing = true
    try {
      const resp = await $fetch<SshTestResponse>('/api/settings/ssh/test', { method: 'POST', headers: authHeaders() })
      if (resp.ok) {
        sshState.lastTest = { success: resp.success, message: resp.message, latencyMs: resp.latencyMs }
        if (resp.success) {
          toast.add({
            title: 'SSH connection OK',
            description: resp.message || (resp.latencyMs ? `${resp.latencyMs} ms` : ''),
            color: 'success',
            icon: 'i-lucide-plug',
          })
        }
        else {
          toast.add({
            title: 'SSH connection failed',
            description: resp.message,
            color: 'error',
            icon: 'i-lucide-plug-zap',
          })
        }
      }
    }
    catch (e: any) {
      sshState.error = e?.message || 'Test failed'
      toast.add({ title: sshState.error || 'Test failed', color: 'error', icon: 'i-lucide-x-circle' })
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
