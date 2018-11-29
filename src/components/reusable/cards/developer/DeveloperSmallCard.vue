<template>
  <div class="developers-section__developer">
    <img class="developer__photo"
         :src="developer.PhotoUri || require('../../../../assets/developer-default-photo.png')">
    <span class="developer__full-name">{{ developer.FirstName + ' ' + developer.LastName }}</span>
    <span class="developer__specialization"> {{developer.Role}} </span>
  </div>
</template>

<script>
  export default {
    data() {
      return {};
    },
    props: {
      developer: {
        type: Object,
        required: true,
        default: () => {
        }
      }
    }
  };
</script>
