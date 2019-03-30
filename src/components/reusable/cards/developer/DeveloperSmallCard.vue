<template>
  <div class="developers-section__developer">
    <div
      class="developer__photo"
      :style="{
        backgroundImage: `url(${photo})`,
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover'
      }"
    ></div>
    <span class="developer__full-name">{{ developer.firstname + ' ' + developer.lastname }}</span>
    <span class="developer__specialization"> {{developer.specialization}} </span>
  </div>
</template>

<script>
import defaultPhoto from "../../../../assets/developer-default-photo.png";

export default {
  data() {
    return {};
  },
  computed: {
    photo() {
      return this.developer.avatar.smallPhotoUri
        ? this.developer.avatar.smallPhotoUri
            .replace(/api/, "test.api")
            .replace(/image/, "images")
        : defaultPhoto;
    }
  },
  props: {
    developer: {
      type: Object,
      required: true
    }
  }
};
</script>
