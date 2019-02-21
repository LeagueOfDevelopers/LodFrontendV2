<template>
  <div class="project-info">
    <h1 class="project-info__name">{{ name }}</h1>
    <div class="main-info">
      <div
        class="main-info__column main-info__image"
        :style="{
            backgroundImage: `url(${ projectImage })`
          }"
      >
        <span :class="{
            'main-info__status': true,
            'main-info__status_planned': status === 0,
            'main-info__status_processing': status === 1,
            'main-info__status_frozen': status === 2,
            'main-info__status_finished': !(status <= 2 && status >= 0),
          }">{{ statusText }}</span>
      </div>
      <div class="main-info__column">
        <div class="main-info__text-info-list">
          <div class="main-info__type text-info">
            <h3 class="text-info__headline">Тип проекта:</h3>
            <div class="text-info__value">
              <span
                class="main-info__type-item"
                v-for="type in types"
                :key="type"
              >{{ getTypeText(type) }}</span>
            </div>
          </div>

          <div class="main-info__description text-info">
            <h3 class="text-info__headline">Описание:</h3>
            <div class="text-info__value">
              {{ description }}
            </div>
          </div>

          <div class="main-info__developers text-info">
            <h3 class="text-info__headline">Разработчики:</h3>
            <div class="text-info__value">
              <p
                class="main-info__developer"
                v-for="(developer, index) in developers"
                :key="index"
              >
                <router-link
                  tag="a"
                  :to="`/developers/${developer.id}`"
                  class="text-link"
                >{{ developer.name }} </router-link>
                <span>({{ developer.role }})</span>
              </p>
            </div>
          </div>

          <div class="main-info__access-level text-info">
            <h3 class="text-info__headline">Уровень доступа:</h3>
            <div class="text-info__value">{{ accessLevelText }}</div>
          </div>

          <div class="main-info__project-links text-info">
            <div class="text-info__value">
              Проект в <a
                :href="redmineLink"
                class="block-link"
              >Redmine</a> и <a
                :href="gitlabLink"
                class="block-link"
              >Gitlab</a>
            </div>
          </div>
        </div>

        <form class="membership-form">
          <input
            type="text"
            class="membership-form__input"
            placeholder="Роль в проекте"
            required
          />
          <button class="membership-form__button">Присоединиться</button>
          <button class="membership-form__button">Покинуть проект</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import defaultImage from "../../assets/project-cap-image.png";

export default {
  name: "ProjectInfo",
  props: {
    name: String,
    status: Number,
    image: String,
    types: Array,
    description: String,
    developers: Array,
    accessLevel: Number,
    redmineLink: String,
    gitlabLink: String
  },
  computed: {
    projectImage() {
      return this.image || defaultImage;
    },
    statusText() {
      switch (this.status) {
        case 0:
          return "Запланирован";
        case 1:
          return "В процессе";
        case 2:
          return "Заморожен";
        default:
          return "Завершён";
      }
    },
    accessLevelText() {
      switch (this.accessLevel) {
        case 1:
          return "Открытый";
        default:
          return "Закрытый";
      }
    }
  },
  methods: {
    getTypeText(type) {
      switch (type) {
        case 0:
          return "Веб";
        case 1:
          return "Мобильное";
        case 2:
          return "Десктопное";
        case 3:
          return "Игра";
        default:
          return "Прочее";
      }
    }
  }
};
</script>

<style lang="less" scoped>
.project-info {
  &__name {
    width: 100%;
    margin: 15px auto;
    text-align: center;
    text-transform: uppercase;
    font-size: 1.8em;
    font-weight: bold;
    font-family: "Cuprum", sans-serif;
    text-shadow: 2px 2px rgba(0, 0, 0, 0.1);

    @media (min-width: 1024px) {
      font-size: 2.2em;
    }
  }

  .main-info {
    display: flex;
    margin: 0 auto;
    background-color: #ffffff;
    border-radius: 5px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    max-width: 1300px;
    min-height: 350px;
    overflow: hidden;

    @media (max-width: 1024px) {
      flex-wrap: wrap;
      max-width: 700px;
    }

    &__column {
      position: relative;
      flex-basis: 100%;
      flex-grow: 1;
      padding: 15px;

      &:not(:last-child) {
        border-right: 1px solid #f1f1f1;
      }
    }

    &__status {
      position: absolute;
      top: 15px;
      left: 20px;
      padding: 5px 10px;
      border-radius: 5px;
      color: #ffffff;
      display: inline-block;

      @media (max-width: 1024px) {
        top: auto;
        left: auto;
        right: 10px;
        bottom: 10px;
      }

      &_planned {
        background-color: #795548;
      }

      &_processing {
        background-color: #1e88e5;
      }

      &_frozen {
        background-color: #607d8b;
      }

      &_finished {
        background-color: #009688;
      }
    }

    &__image {
      background-position: center center;
      background-size: cover;
      background-color: #000;

      @media (max-width: 1024px) {
        min-height: 400px;
      }
    }

    &__type {
      .text-info__headline {
        margin-bottom: 10px;
      }
    }

    &__type-item {
      padding: 5px 10px;
      background-color: #ffd200;
      color: #ffffff;

      &:not(:last-child) {
        margin-right: 5px;
      }
    }
  }

  .text-info {
    &:not(:last-child) {
      margin-bottom: 10px;
    }

    @media (max-width: 640px) {
      font-size: 1em;
    }

    &__headline {
      text-align: left;
      font-weight: 900;
      font-size: 1.1em;
      font-family: "PT Sans", sans-serif;
    }
  }

  .text-link {
    color: #2980b9;

    &:hover {
      text-decoration: underline;
    }
  }

  .block-link {
    display: inline-block;
    color: #2980b9;
    padding: 3px 5px;
    border-radius: 5px;
    border: 1px solid #2980b9;
    transition: all 0.15s;

    &:hover {
      background-color: #2980b9;
      color: #ffffff;
    }
  }

  .membership-form {
    &__input {
      width: 100%;
      margin: 15px 0;
      border: none;
      outline: none;
      font-family: "PT Sans", sans-serif;
      font-size: 1em;
      border-top: 1px solid #aaa;
      border-bottom: 1px solid #aaa;
      min-height: 40px;
      text-align: center;
    }

    &__button {
      display: block;
      max-width: 200px;
      padding: 15px 10px;
      margin: 0 auto;
      color: #202d3a;
      border: 1px solid #202d3a;
      font-family: "PT Sans", sans-serif;
      font-size: 0.9em;
      text-transform: uppercase;
      transition: all 0.15s;

      &:not(:last-child) {
        margin-bottom: 15px;
      }

      &:hover {
        background-color: #2980b9;
        border: 1px solid #2980b9;
        color: #ffffff;
      }
    }
  }
}
</style>
