export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('id', {
    mounted(el, binding) {
      if (!binding.value) {
        return
      }

      const tagName = binding.arg?.toString()
      if (!tagName || el.tagName.toUpperCase() === tagName?.toUpperCase()) {
        el.id = binding.value
      }
    },
  })
})
