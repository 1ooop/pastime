<template>
  <article class="details">
    <SvgIcon
      v-if="ghost.name"
      :name="ghost.name"
      class="float-right ml-2 w-[150px] h-[150px]"
    />
    <p
      class="md:mb-6 sm:mb-3"
      v-for="(detail, i) in ghost.details"
      :key="i"
    >
      {{ detail }}
    </p>

    <PacmanToggle
      v-model="toggle"
      :label="`Want to know more about ${ghost.name}`"
    />
  </article>
</template>

<script setup>
import SvgIcon from './SvgIcon.vue'
import PacmanToggle from './PacmanToggle.vue'

defineProps(['ghost'])

const toggle = defineModel()
</script>

<style lang="scss" scoped>
.details {
  font-weight: 400;
  font-size: 14px;
  line-height: 143%;
  color: #666;
  padding: 0 16px;
}

@media (min-width: 650px) and (max-width: 1024px) {
  .details {
    font-size: 12px;
  }
}

@media (max-width: 650px) {
  .details {
    font-size: 10px;
  }
}
</style>
