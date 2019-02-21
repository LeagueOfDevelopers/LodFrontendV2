<template>
  <div class="project-tasks">
    <slot />
    <ul class="project-tasks__list">
      <li
        class="project-tasks__item"
        v-for="(task, index) in tasks"
        :key="index"
      >{{ task }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "ProjectTasks",
  props: {
    tasks: Array
  }
};
</script>

<style lang="less" scoped>
.project-tasks {
  &__list {
    text-align: center;
  }

  &__item {
    display: inline-block;
    padding: 10px;
    margin: 5px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    background-color: #fff;
    font-size: 1.1em;

    @media (max-width: 640px) {
      font-size: 1em;
    }
  }
}
</style>
