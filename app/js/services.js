'use strict';

/* Services */

angular.module('LodSite.services', [])

    .service('TokenService', ['$rootScope', function ($rootScope) {
        var HOURS = 24;
        var TOKEN_VALIDITY = 3600 * HOURS * 1000;
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

            var now = (new Date()).getTime();
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
        '$window',
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
                        if (response.status === 200) {
                            var date = new Date();
                            var developer = response.data;
                            developer.studyingYear = date.getFullYear() - response.data.StudentAccessionYear || 1;
                            if (developer.IsGraduated) {
                                developer.studyingYear = "Закончил(а) обучение"
                            }
                            return {
                                data: DateService.getFormattedTimeDev(developer),
                                status: response.status === 200
                            };
                        } else {
                            return {
                                status: response.status === 200
                            };
                        }
                    });
            };

            this.getRedirectionToAuthenticationGithubForm = function () {
                var url = '/auth/github';

                return sendAuthorizationSaveRequest(GET, url).then(function (response) {
                    window.location.href = response.data;
                });
            };

            this.unlinkGithubProfile = function () {
                var url = '/unlink/github';

                return sendAuthorizationSaveRequest(GET, url).then(function (response) {
                    if (response.status === 409) {
                        return response.status === 409;
                    }
                    window.location.href = response.data;
                });
            };

            this.getDeveloperForProfileSttings = function (developerId) {
                var url = '/developers/' + developerId;

                return sendAuthorizationSaveRequest(GET, url).then(function (response) {
                    return response.data;
                });
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
                });
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
                var url = '/admin/developers/confirm/' + developerId;

                return sendAuthorizationSaveRequest(POST, url, null).then(function (response) {
                    return response.status === 200;
                });
            };

            this.changeAccountRole = function (developerId) {
                var url = '/admin/' + developerId;

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

            this.changeDeveloperRegistrationDate = function (developerId, newRegistrationDate) {
                var url = '/admin/developers/' + developerId + '/date/' + newRegistrationDate;

                return sendAuthorizationSaveRequest(POST, url).then(function (response) {
                    return response.status === 200;
                });
            };

            this.createGithubRepository = function (repoName) {
                var url = '/github/repositories/' + repoName;

                return sendAuthorizationSaveRequest(GET, url).then(function (response) {
                    window.open(response.data, "popup", "width=300,height=300,left=10,top=100");
                });
            }

            // projects
            this.getRandomProjects = function (numberOfProjects) {
                var url = '/projects/random/' + numberOfProjects;

                return sendAuthorizationSaveRequest(GET, url).then(function (response) {
                    return response.data;
                });
            };

            this.getFullProjects = function (requestParams, projectsToSkip, projectsToReturn) {
                var url = '/projects/' + projectsToSkip + '/' + projectsToReturn + '?';
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
                    };
                });
            };

            this.addProject = function (requestData) {
                var url = '/projects';

                return sendAuthorizationSaveRequest(POST, url, null, requestData).then(function (response) {
                    return {
                        isSuccess: response.status === 200,
                        projectId: response.data
                    };
                });
            };

            this.editProject = function (projectId, requestData) {
                var url = '/projects/' + projectId;

                return sendAuthorizationSaveRequest(PUT, url, null, requestData).then(function (response) {
                    return response.status === 200;
                });
            };

            this.addCollaboratorToRepositories = function (projectId, developerId) {
                var url = '/github/repositories/' + projectId + '/developer/' + developerId;

                return sendAuthorizationSaveRequest(GET, url).then(function (response) {
                    window.location.href = response.data;
                });
            }

            this.removeCollaboratorFromRepositories = function (projectId, developerId) {
                var url = '/github/repositories/' + projectId + '/developer/' + developerId + '/delete';

                return sendAuthorizationSaveRequest(GET, url).then(function (response) {
                    window.location.href = response.data;
                });
            }

            this.joinToProject = function (projectId, userId, projectDeveloperRole) {
                var url = '/projects/' + projectId + '/developer/' + userId;

                return sendAuthorizationSaveRequest(POST, url, null, projectDeveloperRole).then(function (response) {
                    return response.status === 200;
                });
            };

            this.escapeFromProject = function (projectId, userId) {
                var url = '/projects/' + projectId + '/developer/' + userId;

                return sendAuthorizationSaveRequest(DELETE, url).then(function (response) {
                    return response.status === 200;
                });
            };

            this.getAllGithubRepositoriesForTheOrganization = function () {
                var url = '/github/repositories';

                return sendAuthorizationSaveRequest(GET, url).then(function (response) {
                    if (response.status === 200) {
                        return response.data;
                    }
                });
            }

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

                return sendAuthorizationSaveRequest(PUT, url, null, notifIds).then(function (response) {
                    return response.status === 200;
                });
            };

            this.createNotification = function (notification) {
                var url = '/admin/notification';

                return sendAuthorizationSaveRequest(POST, url, null, notification).then(function (response) {
                    return response.status === 200;
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

            this.signUpWithGithub = function (requestData) {
                var url = '/signup/github';

                return sendAuthorizationSaveRequest(POST, url, null, JSON.stringify(requestData)).then(function (response) {
                    window.location.href = response.data;
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

            this.signInWithGithub = function () {
                var url = '/login/github';

                return sendAuthorizationSaveRequest(GET, url).then(function (response) {
                    window.location.href = response.data;
                });
            };

            this.getLinkForPasswordRecovery = function (email) {
                var url = '/password/recovery';

                return sendAuthorizationSaveRequest(POST, url, null, JSON.stringify({ Email: email }))
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

            this.getFile = function (fileName) {
                var url = '/file/' + fileName;
                var fileExtension = fileName.match(/[^\.]*$/)[0];
                var MimeType = "application/octet-stream";

                return sendAuthorizationSaveRequest(GET, url).then(function (response) {
                    var a = document.createElement("a");

                    var blob = new Blob([response.data], { type: MimeType });
                    a.href = URL.createObjectURL(blob);
                    a.download = fileName;
                    a.click();

                    return response.data;
                });
            };

            this.contact = function (requestData) {
                var url = '/contact';

                return sendAuthorizationSaveRequest(POST, url, null, requestData).then(function (response) {
                    return response.status === 200;
                });
            };

            this.getFirstMessage = function (currentUserId) {
                var url = '/socket/message?id=' + currentUserId;

                return sendAuthorizationSaveRequest(GET, url);
            }
        }])

    .service('DateService', [function () {
        var self = this;

        this.getHHmmFromISODate = function (ms) {
            var date = new Date(ms);
            var hh = date.getHours() + 3;
            var mm = date.getMinutes();

            if (hh < 10) hh = '0' + hh;
            if (mm < 10) mm = '0' + mm;

            return hh + ':' + mm;
        };

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
    }])

    .service('WebSocketService', ['$rootScope', 'TokenService', 'ApiService', function ($rootScope, TokenService, ApiService) {
        var self = this;
        self.timerId = 0;
        self.keepAlive = function () {
            var timeout = 40000;
            if ($rootScope.webSocket.readyState === $rootScope.webSocket.OPEN) {
                $rootScope.webSocket.send('');
            }
            self.timerId = setTimeout(self.keepAlive, timeout);
        }
        self.cancelKeepAlive = function () {
            if (self.timerId) {
                clearTimeout(self.timerId);
            }
        }

        $rootScope.getNotificationsAmount = function () {
            if ($rootScope.webSocket == undefined) {
                self.start();
            }
            return JSON.parse(localStorage.getItem('notifications_amount'));
        }

        self.start = function () {
            var currentUserId = TokenService.getToken().UserId;
            $rootScope.webSocket = new WebSocket(WEBSOCKET_CLIENT_URL + '?id=' + currentUserId);
            $rootScope.webSocket.onmessage = function (message) {
                localStorage.setItem('notifications_amount', JSON.stringify(message.data));
                $rootScope.$apply();
            };
            $rootScope.webSocket.onopen = function () {
                console.log("Websocket connection is opened");
                ApiService.getFirstMessage(currentUserId);
                self.keepAlive();
            }
            $rootScope.webSocket.onclose = function () {
                self.cancelKeepAlive();
                localStorage.removeItem('notifications_amount');
                console.log("Websocket connection is closed");
            }
            $rootScope.webSocket.onerror = function (error) {
                console.log("Was closed because of " + error.message);
            }
        }
        self.stop = function () {
            if ($rootScope.webSocket) {
                $rootScope.webSocket.close();
            }
            else {
                localStorage.removeItem('notifications_amount');
                console.log("Websocket connection is closed");
            }
        }
    }])
    ;

