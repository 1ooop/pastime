<template>
  <label class="toggle">
    <input
      class="toggle-checkbox"
      type="checkbox"
      v-model="toggle"
    />
    <div class="toggle-switch"></div>
    <span class="toggle-label sm:text-[12px] md:text-[14px] lg:text-[16px]">{{
      label
    }}</span>
  </label>
</template>

<script setup>
const props = defineProps({
  label: {
    type: String,
    default: 'Toggle'
  }
})

const toggle = defineModel()
</script>

<style scoped>
.toggle {
  cursor: pointer;
  display: flex;
  align-items: center;
}

.toggle-switch {
  display: flex;
  flex-shrink: 0;
  background: #dcdcdc;
  border-radius: 16px;
  width: 32px;
  height: 18px;
  position: relative;
  vertical-align: middle;
  transition: background 0.25s;
}

.toggle-switch:before,
.toggle-switch:after {
  content: '';
}

.toggle-switch:before {
  display: block;
  background: #ffffff;
  border-radius: 50%;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.12);
  width: 14px;
  height: 14px;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: left 0.25s;
}

.toggle-checkbox:checked + .toggle-switch {
  background: #316fee;
}

.toggle-checkbox:checked + .toggle-switch:before {
  left: 15px;
}

.toggle-checkbox {
  position: absolute;
  visibility: hidden;
}

.toggle-label {
  margin-left: 5px;
  font-weight: 400;
  line-height: 143%;
  color: #000;
}
</style>
