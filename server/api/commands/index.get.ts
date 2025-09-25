import { listCommandMeta } from '#shared/commandCatalog'

export default defineEventHandler(() => {
  return { ok: true, commands: listCommandMeta() }
})
