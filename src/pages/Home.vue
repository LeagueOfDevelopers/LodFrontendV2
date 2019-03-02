<template>
	<section>
		<welcome/>
		<h1 class="projects-section__headline headline">Наши проекты</h1>
		<projects-overview :projects="randomProjects"/>
		<div class="dividing-line"></div>
		<h1 class="developers-section__headline headline">Наши разработчики</h1>
		<developers-overview :developers="randomDevelopers"/>
	</section>
</template>

<script>
import { mapActions, mapState } from "vuex";

import Welcome from "../components/home/Welcome.vue";
import ProjectsOverview from "../components/home/ProjectsOverview.vue";
import DevelopersOverview from "../components/home/DevelopersOverview.vue";

export default {
  components: {
    Welcome,
    ProjectsOverview,
    DevelopersOverview
  },
  created() {
    this.loadRandomProjects();
    this.loadRandomDevelopers();
  },
  computed: {
    ...mapState("developers", [
      "randomDevelopers"
    ]),

    ...mapState("projects", [
      "randomProjects"
    ])
  },
  methods: {
    ...mapActions("developers", {
      loadRandomDevelopers: "LOAD_RANDOM_DEVELOPERS"
    }),

    ...mapActions("projects", {
      loadRandomProjects: "LOAD_RANDOM_PROJECTS"
    })
  }
};
</script>
