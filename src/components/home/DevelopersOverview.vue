<template>
  <section class="developers-section">
    <developer-small-cards-row :developers="developers" />
    <router-link :to="{ name: 'developers' }" tag="a"
      class="projects-section__see-all-button button-style">
      Смотреть всех
    </router-link>
  </section>
</template>

<script>
import DeveloperSmallCardsRow from "../reusable/cards/developer/DeveloperSmallCardsRow.vue";

export default {
  components: {
    DeveloperSmallCardsRow
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
