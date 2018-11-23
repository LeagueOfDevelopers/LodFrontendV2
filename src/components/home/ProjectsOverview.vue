<template>
	<section class="projects-section">
		<project-small-cards-row :projects="projects"/>
		<router-link :to="{ name: 'projects' }" tag="a"
		             class="projects-section__see-all-button button-style">
			Смотреть всех
		</router-link>
	</section>
</template>

<script>
import ProjectSmallCardsRow from "../reusable/cards/project/ProjectSmallCardsRow.vue";

export default {
  components: {
    ProjectSmallCardsRow
  },
  props: {
    projects: {
      type: Array,
      required: true,
      default: () => []
    }
  }
};
</script>
