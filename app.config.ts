export default defineAppConfig({
  title: 'Aigc AutoFlow',
  workspace: {
    header: {
      height: 64,
    },
    sider: {
      width: 200,
      collapsedWidth: 65,
    },
    content: {
      padding: 20,
      header: {
        height: 40,
        size: 12,
      },
      footer: {
        height: 40,
        size: 12,
        text: 'Nuxt Admin ©2023 Created by zhuchentong',
      },
    },
    menu: {
      mode: 'vertical' as 'vertical'|'horizontal', 
    },
  },
})
