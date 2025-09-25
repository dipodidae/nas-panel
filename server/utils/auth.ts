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
    const parsed = JSON.parse(atob(token))
    return parsed
  }
  catch {
    throw createError({ statusCode: 401, statusMessage: 'Invalid token' })
  }
}

export function validateNotExpired(data: RawTokenData) {
  if (data.exp && data.exp < Date.now()) {
    throw createError({ statusCode: 401, statusMessage: 'Token expired' })
  }
}

export function requireAuth(event: any): SessionUser {
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader) {
    throw createError({ statusCode: 401, statusMessage: 'Missing Authorization header' })
  }
  // Accept one or more Bearer prefixes and extract the last segment as token.
  // This is tolerant to accidental double-prefixing by layered fetch interceptors.
  const parts = authHeader.split(/\s+/).filter(Boolean)
  const first = parts[0]
  if (parts.length < 2 || !first || !/^Bearer$/i.test(first)) {
    throw createError({ statusCode: 401, statusMessage: 'Malformed Authorization header' })
  }
  // If multiple tokens/prefixes, take the last non-"Bearer" element.
  const token = [...parts].reverse().find(p => !/^Bearer$/i.test(p))
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Missing bearer token value' })
  }
  const raw = decodeToken(token)
  validateNotExpired(raw)
  return { id: raw.id, username: raw.username, name: 'Administrator' }
}
