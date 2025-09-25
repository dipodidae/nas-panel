// Uses global types (ParsedLine, CommandStreamState) from /types

// Single shared reactive state so multiple components can consume the same stream
const state = reactive<CommandStreamState>({
  lines: [],
  status: 'idle',
  error: null,
  exitCode: null,
  activeId: null,
  follow: true,
  cancelling: false,
})

let ws: WebSocket | null = null

const MAX_CLIENT_BUFFER = 1000 // UI-specific cap (<= server limit)

function resetState() {
  state.lines = []
  state.status = 'idle'
  state.error = null
  state.exitCode = null
  state.activeId = null
}

function parseRaw(raw: string): ParsedLine | null {
  try {
    const obj = JSON.parse(raw)
    // Two shapes supported:
    // 1. Raw line: { t, kind, data }
    // 2. Wrapped: { id, line: '{...}' }
    if (obj && obj.line) {
      const inner = JSON.parse(obj.line)
      return normalize(inner)
    }
    return normalize(obj)
  }
  catch {
    return null
  }
}

function normalize(o: any): ParsedLine | null {
  if (!o || typeof o !== 'object')
    return null
  if (!('t' in o) || !('kind' in o) || !('data' in o))
    return null
  return { ts: o.t as number, kind: o.kind as any, text: String(o.data) }
}

function openSocket(path: string, store: ReturnType<typeof useCommandStore>) {
  const url = (path.startsWith('ws://') || path.startsWith('wss://'))
    ? path
    : `${location.protocol === 'https:' ? 'wss:' : 'ws:'}//${location.host}${path}`
  ws = new WebSocket(url)
  state.status = 'connecting'
  ws.onopen = () => { state.status = 'streaming' }
  ws.onmessage = (ev) => {
    const line = parseRaw(ev.data)
    if (!line)
      return
    state.lines.push(line)
    if (state.lines.length > MAX_CLIENT_BUFFER)
      state.lines.splice(0, state.lines.length - MAX_CLIENT_BUFFER)
    if (line.kind === 'meta' && line.text.startsWith('EXIT')) {
      const parts = line.text.split(' ')
      const code = Number.parseInt(parts[1] || '', 10)
      if (!Number.isNaN(code))
        state.exitCode = code
      // record exit in store history
      store.markExited(state.exitCode)
    }
  }
  ws.onerror = () => {
    if (state.status !== 'error') {
      state.status = 'error'
      state.error = 'Stream error'
    }
  }
  ws.onclose = () => {
    if (state.status !== 'error')
      state.status = 'closed'
  }
}

function disconnect() {
  if (ws) {
    ws.onopen = ws.onmessage = ws.onerror = ws.onclose = null
    ws.close()
    ws = null
  }
  if (state.status === 'streaming')
    state.status = 'closed'
}

async function cancelActive() {
  if (!state.activeId || state.status !== 'streaming' || state.cancelling)
    return
  state.cancelling = true
  try {
    await $fetch(`/api/commands/${state.activeId}`, { method: 'DELETE' })
  }
  catch (e: any) {
    state.error = e?.message || 'Cancel failed'
  }
  finally {
    state.cancelling = false
  }
}

export function useCommandStream() {
  const store = useCommandStore()

  async function start(key: string) {
    try {
      state.status = 'connecting'
      const resp = await $fetch<{ ok: boolean, command: { id: string }, wsPath: string }>(`/api/commands/${key}`, { method: 'POST' })
      if (!resp.ok)
        throw new Error('Failed to start command')
      store.markStarted(resp.command.id)
      state.activeId = resp.command.id
      openSocket(resp.wsPath, store)
    }
    catch (e: any) {
      store.setError(e?.message || 'Failed to start')
      state.status = 'error'
      state.error = e?.message || 'Failed to start'
    }
  }

  // Watch for triggers
  watch(() => store.commandKey, (key) => {
    if (!key)
      return
    // New command requested
    disconnect()
    resetState()
    // store.trigger already set pending flag
    start(key)
  })

  onUnmounted(() => {
    // Only disconnect if this is the last consumer
    // (Simplify: always disconnect; future improvement could refcount.)
    disconnect()
  })

  function clear() {
    state.lines = []
  }

  function toggleFollow() {
    state.follow = !state.follow
  }

  return {
    ...toRefs(state),
    clear,
    disconnect,
    toggleFollow,
    cancelActive,
  }
}
