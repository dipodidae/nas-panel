import type { SshSettingsInternal, SshSettingsPublic } from '@@/types/ssh'
import { Buffer } from 'node:buffer'
import { generateKeyPairSync } from 'node:crypto'
import { encryptPrivateKey } from './sshCrypto'

// In-memory store; replace with persistent storage as needed
// Using global ambient types; ensure file is treated as a module
export {}
const settings: SshSettingsInternal = {
  host: null,
  username: null,
  encryptedPrivateKey: null,
  publicKey: null,
  createdAt: null,
  updatedAt: null,
}

export function getSshPublicSettings(): SshSettingsPublic {
  return {
    host: settings.host,
    username: settings.username,
    publicKey: settings.publicKey,
    hasKey: !!settings.encryptedPrivateKey,
  }
}

export function saveSshHostUser(host: string, username: string) {
  settings.host = host
  settings.username = username
  settings.updatedAt = Date.now()
  if (!settings.createdAt)
    settings.createdAt = settings.updatedAt
}

export function generateSshKeypair(force = false): { publicKey: string, replaced: boolean } {
  const had = !!settings.encryptedPrivateKey
  if (had && !force)
    throw new Error('Key already exists (use force)')
  const { publicKey, privateKey } = generateKeyPairSync('ed25519', {
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  })
  // Convert public key to authorized_keys friendly format (ssh-ed25519 ...)
  const openssh = publicKey
    .split('\n')
    .filter(l => l && !l.includes('BEGIN') && !l.includes('END'))
    .join('')
  const pubLine = `ssh-ed25519 ${Buffer.from(openssh, 'base64').toString('base64')}`
  settings.publicKey = pubLine
  settings.encryptedPrivateKey = encryptPrivateKey(privateKey)
  settings.updatedAt = Date.now()
  if (!settings.createdAt)
    settings.createdAt = settings.updatedAt
  return { publicKey: pubLine, replaced: had }
}

export function getSshInternal(): SshSettingsInternal {
  return { ...settings }
}
