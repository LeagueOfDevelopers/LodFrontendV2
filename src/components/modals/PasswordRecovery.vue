<template>
  <form @submit.prevent="validateBeforeSubmit">
    <input type="text" name="email" placeholder="E-mail"
      :v-model="email" data-vv-as="'E-mail'"
      v-validate="{ required: true, email: true, max: 30 }">
    <p class="message_translate-to-top" v-show="errors.has('email')"> 
      {{errors.first('email')}} 
    </p>
    <button type="submit">Отправить</button>
    <p v-show="requestIsSucceeded" class="message">
      Ссылка на восстановление пароля отправлена вам на почту.
    </p>
    <div class="form__question">
      Не являетесь разработчиком?
      <router-link :to="{ name: 'signup' }" tag="a" class="form__become-dev">
        Стать разработчиком
      </router-link>
    </div>
    <div class="form__question">
      Вспомнили пароль?
      <a class="form__become-dev form__link" @click="$emit('back-to-login-form')">
        Войти в свой профиль
      </a>
    </div>
  </form>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      requestIsSucceeded: false
    };
  },
  methods: {
    validateBeforeSubmit() {
      this.$validator.validateAll().then(result => {
        if (result) {
          return;
        }
      });
    }
  }
};
</script>

<style>
</style>
