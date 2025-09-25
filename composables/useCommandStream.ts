// Using relative paths to avoid reliance on alias resolution in server dir
import { nextTick, onBeforeUnmount, ref } from 'vue'
import { CLIENT_MAX_TERMINAL_LINES } from '../app/constants/client'

export interface CommandLine {
  t: number
  kind: 'stdout' | 'stderr' | 'meta'
  data: string
}

interface StartCommandResult {
  ok: boolean
  command: { id: string }
  wsPath: string
}

export function useCommandStream() {
  const { status, getSession, token } = useAuth()
  const activeCommandId = ref<string | null>(null)
  const wsPath = ref<string | null>(null)
  const socket = ref<WebSocket | null>(null)
  const lines = ref<CommandLine[]>([])
  const starting = ref(false)
  const errorMessage = ref<string | null>(null)
  const autoscroll = ref(true)
  const scrollEl = ref<HTMLElement | null>(null)

  function append(raw: any) {
    if (!raw)
      return
    const line: CommandLine = {
      t: raw.t || Date.now(),
      kind: raw.kind || 'meta',
      data: String(raw.data ?? ''),
    }
    lines.value.push(line)
    if (lines.value.length > CLIENT_MAX_TERMINAL_LINES)
      lines.value.splice(0, lines.value.length - CLIENT_MAX_TERMINAL_LINES)
    if (autoscroll.value && scrollEl.value)
      scrollEl.value.scrollTop = scrollEl.value.scrollHeight
  }

  function disconnect() {
    if (socket.value) {
      socket.value.close()
      socket.value = null
    }
  }

  function connect(path: string, commandId: string) {
    disconnect()
    const proto = window.location.protocol === 'https:' ? 'wss' : 'ws'
    const ws = new WebSocket(`${proto}://${window.location.host}${path}`)
    socket.value = ws
    append({ kind: 'meta', data: `[connecting] command ${commandId}` })
    ws.onopen = () => append({ kind: 'meta', data: '[connected]' })
    ws.onclose = () => append({ kind: 'meta', data: '[disconnected]' })
    ws.onerror = () => append({ kind: 'meta', data: '[ws error]' })
    ws.onmessage = (evt) => {
      try {
        const payload = JSON.parse(evt.data)
        if (payload.id && payload.line) {
          const inner = JSON.parse(payload.line)
          append(inner)
        }
        else if (payload.kind) {
          append(payload)
        }
        else {
          append({ kind: 'stdout', data: String(evt.data) })
        }
      }
      catch {
        append({ kind: 'stdout', data: String(evt.data) })
      }
    }
  }

  async function startCommand(key: string) {
    errorMessage.value = null
    if ((status as any).value !== 'authenticated') {
      await getSession()
      if ((status as any).value !== 'authenticated') {
        errorMessage.value = 'Not authenticated'
        return
      }
    }
    if (!token.value) {
      await getSession()
      if (!token.value) {
        errorMessage.value = 'Missing auth token'
        return
      }
    }
    starting.value = true
    try {
      // Explicitly include Authorization header because auto injection appears unreliable for this request.
      const headers: Record<string, string> = {}
      if (token.value) {
        headers.Authorization = `Bearer ${token.value}`
      }
      const resp = await $fetch<StartCommandResult>(`/api/commands/${key}`, { method: 'POST', headers })
      activeCommandId.value = resp.command.id
      wsPath.value = resp.wsPath
      nextTick(() => {
        if (wsPath.value && activeCommandId.value)
          connect(wsPath.value, activeCommandId.value)
      })
    }
    catch (err: any) {
      errorMessage.value = err?.data?.message || err.message || 'Failed to start command'
    }
    finally {
      starting.value = false
    }
  }

  function clear() {
    lines.value = []
  }

  onBeforeUnmount(disconnect)

  return {
    // state
    lines,
    activeCommandId,
    wsPath,
    starting,
    errorMessage,
    autoscroll,
    scrollEl,
    // actions
    startCommand,
    clear,
    disconnect,
  }
}
