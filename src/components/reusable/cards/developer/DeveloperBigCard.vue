<template>
  <div class="developers__full-developer">
    <div class="project-card">
      <router-link
        tag="img"
        :to="`developers/${id}`"
        class="full-developer__photo"
        :src="photo"
      ></router-link>
      <div class="full-developer__info">
        <router-link
          tag="div"
          :to="`developers/${id}`"
          class="full-developer__name"
          :src="photo"
        >{{ firstname + ' ' + lastname }}</router-link>
        <div class="full-developer__role"> {{ specialization }}</div>
        <div class="full-developer__experience">
          В Лиге Разработчиков: <span class="residence-time"> {{ normalizeDate(registrationTime) }}</span>
        </div>
        <div class="full-developer__projects-count">
          Количество проектов: <span class="residence-time"> {{ numberOfProjects }}</span>
        </div>
        <a
          class="full-developer__vk"
          v-if="vkProfileUri"
          :href="vkProfileUri"
        >
          Профиль Вконтакте</a>
      </div>
    </div>
  </div>
</template>

<script>
import defaultPhoto from "../../../../assets/developer-default-photo.png";
import { getOffsetDate } from "../../../../helpers";

export default {
  props: {
    developer: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      // Optional
      PhotoUri: "",
      VkPageUri: "",
      // Developer info
      ...this.developer
    };
  },
  computed: {
    photo() {
      return this.developer.avatar.smallPhotoUri
        ? this.developer.avatar.smallPhotoUri
            .replace(/api/, "test.api")
            .replace(/image/, "images")
        : defaultPhoto;
    }
  },
  methods: {
    normalizeDate(date) {
      return getOffsetDate(date);
    }
  }
};
</script>

<style lang="less" scoped>
.full-developer {
  &__photo,
  &__name {
    cursor: pointer;
  }

  &__name:hover {
    text-decoration: underline;
  }
}
</style>

