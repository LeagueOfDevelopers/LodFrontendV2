<template>
  <section>
    <pp-welcome/>
    <pp-projects-overview :projects="projects"/>
    <pp-dividing-line/>
    <pp-developers-overview :developers="developers"/>
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
    store.dispatch("LOAD_DEVELOPERS");
    store.dispatch("LOAD_PROJECTS");
  },
  computed: {
    ...mapGetters(["projects", "developers"])
  }
};
</script>
