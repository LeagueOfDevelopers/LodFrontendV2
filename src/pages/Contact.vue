<template>
  <div class="contact-content">
  <div class="contact-heading">Связаться с нами</div>
  <form class="contact-form" name="ContactForm" @submit.prevent="sendContactMessage()">
    <label>
      <input type="text" class="validate-field"
        v-model="contactMessage.ClientName" name="name" autocomplete="on" placeholder="Ваше имя"
             required>
    </label>
    <label>
      <input type="email" class="validate-field" v-model="contactMessage.ClientEmail" name="email"
             pattern="^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$" autocomplete="on"
             placeholder="Ваш e-mail адрес" required>
    </label>
    <label>
      <input type="text" class="validate-field" v-model="contactMessage.MessageTopic" name="topic" placeholder="Тема сообщения"
             required>
    </label>
    <label>
      <textarea name="message" class="validate-field" v-model="contactMessage.MessageBody" placeholder="Текст сообщения"
                required></textarea>
    </label>
    <label class="submit" :class="{'submit--success': contactMessageStateStatus === 'succeeded'}">
      <input type="submit" :disabled="contactMessageStateStatus === 'loading'" value=""
        v-if="contactMessageStateStatus !== 'succeeded'">

      <div class="success" v-if="contactMessageStateStatus === 'succeeded'"></div>
    </label>
  </form>
</div>

</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["contactMessage", "contactMessageStateStatus"])
  },
  methods: {
    sendContactMessage() {
      this.$store.dispatch("sendContactMessage");
      this.$store.dispatch("clearContactMessage");
    }
  }
};
</script>
