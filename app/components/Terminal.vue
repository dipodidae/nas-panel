<script setup lang="ts">
/* eslint-disable antfu/if-newline */
// Terminal component handling command output via websocket. Refactored for clearer reactivity,
// explicit auth flow, bounded memory, and safer lifecycle.
import { useWebSocket } from '@vueuse/core'
import { CLIENT_MAX_TERMINAL_LINES } from '@/constants/client'
import { useCommandStore } from '@/stores/command'

interface Line { t: number, kind: 'stdout' | 'stderr' | 'meta', data: string }

const commandStore = useCommandStore()
const { status, getSession, token } = useAuth()

// Refs instead of a catch‑all reactive object (clearer typing + easier expose)
const lines = ref<Line[]>([])
const wsPath = ref<string | null>(null)
const lastError = ref<string | null>(null)
const scrollEl = ref<HTMLElement | null>(null)
const autoscroll = ref(true)
// Reconnect management (custom layer on top of vueuse autoReconnect)
const reconnectAttempts = ref(0)
const maxAdditionalReconnects = 10 // beyond vueuse's built-in 5
let manualClosed = false
let healthPollTimer: any = null
const healthChecking = ref(false)
const lastHealthOkAt = ref<number | null>(null)
const consecutiveAbnormalDisconnects = ref(0)
const maxAbnormalDisconnects = 12
// Abort state flag (helper defined after ws initialization to avoid temporal usage errors)
const aborted = ref(false)

const title = computed(() => {
  const key = commandStore.commandKey
  if (!key)
    return 'Command output'
  return {
    'docker-restart': 'Docker Restart Output',
    'host-reboot': 'Host Reboot Output',
  }[key] ?? `${key} output`
})

const wsUrl = computed(() => {
  if (!wsPath.value)
    return ''
  const proto = location.protocol === 'https:' ? 'wss' : 'ws'
  return `${proto}://${location.host}${wsPath.value}`
})

// Append helper enforcing max lines and optional autoscroll
function append(raw: Partial<Line> | null) {
  if (!raw)
    return
  const line: Line = {
    t: raw.t ?? Date.now(),
    kind: raw.kind ?? 'meta',
    data: String(raw.data ?? ''),
  }
  lines.value.push(line)
  if (lines.value.length > CLIENT_MAX_TERMINAL_LINES)
    lines.value.splice(0, lines.value.length - CLIENT_MAX_TERMINAL_LINES)
  if (autoscroll.value && scrollEl.value)
    scrollEl.value.scrollTop = scrollEl.value.scrollHeight
}

function handleRawMessage(raw: any) {
  try {
    const payload = JSON.parse(raw)
    if (payload.id && payload.line)
      append(JSON.parse(payload.line))
    else if (payload.kind)
      append(payload)
    else append({ kind: 'stdout', data: String(raw) })
  }
  catch {
    append({ kind: 'stdout', data: String(raw) })
  }
}

// Track if a new connection should be initiated when wsPath updates
const ws = useWebSocket(wsUrl, {
  autoReconnect: {
    retries: 5,
    delay: 1500,
    onFailed: () => append({ kind: 'meta', data: '[reconnect failed]' }),
  },
  immediate: false, // we open manually after wsPath is set and command id known
  heartbeat: { message: 'ping', interval: 30000, pongTimeout: 5000 },
  onConnected: () => {
    reconnectAttempts.value = 0
    append({ kind: 'meta', data: '[connected]' })
  },
  onDisconnected: (_, ev) => {
    if (aborted.value)
      return
    if (manualClosed)
      return
    append({ kind: 'meta', data: `[disconnected${ev?.code ? ` code=${ev.code}` : ''}]` })
    if (ev?.code === 1006) {
      consecutiveAbnormalDisconnects.value++
      if (consecutiveAbnormalDisconnects.value >= maxAbnormalDisconnects) {
        abort('[abort] too many abnormal disconnects – session likely lost (no further retries)')
        return
      }
    }
    else {
      consecutiveAbnormalDisconnects.value = 0
    }
    scheduleExtraReconnect()
  },
  onError: () => { if (!aborted.value) append({ kind: 'meta', data: '[ws error]' }) },
  onMessage(_, event) { handleRawMessage(event.data) },
})

function abort(reason: string) {
  if (aborted.value)
    return
  aborted.value = true
  manualClosed = true
  try {
    ws.close()
  }
  catch {
    /* ignore */
  }
  wsPath.value = null
  append({ kind: 'meta', data: reason })
}

const starting = computed(() =>
  commandStore.commandKey ? commandStore.isStarting(commandStore.commandKey) : false,
)

function disconnect() {
  try {
    manualClosed = true
    ws.close()
  }
  catch {
    /* ignore */
  }
}

async function ensureAuth() {
  if (status.value !== 'authenticated')
    await getSession()
  if (status.value !== 'authenticated')
    throw new Error('Not authenticated')
  if (!token.value) {
    await getSession()
    if (!token.value)
      throw new Error('Missing auth token')
  }
}

async function startCommand(key: string) {
  lastError.value = null
  manualClosed = false
  try {
    await ensureAuth()
  }
  catch (e: any) {
    const msg = e?.message || 'Auth failed'
    lastError.value = msg
    append({ kind: 'meta', data: `[error] ${msg}` })
    commandStore.setError(msg)
    return
  }

  if (!commandStore.isStarting(key))
    commandStore.pending[key] = true

  try {
    const headers: Record<string, string> = token.value ? { Authorization: `Bearer ${token.value}` } : {}
    const resp = await $fetch<{ ok: boolean, command: { id: string }, wsPath: string }>(`/api/commands/${key}`, { method: 'POST', headers })
    commandStore.markStarted(resp.command.id)
    wsPath.value = resp.wsPath
    if (wsPath.value && commandStore.activeCommandId) {
      append({ kind: 'meta', data: `[connecting] command ${commandStore.activeCommandId}` })
      ws.open()
    }
  }
  catch (err: any) {
    const msg = err?.data?.message || err.message || 'Failed to start command'
    commandStore.setError(msg)
    lastError.value = msg
    append({ kind: 'meta', data: `[error] ${msg}` })
  }
  finally {
    if (commandStore.commandKey)
      commandStore.clearPending(commandStore.commandKey)
  }
}

function clearLines() {
  lines.value = []
}

// Provide a local alias for template usage (script setup does not auto expose functions added only via defineExpose)
function clear() {
  clearLines()
}

// React to command key changes
watch(() => commandStore.commandKey, (key) => {
  if (!key)
    return
  clearLines()
  wsPath.value = null
  disconnect()
  startCommand(key)
})

// Allow user to disable autoscroll when manually scrolling up
function handleScroll() {
  if (!scrollEl.value)
    return
  const nearBottom = (scrollEl.value.scrollHeight - scrollEl.value.scrollTop - scrollEl.value.clientHeight) < 4
  autoscroll.value = nearBottom
}

function scheduleExtraReconnect() {
  if (aborted.value)
    return
  // If vueuse autoReconnect exhausted, we add our own attempts with exponential backoff.
  if (!wsUrl.value || ws.status.value === 'OPEN' || manualClosed)
    return
  if (reconnectAttempts.value >= maxAdditionalReconnects)
    return
  // For docker-restart we expect backend disruption; poll health before backing off further
  if (commandStore.commandKey === 'docker-restart') {
    pollHealthAndRetry()
    return
  }
  reconnectAttempts.value++
  const delay = Math.min(30000, 2000 * (1.5 ** reconnectAttempts.value))
  append({ kind: 'meta', data: `[retry ${reconnectAttempts.value}/${maxAdditionalReconnects} in ${Math.round(delay / 1000)}s]` })
  setTimeout(() => {
    if (manualClosed)
      return
    if (ws.status.value === 'OPEN')
      return
    ws.open()
  }, delay)
}

async function pollHealth(): Promise<boolean> {
  try {
    const resp = await $fetch<{ ok: boolean, ts: number }>('/api/health', { method: 'GET' })
    if (resp?.ok) {
      lastHealthOkAt.value = Date.now()
      return true
    }
  }
  catch {
    // ignore errors
  }
  return false
}

function pollHealthAndRetry() {
  if (healthChecking.value)
    return
  healthChecking.value = true
  let attempts = 0
  const maxHealthChecks = 20
  const interval = 3000
  append({ kind: 'meta', data: '[waiting for backend to come back online]' })
  const run = async () => {
    attempts++
    const ok = await pollHealth()
    if (ok) {
      const exists = await ensureCommandStillExists()
      if (!exists) {
        abort('[session missing after restart – no further reconnects]')
        healthChecking.value = false
        return
      }
      append({ kind: 'meta', data: '[backend healthy, reconnecting]' })
      healthChecking.value = false
      reconnectAttempts.value = 0
      ws.open()
      return
    }
    if (attempts >= maxHealthChecks) {
      append({ kind: 'meta', data: '[backend still unreachable after health checks]' })
      healthChecking.value = false
      return
    }
    healthPollTimer = setTimeout(run, interval)
  }
  run()
}

async function ensureCommandStillExists(): Promise<boolean> {
  if (!commandStore.activeCommandId)
    return false
  try {
    const res = await $fetch<{ ok: boolean }>(`/api/commands/${commandStore.activeCommandId}`)
    return !!res?.ok
  }
  catch {
    return false
  }
}

function manualRetry() {
  if (aborted.value) {
    append({ kind: 'meta', data: '[retry ignored] session aborted – re-run the command to start a new session' })
    return
  }
  if (!wsUrl.value) {
    append({ kind: 'meta', data: '[retry] no websocket path yet' })
    return
  }
  manualClosed = false
  reconnectAttempts.value = 0
  append({ kind: 'meta', data: '[manual retry]' })
  ws.open()
}

onMounted(() => {
  if (scrollEl.value)
    scrollEl.value.addEventListener('scroll', handleScroll, { passive: true })
})
onBeforeUnmount(() => {
  disconnect()
  if (scrollEl.value)
    scrollEl.value.removeEventListener('scroll', handleScroll)
  if (healthPollTimer)
    clearTimeout(healthPollTimer)
})

defineExpose({
  lines,
  starting,
  lastError,
  disconnect,
  status: ws.status,
  autoscroll,
  clear: clearLines,
  manualRetry,
  healthChecking,
  lastHealthOkAt,
  consecutiveAbnormalDisconnects,
  aborted,
})
</script>

<template>
  <div class="border-default bg-background/60 supports-[backdrop-filter]:bg-background/40 dark:bg-background/40 flex flex-col overflow-hidden rounded-md border backdrop-blur">
    <div v-if="title" class="bg-muted/60 dark:bg-muted/40 border-default flex items-center gap-2 border-b px-3 py-1 text-xs font-medium">
      <span>{{ title }}</span>
      <div class="ml-auto flex items-center gap-2">
        <slot name="controls">
          <UButton :icon="autoscroll ? 'i-lucide-chevron-down' : 'i-lucide-pause'" size="xs" variant="ghost" :disabled="starting" :title="autoscroll ? 'Autoscroll on' : 'Autoscroll off'" @click="autoscroll = !autoscroll" />
          <UButton icon="i-lucide-rotate-ccw" size="xs" variant="ghost" :disabled="starting" title="Manual reconnect" @click="manualRetry()" />
          <UButton icon="i-lucide-trash" size="xs" variant="ghost" :disabled="starting" @click="clear()" />
          <UButton icon="i-lucide-x" size="xs" variant="ghost" :disabled="starting" @click="disconnect" />
          <span v-if="reconnectAttempts" class="text-dimmed select-none">({{ reconnectAttempts }}/{{ 10 }})</span>
        </slot>
      </div>
    </div>
    <div ref="scrollEl" class="bg-inverted/80 dark:bg-inverted/70 text-inverted max-h-96 min-h-60 space-y-0.5 overflow-auto p-2 font-mono text-xs tracking-tight">
      <template v-for="(l, i) in lines" :key="`${l.t}:${i}`">
        <pre
          class="font-mono whitespace-pre-wrap" :class="{
            'text-default': l.kind === 'stdout',
            'text-error': l.kind === 'stderr',
            'text-dimmed': l.kind === 'meta',
          }"
        >{{ l.data }}</pre>
      </template>
    </div>
  </div>
</template>
