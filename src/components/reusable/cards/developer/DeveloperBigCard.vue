<template>
  <div class="developers__full-developer">
    <div class="project-card">
      <img class="full-developer__photo" :src="avatar.smallPhotoUri || DEFAULT_DEVELOPER_PHOTO">
      <div class="full-developer__info">
        <div class="full-developer__name"> {{ firstname + ' ' + lastname }}</div>
        <div class="full-developer__role"> {{ specialization }}</div>
        <div class="full-developer__experience">
          В Лиге Разработчиков: <span class="residence-time"> {{ normalizeDate(registrationTime) }}</span>
        </div>
        <div class="full-developer__projects-count">
          Количество проектов: <span class="residence-time"> {{ numberOfProjects }}</span>
        </div>
        <a class="full-developer__vk" v-if="vkProfileUri" :href="vkProfileUri">
          Профиль Вконтакте</a>
      </div>
    </div>
  </div>
</template>

<script>
  import {getOffsetDate} from "../../../../helpers";

  export default {
    props: {
      developer: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        DEFAULT_DEVELOPER_PHOTO: require("../../../../assets/developer-default-photo.png"),
        // Optional
        PhotoUri: "",
        VkPageUri: "",
        // Developer info
        ...this.developer
      };
    },
    methods: {
      normalizeDate(date) {
        return getOffsetDate(date);
      }
    }
  };
</script>
