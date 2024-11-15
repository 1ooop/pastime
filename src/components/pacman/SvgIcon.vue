<script setup>
import { computed, defineAsyncComponent } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true
  }
})

const svgName = computed(() => props.name.toLowerCase())

const defineComponent = (name) =>
  defineAsyncComponent(() => import(`@/assets/svg/${name}.svg`))

const icon = computed(() => defineComponent(svgName.value))
</script>

<template>
  <component
    :is="icon"
    class="lg:w-20 lg:h-20 md:w-14 md:h-14 sm:w-10 sm:h-10"
  />
</template>
