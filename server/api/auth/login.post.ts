import { encodeToken } from '@@/server/utils/auth'

export default defineEventHandler(async (event) => {
  const { username, password } = await readBody(event)
  const { authAdminUsername, authAdminPassword } = useRuntimeConfig()

  const isValid = username === authAdminUsername && password === authAdminPassword
  if (!isValid) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
  }

  const now = Date.now()
  const token = encodeToken({
    username: authAdminUsername,
    id: 1,
    iat: now,
    exp: now + (24 * 60 * 60 * 1000),
  })

  return {
    token,
    user: { id: 1, username: authAdminUsername, name: 'Administrator' },
  }
})
