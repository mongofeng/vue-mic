<template>
  <div class="home">
    <div class="text">
      teesss
    </div>
    <router-link to="/app2/about">App2's about page</router-link>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'home',
  components: {
    HelloWorld
  }
}
</script>
<style scoped>
.home {
  color: rebeccapurple;
}
.text {
  color: green;
}
</style>
