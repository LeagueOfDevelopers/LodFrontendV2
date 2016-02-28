'use strict';

/* Services */

angular.module('LodSite.services', [])

  .service('TokenService', function () {

    this.saveToken = function (token) {

    };
    this.getToken = function () {

    };
    this.resetToken = function () {

    };
    this.refreshTokenDate = function () {

    };
    this.getRole = function () {

    };

  })

  .service('ApiService', ['$http', function ($http) {
    var GET = 'get';
    var POST = 'post';

    // ApiService methods
    var sendRequest = function (method, url, requestParams, requestData) {
      switch (method) {
        case 'get':
          return $http.get(url, {params: requestParams}).then(
            function successCallback(response) {
              return response.data;
            },
            function errorCallback(response) {
              console.log(response.status);
            });
          break;

        case 'post':
          return $http.post(url, requestData).then(
            function successCallback() {
              return true;
            },
            function errorCallback() {
              return false;
            });
      }
    };

    this.getRandomDevelopers = function (numberOfDevelopers) {
      var apiUrl = 'http://api.lod-misis.ru/developers/random/' + numberOfDevelopers;

      return sendRequest(GET, apiUrl);
    };
    this.getFullDevelopers = function () {
      var apiUrl = 'http://api.lod-misis.ru/developers';

      return sendRequest(GET, apiUrl).then(function setImageCap(data) {
        for (var i = 0; i < data.length; i++) {
          if (data[i].PhotoUri == null) {
            data[i].PhotoUri = '/app/imgs/developer-default-photo.png';
          }
        }
        return data;
      });
    };
    this.getFullDevelopersBySearch = function (searchText) {
      var apiUrl = 'http://api.lod-misis.ru/developers/search/' + searchText;

      return sendRequest(GET, apiUrl).then(function setImageCap(data) {
        for (var i = 0; i < data.length; i++) {
          if (data[i].PhotoUri == null) {
            data[i].PhotoUri = '/app/imgs/developer-default-photo.png';
          }
        }
        return data;
      });
    };
    this.getDeveloper = function (developerId) {
      var apiUrl = 'http://api.lod-misis.ru/developers/' + developerId;

      return sendRequest(GET, apiUrl)
        .then(function setImageCap(data) {
          if (data.PhotoUri == null) {
            data.PhotoUri = '/app/imgs/developer-default-photo.png';
          }
          return data;
        })
        .then(function setStudyingYear(data) {
          var date = new Date();
          data.studyingYear = date.getFullYear() - data.StudentAccessionYear || 1;
          return data;
        });
    };

    this.getRandomProjects = function (numberOfProjects) {
      var apiUrl = 'http://api.lod-misis.ru/projects/random/' + numberOfProjects;

      return sendRequest(GET, apiUrl);
    };
    this.getFullProjects = function (requestParams) {
      var apiUrl = 'http://api.lod-misis.ru/projects';

      return sendRequest(GET, apiUrl, requestParams);
    };
    this.getProject = function (projectId) {
      var apiUrl = 'http://api.lod-misis.ru/projects/' + projectId;

      return sendRequest(GET, apiUrl);
    };

    this.signUp = function (requestData) {
      var apiUrl = 'http://api.lod-misis.ru/developers';

      return sendRequest(POST, apiUrl, null, requestData);
    };
    this.signIn = function (requestData) {
      var apiUrl = 'http://api.lod-misis.ru/login';

      return sendRequest(POST, apiUrl, null, requestData);
    };
  }])
;