<script setup lang="tsx">
const modal = useModal()

function onOpenModal(size: 'small' | 'middle' | 'large', footer = false, draggable = false, mode: 'dialog' | 'drawer' = 'dialog') {
  modal.open(() => <div>Dialog</div>, { msg: 'test' }, {
    title: '弹窗组件',
    size,
    footer,
    draggable,
    mode,
  })
}
</script>

<template>
  <ASpace>
    <AButton @click="() => onOpenModal('small')">
      小号弹窗
    </AButton>
    <AButton @click="() => onOpenModal('middle')">
      中号弹窗
    </AButton>
    <AButton @click="() => onOpenModal('large')">
      大号弹窗
    </AButton>
    <AButton @click="() => onOpenModal('middle', true)">
      Footer弹窗
    </AButton>
    <AButton @click="() => onOpenModal('middle', true, true)">
      Draggable弹窗
    </AButton>
    <AButton @click="() => onOpenModal('middle', true, true, 'drawer')">
      抽屉模式
    </AButton>
  </ASpace>
</template>

<style scoped>

</style>
