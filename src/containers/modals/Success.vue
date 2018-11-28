<template>
  <pp-modal>
    <div slot="header"> 
      <div class="form__close-button" @click="$emit('close-modal')"></div>
      <div class="form__greeting"> Операция выполнена успешно! </div> 
    </div>
    <div slot="content">
      <div class="form-greeting success_message" v-if="actionType">
        {{ getSuccessMessage() }}
      </div>
    </div>
  </pp-modal>
</template>

<script>
import Modal from "./Modal.vue";

export default {
  props: {
    actionType: {
      required: false,
      type: String,
      default: "any"
    }
  },
  methods: {
    getSuccessMessage() {
      switch (this.actionType) {
        case "any":
          return "";
      }
    }
  },
  components: {
    ppModal: Modal
  }
};
</script>

<style>
</style>
