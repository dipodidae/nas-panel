import { requireAuth } from '../../utils/auth'
import { COMMAND_WS_BASE_PATH } from '../../utils/commandConstants'
import { serializeInstance, startCommand } from '../../utils/commandRegistry'

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
    return {
      ok: true,
      command: serializeInstance(instance),
      wsPath,
    }
  }
  catch (err: any) {
    throw createError({ statusCode: 400, statusMessage: err.message || 'Failed to start command' })
  }
})
