<script setup>
import { RouterView } from 'vue-router'
import AppNavbar from './components/AppNavbar.vue'
</script>

<template>
  <main class="flex flex-col gap-5">
    <AppNavbar class="mt-5" />

    <RouterView />
  </main>
</template>
