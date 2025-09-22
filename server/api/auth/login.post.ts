export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { username, password } = body
  const config = useRuntimeConfig()

  // Get credentials from environment variables
  const validUsername = config.authAdminUsername
  const validPassword = config.authAdminPassword

  // Simple hardcoded authentication using env vars
  if (username === validUsername && password === validPassword) {
    // Generate a simple JWT-like token (in production, use proper JWT)
    const tokenData = {
      username: validUsername,
      id: 1,
      iat: Date.now(),
      exp: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
    }
    const token = btoa(JSON.stringify(tokenData))

    return {
      token,
      user: {
        id: 1,
        username: validUsername,
        name: 'Administrator',
      },
    }
  }

  // Invalid credentials
  throw createError({
    statusCode: 401,
    statusMessage: 'Invalid credentials',
  })
})
