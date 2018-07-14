<template>
    <header :class="{ 'header--transparent': $route.name === 'home' }">
      <router-link to="/" tag="div" class="header__site-logo clickable"></router-link>
      <span v-if="!userIsLoggedIn()" class="header__additional-nav">
        <router-link to="registration" tag="span" 
                  class="additional-nav__item">Стать разработчиком</router-link>
        <span>или</span>
        <span @click="signIn" class="additional-nav__item">
          <span class="log-in"><!-- POPUP --></span>Войти
        </span>
      </span>
      <span v-else class="header__additional-nav">
        <router-link to="notifications" tag="span" 
                  class="additional-nav__item">Оповещений: {{getNotificationsAmount}}</router-link>
        <router-link to="{ name: 'portfolio', params: {id: getUser.id }}" tag="span" 
                  class="additional-nav__item">Портфолио</router-link>
        <router-link to="profile" tag="span" class="additional-nav__item">Профиль</router-link>
        <router-link to="adminpanel_main" v-if="userIsAdmin()" tag="span" 
                  class="additional-nav__item">Администрирование</router-link>
        <span>|</span>
        <span @click="signOut" class="additional-nav__item">
          <span class="log-out"></span>Выйти
        </span>
      </span>

      <nav class="header__nav-full">
        <router-link to="projects" tag="span" 
                  class="nav-full__item clickable">Проекты</router-link>
        <router-link to="developers" tag="span" 
                  class="nav-full__item clickable">Разработчики</router-link>
        <router-link to="about" tag="span" 
                  class="nav-full__item clickable">О нас</router-link>
        <router-link to="contact" tag="span" 
                  class="nav-full__item clickable">Связаться</router-link>
      </nav>
    </header>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["getNotificationsAmount", "getUserId"])
  },
  methods: {
    userIsLoggedIn() {
      return true;
    },
    userIsAdmin() {
      return false;
    },
    signIn() {},
    signOut() {}
  },
  created() {}
};
</script>
