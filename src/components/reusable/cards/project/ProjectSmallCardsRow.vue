<template>
  <section class="random-wrapper">
    <project-small-card
      v-for="project in projects"
      :key="project.id"
      :name="project.name"
      :status="project.status"
      :imgUrl="project.landingImage.smallPhotoUri"
      :id="project.id"
    />
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

<style lang="less" scoped>
.random-wrapper {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -1%;
}
</style>

