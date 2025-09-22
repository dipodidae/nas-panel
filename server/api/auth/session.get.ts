export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')
  // const config = useRuntimeConfig() // Available for JWT secret validation in production

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      statusMessage: 'No valid token provided',
    })
  }

  const token = authHeader.slice(7) // Remove 'Bearer ' prefix

  try {
    // Decode the token (in production, use proper JWT validation with secret)
    const tokenData = JSON.parse(atob(token))

    // Check if token is expired
    if (tokenData.exp && tokenData.exp < Date.now()) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Token expired',
      })
    }

    // In production, you would validate the token signature using config.authSecret
    // For now, we're using simple base64 encoding

    // Return user session data
    return {
      id: tokenData.id,
      username: tokenData.username,
      name: 'Administrator',
    }
  }
  catch {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid token',
    })
  }
})
