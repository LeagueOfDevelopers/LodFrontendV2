<template>
  <section class="projects-section">
    <h1 class="projects-section__headline headline">Проекты</h1>
    <div class="dividing-line"></div>
    <category v-for="category in categories" :key="category.index"
      :category="category" @click="selectCategory(category.index)">
    </category>
    <div class="dividing-line"></div>
    <div>
      <project-small-cards-row :projects="projects"/>
    </div>
    <button class="projects-section__see-more-button button-style"
      @click="loadMoreProjects">
      Показать больше
    </button>
  </section>
</template>

<script>
import { mapGetters } from "vuex";
import Category from "../components/Category.vue";
import ProjectSmallCardsRow from "../components/cards/project/ProjectSmallCardsRow.vue";

export default {
  data() {
    return {
      items: 8
    };
  },
  components: {
    Category,
    ProjectSmallCardsRow
  },
  created() {
    this.$store.dispatch("LOAD_PROJECTS");
  },
  computed: {
    ...mapGetters(["projects", "rowsNumber", "categories"])
  },
  methods: {
    loadMoreProjects() {
      this.$store.dispatch("LOAD_PROJECTS");
    },
    selectCategory(index) {
      this.$store.dispatch("SELECT_CATEGORY", index);
    }
  }
};
</script>

<style>
</style>
