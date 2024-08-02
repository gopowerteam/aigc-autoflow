<script setup lang="ts">
definePageMeta({
  layout: 'workspace',
  title: '批次管理',
  requireAuth: true,
  name: 'batch-list',
  menu: {
    path: ['aigc-generate'],
    index: 1,
  },
})

function toCreate() {
  navigateTo({
    path: '/aigc-generate/batch-create',
  })
}

const columns = [
  {
    title: '分类',
    dataIndex: 'category',
  },
  {
    title: '标题',
    dataIndex: 'title',
  },
]
const data = reactive([{
  key: '1',
  category: '最新资讯',
  title: [
    '特朗普的耳朵真的受伤真假？',
  ],
}, {
  key: '2',
  category: '陈年往事',
  title: [
    '1949年新中国成立的他们在干什么？',
    '2008年奥运会他们都去干这件事！',
  ],
}])

const expandable = reactive({
  title: 'Expand',
  width: 80,
  expandedRowRender: (record: any) => {
    return record.title.join('<br>')
  },
})
</script>

<template>
  <section>
    <div class="mb-4 text-right">
      <a-button type="primary" class="mb-4" @click="toCreate">
        新建批次
      </a-button>
      <a-table :columns="columns" :data="data" :expandable="expandable" />
    </div>
  </section>
</template>
