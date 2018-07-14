<template>
  <section class="projects-section">
    <project-small-cards-row :projects="projects"/>
    <watch-all-button link-text="Смотреть все" redirect-to-route="projects" />
  </section>
</template>

<script>
import ProjectSmallCardsRow from "../reusable/cards/project/ProjectSmallCardsRow.vue";
import WatchAllButton from "../reusable/buttons/WatchAllButton.vue";

export default {
  components: {
    ProjectSmallCardsRow,
    WatchAllButton
  },
  props: {
    projects: {
      type: Array,
      required: true,
      default: () => []
    }
  }
};
</script>
