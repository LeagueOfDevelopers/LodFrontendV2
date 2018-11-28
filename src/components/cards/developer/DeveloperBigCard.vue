<template>
	<div class="developers__full-developer">
		<div class="project-card">
			<img class="full-developer__photo" :src="developer.PhotoUri || DEFAULT_DEVELOPER_PHOTO">
			<div class="full-developer__info">
				<div class="full-developer__name"> {{ developer.FirstName + ' ' + developer.LastName }}</div>
				<div class="full-developer__role"> {{ developer.Role }}</div>
				<div class="full-developer__experience">
					В Лиге Разработчиков: <span class="residence-time"> {{ developer.RegistrationDate }}</span>
				</div>
				<div class="full-developer__projects-count">
					Количество проектов: <span class="residence-time"> {{developer.ProjectCount }}</span>
				</div>
				<a class="full-developer__vk" v-if="developer.VkPageUri" :href="developer.VkPageUri">
					Профиль Вконтакте</a>
			</div>
		</div>
	</div>
</template>

<script>
export default {
  props: {
    developer: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      DEFAULT_DEVELOPER_PHOTO: require("../../../assets/developer-default-photo.png")
    };
  }
};
</script>
