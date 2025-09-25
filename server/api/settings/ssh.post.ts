import { requireAuth } from '@@/server/utils/auth'
import { saveSshHostUser } from '@@/server/utils/sshSettings'
import { z } from 'zod'

const hostUserPattern = /^[\w.-]+$/
const bodySchema = z.object({
  host: z.string().min(1).max(255).regex(hostUserPattern),
  username: z.string().min(1).max(64).regex(hostUserPattern),
})

export default defineEventHandler(async (event) => {
  requireAuth(event)
  const body = await readBody(event)
  const parsed = bodySchema.safeParse(body)
  if (!parsed.success)
    throw createError({ statusCode: 400, statusMessage: 'Invalid body' })
  saveSshHostUser(parsed.data.host, parsed.data.username)
  return { ok: true }
})
