<template>
  <form
    class="flex"
    @submit.prevent="handleSubmit"
  >
    <input
      type="email"
      placeholder="Enter email"
      v-model="email"
      aria-label="Email"
    />
    <button type="submit"></button>
  </form>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps(['subscribe'])

const email = ref('')
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

const handleSubmit = () => {
  if (emailPattern.test(email.value)) {
    alert('Успешно подписались на ' + props.subscribe)
    email.value = ''
  } else alert('Неверно указана почта')
}
</script>

<style lang="scss" scoped>
@mixin pad($padT, $padR, $padB, $padL) {
  padding: $padT $padR $padB $padL;
}

form {
  position: relative;
}

input {
  @include pad(16px, 102px, 16px, 16px);
  box-sizing: border-box;
  background: #fff;
  width: 100%;
  outline: none;
  border-radius: 16px 100px 100px 16px;
}

button {
  @include pad(16px, 32px, 16px, 32px);
  position: absolute;
  background: #5a8cf1;
  border: none;
  color: #fff;
  border-radius: 100px;
  right: 0;

  &::after {
    content: 'Send';
  }
}

@media (min-width: 650px) and (max-width: 1024px) {
  input {
    @include pad(12px, 86px, 12px, 12px);
  }

  button {
    @include pad(12px, 24px, 12px, 24px);
  }
}

@media (max-width: 650px) {
  input {
    @include pad(8px, 52px, 8px, 8px);
  }

  button {
    @include pad(8px, 16px, 8px, 16px);
    &::after {
      content: '→';
    }
  }
}
</style>
