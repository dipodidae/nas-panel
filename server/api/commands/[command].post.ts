import type { StartCommandResponse } from '@@/types/api'
import { requireAuth } from '@@/server/utils/auth'
import { COMMAND_WS_BASE_PATH } from '@@/server/utils/commandConstants'
import { serializeInstance, startCommand } from '@@/server/utils/commandRegistry'

export default defineEventHandler(async (event) => {
  // Ensure authenticated (throws if invalid)
  requireAuth(event)

  const command = event.context.params?.command
  if (!command) {
    throw createError({ statusCode: 400, statusMessage: 'Missing command' })
  }

  try {
    const instance = startCommand(command)
    const wsPath = `${COMMAND_WS_BASE_PATH}/${instance.id}`
    const payload: StartCommandResponse = {
      ok: true,
      command: serializeInstance(instance),
      wsPath,
    }
    return payload
  }
  catch (err: any) {
    throw createError({ statusCode: 400, statusMessage: err.message || 'Failed to start command' })
  }
})
