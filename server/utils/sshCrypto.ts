import { Buffer } from 'node:buffer'
import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto'
import process from 'node:process'

const ALGO = 'aes-256-gcm'
const IV_LEN = 12
const AUTH_TAG_LEN = 16

function getKey(): Buffer {
  const secret = process.env.SSH_PRIVATE_KEY_SECRET
  if (!secret || secret.length < 32)
    throw new Error('SSH_PRIVATE_KEY_SECRET missing or too short (min 32 chars)')
  // Derive 32 bytes (simple truncation/padding for now)
  return Buffer.from(secret.padEnd(32, '0')).subarray(0, 32)
}

export function encryptPrivateKey(plain: string): string {
  const key = getKey()
  const iv = randomBytes(IV_LEN)
  const cipher = createCipheriv(ALGO, key, iv, { authTagLength: AUTH_TAG_LEN })
  const enc = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return Buffer.concat([iv, tag, enc]).toString('base64')
}

export function decryptPrivateKey(encoded: string): string {
  const key = getKey()
  const raw = Buffer.from(encoded, 'base64')
  const iv = raw.subarray(0, IV_LEN)
  const tag = raw.subarray(IV_LEN, IV_LEN + AUTH_TAG_LEN)
  const data = raw.subarray(IV_LEN + AUTH_TAG_LEN)
  const decipher = createDecipheriv(ALGO, key, iv, { authTagLength: AUTH_TAG_LEN })
  decipher.setAuthTag(tag)
  const dec = Buffer.concat([decipher.update(data), decipher.final()])
  return dec.toString('utf8')
}
