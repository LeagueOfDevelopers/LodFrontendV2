<template>
  <router-link
    :to="{path: `projects`, params: id}"
    class="project-wrapper"
  >
    <div
      class="projectSmallCard"
      :style="{ 
        backgroundImage: `url(${image})`
      }"
    >
      <div class="projectSmallCard-description">
        <h1 class="projectSmallCard-description__name">{{name}}</h1>
        <p class="projectSmallCard-description__status">
          <span>Статус:</span>
          <span
            class="statusLabel"
            :style="{
              backgroundColor: stateStatus.color
            }"
          >{{ stateStatus.text }}</span>
        </p>
      </div>
    </div>
  </router-link>
</template>

<script>
import defaultImage from "../../../../assets/project-cap-image.png";

export default {
  props: {
    name: String,
    status: Number,
    imgUrl: String,
    id: Number
  },
  computed: {
    image() {
      return this.imgUrl
        ? this.imgUrl.replace(/api/, "test.api").replace(/image/, "images")
        : defaultImage;
    },
    stateStatus() {
      switch (this.status) {
        case 0: {
          return {
            color: "#795548",
            text: "Запланирован"
          };
        }
        case 1:
          return {
            color: "#1E88E5",
            text: "В процессе"
          };
        case 2:
          return {
            color: "#607D8B",
            text: "Заморожен"
          };
        default:
          return {
            color: "#009688",
            text: "Завершён"
          };
      }
    }
  }
};
</script>

<style lang="less" scoped>
.project-wrapper {
  position: relative;
  box-sizing: border-box;
  padding: 1%;
  flex-basis: calc(100% / 5);

  @media (max-width: 1499px) {
    flex-basis: calc(100% / 4);
  }

  @media (max-width: 1199px) {
    flex-basis: calc(100% / 4);
  }

  @media (max-width: 991px) {
    flex-basis: calc(100% / 3);
  }

  @media (max-width: 767px) {
    flex-basis: calc(100% / 2);
  }

  @media (max-width: 575px) {
    flex-basis: calc(100% / 1);
  }
}

.projectSmallCard {
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
    text-align: left;
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
