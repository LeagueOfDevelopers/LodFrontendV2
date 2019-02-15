<template>
  <div class="project">
    <div class="container">
      <project-info
        name="project name"
        :types="[1, 3]"
        :description="description"
        :developers="developers"
        :accessLevel="1"
        :status="1"
      />

      <project-tasks :tasks="tasks">
        <section-header text="Задачи на проекте" />
      </project-tasks>

      <project-screenshots :screenshots="screenshots">
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

export default {
  name: "Project",
  components: {
    "project-info": ProjectInfo,
    "project-tasks": ProjectTasks,
    "section-header": SectionHeader,
    "project-screenshots": ProjectScreenshots
  },
  data() {
    return {
      description:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quaerat consequuntur harum repellat alias eligendi molestias assumenda corporis minima. Voluptatem, optio!",
      developers: [
        {
          name: "Иван Иванов",
          role: "Backend",
          id: 5
        }
      ],
      img: undefined,
      tasks: ["first", "second", "third", "fourth", "fifth", "sixth", "seventh"],
      screenshots: [
        "https://pay.google.com/about/static/images/social/knowledge_graph_logo.png",
        "https://pay.google.com/about/static/images/social/knowledge_graph_logo.png",
        "https://pay.google.com/about/static/images/social/knowledge_graph_logo.png",
        "https://pay.google.com/about/static/images/social/knowledge_graph_logo.png",
        "https://pay.google.com/about/static/images/social/knowledge_graph_logo.png"
      ]
    };
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
