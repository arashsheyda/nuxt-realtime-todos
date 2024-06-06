export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn } = useUserSession()

  if (!loggedIn.value && to.name !== 'index') {
    return navigateTo({ name: 'index' })
  }
})
