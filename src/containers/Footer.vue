<template>
  <footer>
    <span class="footer__signature">
      Сделано <router-link to="home" tag="a"
        class="signature__link">Лигой Разработчиков</router-link>
    </span>
    <div class="footer__links">
      <router-link to="http://vk.com/lodmisis" tag="a" class="links__vk clickable">Мы Вконтакте</router-link>
      <span>|</span>
      <router-link to="contact" tag="a" class="links__contact-us clickable">Связаться</router-link>
    </div>
    <span class="footer__copyright">© League of developers
      <span class="copyright__this-year">{{ currentDate }}</span>
    </span>
    <span>

    </span>
  </footer>
</template>

<script>
export default {
  data() {
    return {
      currentDate: new Date().getFullYear()
    };
  }
};
</script>
