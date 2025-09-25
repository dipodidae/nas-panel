interface CommandCatalogState {
  loaded: boolean
  commands: CommandMeta[]
  error: string | null
}

const state = reactive<CommandCatalogState>({
  loaded: false,
  commands: [],
  error: null,
})

export function useCommandCatalog() {
  async function load(force = false) {
    if (state.loaded && !force)
      return
    try {
      const resp = await $fetch<ListCommandsResponse>('/api/commands')
      if (!resp.ok)
        return setError('Failed to load commands')
      state.commands = resp.commands
      state.loaded = true
      state.error = null
    }
    catch (e: any) {
      setError(e?.message || 'Failed to load commands')
    }
  }

  function setError(msg: string) {
    state.error = msg
  }

  return { ...toRefs(state), load }
}
