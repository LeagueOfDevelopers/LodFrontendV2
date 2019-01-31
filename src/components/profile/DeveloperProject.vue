<template>
  <div
    class="project-wrapper"
    :style="{ width: width }"
  >
    <div
      class="developerProject"
      :style="{ backgroundImage: `url(${imgUrl})` }"
    >
      <div class="developerProject-description">
        <h1 class="developerProject-description__name">Project name</h1>
        <p class="developerProject-description__status">
          <span>Статус:</span>
          <span
            class="statusLabel"
            :style="{
            backgroundColor: statusState.color
          }"
          >{{ statusState.text }}</span>
        </p>
        <p class="developerProject-description__role">
          <span>Роль разработчика: </span>
          <span>{{ role }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { getComponentsInRowNumber } from "../../helpers";
import defaultBackground from "../../assets/project-cap-image.png";

export default {
  name: "DeveloperProject",
  props: {
    imgUrl: {
      type: String,
      default: defaultBackground
    },
    name: {
      type: String,
      required: true
    },
    status: {
      type: Number,
      required: true
    },
    role: {
      type: String,
      required: true
    }
  },
  computed: {
    width() {
      return `${100 / getComponentsInRowNumber()}%`;
    },
    statusState() {
      switch (this.status) {
        case 1:
          return {
            color: "#009688",
            text: "Завершён"
          };
        case 2:
          return {
            color: "#1E88E5",
            text: "В процессе"
          };
        case 3:
          return {
            color: "#607D8B",
            text: "Заморожен"
          };
      }
    }
  }
};
</script>

<style lang="less" scoped>
.project-wrapper {
  position: relative;
  padding: 5px;
  box-sizing: border-box;
}

.developerProject {
  position: relative;
  padding-top: 100%;
  width: 100%;
  background-size: cover;
  background-position: center center;
  background-color: #000;
  &-description {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    padding: 10px;
    background-color: rgba(0, 0, 0, 0.7);
    color: #ffffff;
    &__name {
      margin-bottom: 10px;
      font-size: 1.7em;
      font-family: "Cuprum", sans-serif;
    }
    &__status,
    &__role {
      font-family: "PT Sans", sans-serif;
      font-weight: bold;
    }
    &__status {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      .statusLabel {
        padding: 5px 10px;
        margin-left: 10px;
        border-radius: 5px;
        box-sizing: border-box;
        display: block;
      }
    }
    &__role {
      margin-bottom: 10px;
    }
  }
}
</style>

