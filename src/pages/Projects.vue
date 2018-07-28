<template>
  <section class="projects-section">
    <h1 class="projects-section__headline headline">Проекты</h1>
    <dividing-line/>
    <category-list/>
    <dividing-line/>
    <div>
      <project-small-cards-row v-for="row in rowsNumber" :key="row" 
        :projects="projects"/>
    </div>
    <show-more-button @click="loadMoreProjects"/>
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
  data() {
    return {
      items: 8
    };
  },
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
    ...mapGetters(["projects", "rowsNumber"])
  },
  methods: {
    loadMoreProjects() {
      store.dispatch("LOAD_PROJECTS");
    }
  }
};
</script>

<style>
</style>
