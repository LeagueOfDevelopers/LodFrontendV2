<template>
  <div class="developer-info">
    <div class="developer-info__item">
      <div class="developer-info__item-name">Институт</div>
      <div class="developer-info__item-text">{{ institute }}</div>
    </div>
    <div class="developer-info__item">
      <div class="developer-info__item-name">Кафедра</div>
      <div class="developer-info__item-text">{{ faculty }}</div>
    </div>
    <div class="developer-info__item">
      <div class="developer-info__item-name">Специальность</div>
      <div class="developer-info__item-text">{{ specialization }}</div>
    </div>
    <div class="developer-info__item">
      <div class="developer-info__item-name">Курс</div>
      <div class="developer-info__item-text">{{ course }}</div>
    </div>
    <div class="developer-info__item">
      <div class="developer-info__item-name">В Лиге Разработчиков</div>
      <div class="developer-info__item-text">{{ date }}</div>
    </div>
    <div class="developer-info__item">
      <div class="developer-info__item-name">Профиль Вконтакте</div>
      <div class="developer-info__item-text">
        <a class="link" :href="profileVk">{{ profileVk }}</a>
      </div>
    </div>
    <div class="developer-info__item">
      <div class="developer-info__item-name">E-mail</div>
      <div class="developer-info__item-text">{{ email }}</div>
    </div>
    <div class="developer-info__item">
      <div class="developer-info__item-name">Номер телефона</div>
      <div class="developer-info__item-text">{{ phoneNumber }}</div>
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
  }
};
</script>

<style lang="less" scoped>
.link {
  color: #3498db;
  
  &:hover {
    text-decoration: underline;
  }
}
</style>

