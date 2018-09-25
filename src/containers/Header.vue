<template>
  <div>
    <header :class="{ 'header--transparent': $route.name === 'home' }">
      <router-link :to="{ name: 'home' }" tag="div" class="header__site-logo"></router-link>
      <span v-if="!isAuthorized" class="header__additional-nav">
        <router-link :to="{ name: 'signup' }" tag="a"
          class="additional-nav__item">Стать разработчиком</router-link>
        <span>или</span>
        <span class="additional-nav__item"
          @click="loginModalIsOpened = true">
          <span class="log-in">
          </span>Войти
        </span>
      </span>
      <span v-else class="header__additional-nav">
        <router-link to="notifications" tag="a"
          class="additional-nav__item">Оповещений: {{notificationsAmount}}</router-link>
        <router-link :to="{ name: 'portfolio', params: {id: userId }}" tag="a"
          class="additional-nav__item">Портфолио</router-link>
        <router-link to="profile" tag="a" class="additional-nav__item">Профиль</router-link>
        <router-link :to="{ name: 'admin_main' }" v-if="userIsAdmin" tag="a"
          class="additional-nav__item">Администрирование</router-link>
        <span>|</span>
        <span @click="signOut" class="additional-nav__item">
          <span class="log-out"></span>Выйти
        </span>
      </span>

      <div class="header__nav-toggle" @click="openNavMobile"
        :class="{'header__nav-toggle--active': navMobileIsOpened}">
        <div class="nav-toggle__burger"></div>
      </div>

      <nav class="header__nav-full">
        <router-link :to="{ name: 'projects' }" tag="a"
          class="nav-full__item">Проекты</router-link>
        <router-link :to="{ name: 'developers' }" tag="a"
          class="nav-full__item">Разработчики</router-link>
        <router-link :to="{ name: 'about' }" tag="a"
          class="nav-full__item">О нас</router-link>
        <router-link :to="{ name: 'contact' }" tag="a"
          class="nav-full__item">Связаться</router-link>
      </nav>
    </header>

    <nav class="nav-mobile" v-if="navMobileIsOpened">
      <router-link :to="{ name: 'notifications' }" tag="a" v-if="isAuthorized"
        class="nav-mobile__item">Оповещений: {{ notificationsAmount }}</router-link>
      <router-link :to="{ name: 'portfolio' }" tag="a" v-if="isAuthorized"
        class="nav-mobile__item">Портфолио</router-link>
      <router-link :to="{ name: 'profile' }" tag="a" v-if="isAuthorized"
        class="nav-mobile__item">Профиль</router-link>
      <router-link :to="{ name: 'admin_main' }" tag="a" v-if="userIsAdmin"
        class="nav-mobile__item">Администрирование</router-link>
      <a v-if="!isAuthorized"
        @click="loginModalIsOpened = true" class="nav-mobile__item">Войти</a>
      <router-link :to="{ name: 'signup' }" tag="a" v-if="!isAuthorized"
        class="nav-mobile__item">Стать разработчиком</router-link>
      <router-link :to="{ name: 'projects' }" tag="a"
        class="nav-mobile__item">Наши проекты</router-link>
      <router-link :to="{ name: 'developers' }" tag="a"
        class="nav-mobile__item">Разработчики</router-link>
      <router-link :to="{ name: 'about' }" tag="a"
        class="nav-mobile__item">О нас</router-link>
      <router-link :to="{ name: 'contact' }" tag="a"
        class="nav-mobile__item">Связаться</router-link>
      <a tag="a" @click="signOut" v-if="isAuthorized"
        class="nav-mobile__item">Выйти</a>
    </nav>

    <login v-if="loginModalIsOpened" v-on:close-modal="loginModalIsOpened = false"></login>
    <success v-show="$route.params.status == 'success'"
      v-on:close-modal="successModalIsOpened = false"></success>
    <error v-show="$route.params.status == 'error'"
      v-on:close-modal="errorModalIsOpened = false"></error>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Login from "./modals/Login.vue";
import Success from "./modals/Success.vue";
import Error from "./modals/Error.vue";

export default {
  data() {
    return {
      loginModalIsOpened: false,
      successModalIsOpened: false,
      errorModalIsOpened: false,
      userIsAdmin: false,
      navMobileIsOpened: false
    };
  },
  components: {
    Login,
    Success,
    Error
  },
  computed: {
    ...mapGetters(["notificationsAmount", "userId", "isAuthorized"])
  },
  methods: {
    openNavMobile() {
      this.navMobileIsOpened = !this.navMobileIsOpened;
    },
    signOut() {
      this.$store.dispatch("UNAUTHORIZE_USER");
    }
  },
  created() {
    this.$store.dispatch("CHECK_AUTHORIZATION");
  }
};
</script>
