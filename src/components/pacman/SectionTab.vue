<template>
  <main
    class="flex flex-col bg-[#F5F5F8] shadow-2xl md:gap-6 px-4 md:py-10 sm:gap-4 sm:py-5"
  >
    <header
      class="col-span-2 lg:text-[24px] md:text-[18px] sm:text-[14px] font-medium leading-8 text-center -tracking-[.01em]"
    >
      {{ sectionHeader[tabID] }}
    </header>
    <PacmanInput
      class="mx-6"
      :subscribe="subscribeCards"
    />
    <PacmanToggle
      class="mx-6"
      label="Want to know everything"
      v-model="allKnow"
    />
    <section
      v-if="tabID === -1"
      :class="{
        'grid md:grid-cols-2 sm:grid-cols-1 md:gap-6 sm:gap-3': tabID === -1
      }"
    >
      <SectionCard
        v-for="(ghost, i) in ghosts"
        :key="i"
        :card="ghost"
        v-model="cardToggles[i]"
      />
    </section>
    <template v-else>
      <PacmanGhost
        :ghost="ghosts[tabID]"
        v-model="cardToggles[tabID]"
      />
    </template>
  </main>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import SectionCard from './SectionCard.vue'
import PacmanInput from './PacmanInput.vue'
import PacmanToggle from './PacmanToggle.vue'
import PacmanGhost from './PacmanGhost.vue'

defineProps(['tabID'])

const sectionHeader = ref({
  '-1': 'General characters',
  0: 'Blinky',
  1: 'Pinky',
  2: 'Inky',
  3: 'Clyde'
})

const ghosts = ref([
  {
    name: 'Shadow',
    nick: 'Blinky',
    description:
      'В режиме преследования использует как цель ту клетку, в которой находится Пакман',
    notes: [
      'Подробное описание алгоритма преследования',
      'Оригинальное японское имя'
    ],
    details: [
      'Оригинальное японское имя — Оикакэ (яп. 追いかけ, преследователь), прозвище — Акабэй (яп. 赤ベイ, красный)',
      'В режиме преследования использует как цель ту клетку, в которой находится Пакман',
      'В отличие от других привидений, увеличивает свою скорость преследования относительно первоначальной дважды за уровень в зависимости от количества съеденных точек',
      'Если точек осталось мало, то он меняет целевую клетку в режиме рассеивания на квадрат, в котором находится Пакман, и так гоняется за героем в двух режимах',
      'Подобное «агрессивное» поведение призрака игроки прозвали «круизом Элроя» (англ. Cruise Elroy)'
    ]
  },
  {
    name: 'Speedy',
    nick: 'Pinky',
    description:
      'В качестве цели при преследовании использует точку, находящуюся на четыре клетки впереди Пакмана',
    notes: [
      'Подробное описание алгоритма преследования',
      'Оригинальное японское имя'
    ],
    details: [
      'Оригинальное японское имя — Матибусэ (яп. 待ち伏せ, сидящий в засаде), прозвище — Пинки (яп. ピンキー)',
      'В качестве цели при преследовании использует точку, находящуюся на четыре клетки впереди Пакмана',
      'Однако из-за ошибки переполнения при движении Пакмана вверх Пинки использует в качестве цели квадрат, находящийся на четыре клетки вверх и на четыре влево от Пакмана'
    ]
  },
  {
    name: 'Bashful',
    nick: 'Inky',
    description: 'Использует самый сложный алгоритм преследования',
    notes: [
      'Подробное описание алгоритма преследования',
      'Оригинальное японское имя'
    ],
    details: [
      'Оригинальное японское имя — Кимагурэ (яп. 気まぐれ, непостоянный), прозвище — Аосукэ (яп. 青助, голубой)',
      'Использует самый сложный алгоритм преследования: для определения направления движения строится отрезок, один из концов которого определяется положением Блинки, а середина находится на 2 клетки перед Пакманом',
      'Второй конец отрезка — искомая целевая точка',
      'Получившуюся точку сложно предсказать, поэтому Инки считается самым опасным привидением',
      'Из-за ошибки переполнения, аналогичной в поведении Пинки, во время движения Пакмана вверх целевая клетка Инки это две клетки вверх и две влево от Пакмана'
    ]
  },
  {
    name: 'Pockey',
    nick: 'Clyde',
    description: 'Зависит от расстояния в 8 клеток',
    notes: [
      'Подробное описание алгоритма преследования',
      'Оригинальное японское имя'
    ],
    details: [
      'Оригинальное японское имя — Отобокэ (яп. お惚け, глупый), прозвище — Гудзута (яп. 愚図た, медленный)',
      'Если Клайд находится дальше 8 клеток от Пакмана, то он использует в качестве цели самого Пакмана, как Блинки',
      'Если же Пакман ближе 8 клеток, то Клайд стремится к левому нижнему углу, как при рассеивании'
    ]
  }
])

const allKnow = ref(false)

const cardToggles = ref([false, false, false, false])

watch(allKnow, (nv) => {
  if (nv) cardToggles.value.fill(true)
  else cardToggles.value.fill(false)
})

const subscribeCards = computed(() =>
  cardToggles.value.reduce((acc, sub, i) => {
    if (sub) acc.push(sectionHeader.value[i])
    if (acc.length === 4) allKnow.value = true
    return acc
  }, [])
)
</script>
