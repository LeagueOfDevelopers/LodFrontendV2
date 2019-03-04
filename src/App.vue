<template>
  <div
    id="app"
  >
    <pp-header />
    <pp-content>
      <router-view />
    </pp-content>
    <pp-footer />
  </div>
</template>

<script>
import Header from "./containers/Header.vue";
import Footer from "./containers/Footer.vue";
import Content from "./containers/Content";

export default {
  components: {
    ppHeader: Header,
    ppFooter: Footer,
    ppContent: Content
  }
};
</script>

<style src="../public/style.css">
</style>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  min-height: ;
}
</style>
