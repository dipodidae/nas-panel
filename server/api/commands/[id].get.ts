import { getCommand, serializeInstance } from '../../utils/commandRegistry'

export default defineEventHandler((event) => {
  const id = event.context.params?.id
  if (!id)
    throw createError({ statusCode: 400, statusMessage: 'Missing id' })
  const inst = getCommand(id)
  if (!inst)
    throw createError({ statusCode: 404, statusMessage: 'Not found' })
  return { ok: true, command: serializeInstance(inst) }
})
