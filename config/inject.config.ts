import { defineInjectKey } from '../composables/defines/define-inject-key'

export const InjectKeys = {
  workspace: {
    collapsed: defineInjectKey<Ref<boolean>>(),
  },
  aigc: {
    english: {
      addTaskListener: defineInjectKey<(
        task: string,
        callback: () => Promise<void>
      ) => void>(),
    },
  },
}
