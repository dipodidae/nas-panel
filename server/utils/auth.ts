import { Buffer } from 'node:buffer'
import { createHmac, timingSafeEqual } from 'node:crypto'
import { createError } from 'h3'

interface RawTokenData {
  username: string
  id: number
  iat: number
  exp: number
}

export interface SessionUser {
  id: number
  username: string
  name: string
  isDefault?: boolean
}

function b64Encode(str: string): string {
  if (typeof btoa === 'function')
    return btoa(str)
  return Buffer.from(str, 'utf-8').toString('base64')
}

function b64Decode(str: string): string {
  if (typeof atob === 'function')
    return atob(str)
  return Buffer.from(str, 'base64').toString('utf-8')
}

// Token format (signed): <base64(json)>.<hex(hmac)>
// Legacy (unsigned) tokens remain just <base64(json)> and are still accepted
// until all clients refresh. New logins always issue signed tokens if authSecret exists.
export function encodeToken(data: RawTokenData): string {
  const payload = { ...data, v: 1 }
  const b64 = b64Encode(JSON.stringify(payload))
  const secret = (globalThis as any).useRuntimeConfig?.().authSecret || ''
  if (!secret) {
    console.warn('[auth] authSecret not set – issuing UNSIGNED token (legacy mode)')
    return b64
  }
  const sig = createHmac('sha256', secret).update(b64).digest('hex')
  return `${b64}.${sig}`
}

export function decodeToken(token: string): RawTokenData {
  const secret = (globalThis as any).useRuntimeConfig?.().authSecret || ''
  const parts = token.split('.')
  if (parts.length === 1) {
    // Legacy unsigned token path
    const b64 = parts[0]
    if (!b64)
      throw createError({ statusCode: 401, statusMessage: 'Invalid token' })

    try {
      const json = b64Decode(b64)
      return JSON.parse(json)
    }
    catch {
      throw createError({ statusCode: 401, statusMessage: 'Invalid token' })
    }
  }
  if (parts.length !== 2)
    throw createError({ statusCode: 401, statusMessage: 'Malformed token' })
  const [b64, sig] = parts
  if (!b64 || !sig)
    throw createError({ statusCode: 401, statusMessage: 'Malformed token' })

  if (!secret)
    throw createError({ statusCode: 401, statusMessage: 'Server missing authSecret for signed token verification' })
  let expected: string
  try {
    expected = createHmac('sha256', secret).update(b64).digest('hex')
  }
  catch {
    throw createError({ statusCode: 401, statusMessage: 'Invalid token signature' })
  }
  // Timing safe compare
  const ok = timingSafeEqual(Buffer.from(sig, 'utf-8'), Buffer.from(expected, 'utf-8'))
  if (!ok)
    throw createError({ statusCode: 401, statusMessage: 'Bad token signature' })
  try {
    const json = b64Decode(b64)
    return JSON.parse(json)
  }
  catch {
    throw createError({ statusCode: 401, statusMessage: 'Invalid token payload' })
  }
}

export function validateNotExpired(data: RawTokenData) {
  if (data.exp && data.exp < Date.now())
    throw createError({ statusCode: 401, statusMessage: 'Token expired' })
}

// Internal helper: parse Authorization header and return bearer token value.
// Mirrors previous tolerant behavior (allows duplicate "Bearer" prefixes).
function extractBearerToken(authHeader: string): string {
  const parts = authHeader.split(/\s+/).filter(Boolean)
  const first = parts[0]
  if (parts.length < 2 || !first || !/^Bearer$/i.test(first))
    throw createError({ statusCode: 401, statusMessage: 'Malformed Authorization header' })
  const token = [...parts].reverse().find(p => !/^Bearer$/i.test(p))
  if (!token)
    throw createError({ statusCode: 401, statusMessage: 'Missing bearer token value' })
  return token
}

export function requireAuth(event: any): SessionUser {
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader)
    throw createError({ statusCode: 401, statusMessage: 'Missing Authorization header' })
  const token = extractBearerToken(authHeader)
  const raw = decodeToken(token)
  validateNotExpired(raw)
  return { id: raw.id, username: raw.username, name: 'Administrator' }
}
