import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTree = defineStore('tree', () => {
  const url = ref(
    'https://www.klerk.ru/yindex.php/v3/event/rubrics?allowEmpty='
  )

  const loading = ref(false)

  const tree = ref([
    {
      label: 'Древо',
      count: 0,
      countNestedNodes: 0,
      key: '0'
    }
  ])

  const allNodes = ref([])
  const commonParents = ref({})

  const getTree = async (empty = false) => {
    loading.value = true

    allNodes.value = []
    commonParents.value = {}

    await fetch(`${url.value + (empty ? 1 : 0)}`)
      .then((r) => r.json())
      .then((r) => {
        tree.value[0].children = r
        parsedTree()
      })
      .catch((err) => alert(err))

    loading.value = false
  }

  const parsedTree = (mainNode = tree.value[0]) => {
    mainNode.children.forEach((node, index) => {
      node.label = node.title
      node.key = mainNode.key + '-' + index
      node.data = 'https://www.klerk.ru' + node.url
      node.type = 'url'

      findCopy(node)
      allNodes.value.push(node)

      if (node.children && node.children.length !== 0) {
        parsedTree(node)
      } else {
        delete node.children
      }
    })

    mainNode.countNestedNodes = sumCounters(mainNode)
  }

  const findCopy = (node) => {
    const foundCopy = findNode(node.id)

    if (foundCopy) {
      const commonParentKey = findCommonParent(foundCopy.key, node.key)

      commonParents.value[commonParentKey]
        ? commonParents.value[commonParentKey].push(node.key)
        : (commonParents.value[commonParentKey] = [foundCopy.key, node.key])
    }
  }

  const findCommonParent = (keyA, keyB) => {
    const arrayA = keyA.split('-')
    const arrayB = keyB.split('-')

    let commonParent = '0'

    for (let i = 1; i < arrayA.length; i++) {
      if (arrayA[i] !== arrayB[i]) break
      commonParent += '-' + arrayA[i]
    }

    return commonParent
  }

  const findNode = (id, key) =>
    allNodes.value.find((node) => (id ? node.id == id : node.key == key))

  const sumCounters = (node) => {
    let sumNestedNodes = node.children.reduce(
      (acc, nestedNode) =>
        acc + (nestedNode.countNestedNodes || nestedNode.count),
      node.count
    )

    const arrayKeysOfCommonParent = commonParents.value[node.key]

    if (arrayKeysOfCommonParent) {
      let id_quantity = {}

      arrayKeysOfCommonParent.forEach((keyCopy) => {
        const currentCopy = findNode(null, keyCopy)

        id_quantity[currentCopy.id]
          ? (id_quantity[currentCopy.id] += 1)
          : (id_quantity[currentCopy.id] = 1)
      })

      Object.keys(id_quantity).forEach((id) => {
        const quantityCopies = id_quantity[id]

        const currentCopy = findNode(id)

        sumNestedNodes -= (quantityCopies - 1) * currentCopy.count
      })
    }

    return sumNestedNodes
  }

  return { tree, loading, getTree }
})
