<script setup lang="ts">
const form = defineForm<{
  age: number
  name: string
}>([{
  key: 'key1',
  title: 'key1',
  render: r => r.select({
    options: new Map([['a', 'a'], ['b', 'b']]),
  }),
}, {
  key: 'key2',
  title: 'key2',
}, {
  key: 'key3',
  title: 'key3',
}, {
  key: 'key4',
  title: 'key4',
}, {
  key: 'key5',
  title: 'key5',
}])

function onSubmit(data: any) {
  console.error(data)
}
</script>

<template>
  <div>
    <ACard title="普通表单">
      <FormRender :form="form" />
    </ACard>
    <ACard title="表单布局">
      <FormRender :form="form" layout="vertical" />
    </ACard>
    <ACard title="提交表单">
      <FormRender :form="form" submitable @submit="onSubmit" />
    </ACard>
    <ACard title="页脚提交表单">
      <FormRender
        footer
        :form="form"
        submitable
        @submit="onSubmit"
      />
    </ACard>
    <ACard title="搜索表单">
      <FormRender :form="form" searchable @submit="onSubmit" />
    </ACard>
    <ACard title="手动列数">
      <FormRender
        :columns="1"
        footer
        :form="form"
        searchable
        @submit="onSubmit"
      />
    </ACard>
    <ACard title="手动宽度">
      <FormRender
        footer
        :form="form"
        :min-width="400"
        searchable
        @submit="onSubmit"
      />
    </ACard>
    <ACard title="自定义鞍桥">
      <FormRender
        footer
        :form="form"
        :min-width="400"
        searchable
        @submit="onSubmit"
      >
        <template #actions>
          <AButton type="primary">
            自定义操作
          </AButton>
        </template>
      </FormRender>
    </ACard>
  </div>
</template>

<style scoped>

</style>
