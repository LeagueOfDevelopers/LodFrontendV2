<template>
  <div class="categories">
    <div
      v-for="(category, index) in categories"
      :key="index"
      :class="{
				'categories__item': true,
				'categories__item--activated': category.key === currentCategory,
      }"
      @click="category.key === currentCategory ? 
        unselectCategory(index) : 
        selectCategory(index)"
    >
      {{category.name}}
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "project-filter",
  computed: {
    ...mapState("projects", {
      currentCategory: "currentCategory"
    })
  },
  data() {
    return {
      categories: [
        {
          name: "Веб",
          key: 1
        },
        {
          name: "Мобильное",
          key: 2
        },
        {
          name: "Десктопное",
          key: 3
        },
        {
          name: "Игра",
          key: 4
        },
        {
          name: "Прочее",
          key: 5
        }
      ]
    };
  },
  methods: {
    ...mapActions("projects", {
      filterProjets: "FILTER_PROJECTS"
    }),

    selectCategory(index) {
      this.filterProjets(this.categories[index].key);
    },

    unselectCategory(index) {
      this.filterProjets(0);
    }
  }
};
</script>

<style scoped>
.categories {
  text-align: center;
  width: 100%;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.categories__item {
  display: inline-block;
  padding: 10px;
  margin: 5px;
  border: 1px solid #ffffff;
  background-color: #717171;
  color: white;
  -webkit-transition: background-color 0.2s ease-out;
  -moz-transition: background-color 0.2s ease-out;
  -o-transition: background-color 0.2s ease-out;
  transition: background-color 0.2s ease-out;
  cursor: pointer;
}

.categories__item--activated {
  background-color: #2980b9;
}

.categories__item:hover {
  border: 1px dashed white;
}
</style>