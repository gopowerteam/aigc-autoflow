import { defineStore } from 'pinia'

interface Title {
  english: string
  chinese: string
}

export const useAigcStore = defineStore('aigc', {
  state: () => ({
    title: {
      english: '',
      chinese: '',
    } as Title,
  }),

  actions: {
    setTitle(title: Title) {
      this.title = title
    },
  },
})
