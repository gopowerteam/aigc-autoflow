interface MenuState {
  headerMenus: PageMenu[]
  siderMenus: PageMenu[]
}

function createMenuState(): MenuState {
  return {
    siderMenus: [],
    headerMenus: [],
  }
}

export const useMenuStore = defineStore('menu', {
  state: createMenuState,
  actions: {
    updateSiderMenus(menus: PageMenu[]) {
      this.siderMenus = menus
    },
    updateHeaderMenus(menus: PageMenu[]) {
      this.headerMenus = menus
    },
  },
})
