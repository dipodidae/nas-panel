import type { SshGenerateResponse } from '@@/types/ssh'
import { requireAuth } from '@@/server/utils/auth'
import { generateSshKeypair } from '@@/server/utils/sshSettings'

export default defineEventHandler((event) => {
  requireAuth(event)
  const force = getQuery(event).force === '1'
  try {
    const { publicKey, replaced } = generateSshKeypair(force)
    const res: SshGenerateResponse = { ok: true, publicKey, replaced }
    return res
  }
  catch (e: any) {
    throw createError({ statusCode: 400, statusMessage: e.message || 'Key generation failed' })
  }
})
