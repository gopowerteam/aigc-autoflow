declare module '#app' {
  interface PageMeta {
    breadcrumb?: boolean
    menu?: PageMetaMenu
    requireAuth?: boolean
    requireRoles?: string[]
  }
}

export {}
