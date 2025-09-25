import { defineStore } from 'pinia'

export const useCommandStore = defineStore('command', {
  state: (): CommandState => ({
    commandKey: null,
    activeCommandId: null,
    lastError: null,
    pending: {},
    history: [],
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
    markExited(exitCode: number | null) {
      if (this.activeCommandId && this.commandKey) {
        this.history.unshift({ id: this.activeCommandId, key: this.commandKey, exitCode, at: Date.now() })
        if (this.history.length > 25)
          this.history.splice(25)
      }
      this.activeCommandId = null
      this.commandKey = null
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
