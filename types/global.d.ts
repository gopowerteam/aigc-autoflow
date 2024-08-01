declare global {
  interface PageMetaMenu {
    key?: string
    path?: string[]
    title?: string
    icon?: string
    index?: number
  }

  interface PageFlatMenu {
    key: string
    title: string
    icon?: string
    index?: number
    parent?: string
  }

  interface PageMenu {
    key: string
    title: string
    icon?: string
    index?: number
    children?: PageMenu[]
    url?: string
  }

}

export {}
