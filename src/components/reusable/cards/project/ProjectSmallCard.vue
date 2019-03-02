<template>
  <div class="projects-section__project">
    <div
      :style="{
        backgroundColor: '#000000',
        backgroundImage: 
        `url(${image})`
      }"
      class="project__background"
    ></div>
    <div class="project__info-container">
      <div class="project__name">
        {{project.name}}
      </div>

      <slot name="project-status"></slot>

    </div>
  </div>
</template>

<script>
import defaultImage from "../../../../assets/project-cap-image.png";

export default {
  props: {
    project: {
      type: Object,
      required: true,
      default: () => {}
    }
  },
  computed: {
    image() {
      return this.project.landingImage.smallPhotoUri ? 
      this.project.landingImage.smallPhotoUri
        .replace(/api/, "test.api")
        .replace(/image/, "images") :
      defaultImage;
    }
  }
};
</script>

<style scoped>
</style>
