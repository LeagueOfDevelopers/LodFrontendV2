<template>
  <div class="categories">
    <category v-for="category in categories" :key="category.index"
      :category="category"></category>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import Category from "./Category.vue";

export default {
  components: {
    Category
  },
  computed: {
    ...mapGetters(["categories"])
  }
};
</script>

<style>
</style>
