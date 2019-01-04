<template>
	<div class="categories">
		<div
			v-for="(category, index) in categories"
			:class="category.selected ?
				'categories__item categories__item--activated':
				'categories__item'"
			@click="selectCategory(category, index)"
		>
			{{category.name}}
		</div>
	</div>
</template>

<script>
  import { mapGetters } from "vuex";

  export default {
    name: "project-filter",
    created() {
      if (this.currentCategory !== -1)
         this.categories[this.currentCategory].selected = true;
    },
    computed: {
      ...mapGetters(["currentCategory"])
    },
    data() {
      return {
        categories: [
          {
            name: "Веб",
            selected: false
          },
          {
            name: "Мобильное",
            selected: false
          },
          {
            name: "Десктопное",
            selected: false
          },
          {
            name: "Игра",
            selected: false
          },
          {
            name: "Прочее",
            selected: false
          }
        ]
      }
    },
    methods: {
      resetCategory() {
        this.$store.dispatch("FILTER_PROJECTS", -1);
      },

      resetSelection() {
        this.categories.map(category => category.selected = false);
      },

      selectCategory(category, index) {
        if (category.selected) {
          category.selected = false;
          this.resetCategory();
        }
			else {
			  this.resetSelection();
			  category.selected = true;
			  this.$store.dispatch("FILTER_PROJECTS", index)
        }
      }
    }
  }
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
		-webkit-transition: background-color .2s ease-out;
		-moz-transition: background-color .2s ease-out;
		-o-transition: background-color .2s ease-out;
		transition: background-color .2s ease-out;
		cursor: pointer;
	}

	.categories__item--activated {
		background-color: #2980b9;
	}

	.categories__item:hover {
		border: 1px dashed white;
	}
</style>