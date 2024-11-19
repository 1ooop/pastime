<template>
  <Menubar
    :model="menuRoutes"
    breakpoint="0"
    class="position-sticky top-0 mx-auto"
  />
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import Menubar from 'primevue/menubar'

const router = useRouter()

const menuRoutes = ref([
  {
    label: 'Home',
    command: () => {
      router.push('/')
    }
  },
  {
    label: 'Tree',
    items: [
      // {
      //   label: 'Vuetify',
      //   command: () => {
      //     router.push('/vuetify')
      //   }
      // },
      {
        label: 'Primevue',
        command: () => {
          router.push('/primevue')
        }
      }
    ]
  },
  {
    label: 'Pacman',
    command: () => router.push('/pacman')
  }
])
</script>
