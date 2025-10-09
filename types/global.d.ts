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

  // SSH
  type SshSettingsInternal = import('./ssh').SshSettingsInternal
  type SshSettingsPublic = import('./ssh').SshSettingsPublic
  type SshGenerateResponse = import('./ssh').SshGenerateResponse
  type SshSaveSettingsBody = import('./ssh').SshSaveSettingsBody
  type SshTestResponse = import('./ssh').SshTestResponse
}
