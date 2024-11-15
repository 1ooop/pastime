<template>
  <nav>
    <ul
      class="flex md:gap-6 sm:gap-4 list-none select-none"
      role="tablist"
    >
      <li
        role="tab"
        :aria-selected="tabID === tab.id ? true : false"
        :tabindex="tabID === tab.id ? -1 : 0"
        class="tab"
        v-for="tab in tabs"
        :key="tab.id"
        @click="newTab(tab.id)"
        @keypress.enter="newTab(tab.id)"
        :class="{ underline: tabID === tab.id }"
      >
        {{ tab.label }}
      </li>
    </ul>
  </nav>
</template>

<script setup>
const emit = defineEmits(['changeTab'])
const props = defineProps(['tabID', 'tabs'])

const newTab = (id) => {
  if (props.tabID === id) return

  emit('changeTab', id)
}
</script>

<style lang="scss" scoped>
@mixin tab($padbot, $fontsize, $tuo) {
  padding-bottom: $padbot;
  font-size: $fontsize;
  text-underline-offset: $tuo;
}

.tab {
  cursor: pointer;
  @include tab(16px, 16px, 19px);
  font-weight: 500;
  line-height: 150%;
  color: #2a61cf;
  text-decoration-style: solid;
  text-decoration-color: #5a8cf1;
  text-decoration-thickness: 3px;

  &:hover {
    color: #92b3f5;
  }
}

@media (min-width: 650px) and (max-width: 1024px) {
  .tab {
    @include tab(8px, 12px, 9px);
  }
}

@media (max-width: 650px) {
  .tab {
    @include tab(8px, 10px, 9px);
  }
}
</style>
