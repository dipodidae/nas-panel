import { defineStore } from 'pinia'

interface CommandState {
  // The command key most recently requested to start (drives Terminal)
  commandKey: string | null
  // The server-assigned id for the currently active command session
  activeCommandId: string | null
  // Last error message (start failures etc.)
  lastError: string | null
  // Per-command pending (starting) flags
  pending: Record<string, boolean>
}

export const useCommandStore = defineStore('command', {
  state: (): CommandState => ({
    commandKey: null,
    activeCommandId: null,
    lastError: null,
    pending: {},
  }),
  getters: {
    isStarting: state => (key: string | null | undefined): boolean => {
      if (!key)
        return false
      return !!state.pending[key]
    },
  },
  actions: {
    trigger(key: string) {
      this.commandKey = key
      this.lastError = null
      this.activeCommandId = null
      this.pending[key] = true
    },
    markStarted(id: string) {
      this.activeCommandId = id
      // Clear pending for the commandKey (if still set)
      if (this.commandKey) {
        delete this.pending[this.commandKey]
      }
    },
    setError(message: string) {
      this.lastError = message
      if (this.commandKey) {
        delete this.pending[this.commandKey]
      }
    },
    clearPending(key: string) {
      delete this.pending[key]
    },
    reset() {
      this.commandKey = null
      this.activeCommandId = null
      this.lastError = null
      this.pending = {}
    },
  },
})
