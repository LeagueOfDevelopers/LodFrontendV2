<template>
  <section>
    <div class="error-page">
      <h1 class="headline error-page__heading">404 Not found</h1>
      <dividing-line/>
      <div class="not-found-info">
        К сожалению, такой страницы не существует или у Вас нет прав для ее просмотра.
      </div>
    </div>
  </section>
</template>

<script>
import DividingLine from "../components/reusable/DividingLine.vue";

export default {
  components: {
    DividingLine
  }
};
</script>

<style scoped>
.not-found-info {
  margin: 15px 25px;
}
</style>
