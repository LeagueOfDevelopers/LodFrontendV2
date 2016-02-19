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

    this.sendPostRequest = function (apiUrl, requestData) {
      return $http({
        method: 'POST',
        url: apiUrl,
        data: requestData
      }).then(function successCallback() {
        return true;
      }, function errorCallback(response) {
        console.log("Данные не отправлены: " + response.status, response.statusText);
      });
    };
    this.sendGetRequest = function (apiUrl, requestParams) {
      return $http({
        method: 'GET',
        url: apiUrl,
        params: requestParams
      }).then(function successCallback(response) {
        return response.data;
      }, function errorCallback(response) {
        console.log("Данные не получены: " + response.status, response.statusText);
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

    //other
    this.registerNewDeveloper = function (requestData) {
      var apiUrl = 'http://api.lod-misis.ru/developers';
      return sendPostRequest(apiUrl, requestData);
    };
    this.signIn = function (requestData) {
      var apiUrl = 'http://api.lod-misis.ru/developers/authorize';
      return sendPostRequest(apiUrl, requestData);
    }
  }])
;