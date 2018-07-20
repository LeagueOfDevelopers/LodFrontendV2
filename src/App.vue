<template>
  <div id="app" class="block-flex-column full-height">
    <pp-header/>
    <router-view class="flex-grow-max"/>
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

<style scoped>
.full-height {
  min-height: 100vh;
}

.flex-grow-max {
  flex-grow: 2;
}
</style>
