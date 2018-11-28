<template>
  <div class="wrapper about-wrapper">
  <div class="about-heading">
    <div class="about-logo"></div>
    <div class="dividing-line"></div>
  </div>
  <div class="about-wrap-content">
    <div class="about-content">
      <div class="about-points">
        <div class="about-numbers left-number">1</div>
        <div class="about-text first-text">
          <p class="heading">О нас</p>

          <p class="text">
            Мы — студенты НИТУ "МИСиС", выбравшие IT в качестве сферы профессионального развития.
            В Лиге Разработчиков мы работаем над программными проектами в таких сферах как: веб,
            мобильные платформы, десктоп, серверные приложения, игры. Мы не ограничиваем себя и
            не стоим на месте, постоянно развиваемся и ищем новые сферы применения своих способностей.
          </p>
        </div>
      </div>
      <div class="lines">
        <div class="line-1-2 block-1"></div>
        <div class="line-1-2 block-2"></div>
      </div>
      <div class="about-points">
        <div class="about-numbers right-number">2</div>

        <div class="about-text left-text">
          <p class="heading">Цель</p>

          <p class="text">
            Цель организации — собрать всех мотивированных и целеустремлённых студентов для того,
            чтобы вырастить из них IT специалистов. При поддержке Лиги наши студенты работают над
            реальными или приближенными к реальности проектами разного масштаба, учатся работать
            в команде и доводить своё дело до конца. Мы проходим путь, который должен пройти
            каждый разработчик и к концу обучения в институте мы становимся опытными, готовыми
            к работе специалистами, которых так не хватает на рынке труда.
          </p>
        </div>
      </div>
      <div class="lines">
        <div class="line-2-3 block-1"></div>
        <div class="line-2-3 block-2"></div>
      </div>
      <div class="about-points">
        <div class="about-numbers left-number">3</div>
        <div class="about-text right-text">
          <p class="heading">Как появилась организация?</p>

          <p class="text">
            Организация была основана в сентябре 2014 года студентом института информационных технологий
            и автоматизированных систем управления Маргеловым Виталием. При минимальной поддержке
            от руководства института организация вовлекла в разработку более тридцати студентов,
            привлекла внимание многих подразделений "МИСиС", приняла участие в работе над множеством
            проектов различного уровня сложности
          </p>
        </div>
      </div>
      <div class="lines">
        <div class="line-3-4 block-1"></div>
        <div class="line-3-4 block-2"></div>
      </div>
      <div class="about-points">
        <div class="about-numbers right-number">4</div>
        <div class="about-text left-text">
          <p class="heading">К кому обращаться для сотрудничества?</p>

          <p class="text">
            Лига Разработчиков ищет неравнодушных людей, готовых вступить в её ряды или открытых для
            сотрудничества в сфере разработки ПО и IT-образования. Для того, чтобы связаться с руководством,
            воспользуйтесь
            <a ui-sref="contact">формой обратной связи</a>,
            для вступления в ряды разработчиков -
            <a ui-sref="signup">зарегистрируйтесь на сайте</a>.
          </p>
        </div>
      </div>
      <div class="lines">
        <div class="line-4-5 block-1"></div>
        <div class="line-4-5 block-2"></div>
      </div>
      <div class="about-points">
        <div class="about-numbers left-number">5</div>
        <div class="about-text right-text">
          <p class="heading">Обучение и побочная деятельность</p>

          <p class="text">
            Помимо основной деятельности, связанной с работой над проектами, мы
            организовываем обучение для новых членов организации, предоставляя им возможность
            приступить к работе подготовленными. Кроме этого, мы постоянно ищем новые источники
            для образования, привлекаем лекторов и преподавателей для сессионных мероприятий и обучающих курсов
            Участники Лиги - нередкие гости хакатонов и конкурсов разработчиков. В 2015 команда Лиги одержала победу
            в хакатоне "Культурный код", посвящённом кино.
          </p>
        </div>
      </div>
      <div class="lines">
        <div class="line-1-2 block-1"></div>
        <div class="line-1-2 block-2"></div>
      </div>
      <div class="about-points">
        <div class="about-numbers right-number">6</div>
        <div class="about-text last-text">
          <p class="heading">Как нас найти?</p>

          <p class="text">
            Наш офис находится в Лингвистическом корпусе Горного Института, аудитория Г-588.
            Попав в корпус, пройдите турникет, поверните направо и снова направо.
            По лестнице или на лифте поднимитесь на пятый этаж. Выйдя с лестничной клетки пройдите по
            коридору налево. Идите прямо до тех пор, пока не обнаружите с правой стороны коридора дверь
            с номером Г-588. Вы на месте!
          </p>
        </div>
      </div>

      <div id="map" class="about-yandex-map"></div>

    </div>
  </div>
</div>
</template>

<script>
export default {
  created() {
    ymaps.ready(function() {
      var map = new ymaps.Map(
        "map",
        {
          center: [55.72667388793981, 37.60625375300586],
          zoom: 17,
          size: [null, 450],
          lang: "",
          type: "yandex#map",
          traffic: { shown: false }
        },
        {
          suppressMapOpenBlock: true
        }
      );
      const collection = new ymaps.GeoObjectCollection();
      const polylines = [
        new ymaps.Placemark(
          [55.726393150886125, 37.606740556111525],
          {
            hintContent: "Лига Разработчиков (5й этаж, Г-588)",
            balloonContent: "Лига Разработчиков (5й этаж, Г-588)"
          },
          {
            preset: "islands#orangeDotIcon"
          }
        ),
        new ymaps.GeoObject(
          {
            geometry: {
              type: "LineString",
              coordinates: [
                [55.72696229923229, 37.607824168555936],
                [55.726529384354315, 37.606568894736974]
              ]
            },
            properties: {
              hintContent: 'Путь из корпуса "А"',
              balloonContent: 'Путь из корпуса "А"'
            }
          },
          {
            strokeColor: "#177bc9",
            strokeWidth: 5
          }
        ),
        new ymaps.GeoObject(
          {
            geometry: {
              type: "LineString",
              coordinates: [
                [55.72851118975991, 37.60874775027792],
                [55.728526325960175, 37.60895696258108],
                [55.72796628285632, 37.60994401549855],
                [55.72665544769674, 37.60768559550788],
                [55.72690066502515, 37.607229619975406],
                [55.726534352164826, 37.606559067721726]
              ]
            },
            properties: {
              hintContent: "Путь от главного входа НИТУ МИСиС",
              balloonContent: "Путь от главного входа НИТУ МИСиС"
            }
          },
          {
            strokeColor: "#1e98ff",
            strokeWidth: 5
          }
        ),
        new ymaps.GeoObject(
          {
            geometry: {
              type: "LineString",
              coordinates: [
                [55.72652303781649, 37.60654812898927],
                [55.7264594624862, 37.60643011179261]
              ]
            }
          },
          {
            strokeColor: "#b3b3b3",
            strokeWidth: 3
          }
        ),
        new ymaps.GeoObject(
          {
            geometry: {
              type: "LineString",
              coordinates: [
                [55.72690563942714, 37.60720795240702],
                [55.72713874578818, 37.60679489221874],
                [55.72670280548235, 37.60600632276835],
                [55.726336490751585, 37.60665541734995],
                [55.72639401146243, 37.6067519768745]
              ]
            },
            properties: {
              hintContent:
                "Проход через главный корпус Горного института (корпуса соединены проходом на втором и третьем этажах)",
              balloonContent:
                "Проход через главный корпус Горного института (корпуса соединены проходом на втором и третьем этажах)"
            }
          },
          {
            strokeColor: "#b3b3b3",
            strokeWidth: 3
          }
        )
      ];

      for (var i = 0; i < polylines.length; i++) {
        collection.add(polylines[i]);
      }
      map.geoObjects.add(collection);
    });
  }
};
</script>

<style>
</style>
