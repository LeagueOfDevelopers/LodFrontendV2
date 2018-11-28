<template>
	<button class="categories__item"
	        @click="$emit('category-selected')"
	        :class="{'categories__item--activated': category.status}">
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
.categories__item {
  display: none;
}
</style>
