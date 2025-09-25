import { requireAuth } from '@@/server/utils/auth'
import { getCommand } from '@@/server/utils/commandRegistry'

// WebSocket endpoint: /api/ws/command/:id
// Normalized: ALL messages are raw serialized line objects { t, kind, data }
export default defineWebSocketHandler({
  open(peer) {
    const rawUrl = (peer as any).url || ''
    const parts = rawUrl.split('/')
    const id = parts[parts.length - 1]
    if (!id) {
      peer.close(1008, 'Missing command id')
      return
    }
    try {
      requireAuth((peer as any).ctx?.event || ({} as any))
    }
    catch {
      peer.close(1008, 'Unauthorized')
      return
    }

    const instance = getCommand(id)
    if (!instance) {
      peer.close(1008, 'Unknown command id')
      return
    }

    for (const line of instance.buffer) {
      peer.send(line)
    }

    const onData = (line: string) => {
      peer.send(line)
    }
    instance.emitter.on('data', onData)
    ;(peer as any)._off = () => instance.emitter.off('data', onData)
  },
  close(peer) {
    if ((peer as any)._off)
      (peer as any)._off()
  },
  message() {
    // Read-only channel for now
  },
})
