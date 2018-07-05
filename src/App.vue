<template>
  <div id="app">
    <pp-header/>
    <router-view/>
    <pp-footer/>
  </div>
</template>

<script>
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";

export default {
  components: {
    ppHeader: Header,
    ppFooter: Footer
  }
};
</script>

<style src="../public/style.css">
</style>
