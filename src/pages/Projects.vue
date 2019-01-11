<template>
  <section class="projects-section">
    <h1 class="projects-section__headline headline">Проекты</h1>
    <div class="dividing-line"></div>

    <project-filter></project-filter>

    <div class="dividing-line"></div>
    <div>
      <project-small-cards-row :projects="projects"/>
    </div>
    <button class="projects-section__see-more-button button-style"
      @click="loadMoreProjects"
      v-if="projectsStateStatus === 'available'">
      Показать больше
    </button>
  </section>
</template>

<script>
import { mapGetters } from "vuex";
import Category from "../components/Category.vue";
import ProjectSmallCardsRow from "../components/cards/project/ProjectSmallCardsRow.vue";
import ProjectFilter from "../components/projects/ProjectFilter.vue";

export default {
  components: {
    Category,
    ProjectSmallCardsRow,
    ProjectFilter
  },
  created() {
    this.$store.dispatch("LOAD_PROJECTS");
  },
  computed: {
    ...mapGetters(["projects", "categories", "projectsStateStatus"])
  },
  methods: {
    loadMoreProjects() {
      this.$store.dispatch("LOAD_MORE_PROJECTS");
    }
  }
};
</script>
