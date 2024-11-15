<template>
  <nav aria-label="Breadcrumb">
    <ol class="breadcrumbs select-none">
      <li
        v-for="(bc, i) in breadcrumbs"
        :key="i"
        :aria-current="bc.active ? 'page' : null"
      >
        {{ bc.label }}
      </li>
    </ol>
  </nav>
</template>

<script setup>
defineProps(['breadcrumbs'])
</script>

<style lang="scss" scoped>
.breadcrumbs {
  cursor: pointer;
  list-style: none;
  display: flex;
  font-weight: 400;
  font-size: 16px;
  line-height: 123%;
  color: #575757;
}

li {
  &:not(:last-child)::after {
    content: '→';
    margin: 0 8px;
  }

  &:hover {
    color: #a3a3a3;
  }
}

@media screen and (max-width: 650px) {
  .breadcrumbs {
    font-weight: 300;
    font-size: 12px;
  }
}
</style>
