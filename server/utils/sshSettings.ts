import type { SshSettingsInternal, SshSettingsPublic } from '@@/types/ssh'
import { generateKeyPairSync } from 'node:crypto'
import { encryptPrivateKey } from './sshCrypto'

// Table DDL (executed lazily). We keep a single-row table keyed by id='singleton'.
async function ensureTable() {
  const db = useDatabase()
  await db.sql`CREATE TABLE IF NOT EXISTS ssh_settings (
    id TEXT PRIMARY KEY,
    host TEXT,
    username TEXT,
    encryptedPrivateKey TEXT,
    publicKey TEXT,
    algorithm TEXT,
    createdAt INTEGER,
    updatedAt INTEGER
  )`
}

async function loadRow(): Promise<SshSettingsInternal> {
  await ensureTable()
  const db = useDatabase()
  const result = await db.sql`SELECT * FROM ssh_settings WHERE id='singleton' LIMIT 1`
  const rows: any[] = (result as any)?.rows || []
  if (rows.length === 0) {
    return {
      host: null,
      username: null,
      encryptedPrivateKey: null,
      publicKey: null,
      algorithm: null,
      createdAt: null,
      updatedAt: null,
    }
  }
  const r: any = rows[0]
  return {
    host: r.host ?? null,
    username: r.username ?? null,
    encryptedPrivateKey: r.encryptedPrivateKey ?? null,
    publicKey: r.publicKey ?? null,
    algorithm: r.algorithm ?? null,
    createdAt: r.createdAt ?? null,
    updatedAt: r.updatedAt ?? null,
  }
}

async function saveRow(partial: Partial<SshSettingsInternal>) {
  await ensureTable()
  const existing = await loadRow()
  const now = Date.now()
  const merged: SshSettingsInternal = {
    host: partial.host !== undefined ? partial.host : existing.host,
    username: partial.username !== undefined ? partial.username : existing.username,
    encryptedPrivateKey: partial.encryptedPrivateKey !== undefined ? partial.encryptedPrivateKey : existing.encryptedPrivateKey,
    publicKey: partial.publicKey !== undefined ? partial.publicKey : existing.publicKey,
    algorithm: partial.algorithm !== undefined ? partial.algorithm : (existing as any).algorithm ?? null,
    createdAt: existing.createdAt || now,
    updatedAt: now,
  }
  const db = useDatabase()
  await db.sql`INSERT INTO ssh_settings (id, host, username, encryptedPrivateKey, publicKey, algorithm, createdAt, updatedAt)
    VALUES ('singleton', ${merged.host}, ${merged.username}, ${merged.encryptedPrivateKey}, ${merged.publicKey}, ${merged.algorithm}, ${merged.createdAt}, ${merged.updatedAt})
    ON CONFLICT(id) DO UPDATE SET host=excluded.host, username=excluded.username, encryptedPrivateKey=excluded.encryptedPrivateKey, publicKey=excluded.publicKey, algorithm=excluded.algorithm, createdAt=excluded.createdAt, updatedAt=excluded.updatedAt`
  return merged
}

export async function getSshPublicSettings(): Promise<SshSettingsPublic> {
  const row = await loadRow()
  return {
    host: row.host,
    username: row.username,
    publicKey: row.publicKey,
    hasKey: !!row.encryptedPrivateKey,
  }
}

export async function saveSshHostUser(host: string, username: string) {
  await saveRow({ host, username })
}

// Generate SSH keypair (RSA 2048) and persist.
export async function generateSshKeypair(force = false): Promise<{ publicKey: string, replaced: boolean }> {
  const current = await loadRow()
  const had = !!current.encryptedPrivateKey
  if (had && !force)
    throw new Error('Key already exists (use force)')
  const { publicKey, privateKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs1', format: 'pem' },
  })
  const body = publicKey
    .split('\n')
    .filter(l => l && !l.includes('BEGIN') && !l.includes('END'))
    .join('')
  const pubLine = `ssh-rsa ${body}`
  await saveRow({ publicKey: pubLine, encryptedPrivateKey: encryptPrivateKey(privateKey), algorithm: 'rsa' })
  return { publicKey: pubLine, replaced: had }
}

export async function getSshInternal(): Promise<SshSettingsInternal> {
  return loadRow()
}
