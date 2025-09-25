import { requireAuth } from '@@/server/utils/auth'
import { getSshPublicSettings } from '@@/server/utils/sshSettings'

export default defineEventHandler(async (event) => {
  requireAuth(event)
  const settings = await getSshPublicSettings()
  return { ok: true, settings }
})
