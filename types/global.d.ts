// Global augmentations & ambient declarations
// Keep this minimal; prefer module-scoped typings in /types/*.ts
export {}

// Provide ambient (global) aliases for commonly used domain types so that
// components / composables don't need to import from '@/types/...'.
// This relies on Nuxt auto including files under ~/types.
declare global {
  // Window augmentation (keep minimal)
  interface Window {
    __NAS_PANEL_VERSION__?: string
  }

  // Core command & process domain
  type CommandRuntimeStatus = import('./command').CommandRuntimeStatus
  type CommandMeta = import('./command').CommandMeta
  type WhitelistedCommandConfig = import('./command').WhitelistedCommandConfig
  type CommandDefinition = import('./command').CommandDefinition
  type SerializedCommandInstance = import('./command').SerializedCommandInstance
  type CommandHistoryEntry = import('./command').CommandHistoryEntry

  // Stream / view state
  type ParsedLine = import('./stream').ParsedLine
  type CommandStreamState = import('./stream').CommandStreamState

  // Store state
  type CommandState = import('./store').CommandState

  // API shapes
  type ListCommandsResponse = import('./api').ListCommandsResponse
  type StartCommandResponse = import('./api').StartCommandResponse
  type GenericOkResponse = import('./api').GenericOkResponse

  // SSH
  type SshSettingsInternal = import('./ssh').SshSettingsInternal
  type SshSettingsPublic = import('./ssh').SshSettingsPublic
  type SshGenerateResponse = import('./ssh').SshGenerateResponse
  type SshSaveSettingsBody = import('./ssh').SshSaveSettingsBody
  type SshTestResponse = import('./ssh').SshTestResponse
}
