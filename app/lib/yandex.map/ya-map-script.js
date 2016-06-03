ymaps.ready(init);
var map, collection, polylines;

function init() {
  map = new ymaps.Map("map", {
      center: [55.72667388793981, 37.60625375300586],
      zoom: 17,
      size: [null, 450],
      lang: "",
      type: "yandex#map",
      traffic: {"shown": false}
    },
    {
      suppressMapOpenBlock: true
    });

  placeMark = new ymaps.Placemark(
    [55.726393150886125, 37.606740556111525],
    {
      hintContent: 'Лига Разработчиков (5й этаж, Г-588)',
      balloonContent: 'Лига Разработчиков (5й этаж, Г-588)',
    },
    {
      preset: "islands#orangeDotIcon"
    }
  );


  collection = new ymaps.GeoObjectCollection();
  polylines = [
    new ymaps.Placemark(
      [55.726393150886125, 37.606740556111525],
      {
        hintContent: 'Лига Разработчиков (5й этаж, Г-588)',
        balloonContent: 'Лига Разработчиков (5й этаж, Г-588)',
      },
      {
        preset: "islands#orangeDotIcon"
      }
    ),
    new ymaps.GeoObject({
        geometry: {
          type: "LineString",
          coordinates: [[
            55.72696229923229,
            37.607824168555936
          ],
            [
              55.726529384354315,
              37.606568894736974
            ]]
        },
        properties: {
          hintContent: "Путь из корпуса \"А\"",
          balloonContent: "Путь из корпуса \"А\"",
        }
      },
      {
        strokeColor: "#177bc9",
        strokeWidth: 5
      }
    ),
    new ymaps.GeoObject({
        geometry: {
          type: "LineString",
          coordinates: [[
            55.72851118975991,
            37.60874775027792
          ],
            [
              55.728526325960175,
              37.60895696258108
            ],
            [
              55.72796628285632,
              37.60994401549855
            ],
            [
              55.72665544769674,
              37.60768559550788
            ],
            [
              55.72690066502515,
              37.607229619975406
            ],
            [
              55.726534352164826,
              37.606559067721726
            ]]
        },
        properties: {
          hintContent: "Путь от главного входа НИТУ МИСиС",
          balloonContent: "Путь от главного входа НИТУ МИСиС",
        }
      },
      {
        strokeColor: "#1e98ff",
        strokeWidth: 5
      }),
    new ymaps.GeoObject({
        geometry: {
          type: "LineString",
          coordinates: [[
            55.72652303781649,
            37.60654812898927
          ],
            [
              55.7264594624862,
              37.60643011179261
            ]]
        }
      },
      {
        strokeColor: "#b3b3b3",
        strokeWidth: 3
      }),
    new ymaps.GeoObject({
        geometry: {
          type: "LineString",
          coordinates: [[
            55.72690563942714,
            37.60720795240702
          ],
            [
              55.72713874578818,
              37.60679489221874
            ],
            [
              55.72670280548235,
              37.60600632276835
            ],
            [
              55.726336490751585,
              37.60665541734995
            ],
            [
              55.72639401146243,
              37.6067519768745
            ]]
        },
        properties: {
          hintContent: "Проход через главный корпус Горного института (корпуса соединены проходом на втором и третьем этажах)",
          balloonContent: "Проход через главный корпус Горного института (корпуса соединены проходом на втором и третьем этажах)",
        }
      },
      {
        strokeColor: "#b3b3b3",
        strokeWidth: 3
      })
  ];

  for (var i = 0; i < polylines.length; i++) {
    collection.add(polylines[i]);
  }

  map.geoObjects.add(collection);
}