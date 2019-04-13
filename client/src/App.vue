<template>
  <div id="app">
    <navbar></navbar>
    <router-view />
  </div>
</template>

<script>
  import Navbar from './components/Navbar'
  export default {
    name: 'App',
    components: {
      'Navbar': Navbar
    }
  }
</script>
<style scoped>
  #app{
    background-image: linear-gradient(to right, #5570db, #2fbfe0);
    height: 100vh;
    overflow-x: hidden;
  }
</style>
