import type { SshTestResponse } from '@@/types/ssh'
import { requireAuth } from '@@/server/utils/auth'
import { testRemoteConnection } from '@@/server/utils/sshExec'

export default defineEventHandler(async (event) => {
  requireAuth(event)
  const result = await testRemoteConnection()
  const res: SshTestResponse = { ok: true, success: result.success, message: result.message, latencyMs: result.latencyMs }
  return res
})
