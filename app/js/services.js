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
             var apiUrl = API_DOMAIN_URL + url;
             var userRole = TokenService.getRole();
             if (userRole !== false) {
               var token = TokenService.getToken().Token;
             }
             var responsePromise = sendRequest(method, apiUrl, requestParams, requestData, token);

             //show Spinner if request duration > 150ms
             $timeout(function onSpinner() {
               if ($rootScope.dataLoading !== false) {
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
               return {
				Data: DateService.getFormattedTimeDevsList(response.data.Data),
				CountOfEntities: response.data.CountOfEntities
			   };
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
                 if(response.status === 200) {
                   var date = new Date();
                   var developer = response.data;
                   developer.studyingYear = date.getFullYear() - response.data.StudentAccessionYear || 1;

                   return {
                     data: DateService.getFormattedTimeDev(developer),
                     status: (response.status === 200)
                   }
                 } else {
                   return {
                     status: (response.status === 200)
                   }
                 }
               });
           };

           this.getDeveloperForProfileSttings = function (developerId) {
             var url = '/developers/' + developerId;

             return sendAuthorizationSaveRequest(GET, url).then(function (response) {
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

             return sendAuthorizationSaveRequest(GET, url).then(function (response) {
               return response.data;
             })
           };

           this.sendNotifications = function (developerId, requestData) {
             var url = '/developers/notificationsettings/' + developerId;

             return sendAuthorizationSaveRequest(PUT, url, null, requestData).then(function (response) {
               return response.status === 200;
             });
           };

           this.sendNewPassword = function (requestData) {
             var url = '/password';

             return sendAuthorizationSaveRequest(PUT, url, null, requestData).then(function (response) {
               return response.status === 200;
             });
           };

           this.developerConfirmation = function (token) {
             var url = '/developers/confirmation/' + token;

             return sendAuthorizationSaveRequest(POST, url, null).then(function (response) {
               return response.status === 200;
             });
           };

           this.confirmDeveloper = function (developerId) {
             var url = '/admin/developers/confirm/' + developerId ;

             return sendAuthorizationSaveRequest(POST, url, null).then(function (response) {
               return response.status === 200;
             });
           };

           this.changeAccountRole = function (developerId) {
             var url = '/admin/' + developerId ;

             return sendAuthorizationSaveRequest(POST, url, null).then(function (response) {
               return response.status === 200;
             });
           };

           this.changeHidingStatus = function (developerId, condition) {
             var url = '/admin/developers/' + developerId + '/hide/' + condition;

             return sendAuthorizationSaveRequest(POST, url, null).then(function (response) {
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
               return {
                 data: response.data,
                 status: response.status === 200
               }
             });
           };

           this.addProject = function (requestData) {
             var url = '/projects';

             return sendAuthorizationSaveRequest(POST, url, null, requestData).then(function (response) {
               return {
                 isSuccess: response.status === 200,
                 projectId: response.data
               }
             });
           };

           this.editProject = function (projectId, requestData) {
             var url = '/projects/' + projectId;

             return sendAuthorizationSaveRequest(PUT, url, null, requestData).then(function (response) {
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

           //notifications
           this.getNotifications = function (pageCounter) {
             var url = '/event/' + pageCounter;

             function convertNotificationsDates(notifications) {
               for (var i = 0; i < notifications.length; i++) {
                 notifications[i].OccuredOn = Date.parse(notifications[i].OccuredOn);
                 notifications[i].Time = DateService.getHHmmFromISODate(notifications[i].OccuredOn);
                 notifications[i].Date = DateService.getDDMMYYFromISODate(notifications[i].OccuredOn);

                 notifications[i].EventInfo = JSON.parse(notifications[i].EventInfo);
               }
             }

             return sendAuthorizationSaveRequest(GET, url).then(function (response) {
               var notifications = response.data;
               convertNotificationsDates(notifications.Data);

               return notifications;
             });
           };

           this.readNotifications = function (notifIds) {
             var url = '/event/read';

             return sendAuthorizationSaveRequest(PUT, url, null, notifIds);
           };

           this.getNotificationsAmount = function () {
             var url = '/event/count';

             return sendAuthorizationSaveRequest(GET, url).then(function (response) {
               return response.data
             }, function () {
               return 0;
             });
           };

           this.createNotification = function (notification) {
             var url = '/admin/notification';

             return sendAuthorizationSaveRequest(POST, url, null, notification);
           };

           //orders

           this.getOrders = function () {
             var url = '/orders';

             return sendAuthorizationSaveRequest(GET, url).then(function (response) {
               return DateService.getFormattedTimeOrdersList(response.data);
             });
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

           this.getLinkForPasswordRecovery = function (email) {
             var url = '/password/recovery';

             return sendAuthorizationSaveRequest(POST, url, null, JSON.stringify(email))
               .then(function (response) {
                 return response.status === 200;
               });
           };

           this.recoverPassword = function (data) {
             var url = '/password';

             return sendAuthorizationSaveRequest(PUT, url, null, data)
               .then(function (response) {
                 return response.status === 200;
               });
           };

           this.getOrder = function (orderId) {
             var url = '/orders/' + orderId;

             return sendAuthorizationSaveRequest(GET, url).then(function (response) {
               return response.data;
             });
           };

           this.getFile = function (fileName) {
             var url = '/file/'+fileName;
             var fileExtension = fileName.match(/[^\.]*$/)[0];
             var MimeType = "application/octet-stream";

             // if (fileExtension == 'pdf'){
             //   MimeType = 'application/pdf';
             // }else if(fileExtension == 'doc'){
             //   MimeType = 'application/msword';
             // }else if(fileExtension == 'docx'){
             //   MimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
             // }else if(fileExtension == 'ttf'){
             //   MimeType = 'font/ttf';
             // }else if(fileExtension == 'txt'){
             //   MimeType = 'text/plain';
             // }

             return sendAuthorizationSaveRequest(GET, url).then(function (response) {
               var a = document.createElement("a");

               var blob = new Blob([response.data], {type: MimeType});
               // var blob = new Blob([response.data], {type: MimeType+';charset=utf-8'});
               a.href = URL.createObjectURL(blob);
               a.download = fileName;
               a.click();

               return response.data;
             });
           };

           this.order = function (requestData) {
             var url = '/orders';

             return sendAuthorizationSaveRequest(POST, url, null, requestData).then(function (response) {
               return response.status === 200;
             });
           };

           this.contact = function (requestData) {
             var url = '/contact';

             return sendAuthorizationSaveRequest(POST, url, null, requestData).then(function (response) {
               return response.status === 200;
             });
           };

         }])

       .service('DateService', [function () {
         var self = this;

         this.getHHmmFromISODate = function (ms) {
           var date = new Date(ms);
           var hh = date.getHours();
           var mm = date.getMinutes()

           if (hh < 10) hh = '0' + hh;
           if (mm < 10) mm = '0' + mm;

           return hh + ':' + mm;
         } ;

         this.getDDMMYYFromISODate = function (ms) {
           var date = new Date(ms);
           var dd = date.getDate();
           var mm = date.getMonth() + 1;
           var yy = date.getFullYear() % 100;

           if (dd < 10) dd = '0' + dd;
           if (mm < 10) mm = '0' + mm;
           if (yy < 10) yy = '0' + yy;

           return dd + '.' + mm + '.' + yy;
         };

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

           var formattedTime = 'Первый день';

           var daysReminder = residenceTimeObject.days - residenceTimeObject.months * 30;
           var monthsReminder = residenceTimeObject.months - residenceTimeObject.years * 12;

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
             if (daysReminder === 0) {
               formattedTime = residenceTimeObject.months + inclinedMonthWord;
             } else {
               formattedTime = residenceTimeObject.months + inclinedMonthWord + ' и ' + daysReminder + inclinedDaysRemainderWord;
             }
           }
           if (residenceTimeObject.years) {
             if (monthsReminder === 0) {
               formattedTime = residenceTimeObject.years + inclinedYearWord;
             } else {
               formattedTime = residenceTimeObject.years + inclinedYearWord + ' и ' + monthsReminder + inclinedMonthsRemainderWord;
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

         this.getFormattedTimeOrder = function (order) {
           order.DeadLine = self.getDDMMYYFromISODate(new Date(order.DeadLine));

           return order;
         };

         this.getFormattedTimeOrdersList = function (orders) {
           for (var i = 0; i < orders.length; i++) {
             orders[i].DeadLine = self.getDDMMYYFromISODate(new Date(orders[i].DeadLine));
           }

           return orders;
         };
       }])

       .service('NotificationsService', ['$rootScope', 'ApiService', function ($rootScope, ApiService) {
         function getNotificationsNumber() {
           ApiService.getNotificationsAmount().then(function (notificationsAmount) {
             $rootScope.notificationsAmount = notificationsAmount;
           });
         }

         var NOTIFICATIONS_REQUEST_INTERVAL = 5000,
             notificationsTimer;

         this.startShowNotificationsAmount = function () {
           getNotificationsNumber();
           notificationsTimer = setInterval(getNotificationsNumber, NOTIFICATIONS_REQUEST_INTERVAL);
         };

         this.stopShowNotificationsAmount = function () {
           clearInterval(notificationsTimer);
         };

       }])

  .service('OrderService', ['$rootScope', 'ApiService', function ($rootScope, ApiService) {

    this.isFromOrderPage = false;

    this.setOrder = function(order){
      this.order = order;
    };

    this.getOrder = function(){
      return this.order;
    };
  }]);
