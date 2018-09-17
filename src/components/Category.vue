<template>
  <button class="categories__item" :class="{'categories__item--activated': category.status}">
    {{ category.name }}
  </button>
</template>

<script>
export default {
  props: {
    category: {
      type: Object,
      default: () => {},
      required: true
    }
  }
};
</script>

<style>
</style>
