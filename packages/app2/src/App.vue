<template>
  <div id="app2">
    App 2 is working
    <p class="app2">comment me on and off to see HMR</p>
    <router-view></router-view>
  </div>
</template>

<style>
#app2 {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.app2 {
  color:red;
}
</style>
