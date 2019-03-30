<template>
  <div class="project-screenshots">
    <slot />
    <ul class="project-screenshots__list">
      <li
        class="project-screenshots__item"
        v-for="(screenshot, index) in screenshots"
        :key="index"
        :style="{
          backgroundImage: `url(${ normalizeUrl(screenshot.smallPhotoUri) })`
        }"
      >
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "ProjectScreenshots",
  props: {
    screenshots: Array
  },
  methods: {
    normalizeUrl(url) {
      return url.replace(/api/, "test.api").replace(/image/, "images");
    }
  }
};
</script>

<style lang="less" scoped>
.project-screenshots {
  &__list {
    display: flex;
    flex-wrap: wrap;
  }

  &__item {
    flex-basis: 350px;
    flex-grow: 1;
    height: 350px;
    margin: 5px;
    background-position: center center;
    background-size: cover;
    background-repeat: no-repeat;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);

    @media (max-width: 1024px) {
      flex-basis: 240px;
      height: 240px;
    }
  }
}
</style>
