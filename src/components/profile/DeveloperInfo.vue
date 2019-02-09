<template>
  <div class="developer-info">
    <div
      class="developer-info__item"
      v-for="(value, property) in placeholders"
      :key="property"
    >
      <div class="developer-info__item-name">{{value}}</div>
      <div class="developer-info__item-text">{{propsArr[property]}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DeveloperInfo",
  props: {
    institute: {
      type: String,
      required: true
    },
    faculty: {
      type: String,
      required: true
    },
    specialization: {
      type: String,
      required: true
    },
    course: {
      type: Number,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    profileVk: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phoneNumber: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      placeholders: {
        institute: "Институт",
        faculty: "Кафедра",
        specialization: "Специальность",
        course: "Курс",
        date: "В Лиге Разработчиков",
        profileVk: "Профиль Вконтакте",
        email: "E-mail",
        phoneNumber: "Номер телефона"
      }
    };
  },
  computed: {
    propsArr() {
      return {
        institute: this.institute,
        faculty: this.faculty,
        specialization: this.specialization,
        course: this.course,
        date: this.date,
        profileVk: this.profileVk,
        email: this.email,
        phoneNumber: this.phoneNumber
      };
    }
  }
};
</script>
