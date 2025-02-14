import { FormRenderResolver } from '@gopowerteam/form-render'
import { TableRenderResolver } from '@gopowerteam/table-render'
import ReactivityTransform from '@vue-macros/reactivity-transform/vite'
import components from 'unplugin-vue-components/vite'
import { breakpoints } from './package.json'
import { runtimeConfig } from './runtime.config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-02-05',
  runtimeConfig,
  sourcemap: {
    server: true,
    client: true,
  },
  devtools: {
    enabled: true,
  },
  devServer: {
    port: 4000,
  },
  css: [
    '@unocss/reset/normalize.css',
    '@/styles/index.scss',
  ],
  ignore: [
    'pages/**/components/**/*',
  ],
  components: [{
    path: '~/components',
    pathPrefix: false,
  }],
  imports: {
    dirs: [
      'config',
      'components',
      'components/**',
      'components/**/*',
      'composables',
      'composables/**',
      'store',
      'server/utils/**',
    ],
    presets: [
      {
        from: '@gopowerteam/form-render',
        imports: ['defineForm', 'useForm'],
      },
      {
        from: '@gopowerteam/table-render',
        imports: ['defineColumns', 'defineTableLoad', 'useTable'],
      },
      {
        from: '@gopowerteam/modal-render',
        imports: ['useModal'],
      },
    ],
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
        },
      },
    },
    plugins: [
      ReactivityTransform(),
      components({
        resolvers: [
          TableRenderResolver(),
          FormRenderResolver(),
        ],
      }),
    ],
  },
  modules: [
    ['@unocss/nuxt', {}],
    ['@pinia/nuxt', {}],
    ['@pinia-plugin-persistedstate/nuxt', {}],
    ['nuxt-viewport', {}],
    ['dayjs-nuxt', {}],
    ['arco-design-nuxt-module', {}],
    [ '@vueuse/nuxt',{}]
  ],
  pinia: {
    storesDirs: ['./stores/**'],
  },
  piniaPersistedstate: {
    cookieOptions: {
      sameSite: 'strict',
    },
    storage: 'cookies',
  },
  viewport: {
    breakpoints,
    defaultBreakpoints: {
      desktop: 'desktop',
      mobile: 'mobile',
    },
    fallbackBreakpoint: 'desktop',
  },
  nitro: {
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
    storage: {
      memory: {
        driver: 'memory',
      },
      redis: {
        driver: 'redis',
        ...runtimeConfig.redis,
      },
    },
  },
})
