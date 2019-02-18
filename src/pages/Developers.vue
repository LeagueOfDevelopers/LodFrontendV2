<template>
  <section class="developers-page">
    <h1 class="headline">Разработчики</h1>

    <div class="dividing-line"></div>

    <div class="developers-page__search">
      <input
        placeholder="Поиск"
        v-model="searchValue"
        @keyup="filter()"
      />
      <div class="search__icon"></div>
    </div>
    <div class="content-wrapper">
      <div class="developers-page__developers">
        <developer-big-card
          v-for="developer in developers"
          :key="developer.id"
          :developer="developer"
        />
      </div>
    </div>
    <button
      class="developers-section__see-more-button button-style"
      @click="loadMoreDevelopers()"
      v-if="developersStateStatus === 'available'"
    >
      Показать больше
    </button>
  </section>
</template>

<script>
import { mapState, mapActions } from "vuex";
import DeveloperBigCard from "../components/reusable/cards/developer/DeveloperBigCard.vue";

export default {
  components: {
    DeveloperBigCard
  },
  mounted() {
    this.resetDevelopers().then(() => this.loadDevelopers());
  },
  data() {
    return {
      searchValue: ""
    };
  },
  computed: {
    ...mapState("developers", [
      "developers",
      "developersStateStatus"
    ])
  },
  methods: {
    ...mapActions("developers", {
      resetDevelopers: "RESET_DEVELOPERS",
      loadDevelopers: "LOAD_DEVELOPERS",
      loadMoreDevelopers: "LOAD_MORE_DEVELOPERS",
      filterDevelopers: "FILTER_DEVELOPERS"
    }),
    filter() {
      const value = this.searchValue.toLowerCase();
      this.filterDevelopers(value);
    }
  }
};
</script>
