<template>
  <span class="categories__item" :class="{'categories__item--activated': category.status}"
    @click="selectCategory(category.index)">
    {{ category.name }}
  </span>
</template>

<script>
import store from "../../../store/index.js";

export default {
  props: {
    category: {
      type: Object,
      default: () => {},
      required: true
    }
  },
  methods: {
    selectCategory(index) {
      store.dispatch("SELECT_CATEGORY", index);
    }
  }
};
</script>

<style>
</style>
