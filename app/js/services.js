'use strict';

/* Services */

angular.module('LodSite.services', [])

  .service('TokenService', ['$rootScope', function ($rootScope) {
    var HOURS = 24;
    var TOKEN_VALIDITY = 3600 * 1000 * HOURS;
    var self = this;

    this.setToken = function (token) {
      localStorage.setItem('authorization_token', JSON.stringify(token));
      $rootScope.$emit('userRole_changed', {
        userRole: token.Role
      });
    };

    this.getToken = function () {
      return JSON.parse(localStorage.getItem('authorization_token'));
    };

    this.refreshTokenDate = function () {
      var now = new Date();
      var token = self.getToken();
      if (token) {
        token.CreationTime = now.toISOString();
        self.setToken(token);
      }
    };

    this.resetToken = function () {
      localStorage.removeItem('authorization_token');
    };

    this.getRole = function () {
      var token = self.getToken();
      if (!token) return 0;
      var now = (new Date()).getMilliseconds();
      var tokenCreationTime = Date.parse(token.CreationTime);
      if (now - tokenCreationTime > TOKEN_VALIDITY) {
        self.resetToken();
        return 0;
      } else {
        self.refreshTokenDate();
        return token.Role;
      }
    };
  }])

  .service('ApiService', ['$http', 'TokenService', '$rootScope', function ($http, TokenService, $rootScope) {
    var GET = 'get';
    var POST = 'post';

    var sendRequest = function (method, url, requestParams, requestData) {
      var userRole = TokenService.getRole();

      switch (method) {
        case 'get':
          return $http({
            method: 'GET',
            url: url,
            params: requestParams,
            headers: userRole === 0 ? {} : {
              'Authorization': 'Basic ' + TokenService.getToken().Token
            }
          }).then(
            function successCallback(response) {
              TokenService.refreshTokenDate();
              return response.data;
            },
            function errorCallback(response) {
              if (response.status === 401) {
                TokenService.resetToken();
              }
            });
          break;

        case 'post':
          return $http({
            method: 'POST',
            url: url,
            data: requestData,
            headers: userRole === 0 ? {} : {
              'Authorization': TokenService.getToken().Token
            }
          }).then(
            function successCallback(response) {
              return {
                data: response.data,
                isSuccess: true
              };
            },
            function errorCallback() {
              if (response.status === 401) {
                TokenService.resetToken();
              }
              return false;
            });
      }
    };

    // ApiService methods
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

      return sendRequest(POST, apiUrl, null, requestData).then(function (responseObject) {
        TokenService.setToken(responseObject.data);
        return responseObject.isSuccess;
      });
    };

    this.addProject = function (requestData) {
      var apiUrl = 'http://api.lod-misis.ru/projects';

      return sendRequest(POST, apiUrl, null, requestData);
    };
  }])
;