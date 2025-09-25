export function useUserDisplayName() {
  const { data: session } = useAuth()
  const displayName = computed(() => {
    const s = session.value as any
    return s?.name || s?.username || 'User'
  })
  return { displayName }
}
