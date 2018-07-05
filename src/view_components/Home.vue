<template>
  <div>
    <pp-welcome/>
    <pp-projects-overview/>
    <pp-dividing-line/>
    <pp-developers-overview/>
  </div>
</template>

<script>
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
  }
};
</script>
