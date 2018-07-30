<template>
  <section>
    <pp-welcome/>
    <h1 class="projects-section__headline headline">Наши проекты</h1>
    <pp-projects-overview :projects="randomProjects"/>
    <pp-dividing-line/>
    <h1 class="developers-section__headline headline">Наши разработчики</h1>
    <pp-developers-overview :developers="randomDevelopers"/>
  </section>
</template>

<script>
import { mapGetters } from "vuex";
import store from "../store/index.js";

import Welcome from "../components/home/Welcome.vue";
import ProjectsOverview from "../components/home/ProjectsOverview.vue";
import DevelopersOverview from "../components/home/DevelopersOverview.vue";
import DividingLine from "../components/reusable/DividingLine.vue";

export default {
  components: {
    ppWelcome: Welcome,
    ppProjectsOverview: ProjectsOverview,
    ppDividingLine: DividingLine,
    ppDevelopersOverview: DevelopersOverview
  },
  created() {
    store.dispatch("LOAD_RANDOM_DEVELOPERS");
    store.dispatch("LOAD_RANDOM_PROJECTS");
  },
  computed: {
    ...mapGetters(["randomProjects", "randomDevelopers"])
  }
};
</script>
