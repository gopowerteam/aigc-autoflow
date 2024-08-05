<script setup lang="tsx">
import IconDemo from './components/icon-demo.vue'
import ModalDemo from './components/modal-demo.vue'
import TableDemo from './components/table-demo.vue'
import FormDemo from './components/form-demo.vue'

definePageMeta({
  layout: 'workspace',
  title: 'DEMO',
  name: 'demo',
  requireAuth: false,
})
</script>

<template>
  <a-tabs default-active-key="image-editor" direction="horizontal">
    <a-tab-pane key="icon" title="图标">
      <IconDemo />
    </a-tab-pane>
    <a-tab-pane key="modal" title="弹窗">
      <ModalDemo />
    </a-tab-pane>
    <a-tab-pane key="table" title="表格">
      <TableDemo />
    </a-tab-pane>
    <a-tab-pane key="form" title="表单">
      <FormDemo />
    </a-tab-pane>
  </a-tabs>
</template>
