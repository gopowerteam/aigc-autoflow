import { appLaunch } from './server/app-launch'
import { userLaunch } from './server/user-launch'

export default defineNuxtRouteMiddleware(async (to) => {
  const appStore = useAppStore()
  const userStore = useUserStore()

  const { requireAuth } = to.meta

  if (import.meta.client || appStore.ready) {
    return
  }

  await appLaunch()
  await userLaunch()

  if (requireAuth && !userStore.isLogin) {
    return navigateTo('/login', { replace: true })
  }
})
