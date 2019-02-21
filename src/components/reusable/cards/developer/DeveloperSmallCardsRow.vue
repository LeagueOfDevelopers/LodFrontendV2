<template>
  <section class="random-wrapper">
    <router-link v-for="developer in developers" :key="developer.id"
      :to="{name: 'portfolio', params: {id: developer.id}}" tag="div"
      class="developers-section__link-to-profile">
      <developer-small-card :developer="developer" />  
    </router-link>
  </section>
</template>

<script>
import DeveloperSmallCard from "./DeveloperSmallCard.vue";

export default {
  components: {
    DeveloperSmallCard
  },
  props: {
    developers: {
      type: Array,
      required: true,
      default: () => []
    }
  }
};
</script>
