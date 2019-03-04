<template>
  <div id="app" class="block-flex-column full-height">
    <pp-header/>
    <pp-content>
      <router-view class="flex-grow-max"/>
    </pp-content>
    <pp-footer/>
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
  flex-wrap: wrap;
}

.full-height {
  min-height: 100vh;
}

.flex-grow-max {
  flex-grow: 2;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
