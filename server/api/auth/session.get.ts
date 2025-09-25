import { requireAuth } from '@@/server/utils/auth'

export default defineEventHandler((event) => {
  const user = requireAuth(event)
  return user
})
