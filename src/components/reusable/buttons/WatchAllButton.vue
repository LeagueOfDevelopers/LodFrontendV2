<template>
  <router-link :to=redirectToRoute tag="a" 
    class="projects-section__see-all-button button-style">
    {{ linkText }}
  </router-link>
</template>

<script>
export default {
  props: {
    redirectToRoute: {
      type: String,
      required: true
    },
    linkText: {
      type: String,
      default: "Смотреть все",
      required: true
    }
  }
};
</script>
