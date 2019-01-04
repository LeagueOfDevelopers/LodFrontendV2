<template>
  <section class="developers-page">
    <h1 class="headline">Разработчики</h1>

    <div class="dividing-line"></div>
    <div class="developers-page__search">
      <input placeholder="Поиск" v-model="searchValue" @keyup="filterDevelopers()"/>
      <div class="search__icon"></div>
    </div>
    <div class="content-wrapper">
        <div class="developers-page__developers">
          <developer-big-card v-for="developer in developers"
            :key="developer.UserId" :developer="developer" />
        </div>
    </div>
    <button class="developers-section__see-more-button button-style"
      @click="loadMoreDevelopers()"
      v-if="developersStateStatus === 'available'">
        Показать больше
    </button>
  </section>
</template>

<script>
import { mapGetters } from "vuex";
import DeveloperBigCard from "../components/cards/developer/DeveloperBigCard.vue";

export default {
  components: {
    DeveloperBigCard
  },
  created() {
    this.$store.dispatch("LOAD_DEVELOPERS");
  },
  data() {
    return {
      searchValue: ""
    }
  },
  computed: {
    ...mapGetters(["developers", "developersStateStatus"])
  },
  methods: {
    loadMoreDevelopers() {
      this.$store.dispatch("LOAD_MORE_DEVELOPERS");
    },
    filterDevelopers() {
      this.$store.dispatch("FILTER_DEVELOPERS", this.searchValue.toLocaleLowerCase());
    }
  }
};
</script>
