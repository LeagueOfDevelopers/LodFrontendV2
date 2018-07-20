<template>
  <div class="projects-section__project">
    <div :class="{ 'default-project-img': !project.PhotoUri, 'project-img': project.PhotoUri }"
    :style="[ project.PhotoUri ?  {backgroundImage: `url(${project.PhotoUri})`} : {}]" 
    class="project__background"></div>
    <div class="project__info-container">
        <div class="project__name">
          {{project.Name}}
        </div>

        <slot name="project-status"></slot>

    </div>
  </div>
</template>

<script>
export default {
  props: {
    project: {
      type: Object,
      required: true,
      default: () => {}
    }
  }
};
</script>

<style scoped>
.default-project-img {
  background: #000 url("../../../../assets/project-cap-image.png") no-repeat
    center;
  background-size: cover;
}

.project-img {
  background: #000 no-repeat center;
  background-size: cover;
}
</style>
