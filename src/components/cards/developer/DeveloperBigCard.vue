<template>
  <div class="developers__full-developer">
    <div class="project-card">
      <img class="full-developer__photo" :src="PhotoUri || DEFAULT_DEVELOPER_PHOTO">
      <div class="full-developer__info">
        <div class="full-developer__name"> {{ FirstName + ' ' + LastName }}</div>
        <div class="full-developer__role"> {{ Role }}</div>
        <div class="full-developer__experience">
          В Лиге Разработчиков: <span class="residence-time"> {{ getOffsetDate(RegistrationDate) }}</span>
        </div>
        <div class="full-developer__projects-count">
          Количество проектов: <span class="residence-time"> {{ProjectCount }}</span>
        </div>
        <a class="full-developer__vk" v-if="VkPageUri" :href="VkPageUri">
          Профиль Вконтакте</a>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from "moment";

  export default {
    props: {
      developer: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        DEFAULT_DEVELOPER_PHOTO: require("../../../assets/developer-default-photo.png"),
        // Optional
        PhotoUri: "",
        VkPageUri: "",
        // Developer info
        ...this.developer
      };
    },
    methods: {
      getOffsetDate(date) {
        const [offsetYears, offsetMonths, offsetDays] = this.getOffsetDateNumbers(date);

        const years = this.addPostfix(offsetYears, "year");
        const months = this.addPostfix(offsetMonths, "month");
        const days = this.addPostfix(offsetDays, "day");

        return `${offsetYears !== 0 ? years : ""}
                ${offsetMonths !== 0 ? months : ""}
                ${offsetDays !== 0 ? days : ""}`;
      },
      getOffsetDateNumbers(date) {
        date = moment(date);
        const now = moment();

        const offsetYears = now.diff(date, "years");
        date = date.add(offsetYears, "years");

        const offsetMonths = now.diff(date, "months");
        date = date.add(offsetMonths, "months");

        const offsetDays = now.diff(date, "days");

        return [offsetYears, offsetMonths, offsetDays]
      },
      addPostfix(number, type) {
        const words = this.getWordsForDateType(type);

        switch (number) {
          case 11:
          case 12:
          case 13:
          case 14:
            return `${number} ${words[2]}`;
        }

        switch (number % 10) {
          case 1:
            return `${number} ${words[0]}`;
          case 2:
          case 3:
          case 4:
            return `${number} ${words[1]}`;
          default:
            return `${number} ${words[2]}`;
        }
      },
      getWordsForDateType(type) {
        switch (type) {
          case "year":
            return ["год", "года", "лет"];
          case "month":
            return ["месяц", "месяца", "месяцев"];
          case "day":
            return ["день", "дня", "дней"];
          default:
            console.error(`Unknown type ${type}, available types: year, month, day`);
            return [];
        }
      }
    }
  };
</script>
