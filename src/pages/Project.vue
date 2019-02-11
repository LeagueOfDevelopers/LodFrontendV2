<template>
  <div class="full-project-container">
    <h1 class="full-project__name">Project name</h1>

    <div class="full-project-wrapper">
      <div class="full-project__preview" style='background: url(https://pay.google.com/about/static/images/social/knowledge_graph_logo.png) no-repeat center; background-size: cover'>
        <span class="preview__project-status">
          <span
            class="status__value"
            style="background: #795548;"
          >Запланирован</span>
          <!-- <span
            class="status__value"
            style="background: #1e88e5;"
          >В процессе</span>
          <span
            class="status__value"
            style="background: #607d8b;"
          >Заморожен</span>
          <span
            class="status__value"
            style="background: #009688;"
          >Завершен</span> -->
        </span>
      </div>
      <div class="full-project__info">
        <div class="info__subheading">Тип проекта:</div>
        <div class="info__project-types">
          <span class="project-types__type">
            <span>Прочее</span>
          </span>
        </div>
        <div class="info__subheading">Описание:</div>
        <div class="info__description">Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda, error.</div>
        <div class="info__subheading">Разработчики:</div>
        <div class="info__developers">
          <a>Name Surname</a>
          <span> (Backend) </span>
        </div>

        <div
          class="info__if-no-developers"
          style="color:#a4a4a4"
        ></div>
        <div class="info__subheading">Уровень доступа:</div>
        <div class="info__access">
          <span>Открытый</span>
        </div>
        <div class="info__links">Проект в <a href="#">Redmine</a> и <a href="#">Gitlab</a>
        </div>
        <div>
          <form name="projectMembershipForm">
            <input
              class="info__developer-role-input"
              type="text"
              required
              placeholder="Роль в проекте"
            >
            <button class="info__membership-button">Присоединиться
            </button>
            <button class="info__membership-button">
              Покинуть проект
            </button>
          </form>
        </div>
      </div>
    </div>
    <h1 class="full-project__headline headline">Задачи на проекте</h1>

    <div class="dividing-line"></div>
    <div class="full-project-issues">
      <span class="project-issues__issue">jkdsdsjk</span>
      <span class="project-issues__issue">jkdsdsjk</span>
      <span class="project-issues__issue">jkdsdsjk</span>
      <span class="project-issues__issue">jkdsdsjk</span>
      <span class="project-issues__issue">jkdsdsjk</span>
    </div>
    <h1 class="full-project__headline headline">Скриншоты</h1>

    <div class="dividing-line"></div>
    <div class='gallery'>
      <div
        class="gallery__item"
        style='background: url(https://pay.google.com/about/static/images/social/knowledge_graph_logo.png) no-repeat center; background-size: cover'
      ></div>
      <div
        class="gallery__item"
        style='background: url(https://pay.google.com/about/static/images/social/knowledge_graph_logo.png) no-repeat center; background-size: cover'
      ></div>
      <div
        class="gallery__item"
        style='background: url(https://pay.google.com/about/static/images/social/knowledge_graph_logo.png) no-repeat center; background-size: cover'
      ></div>
      <div
        class="gallery__item"
        style='background: url(https://pay.google.com/about/static/images/social/knowledge_graph_logo.png) no-repeat center; background-size: cover'
      ></div>
      <div
        class="gallery__item"
        style='background: url(https://pay.google.com/about/static/images/social/knowledge_graph_logo.png) no-repeat center; background-size: cover'
      ></div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
</style>
