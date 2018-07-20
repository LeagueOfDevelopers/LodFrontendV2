<template>
  <section class="projects-section">
    <h1 class="projects-section__headline headline">Проекты</h1>
    <dividing-line/>
    <category-list/>
    <dividing-line/>
    <project-small-cards-row :projects="projects"/>
    <show-more-button/>
  </section>
</template>

<script>
import { mapGetters } from "vuex";
import store from "../store/index.js";

import CategoryList from "../components/reusable/categories/CategoryList.vue";
import DividingLine from "../components/reusable/DividingLine.vue";
import ProjectSmallCardsRow from "../components/reusable/cards/project/ProjectSmallCardsRow.vue";
import ShowMoreButton from "../components/reusable/buttons/ShowMoreButton.vue";

export default {
  components: {
    CategoryList,
    DividingLine,
    ProjectSmallCardsRow,
    ShowMoreButton
  },
  created() {
    store.dispatch("LOAD_PROJECTS");
  },
  computed: {
    ...mapGetters(["projects"])
  }
};
</script>

<style>
</style>
