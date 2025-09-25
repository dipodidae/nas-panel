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
}

export function encodeToken(data: RawTokenData): string {
  return btoa(JSON.stringify(data))
}

export function decodeToken(token: string): RawTokenData {
  try {
    return JSON.parse(atob(token))
  }
  catch {
    throw createError({ statusCode: 401, statusMessage: 'Invalid token' })
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
