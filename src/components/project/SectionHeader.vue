<template>
  <div class="section-header">
    <h1 class="section-header__text">{{ text }}</h1>
  </div>
</template>

<script>
export default {
  name: "SectionHeader",
  props: {
    text: String
  }
};
</script>

<style lang="less" scoped>
.section-header {
  &__text {
    padding: 15px 0;
    margin-bottom: 10px;
    font-size: 1.8em;
    font-family: "Noto Serif", serif;
    font-weight: bold;
    text-align: center;
    color: #202d3a;
    border-bottom: 1px solid #202d3a;

    @media (max-width: 640px) {
      font-size: 1.5em;
    }
  }
}
</style>
