<template>
  <div class="background flex flex-col items-center pt-6 font-sans">
    <SvgIcon
      name="pacman-logo"
      alt="pacman_logo"
      class="mb-6"
    />
    <PacmanBreadcrumbs
      class="breadcrumbs"
      :breadcrumbs="breadcrumbs"
    />
    <header
      class="header"
      @click="tabID = -1"
    >
      {{ header }}
    </header>
    <PacmanTabs
      :tabs="tabs"
      :tabID="tabID"
      @change-tab="(id) => (tabID = id)"
    />
    <SectionTab
      class="lg:w-3/5 md:w-3/4 md:rounded-[16px] sm:w-full sm:rounded-none"
      :tabID="tabID"
    />

    <footer class="my-4">
      <img
        src="@/assets/footer.png"
        alt="footer"
        class="lg:w-[170px] md:w-[120px] sm:w-[80px]"
      />
    </footer>
  </div>
</template>

<script setup>
import PacmanBreadcrumbs from '@/components/pacman/PacmanBreadcrumbs.vue'
import SectionTab from '@/components/pacman/SectionTab.vue'
import SvgIcon from '@/components/pacman/SvgIcon.vue'
import PacmanTabs from '@/components/pacman/PacmanTabs.vue'
import { computed, ref } from 'vue'

const header = ref('Pacman')

const breadcrumbs = computed(() => {
  const bc = []

  const bcHeader = { label: header.value, active: tabID.value === -1 }

  bc.push(bcHeader)

  if (currentTab.value) bc.push({ label: currentTab.value.label, active: true })

  return bc
})

const currentTab = computed(() =>
  tabs.value.find((tab) => tab.id === tabID.value)
)

const tabs = ref([
  {
    label: 'Shadow',
    id: 0
  },
  {
    label: 'Speedy',
    id: 1
  },
  {
    label: 'Bashful',
    id: 2
  },
  {
    label: 'Pockey',
    id: 3
  }
])

const tabID = ref(-1)
</script>

<style lang="scss" scoped>
.background {
  background-image: url('/src/assets/background.png');
  background-repeat: round;
  background-color: rgba(255, 255, 255, 0.9);
  background-blend-mode: screen;
}

.breadcrumbs {
  margin-bottom: 16px;
}

.header {
  cursor: pointer;
  color: #f4a900;
  font-weight: 500;
  font-size: 56px;
  line-height: 129%;
  letter-spacing: -0.01em;
  margin-bottom: 16px;

  &:hover {
    color: #ffcf48;
  }
}

@media screen and (max-width: 650px) {
  .header {
    font-weight: 400;
    font-size: 42px;
    margin-bottom: 8px;
  }

  .breadcrumbs {
    margin-bottom: 8px;
  }
}
</style>
