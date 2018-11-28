<template>
  <section class="random-wrapper">
    <router-link v-for="project in projects" :key="project.ProjectId"
      :to="{name: 'project', params: {id: project.ProjectId}}" tag="div"
      class="projects-section__link-to-project">
      <project-small-card :project="project">
        <div class="project__status" slot="project-status">
          Статус:
          <span class="status__value" :style="{ background: getstatusColor(project.ProjectStatus) }">
            {{ getStatusDescription(project.ProjectStatus) }}
          </span>
        </div>
      </project-small-card>
    </router-link>
  </section>
</template>

<script>
import ProjectSmallCard from "./ProjectSmallCard.vue";

export default {
  components: {
    ProjectSmallCard
  },
  methods: {
    getstatusColor(status) {
      switch (status) {
        case 0:
          return "#795548";
        case 1:
          return "#1e88e5";
        case 2:
          return "#607d8b";
        default:
          return "#009688";
      }
    },
    getStatusDescription(status) {
      switch (status) {
        case 0:
          return "Запланирован";
        case 1:
          return "В процессе";
        case 2:
          return "Заморожен";
        default:
          return "Завершен";
      }
    }
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
