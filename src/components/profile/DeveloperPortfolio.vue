<template>
  <div class="developerPortfolio">
    <h1 class="developerPortfolio-header">Портфолио</h1>
    <div class="developerPortfolio-projects">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: "DeveloperPortfolio"
};
</script>

<style lang="less" scoped>
.developerPortfolio {
  &-header {
    font-size: 2em;
    font-family: "Noto Serif", serif;
    padding-left: 1%;
    margin-bottom: 15px;
  }
  &-projects {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -1%;
    margin-bottom: 20px;
  }
}
</style>
