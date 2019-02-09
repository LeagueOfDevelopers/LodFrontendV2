<template>
  <div class="profileHeader">
    <p class="profileHeader-confirmationStatus">
      <span>{{ confirmationStatusText }}</span>
    </p>
    <div class="profileHeader-photo">
      <figure 
        :style="{
          backgroundImage: `url(${photoUrl})`
        }"></figure>
    </div>
    <p class="profileHeader-info">
      <span class="profileHeader-info__name">{{name}}</span>
      <span class="profileHeader-info__role">{{role}}</span>
    </p>
  </div>
</template>

<script>
import defaultPhoto from "../../assets/developer-default-photo.png";

export default {
  name: "ProfileHeader",
  props: {
    confirmationStatus: {
      type: Number,
      required: false,
      default: -1
    },
    photoUrl: {
      type: String,
      required: false,
      default: defaultPhoto
    },
    name: {
      type: String,
      required: true
    },
    role: {
      tyle: String,
      required: true
    }
  },
  computed: {
    confirmationStatusText() {
      switch (this.confirmationStatus) {
        case 1:
          return "Подтверждена почта";
        case 2:
          return "Подтверждён администратором";
        default:
          return "Не подтвержден";
      }
    }
  }
};
</script>

<style lang="less" scoped>
.profileHeader {
  &-confirmationStatus {
    padding: 10px 0;
    text-align: right;
    font-size: 1.1em;
    color: #ccc;
    font-family: "PT Sans", sans-serif;
  }
  &-photo {
    figure {
      width: 250px;
      height: 250px;
      margin: 0 auto;
      background-size: cover;
      background-position: center center;
      box-sizing: border-box;
      border: 10px solid #ccc;
      border-radius: 50%;
    }
  }
  &-info {
    text-align: center;
    &__name {
      display: block;
      font-size: 1.8em;
      font-family: "Noto Serif", serif;
      font-weight: bold;
    }
    &__role {
      display: block;
      font-size: 1.2em;
      font-family: "PT Sans", sans-serif;
    }
  }
}
</style>
