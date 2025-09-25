import { requireAuth } from '@@/server/utils/auth'
import { getSshPublicSettings } from '@@/server/utils/sshSettings'

export default defineEventHandler((event) => {
  requireAuth(event)
  return { ok: true, settings: getSshPublicSettings() }
})
