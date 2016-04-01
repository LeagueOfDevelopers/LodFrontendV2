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


       .service('ApiService', ['$http',
         'TokenService',
         'DateService',
         '$rootScope',
         '$timeout',
         function ($http, TokenService, DateService, $rootScope, $timeout) {
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
             var apiUrl = API_DOMAIN_NAME + url;
             var userRole = TokenService.getRole();
             if (userRole !== false) {
               var token = TokenService.getToken().Token;
             }
             var responsePromise = sendRequest(method, apiUrl, requestParams, requestData, token);

             //show Spinner if request duration > 150ms
             $timeout(function onSpinner() {
               if($rootScope.dataLoading !== false){
                 $rootScope.dataLoading = true;
               }
             }, 150);

             return responsePromise
               .then(function successCallback(response) {
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
                 })
               .then(function offSpinner(response) { //off Spinner after getting request data
                 $rootScope.dataLoading = false;

                 return response;
               });
           };


           // developers
           this.getRandomDevelopers = function (numberOfDevelopers) {
             var url = '/developers/random/' + numberOfDevelopers;

             return sendAuthorizationSaveRequest(GET, url).then(function (response) {
               return response.data;
             });
           };

           this.getFullDevelopers = function (pageCounter) {
             var url = '/developers?page=' + pageCounter;

             return sendAuthorizationSaveRequest(GET, url).then(function (response) {
               return DateService.getFormattedTimeDevsList(response.data);
             });
           };

           this.getFullDevelopersBySearch = function (searchText) {
             var url = '/developers/search/' + searchText;

             return sendAuthorizationSaveRequest(GET, url).then(function (response) {
               return DateService.getFormattedTimeDevsList(response.data);
             });
           };

           this.getDeveloper = function (developerId) {
             var url = '/developers/' + developerId;

             return sendAuthorizationSaveRequest(GET, url)
               .then(function (response) {
                 var date = new Date();
                 var developer = response.data;
                 developer.studyingYear = date.getFullYear() - response.data.StudentAccessionYear || 1;

                 return DateService.getFormattedTimeDev(developer);
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
               return response.status === 200;
             });
           };

           this.developerConfirmation = function (token) {
             var url = '/developers/confirmation/' + token;

             return sendAuthorizationSaveRequest(POST, url, null, null).then(function (response) {
               return response.status === 200;
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

             return sendAuthorizationSaveRequest(POST, url, null, requestData).then(function (response) {
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

           this.order = function (requestData) {
             var apiUrl = 'http://api.lod-misis.ru/orders';

             return sendAuthorizationSaveRequest(POST, apiUrl, null, requestData).then(function (response) {
               return response.status === 200;
             });
           };

           this.contact = function (requestData) {
             var apiUrl = 'http://api.lod-misis.ru/contact';

             return sendAuthorizationSaveRequest(POST, apiUrl, null, requestData).then(function (response) {
               return response.status === 200;
             });
           };
         }])


       .service('DateService', [function () {
         var self = this;

         this.getFormattedTimeDev = function (developer) {
           developer.residenceTime = self.getFormattedTime(developer.RegistrationDate);

           return developer;
         };

         this.getFormattedTimeDevsList = function (developers) {
           for (var i = 0; i < developers.length; i++) {
             developers[i].residenceTime = self.getFormattedTime(developers[i].RegistrationDate);
           }

           return developers;
         };

         this.getFormattedTime = function (registrationDate) {
           var residenceTimeObject = self.getResidenceTimeObject(registrationDate);

           var formattedTime = 'первый день';

           var daysReminder = residenceTimeObject.days - residenceTimeObject.months * 30;
           var monthsReminder = residenceTimeObject.months -  residenceTimeObject.years * 12;

           var inclinedDayWord = getInclinedWord(residenceTimeObject.days, [' день', ' дня', ' дней']);
           var inclinedWeekWord = getInclinedWord(residenceTimeObject.weeks, [' неделю', ' недели', ' недель']);
           var inclinedMonthWord = getInclinedWord(residenceTimeObject.months, [' месяц', ' месяца', ' месяцев']);
           var inclinedYearWord = getInclinedWord(residenceTimeObject.years, [' год', ' года', ' лет']);
           var inclinedDaysRemainderWord = getInclinedWord(daysReminder, [' день', ' дня', ' дней']);
           var inclinedMonthsRemainderWord = getInclinedWord(monthsReminder, [' месяц', ' месяца', ' месяцев']);

           function getInclinedWord(value, declensionArray) {
             var cases = [2, 0, 1, 1, 1, 2];
             return declensionArray[(value % 100 > 4 && value % 100 < 20) ? 2 : cases[(value % 10 < 5) ? value % 10 : 5]];
           }

           if (residenceTimeObject.days < 20 && residenceTimeObject.days !== 0) {
             formattedTime = residenceTimeObject.days + inclinedDayWord;
           }
           if (residenceTimeObject.weeks) {
             formattedTime = residenceTimeObject.weeks + inclinedWeekWord;
           }
           if (residenceTimeObject.months) {
             if(daysReminder !== 0){
               formattedTime = residenceTimeObject.months + inclinedMonthWord + ' и ' + daysReminder + inclinedDaysRemainderWord;
             }else{
               formattedTime = residenceTimeObject.months + inclinedMonthWord;
             }
           }
           if (residenceTimeObject.years) {
             if(monthsReminder !== 0){
               formattedTime = residenceTimeObject.years + inclinedYearWord + ' и ' + monthsReminder + inclinedMonthsRemainderWord;
             }else{
               formattedTime = residenceTimeObject.years;
             }
           }

           return formattedTime;
         };

         this.getResidenceTimeObject = function (registrationDate) {
           var MSEC_IN_DAY = 86400000;
           var now = new Date();
           var nowMs = Date.parse(now);
           var registrationDateMs = Date.parse(registrationDate);
           var residenceTimeMs = nowMs - registrationDateMs;
           var residenceTime = {};
           residenceTime.days = Math.floor(residenceTimeMs / MSEC_IN_DAY);
           residenceTime.weeks = Math.floor(residenceTimeMs / MSEC_IN_DAY / 7);
           residenceTime.months = Math.floor(residenceTimeMs / MSEC_IN_DAY / 30);
           residenceTime.years = Math.floor(residenceTimeMs / MSEC_IN_DAY / 30 / 12);

           return residenceTime;
         };
       }])

;