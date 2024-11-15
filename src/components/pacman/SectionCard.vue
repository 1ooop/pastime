<template>
  <article class="bg-white flex flex-col rounded-[16px] p-6">
    <header class="mb-auto">
      <SvgIcon
        :name="card.name"
        class="float-right rounded-[8px] ml-2 w-[80px] h-[80px]"
      />
      <h5 class="podzag">{{ card.nick }}</h5>
      <h3 class="zag">{{ card.name }}</h3>

      <span class="opis">{{ card.description }}</span>
    </header>
    <p
      class="ssub mt-2"
      v-for="(note, i) in card.notes"
      :key="i"
    >
      {{ note }}
    </p>
    <SectionToggle
      class="mt-2"
      :label="`Want to know more about ${card.name}`"
      v-model="toggle"
    />
  </article>
</template>

<script setup>
import SectionToggle from './PacmanToggle.vue'
import SvgIcon from './SvgIcon.vue'

defineProps(['card'])
defineEmits(['changeToggle'])

const toggle = defineModel()
</script>

<style scoped>
.podzag {
  font-weight: 400;
  font-size: 13px;
  line-height: 123%;
  color: #999;
}
.zag {
  font-weight: 500;
  font-size: 20px;
  line-height: 140%;
  color: #000;
}
.opis {
  font-weight: 400;
  font-size: 14px;
  line-height: 143%;
  color: #666;
}
.ssub {
  font-weight: 400;
  font-size: 14px;
  line-height: 143%;
  color: #000;
}
</style>
