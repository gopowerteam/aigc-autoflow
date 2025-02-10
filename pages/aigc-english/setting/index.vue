<script setup lang="ts">
import { ATextarea } from '#components'
import { SystemSettingFieldsEnum, SystemSettingScopesEnum } from '~/drizzle/schemas'

definePageMeta({
  layout: 'workspace',
  title: '生成设置',
  requireAuth: true,
  name: 'aigc-english.setting',
  menu: {
    key: 'setting',
    path: ['aigc-english'],
    index: 5,
  },
})

const formModel = $ref<Partial<Record<SystemSettingFieldsEnum, string>>>({
  [SystemSettingFieldsEnum.AigcEnglishModel]: '',
  [SystemSettingFieldsEnum.AigcEnglishPrompt]: '',
})

function requestSetting() {
  $request('/api/system-setting', {
    method: 'GET',
    query: {
      scope: SystemSettingScopesEnum.AigcEnglish,
    },
  }).then((data) => {
    data.forEach((item) => {
      if (item.key in formModel) {
        formModel[item.key] = item.value
      }
    })
  })
}

function onUpdate() {
  Promise.all(Object.entries(formModel).map(([key, value]) => {
    return $request('/api/system-setting', {
      method: 'PUT',
      body: {
        scope: SystemSettingScopesEnum.AigcEnglish,
        key,
        value,
      },
    })
  })).then(() => {
    Message.success('更新完成')
  })
}

onMounted(() => {
  requestSetting()
})
</script>

<template>
  <PageContainer>
    <template #actions>
      <AButton size="mini" type="primary" @click="onUpdate">
        更新设置
      </AButton>
    </template>
    <div class="space-y-2">
      <ACollapse :default-active-key="['model', 'prompt']">
        <ACollapseItem key="model" header="模型名称">
          <AInput v-model="formModel.AigcEnglishModel" />
        </ACollapseItem>
        <ACollapseItem key="prompt" header="提示词">
          <ATextarea v-model="formModel.AigcEnglishPrompt" :auto-size="{ minRows: 5, maxRows: 10 }" />
        </ACollapseItem>
      </ACollapse>
    </div>
  </PageContainer>
</template>

<style scoped>

</style>
