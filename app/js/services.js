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
      $rootScope.$emit('userRole_changed', {
        userRole: self.getRole()
      });
    };

    this.getRole = function () {
      var token = self.getToken();
      if (!token) return false;
      var now = (new Date()).getMilliseconds();
      var tokenCreationTime = Date.parse(token.CreationTime);
      if (now - tokenCreationTime > TOKEN_VALIDITY) {
        self.resetToken();
        return false;
      } else {
        self.refreshTokenDate();
        return token.Role;
      }
    };
  }])

  .service('ApiService', ['$http', 'TokenService', '$rootScope', function ($http, TokenService) {
    var GET = 'get';
    var POST = 'post';
    var DELETE = 'delete';

    var sendRequest = function (method, url, requestParams, requestData, tokenValue) {
      var requestConfig = {
        method: method,
        url: url
      };
      if (tokenValue) {
        requestConfig.headers = { 'Authorization': 'Basic ' + tokenValue };
      }
      if (requestParams) {
        requestConfig.params = requestParams;
      }
      if (requestData) {
        requestConfig.data = requestData;
      }
      return $http(requestConfig);
    };
    var sendAuthorizationSaveRequest = function (method, url, requestParams, requestData) {
      var userRole = TokenService.getRole();
      if (userRole !== false) {
        var token = TokenService.getToken().Token;
      }
      var responsePromise = sendRequest(method, url, requestParams, requestData, token);

      return responsePromise.then(function successCallback(response) {
          TokenService.refreshTokenDate();
          return response;
        },
        function errorCallback(response) {
          if (response.status === 401) {
            TokenService.resetToken();
            return sendRequest(method, url, requestParams, requestData, null).then(function successCallback(response) {
                TokenService.refreshTokenDate();
                return response;
              },
              function errorCallback() {
                return false;
              });
          }
          return false;
        });
    };

    // ApiService methods
    this.getRandomDevelopers = function (numberOfDevelopers) {
      var apiUrl = 'http://api.lod-misis.ru/developers/random/' + numberOfDevelopers;

      return sendAuthorizationSaveRequest(GET, apiUrl).then(function (response) {
        return response.data;
      });
    };
    this.getFullDevelopers = function () {
      var apiUrl = 'http://api.lod-misis.ru/developers';

      return sendAuthorizationSaveRequest(GET, apiUrl).then(function setImageCap(response) {
        for (var i = 0; i < response.data.length; i++) {
          if (response.data[i].PhotoUri == null) {
            response.data[i].PhotoUri = '/app/imgs/developer-default-photo.png';
          }
        }
        return response.data;
      });
    };
    this.getFullDevelopersBySearch = function (searchText) {
      var apiUrl = 'http://api.lod-misis.ru/developers/search/' + searchText;

      return sendAuthorizationSaveRequest(GET, apiUrl).then(function setImageCap(response) {
        for (var i = 0; i < response.data.length; i++) {
          if (response.data[i].PhotoUri == null) {
            response.data[i].PhotoUri = '/app/imgs/developer-default-photo.png';
          }
        }
        return response.data;
      });
    };
    this.getDeveloper = function (developerId) {
      var apiUrl = 'http://api.lod-misis.ru/developers/' + developerId;

      return sendAuthorizationSaveRequest(GET, apiUrl)
        .then(function setImageCap(response) {
          if (response.data.PhotoUri == null) {
            response.data.PhotoUri = '/app/imgs/developer-default-photo.png';
          }
          return response.data;
        })
        .then(function setStudyingYear(data) {
          var date = new Date();
          data.studyingYear = date.getFullYear() - data.StudentAccessionYear || 1;
          return data;
        });
    };

    this.getRandomProjects = function (numberOfProjects) {
      var apiUrl = 'http://api.lod-misis.ru/projects/random/' + numberOfProjects;

      return sendAuthorizationSaveRequest(GET, apiUrl).then(function (response) {
        return response.data;
      });
    };
    this.getFullProjects = function (requestParams, pageCounter) {
      var apiUrl = 'http://api.lod-misis.ru/projects?page=' + pageCounter;

      return sendAuthorizationSaveRequest(GET, apiUrl, requestParams).then(function (response) {
        return response.data;
      });
    };
    this.getProject = function (projectId) {
      var apiUrl = 'http://api.lod-misis.ru/projects/' + projectId;

      return sendAuthorizationSaveRequest(GET, apiUrl).then(function (response) {
        return response.data;
      });
    };
    this.joinToProject = function (projectId, userId, projectDeveloperRole) {
      var apiUrl = 'http://api.lod-misis.ru/projects/' + projectId + '/developer/' + userId;
      return sendAuthorizationSaveRequest(POST, apiUrl, null, projectDeveloperRole);
    };
    this.escapeFromProject = function (projectId, userId) {
      var apiUrl = 'http://api.lod-misis.ru/projects/' + projectId + '/developer/' + userId;
      return sendAuthorizationSaveRequest(DELETE, apiUrl);
    };

    this.signUp = function (requestData) {
      var apiUrl = 'http://api.lod-misis.ru/developers';

      return sendAuthorizationSaveRequest(POST, apiUrl, null, requestData).then(function (response) {
        return response.data;
      });
    };
    this.signIn = function (requestData) {
      var apiUrl = 'http://api.lod-misis.ru/login';

      return sendAuthorizationSaveRequest(POST, apiUrl, null, requestData).then(function (responseObject) {
        TokenService.setToken(responseObject.data);
        return responseObject.data;
      });
    };

    this.addProject = function (requestData) {
      var apiUrl = 'http://api.lod-misis.ru/projects';

      return sendRequest(POST, apiUrl, null, requestData);
    };
  }])
;