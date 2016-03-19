'use strict';

/* Services */

angular.module('LodSite.services', [])

       .service('TokenService', ['$rootScope', '$state', function ($rootScope, $state) {
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
         var PUT = 'put';

         // requests
         var sendRequest = function (method, apiUrl, requestParams, requestData, tokenValue) {
           var requestConfig = {
             method: method,
             url: apiUrl
           };
           if (tokenValue) {
             requestConfig.headers = {'Authorization': 'Basic ' + tokenValue};
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
           var apiUrl = DOMAIN_NAME + url;
           var userRole = TokenService.getRole();
           if (userRole !== false) {
             var token = TokenService.getToken().Token;
           }
           var responsePromise = sendRequest(method, apiUrl, requestParams, requestData, token);

           return responsePromise.then(
             function successCallback(response) {
               TokenService.refreshTokenDate();

               return response;
             },
             function errorCallback(response) {
               if (response.status === 401) {
                 TokenService.resetToken();
                 return sendRequest(method, apiUrl, requestParams, requestData, null).then(
                   function successCallback(response) {
                     TokenService.refreshTokenDate();

                     return response;
                   },
                   function errorCallback() {
                     return false;
                   }
                 );
               }

               return response;
             }
           );
         };


         // developers
         this.getRandomDevelopers = function (numberOfDevelopers) {
           var url = '/developers/random/' + numberOfDevelopers;

           return sendAuthorizationSaveRequest(GET, url).then(function (response) {
             return response.data;
           });
         };

         this.getFullDevelopers = function () {
           var url = '/developers';

           return sendAuthorizationSaveRequest(GET, url).then(function (response) {
             return response.data;
           });
         };

         this.getFullDevelopersBySearch = function (searchText) {
           var url = '/developers/search/' + searchText;

           return sendAuthorizationSaveRequest(GET, url).then(function (response) {
             return response.data;
           });
         };

         this.getDeveloper = function (developerId) {
           var url = '/developers/' + developerId;

           return sendAuthorizationSaveRequest(GET, url)
             .then(function (response) {
               var date = new Date();
               response.data.studyingYear = date.getFullYear() - response.data.StudentAccessionYear || 1;
               return response.data;
             });
         };

         this.getDeveloperForProfileSttings = function (developerId) {
           var url = '/developers/' + developerId;

           return sendAuthorizationSaveRequest(GET, url).then(function setImageCap(response) {
             if (response.data.BigPhotoUri == null) {
               response.data.BigPhotoUri = '/app/imgs/developer-default-photo.png';
             }

             return response.data;
           })
         };

         this.sendProfileSttings = function (developerId, requestData) {
           var url = '/developers/' + developerId;

           return sendAuthorizationSaveRequest(PUT, url, null, requestData).then(function (response) {
             return response.status === 200;
           });
         };

         this.getNotificationsForProfileSttings = function (developerId) {
           var url = '/developers/notificationsettings/' + developerId;

           return sendAuthorizationSaveRequest(GET, url).then(function setImageCap(response) {
             return response.data;
           })
         };

         this.sendNotifications = function (developerId, requestData) {
           var url = '/developers/notificationsettings/' + developerId;

           return sendAuthorizationSaveRequest(PUT, url, null, requestData).then(function (response) {
             return response.status === 200;
           });
         };

         this.sendNewPassword = function (developerId, requestData) {
           var url = '/developers/password/' + developerId;

           return sendAuthorizationSaveRequest(PUT, url, null, requestData).then(function (response) {
             return response.data;
           });
         };


         // projects
         this.getRandomProjects = function (numberOfProjects) {
           var url = '/projects/random/' + numberOfProjects;

           return sendAuthorizationSaveRequest(GET, url).then(function (response) {
             return response.data;
           });
         };

         this.getFullProjects = function (requestParams, pageCounter) {
           var url = '/projects?page=' + pageCounter;

           return sendAuthorizationSaveRequest(GET, url, requestParams).then(function (response) {
             return response.data;
           });
         };

         this.getProject = function (projectId) {
           var url = '/projects/' + projectId;

           return sendAuthorizationSaveRequest(GET, url).then(function (response) {
             return response.data;
           });
         };

         this.addProject = function (requestData) {
           var url = '/projects';

           return sendRequest(POST, url, null, requestData).then(function (response) {
             return response.status === 200;
           });
         };

         this.joinToProject = function (projectId, userId, projectDeveloperRole) {
           var url = '/projects/' + projectId + '/developer/' + userId;

           return sendAuthorizationSaveRequest(POST, url, null, projectDeveloperRole);
         };

         this.escapeFromProject = function (projectId, userId) {
           var url = '/projects/' + projectId + '/developer/' + userId;

           return sendAuthorizationSaveRequest(DELETE, url);
         };


         // other
         this.signUp = function (requestData) {
           var url = '/developers';

           return sendAuthorizationSaveRequest(POST, url, null, JSON.stringify(requestData))
             .then(function (responseObject) {
               return responseObject;
             });
         };

         this.signIn = function (requestData) {
           var url = '/login';

           return sendAuthorizationSaveRequest(POST, url, null, requestData).then(function (responseObject) {
             if (responseObject.status === 200) {
               TokenService.setToken(responseObject.data);
             }

             return responseObject.status === 200;
           });
         };

       }])
;