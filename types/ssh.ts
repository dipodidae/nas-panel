// SSH settings related shared types
export interface SshSettingsInternal {
  host: string | null
  username: string | null
  encryptedPrivateKey: string | null
  publicKey: string | null
  createdAt: number | null
  updatedAt: number | null
}

export interface SshSettingsPublic {
  host: string | null
  username: string | null
  publicKey: string | null
  hasKey: boolean
}

export interface SshGenerateResponse {
  ok: boolean
  publicKey: string
  replaced: boolean
}

export interface SshSaveSettingsBody {
  host: string
  username: string
}

export interface SshTestResponse {
  ok: boolean
  success: boolean
  message: string
  latencyMs?: number
}
