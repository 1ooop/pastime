<script setup>
import { onMounted, ref } from 'vue'
import { VDivider, VSwitch, VSheet } from 'vuetify/lib/components/index.mjs'

const url = ref('https://www.klerk.ru/yindex.php/v3/event/rubrics?allowEmpty=')

const loading = ref(true)
const allowEmpty = ref(false)

const tree = ref({
  title: 'Древо',
  count: 0,
  id: -1,
  children: []
})

const selectedEndNodes = ref([])
const selectedParentNodes = ref([])
const countResult = ref(0)

const allNodes = ref([])
const allCopies = ref({})

const getTree = async () => {
  loading.value = true

  selectedEndNodes.value = []
  selectedParentNodes.value = []
  countResult.value = 0
  delete tree.value.children
  allNodes.value = []
  allCopies.value = []

  await fetch(`${url.value + (allowEmpty.value ? 1 : 0)}`)
    .then((r) => r.json())
    .then((r) => {
      tree.value.children = r
      parsedTree()
      avoidCopies()
      sumExceptCopies()
    })
    .catch((err) => alert(err))

  loading.value = false
}

onMounted(() => getTree())

const parsedTree = (mainNode = tree.value) => {
  mainNode.children?.forEach((node) => {
    node.children && node.children.length !== 0
      ? parsedTree(node)
      : delete node.children

    const findDuplicate = allNodes.value.find(
      (nodeFromAll) => nodeFromAll.id == node.id
    )

    if (findDuplicate) {
      allCopies.value[node.id]
        ? (allCopies.value[node.id] = allCopies.value[node.id].concat([node]))
        : (allCopies.value[node.id] = [findDuplicate, node])
    } else {
      allNodes.value.push(node)
    }
  })

  mainNode.countNestedNodes = sumCounters(mainNode)
}

const sumCounters = (node) =>
  node.children.reduce(
    (acc, nestedNode) =>
      acc + (nestedNode.countNestedNodes || nestedNode.count),
    node.count
  )

const avoidCopies = () => {
  Object.keys(allCopies.value).forEach((key) => {
    allCopies.value[key].forEach((duplicate, index) => {
      duplicate.subtitle = duplicate.id + ' Дубликат №' + (index + 1)
      duplicate.id = duplicate.id + Math.random()
      duplicate.disabled = false
      duplicate.isSelected = false
    })
  })
}

const sumExceptCopies = (node = tree.value) => {
  let resultReduce = 0

  resultReduce = node.children.reduce((acc, childNode) => {
    if (childNode.children) {
      sumExceptCopies(childNode)
      return acc + childNode.countExcept
    } else {
      if ('disabled' in node) return acc
      else return acc + childNode.count
    }
  }, node.count)

  node.countExcept = resultReduce
}

const avoidSelectedCopies = (original, lack) => {
  original.isSelected = lack

  const requiredCopies = allCopies.value[Math.trunc(original.id)]

  requiredCopies.forEach((copy) => {
    if (copy.isSelected && copy.id !== original.id && lack) {
      copy.isSelected = false
      copy.disabled = true
      countResult.value -= copy.count
    } else if (original.isSelected && copy.id !== original.id) {
      copy.isSelected = false
      copy.disabled = true
    } else {
      copy.disabled = false
    }
  })
}

const allParentNodes = (tree) => {
  let nodes = []

  const nestedParentNodes = (tree) => {
    if (tree.children) {
      nodes.push(tree.id)
      tree.children.forEach((child) => nestedParentNodes(child))
    }
  }

  nestedParentNodes(tree)

  return nodes
}

const missedNodes = (parentNode, lack) => {
  return parentNode.children.filter((node) => {
    if (lack)
      return (
        !selectedParentNodes.value.includes(node.id) &&
        !selectedEndNodes.value.includes(node.id)
      )
    else
      return (
        selectedParentNodes.value.includes(node.id) ||
        selectedEndNodes.value.includes(node.id)
      )
  })
}

const manageBelowNodes = ({ value: lack, path }) => {
  let sum = 0

  let involvedParentNodes = []

  const requiredNode = findNode(path)

  const checkSelectedNode = (node) => selectedEndNodes.value.includes(node.id)

  const checkCopies = (node) => {
    if ('isSelected' in node) avoidSelectedCopies(node, lack)
  }

  const checkNestedNodes = (requestedNode) => {
    if (requestedNode?.children) {
      involvedParentNodes.push(requestedNode.id)
      lack ? (sum += requestedNode.count) : (sum -= requestedNode.count)

      const missedNestedNodes = missedNodes(requestedNode, lack)

      missedNestedNodes.forEach((node) => {
        if (node.children) {
          checkNestedNodes(node)
        } else {
          lack ? (sum += node.count) : (sum -= node.count)
          checkCopies(node)
        }
      })
    } else if (!checkSelectedNode(requestedNode) && lack) {
      sum += requestedNode.count
      checkCopies(requestedNode)
    } else if (checkSelectedNode(requestedNode) && !lack) {
      sum -= requestedNode.count
      checkCopies(requestedNode)
    }
  }

  checkNestedNodes(requiredNode)

  if (lack) {
    selectedParentNodes.value.push(...involvedParentNodes)
  } else {
    selectedParentNodes.value = selectedParentNodes.value.filter(
      (parentId) => !involvedParentNodes.includes(parentId)
    )
  }

  return sum
}

const manageAboveNodes = ({ value: lack, path }) => {
  let sum = 0

  for (let i = 1; i < path.length; i++) {
    const parentNode = findNode(path.slice(0, -i))
    const nestedNode = findNode(i != 1 ? path.slice(0, 1 - i) : path)

    const lengthMissedNodesAbove = missedNodes(parentNode, true).length

    const checkNodeDepend =
      (lengthMissedNodesAbove === (lack ? 1 : 0) && !nestedNode.children) ||
      (lengthMissedNodesAbove === (lack ? 0 : 1) && !!nestedNode.children)

    if (lack && checkNodeDepend) {
      sum += parentNode.count

      selectedParentNodes.value.push(parentNode.id)
    } else if (!lack && checkNodeDepend) {
      sum -= parentNode.count

      selectedParentNodes.value = selectedParentNodes.value.filter(
        (parentId) => parentId != parentNode.id
      )
    } else {
      break
    }
  }

  return sum
}

const findNode = (path) => {
  let node = tree.value

  if (path.length === 1) return node

  let i = 1
  while (i < path.length) {
    node = node.children.find((nested) => nested.id == path[i])
    i++
  }

  return node
}

const updateSelectedNodes = (item) => {
  const requiredNode = findNode(item.path)

  if (item.path.length === 1 && item.value) {
    countResult.value = requiredNode.countNestedNodes
    selectedParentNodes.value = allParentNodes(requiredNode)
  } else if (item.path.length === 1 && !item.value) {
    countResult.value = 0
    selectedParentNodes.value = []
  } else {
    const manageResult = manageBelowNodes(item) + manageAboveNodes(item)

    countResult.value += manageResult
  }
}
</script>

<template>
  <v-sheet class="d-flex flex-column ga-5 mt-5">
    <span class="align-self-center">{{ countResult }}</span>

    <v-divider thickness="2"></v-divider>

    <v-sheet
      class="d-flex flex-wrap overflow-auto align-start justify-start ga-5 pa-10"
    >
      <v-switch
        label="allowEmpty"
        color="primary"
        v-model="allowEmpty"
        @update:modelValue="getTree"
        class="flex-shrink-0"
        :disabled="loading"
      ></v-switch>

      <v-divider
        thickness="2"
        vertical
      ></v-divider>

      <v-treeview
        v-if="!loading"
        :items="[tree]"
        v-model:selected="selectedEndNodes"
        @click:select="(e) => updateSelectedNodes(e)"
        item-value="id"
        item-props
        open-strategy="single"
        select-strategy="classic"
        selectable
        class="flex-1-0"
      >
        <template #title="{ title, item }">
          <a
            v-if="item?.url"
            :href="'https://www.klerk.ru' + item.url"
            @click.stop
            class="text-decoration-none"
          >
            {{ title }}
          </a>
          <span v-else>{{ title }}</span>
          <span class="ml-2">{{
            item?.children
              ? `(${item?.count}, ${item.countNestedNodes})`
              : `(${item?.count})`
          }}</span>
        </template>
      </v-treeview>
    </v-sheet>
  </v-sheet>
</template>
