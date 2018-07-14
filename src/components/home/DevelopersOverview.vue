<template>
  <section class="developers-section">
    <developer-small-cards-row :developers="developers" />
    <watch-all-button link-text="Смотреть всех" redirect-to-route="developer" />
  </section>
</template>

<script>
import DeveloperSmallCardsRow from "../reusable/cards/developer/DeveloperSmallCardsRow.vue";
import WatchAllButton from "../reusable/buttons/WatchAllButton.vue";

export default {
  components: {
    DeveloperSmallCardsRow,
    WatchAllButton
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
