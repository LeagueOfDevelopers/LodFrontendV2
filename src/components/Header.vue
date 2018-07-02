<template>
    <header>
      <router-link to="home" tag="div" class="header__site-logo"></router-link>
      <span v-if="!userIsLoggedIn" class="header__additional-nav">
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
        <router-link to="adminpanel_main" v-if="userIsAdmin" tag="span" 
                  class="additional-nav__item">Администрирование</router-link>
        <span>|</span>
        <span @click="signOut" class="additional-nav__item">
          <span class="log-out"></span>Выйти
        </span>
      </span>

      <nav class="header__nav-full">
        <router-link to="projects" tag="span" 
                  class="nav-full__item">Проекты</router-link>
        <router-link to="developers" tag="span" 
                  class="nav-full__item">Разработчики</router-link>
        <router-link to="about" tag="span" 
                  class="nav-full__item">О нас</router-link>
        <router-link to="contact" tag="span" 
                  class="nav-full__item">Связаться</router-link>
      </nav>
    </header>
</template>

<script>
export default {
  computed: {
    getNotificationsAmount() {
      return 1;
    },
    getUser() {
      return { id: 1 };
    }
  },
  methods: {
    userIsLoggedIn() {
      return true;
    },
    userIsAdmin() {
      return true;
    },
    signIn() {},
    signOut() {}
  }
};
</script>


<style>
/* .header__site-logo {
  width: 200px;
  display: inline-block;
  height: 100%;
  background: url('../assets/logo-ver2.svg') no-repeat left;
  background-size: contain;
}
.header__additional-nav {
  display: inline-block;
  position: absolute;
  top: 15px;
  right: 20px;
  color: rgba(255, 255, 255, 0.5);
}
.additional-nav__item {
  position: relative;
  color: #ffffff;
  margin: 0 5px;
  -webkit-transition: all 0.1s ease;
  -moz-transition: all 0.1s ease;
  -o-transition: all 0.1s ease;
  transition: all 0.1s ease;
  cursor: pointer;
  opacity: 0.7;
}
.additional-nav__item:hover {
  opacity: 1;
}
.log-in,
.log-out {
  display: inline-block;
  width: 0.8em;
  height: 0.8em;
}

.log-in {
  background: url("../assets/log-in-icon.png") no-repeat center;
  background-size: contain;
}

.log-out {
  background: url("../assets/log-out-icon.png") no-repeat center;
  background-size: contain;
}
.header__nav-toggle {
  display: none;
} */
</style>
