<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useTree } from '@/store/tree'
import { storeToRefs } from 'pinia'
import Tree from 'primevue/tree'
import Checkbox from 'primevue/checkbox'
import Divider from 'primevue/divider'
import ProgressSpinner from 'primevue/progressspinner'

const storeTree = useTree()
const tree = computed(() => storeTree.tree)
const { loading } = storeToRefs(storeTree)
const { getTree } = storeTree

const allowEmpty = ref(false)

const selectedNodeKeys = ref({})
const countResult = ref(0)

onMounted(() => getTree())

const findNode = (key) => {
  let currentNode = tree.value[0]

  if (key === 0) return currentNode

  const nestedLevel = key.length - key.replaceAll('-', '').length

  let i = 1

  const currentLevelKey = (key) => key.split('-')[i]

  while (i <= nestedLevel) {
    currentNode = currentNode.children.find(
      (node) => currentLevelKey(key) === currentLevelKey(node.key)
    )
    i++
  }

  return currentNode
}

const verifiedSelectedNodes = (valueSelectedNodes) =>
  Object.entries(valueSelectedNodes).reduce((newArray, entry) => {
    if (entry[1].checked) newArray.push(entry[0])
    return newArray
  }, [])

const mathOperationNewKeys = (keys) => {
  const entireTree = keys[0] === '0'

  countResult.value = entireTree ? tree.value[0].countNestedNodes : 0

  if (keys.length === 0 || entireTree) return

  const selectedIDS = []

  keys.forEach((key) => {
    const node = findNode(key)
    if (!selectedIDS.includes(node.id)) {
      selectedIDS.push(node.id)

      countResult.value += node.count
    }
  })
}

watch(selectedNodeKeys, (newValue) => {
  const newKeys = verifiedSelectedNodes(newValue).sort()
  mathOperationNewKeys(newKeys)
})

watch(loading, () => {
  countResult.value = 0
  selectedNodeKeys.value = []
})
</script>

<template>
  <div class="flex flex-col gap-5 mx-10 mt-10">
    <span class="self-center text-xl">{{ countResult }}</span>

    <Divider />

    <div class="flex flex-wrap gap-5 ml-5">
      <div class="flex gap-2 mt-5">
        <Checkbox
          v-model="allowEmpty"
          size="large"
          name="allowEmpty"
          binary
          @update:modelValue="getTree(allowEmpty)"
        />
        <label for="allowEmpty">allowEmpty</label>
      </div>

      <Divider layout="vertical" />

      <Tree
        v-if="!loading"
        :value="tree"
        v-model:selectionKeys="selectedNodeKeys"
        selectionMode="checkbox"
      >
        <template #default="{ node }">
          <b>{{ node.label }}</b>
          <b class="ml-2">{{ `(${node.count}, ${node.countNestedNodes})` }}</b>
        </template>
        <template #url="{ node }">
          <a
            :href="node.data"
            @click.stop
            class="hover:text-purple-600"
            >{{ node.label }}</a
          >
          <span class="ml-2">{{
            node?.children
              ? `(${node.count}, ${node.countNestedNodes})`
              : `(${node.count})`
          }}</span>
        </template>
      </Tree>
      <ProgressSpinner v-else />
    </div>
  </div>
</template>
