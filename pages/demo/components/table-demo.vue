<script setup lang="ts">
const table1 = $(useTable('preview'))

const radioKey = ref()
const raduiRow = ref()
const checkboxKeys = ref([])
const checkboxRows = ref([])

interface EmployeeResponse {
  name: string
  jobNumber: string
}
const form1 = defineForm<EmployeeResponse>([{
  key: 'name',
  title: '姓名',
}])

const form2 = defineForm<EmployeeResponse>([{
  key: 'name',
  title: '姓名',
  render: r => r.input(),
}])

const columns1 = defineColumns<EmployeeResponse>([{
  key: 'name',
  title: '姓名',
}, {
  key: 'jobNumber',
  title: '工号',
}])

const columns2 = defineColumns<EmployeeResponse>([{
  key: 'name',
  title: '姓名',
  form: true,
}, {
  key: 'jobNumber',
  title: '工号',
  form: true,
}])

const columns3 = defineColumns<EmployeeResponse>([{
  key: 'name',
  title: '姓名',
  sortable: 'asc',
}, {
  key: 'jobNumber',
  title: '工号',
  sortable: 'desc',
}])

const columns4 = defineColumns<EmployeeResponse>([{
  key: 'name',
  title: '姓名',
  sortable: 'asc',
}, {
  key: 'jobNumber',
  title: '工号',
  sortable: 'desc',
}, {
  key: 'actions',
  title: '操作',
  render: r => r.button({
    content: '预览',
    onClick(record) {
      //  可以通过key或record进行预览
      // table1.preview({
      //   key: record.id,
      // })
      table1.preview({
        record,
      })
    },
  }),
}])

const columns5 = defineColumns([{
  key: 'name',
  title: '姓名',
  sortable: 'asc',
}, {
  key: 'jobNumber',
  title: '工号',
  sortable: 'desc',
}, {
  key: 'actions',
  title: '操作',
  render: r => r.button({
    content: '编辑',
    onClick(record) {
      //  可以通过key或record进行编辑
      // table1.preview({
      //   key: record.id,
      // })
      table1.edit<EmployeeResponse>({
        record,
        form: form2,
        onSubmit(data) {
          // 两种方式获取编辑结果
          console.error(data)
        },
      }).then((data) => {
        console.error(data)
      })
    },
  }),
}])

const onTableLoad = defineTableLoad(({ form: _form, page: _page, sort: _sort, update }) => {
  //
  update([
    {
      id: 1,
      name: '11',
      jobNumber: '222',
    },
    {
      id: 2,
      name: '11',
      jobNumber: '222',
    },
    {
      id: 3,
      name: '11',
      jobNumber: '222',
    },
  ])
},
)
</script>

<template>
  <ACard title="基础表格">
    <TableRender
      :columns="columns1"
      :data-load="onTableLoad"
      row-key="id"
    />
  </ACard>
  <ACard title="分页表格">
    <TableRender
      :columns="columns1"
      :data-load="onTableLoad"
      pageable
      row-key="id"
    />
  </ACard>
  <ACard title="排序表格">
    <TableRender
      :columns="columns3"
      :data-load="onTableLoad"
      :form="form1"
      :height="500"
      row-key="id"
    />
  </ACard>
  <ACard title="固定高度表格">
    <TableRender
      :columns="columns1"
      :data-load="onTableLoad"
      :height="500"
      row-key="id"
    />
  </ACard>
  <ACard title="简单表单1">
    <TableRender
      :columns="columns2"
      :data-load="onTableLoad"
      :height="500"
      row-key="id"
    />
  </ACard>
  <ACard title="简单表单2">
    <TableRender
      :columns="columns1"
      :data-load="onTableLoad"
      :form="form1"
      :height="500"
      row-key="id"
    />
  </ACard>
  <ACard title="表格操作">
    <TableRender
      :columns="columns1"
      :data-load="onTableLoad"
      :form="form1"
      :height="500"
      row-key="id"
    >
      <template #actions>
        <AButton type="primary">
          111
        </AButton>
        <AButton type="primary">
          222
        </AButton>
        <AButton type="primary">
          333
        </AButton>
      </template>
    </TableRender>
  </ACard>
  <ACard title="可导出，可刷新表格">
    <TableRender
      :columns="columns1"
      :data-load="onTableLoad"
      exportable
      :form="form1"
      :height="500"
      refreshable
      row-key="id"
    >
      <template #actions>
        <AButton type="primary">
          111
        </AButton>
        <AButton type="primary">
          222
        </AButton>
        <AButton type="primary">
          333
        </AButton>
      </template>
    </TableRender>
  </ACard>
  <ACard title="表格预览">
    <TableRender
      :columns="columns4"
      :data-load="onTableLoad"
      :form="form1"
      :height="500"
      row-key="id"
    />
  </ACard>
  <ACard title="表格编辑">
    <TableRender
      :columns="columns5"
      :data-load="onTableLoad"
      :form="form1"
      :height="500"
      row-key="id"
    />
  </ACard>
  <ACard title="表格单选">
    <TableRender
      v-model:radio-key="radioKey"
      v-model:radio-row="raduiRow"
      :columns="columns1"
      :data-load="onTableLoad"
      :form="form1"
      :height="500"
      row-key="id"
      selection="radio"
    />
  </ACard>
  <ACard title="表格多选">
    <TableRender
      v-model:checkbox-keys="checkboxKeys"
      v-model:checkbox-rows="checkboxRows"
      :columns="columns1"
      :data-load="onTableLoad"
      :form="form1"
      :height="500"
      row-key="id"
      selection="checkbox"
    />
  </ACard>
</template>

<style scoped>

</style>
