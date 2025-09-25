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
    isStarting: state => (key: string | null | undefined): boolean => !!(key && state.pending[key]),
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
      if (this.commandKey)
        delete this.pending[this.commandKey]
    },
    markExited(exitCode: number | null) {
      if (this.activeCommandId && this.commandKey)
        this.pushHistory(this.activeCommandId, this.commandKey, exitCode)
      this.activeCommandId = null
      this.commandKey = null
    },
    setError(message: string) {
      this.lastError = message
      if (this.commandKey)
        delete this.pending[this.commandKey]
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
    pushHistory(id: string, key: string, exitCode: number | null) {
      this.history.unshift({ id, key, exitCode, at: Date.now() })
      if (this.history.length > 25)
        this.history.splice(25)
    },
  },
})
