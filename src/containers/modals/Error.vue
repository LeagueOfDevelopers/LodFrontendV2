<template>
  <pp-modal>
    <div slot="header"> 
      <div class="form__close-button" @click="$emit('close-modal')"></div>
      <div class="form__greeting"> Произошла ошибка! </div> 
    </div>
    <div slot="content">
      <div class="form-greeting error_message" v-if="actionType">
        {{ getErrorMessage() }}
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
    getErrorMessage() {
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
