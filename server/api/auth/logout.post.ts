export default defineEventHandler(async (_event) => {
  // For local provider, logout is handled client-side by removing the token
  // We can optionally perform server-side cleanup here if needed

  return {
    success: true,
    message: 'Logged out successfully',
  }
})
