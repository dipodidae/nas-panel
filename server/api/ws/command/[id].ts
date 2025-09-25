import { getCommand } from '../../../utils/commandRegistry'

// WebSocket endpoint: /api/ws/command/:id
export default defineWebSocketHandler({
  open(peer) {
  // Nitro's Peer object might not expose route params in type context; parse from URL
    const rawUrl = (peer as any).url || ''
    const parts = rawUrl.split('/')
    const id = parts[parts.length - 1]
    if (!id) {
      peer.close(1008, 'Missing command id')
      return
    }
    const instance = getCommand(id)
    if (!instance) {
      peer.close(1008, 'Unknown command id')
      return
    }

    // Send existing buffered lines first
    for (const line of instance.buffer) {
      peer.send(line)
    }

    // Listener for new data
    const onData = (line: string) => {
      // Namespacing: wrap output with command id
      peer.send(JSON.stringify({ id: instance.id, line }))
    }
    instance.emitter.on('data', onData)

    // Store unsubscribe on peer
    ;(peer as any)._off = () => instance.emitter.off('data', onData)
  },
  close(peer) {
    if ((peer as any)._off)
      (peer as any)._off()
  },
  message() {
    // Read-only channel for now; ignore messages.
  },
})
