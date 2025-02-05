export default defineNuxtRouteMiddleware(async () => {
  const appStore = useAppStore()

  if (import.meta.server || appStore.ready) {
    return
  }

  appStore.setReady()
})
