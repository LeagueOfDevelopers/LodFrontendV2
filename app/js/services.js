'use strict';

/* Services */

angular.module('LodSite.services', [])

  //.service('TokenService', function () {
  //
  //  this.saveToken = function (token) {
  //
  //  };
  //  this.getToken = function () {
  //
  //  };
  //  this.resetToken = function () {
  //
  //  };
  //  this.refreshTokenDate = function () {
  //
  //  };
  //  this.getRole = function () {
  //
  //  };
  //
  //})

  .service('ApiService', ['$http', function ($http) {

    var sendPostRequest = function (apiUrl, requestData) {
      return $http({
        method: 'POST',
        url: apiUrl,
        data: requestData
      }).then(function successCallback() {
        return true;
      }, function errorCallback(response) {
      });
    };
    var sendGetRequest = function (apiUrl, requestParams) {
      return $http({
        method: 'GET',
        url: apiUrl,
        params: requestParams
      }).then(function successCallback(response) {
        return response.data;
      }, function errorCallback(response) {
      });
    };

    //methods for developers
    this.getRandomDevelopers = function (numberOfDevelopers) {
      var apiUrl = 'http://api.lod-misis.ru/developers/random/' + numberOfDevelopers;
      return sendGetRequest(apiUrl);
    };
    this.getFullDevelopers = function () {
      var apiUrl = 'http://api.lod-misis.ru/developers';
      return sendGetRequest(apiUrl);
    };
    this.getDeveloper = function (developerId) {
      var apiUrl = 'http://api.lod-misis.ru/developers/' + developerId;
      return sendGetRequest(apiUrl);
    };

    //methods for projects
    this.getRandomProjects = function (numberOfProjects) {
      var apiUrl = 'http://api.lod-misis.ru/projects/random/' + numberOfProjects;
      return sendGetRequest(apiUrl);
    };
    this.getFullProjects = function (requestParams) {
      var apiUrl = 'http://api.lod-misis.ru/projects';
      return sendGetRequest(apiUrl, requestParams);
    };
    this.getProject = function (projectId) {
      var apiUrl = 'http://api.lod-misis.ru/projects/' + projectId;
      return sendGetRequest(apiUrl);
    };
    this.testGetProject = function (projectId) {
      return {
        "ProjectId": projectId,
        "Name": "Movie-Extended",
        "ProjectType": [
          1
        ],
        "AccessLevel": 1,
        "Info": "На самом то деле Уилл никуда и не уходил, просто все это время он сидел в ожидании того, когда же Лемми закончит работу с кодом NPC, чтобы наконец приступить к работе. Пока Лемми занимался кодом, Уилл тоже не сидел без дела и (судя по тому как я, не проф. переводчик, понял) помогал с написанием диалогов в грядущей игре Alien: Isolation. Я считаю что это действительно здорово.",
        "ProjectStatus": 3,
        "LandingImageUri": "http://cs625427.vk.me/v625427159/38702/L52mg3iPI8I.jpg",
        "VersionControlSystemUri": "http://85.143.104.47:1080/10",
        "ProjectManagementSystemUri": "http://gitlab.lod-misis.ru/2",
        "Issues": [
          {
            "Header": "Идти туда, не знаю куда",
            "Descripton": "",
            "IssueType": 0
          },
          {
            "Header": "Сделать то, не знаю что",
            "Descripton": "",
            "IssueType": 0
          },
          {
            "Header": "Мдам мда бла бла",
            "Descripton": "",
            "IssueType": 0
          }
        ],
        "ProjectMemberships": [
          {
            "DeveloperId": 4,
            "FirstName": "Boris",
            "LastName": "Valdis",
            "Role": "Something"
          },
          {
            "DeveloperId": 5,
            "FirstName": "Grebaniy",
            "LastName": "Bashkir",
            "Role": "Somethiiing else"
          }
        ],
        "Screenshots": [
          "http://cs629210.vk.me/v629210352/1098a/bKMNLZX2XiQ.jpg",
          "http://cs543108.vk.me/v543108934/9e78/jo-124CHV7w.jpg",
          "http://cs540106.vk.me/v540106472/425ec/gHHiLb4-Fg4.jpg",
          "http://cs623918.vk.me/v623918923/1686a/45a0fmChyKI.jpg"
        ]
      }
    };

    //other
    this.registerNewDeveloper = function (requestData) {
      var apiUrl = 'http://api.lod-misis.ru/developers';
      return sendPostRequest(apiUrl, requestData);
    };
    this.signIn = function (requestData) {
      var apiUrl = 'http://api.lod-misis.ru/developers/authorize';
      return sendPostRequest(apiUrl, requestData);
    };
  }])
;