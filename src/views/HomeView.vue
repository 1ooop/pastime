<template>
  <div class="flex flex-col justify-center">
    <article class="mx-auto p-4 rounded-[24px]">
      <header class="text-center md:text-xl sm:text-lg">
        <h1>Небольшая демонстрация</h1>
      </header>
      <ol class="md:text-lg sm:text-sm">
        <li
          v-for="(article, index) in articles"
          :key="index"
          class="mt-4"
        >
          {{ article.title }}

          <template v-if="article.subtitles">
            <li
              v-for="(subtitle, i) in article.subtitles"
              :key="i"
              class="ml-8"
            >
              {{ subtitle }}

              <ol class="ml-4">
                <li
                  v-for="note in article.notes[i]"
                  class="mb-2"
                >
                  {{ note }}
                </li>
              </ol>
            </li>
          </template>
          <ol
            v-else
            class="ml-8"
          >
            <li
              v-for="note in article.notes"
              class="mb-2"
            >
              {{ note }}
            </li>
          </ol>
        </li>
      </ol>
    </article>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const articles = ref([
  {
    title: 'Tree data',
    subtitles: ['Vuetify', 'PrimeVue'],
    notes: [
      [
        '/Labs - неудобно реализовано',
        'тянет свои стили на уровне приложения',
        'сырое - не работает'
      ],
      ['приятное решение', 'Pinia']
    ]
  },
  {
    title: 'Pacman',
    notes: ['Адаптивный дизайн', 'Tailwind only']
  }
])
</script>

<style scoped>
div {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  height: 100vh;
  width: 100%;
  background-color: #4158d0;
  background-image: linear-gradient(
    43deg,
    #4158d0 0%,
    #c850c0 46%,
    #ffcc70 100%
  );
}

article {
  background: #c5b79a;
  color: #263c7e;
}
</style>
