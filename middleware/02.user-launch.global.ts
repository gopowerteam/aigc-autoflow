import MenuConfig from '@/config/menu.config'
import { shake } from 'radash'

async function generateUserMenus() {
  const menuStore = useMenuStore()
  const router = useRouter()
  const routes = router.getRoutes()
  const menus: PageFlatMenu[] = []
  const roots: (PageFlatMenu & PageMenu)[] = []
  const sortByIndex = (a: PageMenu, b: PageMenu) => a.index! - b.index!

  // 转换页面路由为菜单
  const pages = routes.filter(route => route.meta.menu)
    .map((route) => {
      const menu = route.meta.menu as PageMetaMenu

      return {
        ...menu,
        key: menu.key || route.meta.name,
        title: menu.title || route.meta.title,
        index: menu.index || 0,
        url: route.path,
      } as PageMenu & PageMetaMenu
    })

  // 遍历菜单节点
  const traverseMenus = (menu: PageMenu, parent?: string) => {
    menus.push({
      ...structuredClone(menu),
      parent,
    })

    if (menu.children) {
      menu.children.forEach((item) => {
        traverseMenus(item, menu.key)
      })
    }
  }

  // 遍历页面节点
  const traversePages = (page: PageMenu & PageMetaMenu) => {
    page.path?.forEach((key) => {
      const parent = menus.find(menu => menu.key === key)

      if (parent && !roots.includes(parent)) {
        roots.push(parent)
      }
    })

    const [parent] = (page.path || [])?.reverse()

    roots.push({
      ...page,
      parent,
    })
  }

  // 生成菜单节点
  const traverseRoots = (menus: (PageMenu & PageFlatMenu)[]) => {
    return menus
      .map((menu) => {
        const children = roots.filter(x => x.parent === menu.key)

        if (children && children.length) {
          menu.children = traverseRoots(children)
        }

        return shake(menu) as PageMenu
      })
      .sort(sortByIndex)
  }

  MenuConfig.forEach(menu => traverseMenus(menu))
  pages.forEach(page => traversePages(page))

  const data = traverseRoots(roots.filter(item => !item.parent))

  menuStore.updateSiderMenus(data)
}

export default defineNuxtRouteMiddleware(async () => {
  const appStore = useAppStore()

  if (appStore.ready || import.meta.client) {
    return
  }

  // run app luncher only when not ready and run on server
  await Promise.all([
    generateUserMenus(),
  ])
})
