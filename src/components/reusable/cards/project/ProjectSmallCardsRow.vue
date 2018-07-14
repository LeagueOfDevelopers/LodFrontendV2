<template>
  <section class="random-wrapper">
    <router-link v-for="project in projects" :key="project.ProjectId" 
      :to="{name: 'project', params: {id: project.ProjectId}}" tag="div"
      class="projects-section__link-to-project">
      <project-small-card :project="project" />  
    </router-link>
  </section>
</template>

<script>
import ProjectSmallCard from "./ProjectSmallCard.vue";

export default {
  components: {
    ProjectSmallCard
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
