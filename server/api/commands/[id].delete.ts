import { requireAuth } from '@@/server/utils/auth'
import { cancelCommand, getCommand } from '@@/server/utils/commandRegistry'

export default defineEventHandler((event) => {
  requireAuth(event)
  const id = event.context.params?.id
  if (!id)
    throw createError({ statusCode: 400, statusMessage: 'Missing id' })
  const inst = getCommand(id)
  if (!inst)
    throw createError({ statusCode: 404, statusMessage: 'Not found' })
  const ok = cancelCommand(id)
  return { ok }
})
