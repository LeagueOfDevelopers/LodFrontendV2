<template>
  <pp-modal>
    <div slot="header">
      <div class="form__close-button" @click="$emit('close-modal')"></div>
      <div class="form__greeting"> {{ getGreeting() }}! </div>
    </div>
    <form @submit.prevent="validateBeforeSubmit" slot="content"
      v-if="!isRecoverPasswordSelected">
      <input type="text" name="email" placeholder="E-mail"
        v-model="credentials.email" data-vv-as="'E-mail'"
        v-validate="{ required: true, email: true, max: 30 }">
      <p class="message_translate-to-top" v-show="errors.has('email')">
        {{errors.first('email')}}
      </p>
      <input type="password" name="password" placeholder="Пароль"
        v-model="credentials.password" data-vv-as="'Пароль'"
        v-validate="{ required: true, min: 8, max: 50, regex: /^[a-zA-Z0-9]+$/ }">
      <p class="message_translate-to-top" v-show="errors.has('password')">
        {{errors.first('password')}}
      </p>
      <button type="submit">Войти</button>
      <p class="message" v-show="authorizeUserStateStatus === 'succeeded'">
        Вход в систему успешно выполнен.
      </p>
      <p class="message" v-show="authorizeUserStateStatus === 'failed'">
        Не удалось войти, проверьте введенные данные.
      </p>
      <div class="form__question">
        Регистрировались через GitHub?
        <span class="form__become-dev form__link" @click="signInWithGithub()">
          Войти через GitHub
        </span>
      </div>
      <div class="form__question">
        Не являетесь разработчиком?
        <router-link :to="{ name: 'signup' }" tag="a" class="form__become-dev">
          Стать разработчиком
        </router-link>
      </div>
      <div class="form__question">
        Забыли пароль?
        <span class="form__become-dev form__link" @click="isRecoverPasswordSelected = true">
          Восстановить пароль
        </span>
      </div>
    </form>
    <password-recovery v-if="isRecoverPasswordSelected" slot="content"
        @back-to-login-form="isRecoverPasswordSelected = false">
    </password-recovery>
  </pp-modal>
</template>

<script>
import Modal from "./Modal.vue";
import PasswordRecovery from "./PasswordRecovery.vue";
import { getGreeting } from "../../helpers";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      isRecoverPasswordSelected: false
    };
  },
  computed: {
    ...mapGetters(["credentials", "authorizeUserStateStatus"])
  },
  methods: {
    getGreeting() {
      return getGreeting();
    },
    validateBeforeSubmit() {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.$store.dispatch(
            "AUTHORIZE_USER_WITH_CREDENTIALS",
            this.credentials
          );
        }
      });
    },
    signInWithGithub() {}
  },
  components: {
    ppModal: Modal,
    PasswordRecovery
  }
};
</script>

<style>
</style>
