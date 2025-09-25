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
      if (resp.ok) {
        state.commands = resp.commands
        state.loaded = true
        state.error = null
        return
      }
      state.error = 'Failed to load commands'
    }
    catch (e: any) {
      state.error = e?.message || 'Failed to load commands'
    }
  }

  return { ...toRefs(state), load }
}
