<template>
  <not-found v-if="failedStatus"></not-found>
  <div
    class="project"
    v-else-if="availableStatus"
  >
    <div class="container">
      <project-info
        :name="info.name"
        :types="info.projectTypes"
        :description="info.info"
        :developers="info.projectMemberships"
        :accessLevel="1"
        :status="info.projectStatus"
        :image="info.landingImage ? info.landingImage.bigPhotoUri : ''"
      />

      <project-tasks
        v-if="info.tasks && info.tasks.length"
        :tasks="info.tasks"
      >
        <section-header text="Задачи на проекте" />
      </project-tasks>

      <project-screenshots
        v-if="info.screenshots && info.screenshots.length"
        :screenshots="info.screenshots"
      >
        <section-header text="Скриншоты" />
      </project-screenshots>
    </div>
  </div>
</template>

<script>
import ProjectInfo from "../components/project/ProjectInfo";
import ProjectTasks from "../components/project/ProjectTasks";
import ProjectScreenshots from "../components/project/ProjectScreenshots";
import SectionHeader from "../components/project/SectionHeader";
import NotFound from "../pages/NotFound";

import { mapActions, mapState, mapGetters } from "vuex";

export default {
  name: "Project",
  components: {
    "project-info": ProjectInfo,
    "project-tasks": ProjectTasks,
    "section-header": SectionHeader,
    "project-screenshots": ProjectScreenshots,
    "not-found": NotFound
  },
  created() {
    this.loadProjectInfo(this.$route.params.id);
  },
  computed: {
    ...mapState("project", {
      info: state => state.info
    }),

    ...mapGetters("project", ["availableStatus", "failedStatus"])
  },
  methods: {
    ...mapActions("project", {
      loadProjectInfo: "LOAD_PROJECT_INFO"
    })
  }
};
</script>

<style lang="less" scoped>
.container {
  padding: 20px 40px 40px 40px;

  @media (max-width: 1024px) {
    padding: 15px;
  }
}
</style>
