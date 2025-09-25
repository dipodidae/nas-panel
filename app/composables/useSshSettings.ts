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
    return token?.value ? { Authorization: `Bearer ${token.value}` } : {}
  }

  function setError(message: string) {
    sshState.error = message
  }

  function handleFailureToast(message: string, base: string, icon = 'i-lucide-x-circle') {
    toast.add({ title: message || base, color: 'error', icon })
  }

  function handleSuccessToast(title: string, icon: string, description?: string) {
    toast.add({ title, description, color: 'success', icon })
  }

  async function load(force = false) {
    if (sshState.loading && !force)
      return
    sshState.loading = true
    try {
      const resp = await $fetch<{ ok: boolean, settings: SshSettingsPublic }>('/api/settings/ssh', { headers: authHeaders() })
      if (!resp.ok)
        return setError('Failed to load settings')
      const s = resp.settings
      sshState.host = s.host || ''
      sshState.username = s.username || ''
      sshState.publicKey = s.publicKey
      sshState.hasKey = s.hasKey
      sshState.error = null
    }
    catch (e: any) {
      setError(e?.message || 'Failed to load settings')
    }
    finally {
      sshState.loading = false
    }
  }

  async function save() {
    sshState.saving = true
    try {
      await $fetch('/api/settings/ssh', { method: 'POST', body: { host: sshState.host, username: sshState.username }, headers: authHeaders() })
      handleSuccessToast('SSH settings saved', 'i-lucide-check-circle')
    }
    catch (e: any) {
      const msg = e?.message || 'Save failed'
      setError(msg)
      handleFailureToast(msg, 'Save failed')
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
        handleSuccessToast(resp.publicKey ? (force ? 'SSH key regenerated' : 'SSH key generated') : 'SSH key generated', 'i-lucide-key')
      }
    }
    catch (e: any) {
      const msg = e?.message || 'Generate failed'
      setError(msg)
      handleFailureToast(msg, 'Generate failed')
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
          handleSuccessToast('SSH connection OK', 'i-lucide-plug', resp.message || (resp.latencyMs ? `${resp.latencyMs} ms` : undefined))
        }
        else {
          toast.add({ title: 'SSH connection failed', description: resp.message, color: 'error', icon: 'i-lucide-plug-zap' })
        }
      }
    }
    catch (e: any) {
      const msg = e?.message || 'Test failed'
      setError(msg)
      handleFailureToast(msg, 'Test failed')
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
