<template>
  <div class="developer-page">
    <div class="developer-confirmation-status">
      <!-- <span style="color: #ccc;">Подтверждена почта</span> -->
      <span style="color: #ccc;">Подтверждён администратором</span>
      <!-- <span style="color: #ccc;">Не подтверждён</span> -->
    </div>
    <div
      class="developer-photo"
      style="background: url('https://proxy.duckduckgo.com/iu/?u=http%3A%2F%2Fdeveloper.amd.com%2Fwordpress%2Fmedia%2F2012%2F09%2FDeveloperImage.png&f=1'); 
      background-position: center center;
      background-repeat: no-repeat; 
      background-size: cover"
    ></div>
    <div class="developer-name">name</div>
    <div class="developer-role">Backend-разработчик</div>

    <div class="dividing-line"></div>

    <DeveloperInfo />

    <div class="dividing-line"></div>
    
    <h1 class="developer-page__headline headline">Портфолио</h1>

    <div class="developer-projects">
      <div class="projects-section-container">
        <a class="projects-section__link-to-project">
          <div class="projects-section__project">
            <div
              style="background: url('https://africanreporter.co.za/wp-content/uploads/sites/32/2016/03/pic.jpg';
              background-position: center center;
              background-repeat: no-repeat;
              background-size: cover;"
              class="project__background"
            ></div>
            <div class="project__info-container">
              <div class="project__name"></div>
              <div class="project__status">Cтатус:
                <span>
                  <!-- <span
                    class="status__value"
                    style="background: #795548;"                    
                  >Запланирован</span>
                  <span
                    class="status__value"
                    style="background: #1e88e5;"                    
                  >В процессе</span>
                  <span
                    class="status__value"
                    style="background: #607d8b;"                    
                  >Заморожен</span> -->
                  <span
                    class="status__value"
                    style="background: #009688;"
                  >Завершен</span>
                </span>
              </div>
              <div class="project__developer-role"><b>Роль разработчика:</b></div>
              <div class="project__developer-role-text">Backend</div>
            </div>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import DeveloperInfo from "../components/profile/DeveloperInfo";

export default {
  name: "Profile",
  components: {
    DeveloperInfo
  }
};
</script>

<style lang="less" scoped>

</style>

