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

    //methods for developers
    this.getRandomDevelopers = function (numberOfDevelopers) {
      var apiUrl = 'http://api.lod-misis.ru/developers/random/' + numberOfDevelopers;
      return $http.get(apiUrl).then(
        function successCallback(response) {
          return response.data;
        },
        function errorCallback(response) {
          console.log(response.status);
        });
    };
    this.getFullDevelopers = function () {
      var apiUrl = 'http://api.lod-misis.ru/developers';

      return $http.get(apiUrl).then(
        function successCallback(response) {
          function changeDateFormat() {
            var dateOptions = {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            };
            for (var i = 0; i < response.data.length; i++) {
              var formattedDate = new Date(Date.parse(response.data[i].RegistrationDate));
              response.data[i].RegistrationDate = formattedDate.toLocaleString("ru", dateOptions);
              if (response.data[i].PhotoUri == null) {
                response.data[i].PhotoUri = '/app/imgs/developer-default-photo.png';
              }
            }
          }

          changeDateFormat();
          return response.data;
        },
        function errorCallback(response) {
          console.log(response.status);
        });
    };
    this.getFullDevelopersBySearch = function(searchText) {
      var apiUrl = 'http://api.lod-misis.ru/developers/search/' + searchText;
      return $http.get(apiUrl).then(
        function successCallback(response) {
          function changeDateFormat() {
            var dateOptions = {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            };
            for (var i = 0; i < response.data.length; i++) {
              var formattedDate = new Date(Date.parse(response.data[i].RegistrationDate));
              response.data[i].RegistrationDate = formattedDate.toLocaleString("ru", dateOptions);
              if (response.data[i].PhotoUri == null) {
                response.data[i].PhotoUri = '/app/imgs/developer-default-photo.png';
              }
            }
          }

          changeDateFormat();
          return response.data;
        },
        function errorCallback(response) {
          console.log(response.status);
        });
    };
    this.getDeveloper = function (developerId) {
      var apiUrl = 'http://api.lod-misis.ru/developers/' + developerId;

      return $http.get(apiUrl).then(function successCallback(response) {
          function changeDateFormat(){
            var dateOptions = {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            };
            var formattedDate = new Date(Date.parse(response.data.RegistrationDate));
            response.data.RegistrationDate = formattedDate.toLocaleString("ru", dateOptions);
          }
          function setCap(){
            if (response.data.PhotoUri == null) {
              response.data.PhotoUri = '/app/imgs/developer-default-photo.png';
            }
          }
          function setStudyingYear() {
            var date = new Date();
            response.data.studyingYear = date.getFullYear() - response.data.StudentAccessionYear || 1;
          }

          changeDateFormat();
          setCap();
          setStudyingYear();

          return response.data;
        },
        function errorCallback(response) {
          console.log(response.status);
        });
    };

    //methods for projects
    this.getRandomProjects = function (numberOfProjects) {
      var apiUrl = 'http://api.lod-misis.ru/projects/random/' + numberOfProjects;
      return $http.get(apiUrl).then(
        function successCallback(response) {
          return response.data;
        },
        function errorCallback(response) {
          console.log(response.status);
        });

    };
    this.getFullProjects = function (requestParams) {
      var apiUrl = 'http://api.lod-misis.ru/projects';
      return $http.get(apiUrl,{params: requestParams}).then(
        function successCallback(response) {
          return response.data;
        },
        function errorCallback(response) {
          console.log(response.status);
        });

    };
    this.getProject = function (projectId) {
      var apiUrl = 'http://api.lod-misis.ru/projects/' + projectId;

      return $http.get(apiUrl).then(
        function successCallback(response) {
          return response.data;
        },
        function errorCallback(response) {

        });

    };

    //other
    this.registerNewDeveloper = function (requestData) {
      var apiUrl = 'http://api.lod-misis.ru/developers';
      return $http.post(apiUrl,{ data: requestData}).then(
        function successCallback() {
          return true;
        },
        function errorCallback() {
          return false;
        });

    };
    this.signIn = function (requestData) {
      var apiUrl = 'http://api.lod-misis.ru/developers/authorize';
      return $http.get(apiUrl,{data: requestData}).then(
        function successCallback() {
          return true;
        },
        function errorCallback() {
          return false;
        });
    };
  }])
;