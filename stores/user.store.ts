import { defineStore } from 'pinia'

export interface UserState {
  accessToken: string | null
  refreshToken: string | null
  expires: number | null
}

function createUserState(): UserState {
  return {
    accessToken: null,
    refreshToken: null,
    expires: null,
  }
}

export const useUserStore = defineStore('user', {
  state: createUserState,
  getters: {
    isLogin(state) {
      return state.accessToken && state.refreshToken
    },
  },
  actions: {
    updateToken(token: { accessToken: string, refreshToken: string, expires: number }) {
      this.accessToken = token.accessToken
      this.refreshToken = token.refreshToken
      this.expires = token.expires
    },
    logout() {
      this.accessToken = null
      this.refreshToken = null
      this.expires = null
    },
  },
  persist: {
    paths: ['accessToken', 'refreshToken', 'expires'],
  },
})
