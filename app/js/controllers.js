'use strict';

/* Controllers */

angular.module('LodSite.controllers', [])

    //main
    .controller('PageCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
        var defaultTitle = 'Лига Разработчиков НИТУ МИСиС';
        $rootScope.dataLoading = null;
        $scope.DEFAULT_PROJECT_LANDSCAPE = '/app/imgs/project-cap-image.png';
        $scope.DEFAULT_DEVELOPER_PHOTO = '/app/imgs/developer-default-photo.png';

        $rootScope.$on('userRole_changed', function (e, args) {
            $scope.userRole = args.userRole;
        });
        $scope.$on('change_title', function (e, args) {
            $scope.title = args.title !== undefined && args.title.length ? args.title : defaultTitle;
        });
        $scope.$on('$viewContentLoaded', setPaddingBottom);
        $scope.$on('$locationChangeSuccess', function () {
            angular.element(window).scrollTop(0);
        });
    }])

    .controller('AppCtrl', ['$scope', function ($scope) {
        $scope.isBlack = false;

        $scope.$on('toggle_black', function (e, args) {
            $scope.isBlack = args ? args.isBlack : false;
        });
    }])

    .controller('IndexCtrl', ['$scope', function ($scope) {
        $scope.$emit('change_title', { title: 'Лига Разработчиков НИТУ МИСиС' });
        $scope.$emit('toggle_black');
    }])

    //header and footer
    .controller('HeaderCtrl', ['$scope', 'ngDialog', 'TokenService', '$state', '$rootScope', 'WebSocketService',
        function ($scope, ngDialog, TokenService, $state, $rootScope, WebSocketService) {
            $scope.isOpened = false;

            var token = TokenService.getToken();

            if (token) {
                $scope.userId = token.UserId;
            }

            $scope.activeToggle = function () {
                $scope.isOpened = !$scope.isOpened;
            };
            $scope.openLoginDialog = function () {
                $scope.$dialog = ngDialog.open({
                    template: 'loginTemplate',
                    showClose: true,
                    closeByNavigation: true
                });
                this.activeToggle();
            };
            $scope.signOut = function () {
                TokenService.resetToken();
                TokenService.getRole();
                WebSocketService.stop();
                $state.reload();
            };

            $scope.$on('$locationChangeSuccess', function () {
                $scope.isOpened = false;
            });

            $rootScope.$on('userRole_changed', function (e, args) {
                token = TokenService.getToken();
                if (token) {
                    $scope.userId = token.UserId;
                }
            });
        }])

    .controller('FooterCtrl', ['$scope', function ($scope) {
        $scope.currentDate = new Date();
    }])


    //developers
    .controller('RandomDevelopersCtrl', ['$scope', 'ApiService', function ($scope, ApiService) {
        var numberOfDevelopers = getProjsSectionAmount();

        ApiService.getRandomDevelopers(numberOfDevelopers)
            .then(function (data) {
                $scope.randomDevelopers = data;
            });
    }])

    .controller('FullDevelopersCtrl', ['$scope', 'ApiService', function ($scope, ApiService) {
        $scope.searchText = '';
        $scope.fullDevelopers = [];
        $scope.isMoreDevs = true;
        var pageCounter = 0;
        $scope.isDisabled = false;

        $scope.changeDisable = function () {
            $scope.isDisabled = !$scope.isDisabled;
        }

        $scope.resetPageCounter = function () {
            pageCounter = 0;
        };
        $scope.addDevelopers = function () {
            $scope.changeDisable();
            pageCounter++;
            ApiService.getFullDevelopers(pageCounter)
                .then(function (data) {
                    if (!data || data.Data.length === 0) {
                        $scope.isMoreDevs = false;
                    } else {
                        $scope.fullDevelopers = $scope.fullDevelopers.concat(data.Data);
                        $scope.isMoreDevs = $scope.fullDevelopers.length < data.CountOfEntities;
                    }
                    $scope.changeDisable();
                });
        };

        $scope.$watch("searchText", function (newValue, oldValue) {
            if (newValue === '') {
                $scope.resetPageCounter();
                ApiService.getFullDevelopers(pageCounter)
                    .then(function (data) {
                        $scope.fullDevelopers = data.Data;
                        $scope.isMoreDevs = $scope.fullDevelopers.length < data.CountOfEntities;
                    });
            } else if (newValue !== oldValue) {
                ApiService.getFullDevelopersBySearch($scope.searchText)
                    .then(function (data) {
                        $scope.isMoreDevs = false;
                        $scope.fullDevelopers = data;
                    });
            }
        });

        $scope.$emit('toggle_black', { isBlack: true });
        $scope.$emit('change_title', { title: 'Разработчики - Лига Разработчиков НИТУ МИСиС' });
    }])

    .controller('DeveloperCtrl', ['$scope', '$state', 'ApiService', function ($scope, $state, ApiService) {
        var developerId = $state.params.id;

        ApiService.getDeveloper(developerId)
            .then(function (response) {
                $scope.status = response.status;

                if (response.status) {
                    $scope.developer = response.data;
                    $scope.$emit('change_title', {
                        title: $scope.developer.FirstName + ' ' + $scope.developer.LastName +
                        ' - Лига Разработчиков НИТУ МИСиС'
                    });
                } else {
                    $scope.$emit('change_title', {
                        title: '404 Not found - Лига Разработчиков НИТУ МИСиС'
                    });
                }
            });

        $scope.$emit('toggle_black', { isBlack: true });
    }])

    .controller('DeveloperEditCtrl', ['$scope', '$state', '$location', '$timeout', 'ApiService', 'TokenService',
        function ($scope, $state, $location, $timeout, ApiService, TokenService) {
            var token = TokenService.getToken();
            if (!token) {
                return $state.go('index');
            }
            var developerId = token.UserId;

            if ($state.params.status == 'False') {
                $scope.currentState = 'failed';
                $scope.$apply();
            }

            $location.url($location.path());
            
            $scope.state = [];
            $scope.currentState = null;
            $scope.profile = {};
            $scope.currentDate = new Date();
            $scope.isDisabled = false;

            $scope.changeDisable = function () {
                $scope.isDisabled = !$scope.isDisabled;
            }

            var nullifyEntities = function () {
                $scope.state = [];
                $scope.repeatedPassword = null;
                $scope.newPassword = null;
                $scope.profileSettingsForm.$setPristine();

                $timeout(function () {
                    $scope.currentState = null;
                }, 5000);
            };

            var changeCurrentState = function () {
                for (var i = 0; i < 3; i++) {
                    if (!$scope.state[i]) {
                        return;
                    }
                }

                for (i = 0; i < 3; i++) {
                    if ($scope.state[i] == 'failed') {
                        $scope.currentState = 'failed';

                        nullifyEntities();

                        return;
                    }
                }
                $scope.currentState = 'success';

                nullifyEntities();
            };


            /*FOR UPLOADING OF PHOTO*/
            $scope.currentUploadStateBigPhoto = 'waiting'; // waiting, uploading
            $scope.currentPercentBigPhoto = 0;

            $scope.$on('beforeSendBigImage', function (ev, args) {
                $scope.currentUploadStateBigPhoto = 'uploading';
                $scope.currentPercentBigPhoto = 0;
                $scope.$apply();
            });

            $scope.$on('errorUploadingBigImage', function (ev, args) {

                alert('Размер файла не должен превышать 10 Мб. Разрешённые форматы изображения: JPG, JPEG, PNG, SVG, BMP, GIF. ' +
                    'Или, возможно, вы не авторизовались.');
                $scope.currentUploadStateBigPhoto = 'waiting';
                $scope.currentPercentBigPhoto = 0;
                $scope.$apply();
            });

            $scope.$on('progressBigImage', function (ev, args) {
                $scope.currentPercentBigPhoto = args.progress_value;
                $scope.$apply();
            });

            $scope.$on('successUploadingBigImage', function (ev, args) {
                $scope.profile.Image = {
                    BigPhotoUri: API_DOMAIN_URL + '/image/' + args.data.BigPhotoName,
                    SmallPhotoUri: API_DOMAIN_URL + '/image/' + args.data.SmallPhotoName
                };

                $scope.currentUploadStateBigPhoto = 'waiting';

                $scope.$apply();
            });

            $scope.deleteBigPhoto = function () {
                $scope.profile.Image = null;
            };

            /*FOR NOTIFICATIONS*/
            $scope.toggleNotifications = function (index) {
                $scope.notifications[index] = !$scope.notifications[index];
            };

            /*GET - REQUESTS*/
            ApiService.getDeveloperForProfileSttings(developerId).then(function (data) {

                $scope.profile.Image = {
                    BigPhotoUri: data.PhotoUri,
                    SmallPhotoUri: data.PhotoUri
                };
                $scope.profile.InstituteName = data.InstituteName;
                $scope.profile.StudyingDirection = data.StudyingDirection;
                $scope.profile.Specialization = data.Specialization;
                $scope.profile.StudentAccessionYear = data.StudentAccessionYear;
                $scope.profile.LinkToGithubProfile = data.LinkToGithubProfile;
                $scope.profile.VkProfileUri = data.VkProfileUri;
                $scope.profile.PhoneNumber = data.PhoneNumber.slice(1);
                $scope.profile.IsGraduated = data.IsGraduated;
                $scope.profile.HasPassword = !data.IsOauthRegistered;
            });
            ApiService.getNotificationsForProfileSttings(developerId).then(function (data) {
                $scope.notificationSettings = data;
                $scope.notifications = data.map(function (notification) {
                    return (notification.NotificationSettingValue == 2);
                });
            });

            $scope.getRedirectionToAuthenticationGithubForm = function () {
                $scope.changeDisable();
                ApiService.getRedirectionToAuthenticationGithubForm(developerId).then(function (isSuccess) {
                    if (isSuccess) {
                        $scope.state[0] = 'success';
                    } else {
                        $scope.state[0] = 'failed';
                    }
                    changeCurrentState();
                    $scope.changeDisable();
                });
            }

            /*POST - REQUESTS*/

            $scope.unlinkGithubProfile = function () {
                $scope.changeDisable();
                ApiService.unlinkGithubProfile().then(function (isFailed) {
                        $scope.state[0] = 'failed';
                        changeCurrentState();
                        $scope.changeDisable();
                });
            }

            $scope.changeProfileSettings = function () {
                $scope.changeDisable();
                $scope.profile.PhoneNumber = '7' + $scope.profile.PhoneNumber;
                ApiService.sendProfileSttings(developerId, $scope.profile).then(function (isSuccess) {
                    if (isSuccess) {
                        $scope.state[0] = 'success';
                    } else {
                        $scope.state[0] = 'failed';
                    }
                    $scope.profile.PhoneNumber = $scope.profile.PhoneNumber.slice(1);
                    changeCurrentState();
                });

                for (var i = 0; i < $scope.notificationSettings.length; i++) {
                    $scope.notificationSettings[i].NotificationSettingValue = $scope.notifications[i] ? 2 : 1;
                }

                ApiService.sendNotifications(developerId, $scope.notificationSettings).then(function (isSuccess) {
                    if (isSuccess) {
                        $scope.state[1] = 'success';
                    } else {
                        $scope.state[1] = 'failed';
                    }
                    changeCurrentState();
                });

                if ($scope.newPassword && $scope.repeatedPassword) {
                    ApiService.sendNewPassword({ NewPassword: $scope.newPassword, Token: token.Token }).then(function (isSuccess) {
                        if (isSuccess) {
                            $scope.state[2] = 'success';
                        } else {
                            $scope.state[2] = 'failed';
                        }
                        changeCurrentState();
                        $scope.changeDisable();
                    });
                } else {
                    $scope.state[2] = 'success';
                    $scope.changeDisable();
                    changeCurrentState();
                }
            };


            $scope.$on('userRole_changed', function (e, args) {
                token = TokenService.getToken();
                if (!token || !token.UserId) {
                    return $state.go('index');
                }
            });

            $scope.$emit('toggle_black', { isBlack: true });
            $scope.$emit('change_title', {
                title: 'Редактирование профиля - Лига Разработчиков НИТУ МИСиС'
            });
        }])


    //projects
    .controller('RandomProjectsCtrl', ['$scope', 'ApiService', function ($scope, ApiService) {
        var numberOfProjects = getProjsSectionAmount();

        ApiService.getRandomProjects(numberOfProjects).then(function (data) {
            $scope.randomProjects = data;
        })
    }])

    .controller('FullProjectsCtrl', ['$scope', 'ApiService', function ($scope, ApiService) {
        $scope.isDisabled = false;

        $scope.changeDisable = function () {
            $scope.isDisabled = !$scope.isDisabled;
        }
        $scope.categories = [{
            category: 'Веб',
            status: false,
            index: 0
        }, {
            category: 'Мобильное',
            status: false,
            index: 1
        }, {
            category: 'Десктопное',
            status: false,
            index: 2
        }, {
            category: 'Игра',
            status: false,
            index: 3
        }, {
            category: 'Прочее',
            status: false,
            index: 4
        }];
        $scope.fullProjects = [];
        $scope.isMoreProjects = true;
        var projectsToReturn = getProjsSectionAmount();

        $scope.resetFullProjects = function () {
            $scope.fullProjects = [];
        };
        $scope.addProjects = function () {
            $scope.updateProjects();
        };
        $scope.toggleCategory = function (targetCategory) {
            targetCategory.status = !targetCategory.status;
            $scope.resetFullProjects();
            $scope.updateProjects();
        };
        $scope.updateProjects = function () {
            $scope.changeDisable();
            var requestParams = {};
            var indexes = $scope.categories.filter(function (category) {
                return category.status;
            }).map(function (category) {
                return category.index;
            });

            if (indexes.length) {
                angular.extend(requestParams, {
                    categories: indexes.join(',')
                });
            }
            ApiService.getFullProjects(requestParams, $scope.fullProjects.length, projectsToReturn)
                .then(function (data) {
                    if (!data || data.Data.length === 0) {
                        $scope.isMoreProjects = false;
                    } else {
                        $scope.fullProjects = $scope.fullProjects.concat(data.Data);
                        $scope.isMoreProjects = $scope.fullProjects.length < data.CountOfEntities;
                    }
                    $scope.changeDisable();
                });
        };

        $scope.updateProjects();

        $scope.$emit('toggle_black', { isBlack: true });
        $scope.$emit('change_title', { title: 'Проекты - Лига Разработчиков НИТУ МИСиС' });
    }])

    .controller('ProjectCtrl', ['$scope', '$state', 'ApiService', 'ngDialog', '$rootScope', 'TokenService',
        function ($scope, $state, ApiService, ngDialog, $rootScope, TokenService) {
            var projectId = $state.params.id;
            var token = TokenService.getToken();

            $scope.openViewer = function () {
                $scope.$dialog = ngDialog.open({
                    template: 'viewer',
                    showClose: true,
                    closeByNavigation: true,
                    controller: [
                        '$rootScope', '$scope', function ($rootScope, $scope) {
                            $scope.openedScreenshotUrl = $rootScope.openedScreenshot.BigPhotoUri;
                            $scope.plusDivs = function (n) {
                                $scope.scaleSymbol = '+';
                                if ($rootScope.imgIndex + 1 == $rootScope.screenshots.length && n == 1) {
                                    $rootScope.imgIndex = -1;
                                };
                                if ($rootScope.imgIndex == 0 && n == -1) {
                                    $rootScope.imgIndex = $rootScope.screenshots.length;
                                };
                                $scope.openedScreenshotUrl = $rootScope.screenshots[$rootScope.imgIndex += n].BigPhotoUri;
                            };
                            $scope.scaleSymbol = '+';
                            $scope.scale = function () {
                                $scope.scaleSymbol == '+' ? document.getElementsByClassName("viewer__img")[0].style.backgroundSize = "cover" :
                                    document.getElementsByClassName("viewer__img")[0].style.backgroundSize = "contain";
                                $scope.scaleSymbol = $scope.scaleSymbol == '+' ? '−' : '+';
                            };
                        }
                    ]
                });
            };

            if (token) {
                var userId = TokenService.getToken().UserId;
            }

            ApiService.getProject(projectId)
                .then(function (response) {
                    $scope.status = response.status;

                    if ($scope.status) {
                        $scope.project = response.data;
                        $scope.projectTypes = $scope.project.ProjectType;
                        $scope.projectIssues = $scope.project.Issues;
                        if ($scope.project.ProjectMemberships.length === 0) {
                            $scope.replacementText = "В данный момент на проекте нет разработчиков.";
                        }
                        $scope.openViewerDialog = function (imgIndex) {
                            $rootScope.imgIndex = imgIndex;
                            $rootScope.openedScreenshot = $scope.project.Screenshots[imgIndex];
                            $rootScope.screenshots = $scope.project.Screenshots;
                            $scope.openViewer();
                        };
                        $scope.$emit('change_title', {
                            title: $scope.project.Name + ' - Лига Разработчиков НИТУ МИСиС'
                        });
                    } else {
                        $scope.$emit('change_title', {
                            title: '404 Not found - Лига Разработчиков НИТУ МИСиС'
                        });
                    }
                });

            $scope.$emit('toggle_black', { isBlack: true });
        }])


    //admin
    .controller('AdminPanelCtrl', ['$scope', '$state', 'TokenService',
        function ($scope, $state, TokenService) {
            var role = TokenService.getRole();
            if (role != 1) {
                return $state.go('index');
            };

            $scope.$on('userRole_changed', function (e, args) {
                role = TokenService.getRole();
                if (role != 1) {
                    return $state.go('index');
                }
            });


            $scope.$emit('toggle_black', { isBlack: true });
            $scope.$emit('change_title', {
                title: 'Административная панель - Лига Разработчиков НИТУ МИСиС'
            });
        }])

    .controller('AllProjectsCtrl', ['$scope', '$state', 'ApiService', 'TokenService',
        function ($scope, $state, ApiService, TokenService) {
            var token = TokenService.getToken();
            var role = TokenService.getRole();
            if (!token || role != 1) {
                return $state.go('index');
            }
            $scope.fullProjects = [];
            $scope.isMoreProjects = true;
            var projectsToReturn = getProjsSectionAmount();

            $scope.isDisabled = false;

            $scope.changeDisable = function () {
                $scope.isDisabled = !$scope.isDisabled;
            }

            $scope.addProjects = function () {
                $scope.updateProjects();
            };

            $scope.updateProjects = function () {
                $scope.changeDisable();
                ApiService.getFullProjects(null, $scope.fullProjects.length, projectsToReturn)
                    .then(function (data) {
                        if (!data || data.Data.length === 0) {
                            $scope.isMoreProjects = false;
                        } else {
                            $scope.fullProjects = $scope.fullProjects.concat(data.Data);
                            $scope.isMoreProjects = $scope.fullProjects.length < data.CountOfEntities;
                        }
                        $scope.changeDisable();
                    });
            };

            $scope.updateProjects();

            $scope.$on('userRole_changed', function (e, args) {
                role = TokenService.getRole();
                if (role != 1) {
                    return $state.go('index');
                }
            });

            $scope.$emit('toggle_black', { isBlack: true });
            $scope.$emit('change_title', {
                title: 'Проекты - Лига Разработчиков НИТУ МИСиС'
            });
        }])

    .controller('AddProjectCtrl', ['$scope', '$state', '$location', 'ngDialog', 'ApiService', 'TokenService', '$timeout',
        function ($scope, $state, $location, ngDialog, ApiService, TokenService, $timeout) {
            var role = TokenService.getRole();
            if (role != 1) {
                return $state.go('index');
            }

            var pageCounter = 0;
            $scope.isInvalid = [];
            $scope.isOpen = false;
            $scope.isDisabled = false;

            $scope.changeDisable = function () {
                $scope.isDisabled = !$scope.isDisabled;
            }

            $scope.images = [];
            $scope.developers = [];
            $scope.chosenDevelopers = [];
            $scope.isMoreDevs = true;
            $scope.currentState = 'filling';
            $scope.chosenRepositories = [];

            $scope.categories = [{
                category: 'Веб',
                status: false,
                index: 0
            }, {
                category: 'Мобильное',
                status: false,
                index: 1
            }, {
                category: 'Десктопное',
                status: false,
                index: 2
            }, {
                category: 'Игра',
                status: false,
                index: 3
            }, {
                category: 'Прочее',
                status: false,
                index: 4
            }];

            var sampleProject = function () {
                this.Name = '';
                this.ProjectTypes = [];
                this.Info = '';
                this.AccessLevel = '0';
                this.ProjectStatus = 0;
                this.LandingImage = {};
                this.Screenshots = [];
                this.LinksToGithubRepositories = [];
            };

            $scope.newProject = new sampleProject();

            if ($state.params.success == 'False') {
                $scope.newProject = JSON.parse(localStorage.getItem('saved_project'));
                $scope.chosenDevelopers = JSON.parse(localStorage.getItem('chosen_developers'));
                $scope.chosenRepositories = JSON.parse(localStorage.getItem('chosen_repositories'));
                $scope.images = JSON.parse(localStorage.getItem('screenshots'));
                $scope.categories = JSON.parse(localStorage.getItem('categories'));
                localStorage.removeItem('saved_project');
                localStorage.removeItem('chosen_developers');
                localStorage.removeItem('chosen_repositories');
                localStorage.removeItem('screenshots');
                localStorage.removeItem('categories');
                $scope.action = $state.params.action;
                if ($scope.action == 'add_collaborator') {
                    $scope.currentState = 'failed_to_add_collaborator';
                }
                if ($scope.action == 'create_repository') {
                    $scope.currentState = 'failed_to_create_repository';
                }
            }
            if ($state.params.success == 'True') {
                $scope.newProject = JSON.parse(localStorage.getItem('saved_project'));
                $scope.chosenDevelopers = JSON.parse(localStorage.getItem('chosen_developers'));
                $scope.chosenRepositories = JSON.parse(localStorage.getItem('chosen_repositories'));
                $scope.images = JSON.parse(localStorage.getItem('screenshots'));
                $scope.categories = JSON.parse(localStorage.getItem('categories'));
                localStorage.removeItem('saved_project');
                localStorage.removeItem('chosen_developers');
                localStorage.removeItem('chosen_repositories');
                localStorage.removeItem('screenshots');
                localStorage.removeItem('categories');
                if ($state.params.action == 'create_repository') {
                    var repo = $state.params.repository_link;
                    $scope.chosenRepositories.push({
                        Name: repo.split('/')[repo.split('/').length - 1],
                        HtmlUrl: repo
                    });
                } else {
                    $scope.currentState = 'success';
                }
            };

            $location.url($location.path());

            //   FOR TYPE OF PROJECT


            $scope.toggleCategory = function (targetCategory) {
                targetCategory.status = !targetCategory.status;
            };

            //   FOR DEVELOPERS

            $scope.resetPageCounter = function () {
                pageCounter = 0;
                $scope.developers = [];
            };

            $scope.toggleOpened = function () {
                $scope.isOpen = !$scope.isOpen;

                if ($scope.isOpen) {
                    $scope.showFirstPage();
                } else {
                    $scope.resetPageCounter();
                }
            };

            var inArray = function (value, array, strict) {
                var found = false, key, strict = !!strict;

                for (key in array) {
                    if ((strict && array[key] === value) || (!strict && array[key] == value)) {
                        found = true;
                        break;
                    }
                }
                return found;
            };


            $scope.showFirstPage = function () {
                ApiService.getFullDevelopers(pageCounter)
                    .then(function (data) {
                        $scope.developers = [];

                        if ($scope.chosenDevelopers.length == 0) {
                            $scope.developers = $scope.developers.concat(data.Data);

                            $scope.isMoreDevs = ($scope.developers.length + $scope.chosenDevelopers.length) < data.CountOfEntities;

                            return;
                        } else {
                            var dataId = data.Data.map(function (dataItem) {
                                return dataItem.UserId;
                            });
                            var chosenDevelopersId = $scope.chosenDevelopers.map(function (developerItem) {
                                return developerItem.UserId;
                            });

                            dataId = dataId.filter(function (id) {
                                return !inArray(id, chosenDevelopersId);
                            });

                            data.Data = data.Data.filter(function (dataItem) {
                                return inArray(dataItem.UserId, dataId);
                            });
                            if (data.Data.length == 0) {
                                $scope.addDevelopers();
                            } else {
                                $scope.developers = $scope.developers.concat(data.Data);
                            }

                            $scope.isMoreDevs = ($scope.developers.length + $scope.chosenDevelopers.length) < data.CountOfEntities;
                        }
                    });
            };

            $scope.addDevelopers = function () {
                pageCounter++;
                ApiService.getFullDevelopers(pageCounter)
                    .then(function (data) {
                        if (!data || data.Data.length === 0) {
                            $scope.isMoreDevs = false;
                            return;
                        } else if ($scope.chosenDevelopers.length == 0) {
                            $scope.developers = $scope.developers.concat(data.Data);

                            $scope.isMoreDevs = ($scope.developers.length + $scope.chosenDevelopers.length) < data.CountOfEntities;

                            return;
                        } else {
                            var dataId = data.Data.map(function (dataItem) {
                                return dataItem.UserId;
                            });
                            var chosenDevelopersId = $scope.chosenDevelopers.map(function (developerItem) {
                                return developerItem.UserId;
                            });

                            dataId = dataId.filter(function (id) {
                                return !inArray(id, chosenDevelopersId);
                            });

                            data.Data = data.Data.filter(function (dataItem) {
                                return inArray(dataItem.UserId, dataId);
                            });

                            if (data.Data.length == 0) {
                                $scope.addDevelopers();
                            } else {
                                $scope.developers = $scope.developers.concat(data.Data);
                            }

                            $scope.isMoreDevs = ($scope.developers.length + $scope.chosenDevelopers.length) < data.CountOfEntities;
                        }
                    });
            };

            $scope.$watch("searchText", function (newValue, oldValue) {
                if (newValue === '') {
                    $scope.resetPageCounter();
                    $scope.showFirstPage();

                } else if (newValue !== oldValue) {
                    ApiService.getFullDevelopersBySearch($scope.searchText)
                        .then(function (data) {
                            if (data.Message) {
                                $scope.resetPageCounter();
                                $scope.showFirstPage();
                            } else {
                                $scope.isMoreDevs = false;

                                var dataId = data.map(function (dataItem) {
                                    return dataItem.UserId;
                                });
                                var chosenDevelopersId = $scope.chosenDevelopers.map(function (developerItem) {
                                    return developerItem.UserId;
                                });

                                dataId = dataId.filter(function (id) {
                                    return !inArray(id, chosenDevelopersId);
                                });

                                data = data.filter(function (dataItem) {
                                    return inArray(dataItem.UserId, dataId);
                                });

                                $scope.developers = data;
                            }
                        });
                }
            });

            $scope.selectDeveloper = function (index) {
                $scope.developers.forEach(function (developerItem, i) {
                    developerItem.isSelect = (index == i);
                    developerItem.DeveloperRole = ''
                });
            };

            $scope.chooseDeveloper = function (index) {
                if ($scope.developers[index].DeveloperRole) {
                    $scope.chosenDevelopers.push({
                        UserId: $scope.developers[index].UserId,
                        FirstName: $scope.developers[index].FirstName,
                        LastName: $scope.developers[index].LastName,
                        Role: $scope.developers[index].DeveloperRole
                    });

                    $scope.developers = [];
                    $scope.toggleOpened();
                }
            };

            $scope.deleteDeveloper = function (index) {
                $scope.chosenDevelopers.splice(index, 1);
            };

            // FOR GITHUB REPOSITORIES

            $scope.isGithubRepoDialogOpen = false;
            $scope.repositories = [];
            $scope.gottenRepositories = $scope.repositories;
            $scope.previousSearchString = "";

            $scope.githubRepoToggleOpened = function () {
                $scope.isGithubRepoDialogOpen = !$scope.isGithubRepoDialogOpen;

                if ($scope.isGithubRepoDialogOpen) {
                    $scope.getGithubRepositories();
                } else {
                    $scope.resetRepositories();
                }
            };

            $scope.getGithubRepositories = function () {
                ApiService.getAllGithubRepositoriesForTheOrganization().then(function (data) {
                    $scope.repositories = [];

                    if ($scope.chosenRepositories.length == 0) {
                        $scope.repositories = $scope.repositories.concat(data);
                    } else {
                        var repoUrls = data.map(function (repoItem) {
                            return repoItem.HtmlUrl;
                        });
                        var chosenRepoUrls = $scope.chosenRepositories.map(function (repoItem) {
                            return repoItem.HtmlUrl;
                        });

                        repoUrls = repoUrls.filter(function (url) {
                            return !inArray(url, chosenRepoUrls);
                        });

                        data = data.filter(function (dataItem) {
                            return inArray(dataItem.HtmlUrl, repoUrls);
                        });
                        if (data.length == 0) {
                            $scope.getAllGithubRepositoriesForTheOrganization();
                        } else {
                            $scope.repositories = $scope.repositories.concat(data);
                        }
                    }
                    $scope.gottenRepositories = $scope.repositories;
                })
            };

            $scope.$watch("searchGithubRepository", function (searchString) {
                if ($scope.previousSearchString !== undefined && searchString !== undefined) {
                    if (searchString === '' || searchString.length < $scope.previousSearchString.length) {
                        $scope.repositories = $scope.gottenRepositories;
                    }
                }
                $scope.repositories = $scope.repositories.filter(function (repo) {
                    return repo.Name.toLowerCase().includes(searchString.toLowerCase());
                });
                $scope.previousSearchString = searchString;
            });

            $scope.resetRepositories = function () {
                $scope.repositories = [];
            }

            $scope.chooseRepo = function (index) {
                $scope.chosenRepositories.push({
                    Name: $scope.repositories[index].Name,
                    HtmlUrl: $scope.repositories[index].HtmlUrl
                });
                $scope.repositories = [];
                $scope.githubRepoToggleOpened();
            };

            $scope.deleteRepo = function (index) {
                $scope.chosenRepositories.splice(index, 1);
            };

            $scope.isGithubRepoNameInputDialogOpen = false;
            $scope.newRepositoryName = "";

            $scope.createRepository = function () {
                $scope.changeDisable();
                localStorage.setItem('saved_project', JSON.stringify($scope.newProject));
                localStorage.setItem('chosen_developers', JSON.stringify($scope.chosenDevelopers));
                localStorage.setItem('chosen_repositories', JSON.stringify($scope.chosenRepositories));
                localStorage.setItem('screenshots', JSON.stringify($scope.images));
                localStorage.setItem('categories', JSON.stringify($scope.categories));
                ApiService.createGithubRepository($scope.newRepositoryName).then(function () {
                    $scope.changeDisable();
                });
                $scope.repoNameInputToggleOpened();
            }

            $scope.repoNameInputToggleOpened = function () {
                $scope.isGithubRepoNameInputDialogOpen = !$scope.isGithubRepoNameInputDialogOpen;
            }

            //   FOR SMALL IMAGES
            $scope.currentUploadStateImage = "waiting"; // waiting, uploading
            $scope.currentPercentImage = 0;

            $scope.$on('beforeSendImage', function (ev, args) {
                $scope.currentUploadStateImage = 'uploading';
                $scope.currentPercentImage = 0;
                $scope.$apply();
            });

            $scope.$on('errorUploadingImage', function (ev, args) {

                alert('Размер файла не должен превышать 10 Мб. Разрешённые форматы изображения: JPG, JPEG, PNG, SVG, BMP, GIF. ' +
                    'Или, возможно, вы не авторизовались.');
                $scope.currentUploadStateImage = 'waiting';
                $scope.currentPercentImage = 0;
                $scope.$apply();
            });

            $scope.$on('progressImage', function (ev, args) {
                $scope.currentPercentImage = args.progress_value;
                $scope.$apply();
            });

            $scope.$on('successUploadingImage', function (ev, args) {
                $scope.images.push({
                    BigPhotoUri: API_DOMAIN_URL + '/image/' + args.data.BigPhotoName,
                    SmallPhotoUri: API_DOMAIN_URL + '/image/' + args.data.SmallPhotoName
                });

                $scope.currentUploadStateImage = 'waiting';

                $scope.$apply();
            }
            );

            $scope.deleteImage = function (index) {
                $scope.images.splice(index, 1);
            };

            //  FOR BIG IMAGE
            $scope.currentUploadStateBigImage = 'waiting'; // waiting, uploading
            $scope.currentPercentBigImage = 0;

            $scope.$on('beforeSendBigImage', function (ev, args) {
                $scope.currentUploadStateBigImage = 'uploading';
                $scope.currentPercentBigImage = 0;
                $scope.$apply();
            });

            $scope.$on('errorUploadingBigImage', function (ev, args) {

                alert('Размер файла не должен превышать 10 Мб. Разрешённые форматы изображения: JPG, JPEG, PNG, SVG, BMP, GIF. ' +
                    'Или, возможно, вы не авторизовались.');
                $scope.currentUploadStateBigImage = 'waiting';
                $scope.currentPercentBigImage = 0;
                $scope.$apply();
            });

            $scope.$on('progressBigImage', function (ev, args) {
                $scope.currentPercentBigImage = args.progress_value;
                $scope.$apply();
            });

            $scope.$on('successUploadingBigImage', function (ev, args) {
                $scope.newProject.LandingImage = {
                    BigPhotoUri: API_DOMAIN_URL + '/image/' + args.data.BigPhotoName,
                    SmallPhotoUri: API_DOMAIN_URL + '/image/' + args.data.SmallPhotoName
                };

                $scope.currentUploadStateBigImage = 'waiting';

                $scope.$apply();
            });

            $scope.deleteBigImage = function () {
                $scope.newProject.LandingImage = {};
            };

            //   POST REQUESTS
            $scope.registerProject = function () {
                $scope.changeDisable();

                $scope.newProject.Screenshots = $scope.images.map(function (image) {
                    return image;
                });

                $scope.newProject.LinksToGithubRepositories = $scope.chosenRepositories.map(function (repo) {
                    return repo.HtmlUrl;
                })

                var j = 0;
                for (var i = 0; i < $scope.categories.length; i++) {
                    if ($scope.categories[i].status) {
                        $scope.newProject.ProjectTypes[j] = i;
                        j++;
                    }
                }

                ApiService.addProject($scope.newProject).then(function (response) {
                    if (response.isSuccess) {
                        $scope.currentState = 'success';
                        $scope.developerIds = [];
                        $scope.chosenDevelopers.forEach(function (developer) {
                            ApiService.joinToProject(response.projectId, developer.UserId, JSON.stringify(developer.Role));
                            $scope.developerIds.push(developer.UserId);
                        });

                        ApiService.addCollaboratorToRepositories(response.projectId, $scope.developerIds);

                        localStorage.setItem('saved_project', JSON.stringify($scope.newProject));
                        localStorage.setItem('chosen_developers', JSON.stringify($scope.chosenDevelopers));
                        localStorage.setItem('chosen_repositories', JSON.stringify($scope.chosenRepositories));
                        localStorage.setItem('screenshots', JSON.stringify($scope.images));
                        localStorage.setItem('categories', JSON.stringify($scope.categories));

                        pageCounter = 0;
                        $scope.images = [];
                        $scope.developers = [];
                        $scope.chosenDevelopers = [];
                        $scope.repositories = [];
                        $scope.chosenRepositories = [];
                        $scope.isMoreDevs = true;
                        $scope.newProject = new sampleProject();
                        $scope.categories = [{
                            category: 'Веб',
                            status: false,
                            index: 0
                        }, {
                            category: 'Мобильное',
                            status: false,
                            index: 1
                        }, {
                            category: 'Десктопное',
                            status: false,
                            index: 2
                        }, {
                            category: 'Игра',
                            status: false,
                            index: 3
                        }, {
                            category: 'Прочее',
                            status: false,
                            index: 4
                        }];

                        $scope.addProjectForm.$setPristine();

                        $timeout(function () {
                            $scope.currentState = 'filling';
                        }, 3000);
                    } else {
                        $scope.currentState = 'failed';
                    }
                    $scope.changeDisable();
                });
            };

            $scope.$on('userRole_changed', function (e, args) {
                role = TokenService.getRole();
                if (role != 1) {
                    return $state.go('index');
                }
            });

            $scope.$emit('toggle_black', { isBlack: true });
            $scope.$emit('change_title', {
                title: 'Добавление проекта - Лига Разработчиков НИТУ МИСиС'
            });
        }
    ])

    .controller('EditProjectCtrl', ['$scope', '$state', '$location', 'ApiService', 'TokenService', 'ngDialog', '$timeout',
        function ($scope, $state, $location, ApiService, TokenService, ngDialog, $timeout) {
            var role = TokenService.getRole();
            if (role != 1) {
                return $state.go('index');
            }

            var projectId = $state.params.id;
            var pageCounter = 0;
            $scope.isDisabled = false;

            $scope.changeDisable = function () {
                $scope.isDisabled = !$scope.isDisabled;
            }

            $scope.developers = [];
            $scope.chosenDevelopers = [];
            $scope.isMoreDevs = true;
            $scope.currentState = 'filling';
            $scope.editedProject = {};
            $scope.projectMemberships = [];

            if ($state.params.status == 'False') {
                $scope.editedProject = localStorage.getItem('saved_project');
                $scope.$apply();
            }

            //   FOR TYPE OF PROJECT
            $scope.categories = [{
                category: 'Веб',
                status: false,
                index: 0
            }, {
                category: 'Мобильное',
                status: false,
                index: 1
            }, {
                category: 'Десктопное',
                status: false,
                index: 2
            }, {
                category: 'Игра',
                status: false,
                index: 3
            }, {
                category: 'Прочее',
                status: false,
                index: 4
            }];

            $scope.toggleCategory = function (targetCategory) {
                targetCategory.status = !targetCategory.status;
            };

            //   FOR DEVELOPERS

            $scope.resetPageCounter = function () {
                pageCounter = 0;
                $scope.developers = [];
            };

            $scope.toggleOpened = function () {
                $scope.isOpen = !$scope.isOpen;

                if ($scope.isOpen) {
                    $scope.showFirstPage();
                } else {
                    $scope.resetPageCounter();
                }
            };

            var inArray = function (value, array, strict) {
                var found = false, key, strict = !!strict;

                for (key in array) {
                    if ((strict && array[key] === value) || (!strict && array[key] == value)) {
                        found = true;
                        break;
                    }
                }
                return found;
            }


            $scope.showFirstPage = function () {
                ApiService.getFullDevelopers(pageCounter)
                    .then(function (data) {
                        if ($scope.projectMemberships.length == 0) {
                            $scope.developers = $scope.developers.concat(data.Data);

                            $scope.isMoreDevs = ($scope.developers.length + $scope.projectMemberships.length) < data.CountOfEntities;

                            return;
                        } else {
                            var dataId = data.Data.map(function (dataItem) {
                                return dataItem.UserId;
                            });
                            var chosenDevelopersId = $scope.projectMemberships.map(function (developerItem) {
                                return developerItem.UserId;
                            });

                            dataId = dataId.filter(function (id) {
                                return !inArray(id, chosenDevelopersId);
                            });

                            data.Data = data.Data.filter(function (dataItem) {
                                return inArray(dataItem.UserId, dataId);
                            });
                            if (data.Data.length == 0) {
                                $scope.addDevelopers();
                            } else {
                                $scope.developers = $scope.developers.concat(data.Data);
                            }

                            $scope.isMoreDevs = ($scope.developers.length + $scope.projectMemberships.length) < data.CountOfEntities;
                        }
                    });
            };

            $scope.addDevelopers = function () {
                pageCounter++;
                ApiService.getFullDevelopers(pageCounter)
                    .then(function (data) {
                        if (!data || data.Data.length === 0) {
                            $scope.isMoreDevs = false;
                            return;
                        } else if ($scope.projectMemberships.length == 0) {
                            $scope.developers = $scope.developers.concat(data.Data);

                            $scope.isMoreDevs = ($scope.developers.length + $scope.projectMemberships.length) < data.CountOfEntities;

                            return;
                        } else {
                            var dataId = data.Data.map(function (dataItem) {
                                return dataItem.UserId;
                            });
                            var chosenDevelopersId = $scope.projectMemberships.map(function (developerItem) {
                                return developerItem.UserId;
                            });

                            dataId = dataId.filter(function (id) {
                                return !inArray(id, chosenDevelopersId);
                            });

                            data.Data = data.Data.filter(function (dataItem) {
                                return inArray(dataItem.UserId, dataId);
                            });

                            if (data.Data.length == 0) {
                                $scope.addDevelopers();
                            } else {
                                $scope.developers = $scope.developers.concat(data.Data);
                            }

                            $scope.isMoreDevs = ($scope.developers.length + $scope.projectMemberships.length) < data.CountOfEntities;
                        }
                    });
            };

            $scope.$watch("searchText", function (newValue, oldValue) {
                if (newValue === '') {
                    $scope.resetPageCounter();
                    $scope.showFirstPage();

                } else if (newValue !== oldValue) {
                    ApiService.getFullDevelopersBySearch($scope.searchText)
                        .then(function (data) {
                            $scope.isMoreDevs = false;

                            var dataId = data.map(function (dataItem) {
                                return dataItem.UserId;
                            });
                            var chosenDevelopersId = $scope.projectMemberships.map(function (developerItem) {
                                return developerItem.UserId;
                            });

                            dataId = dataId.filter(function (id) {
                                return !inArray(id, chosenDevelopersId);
                            });

                            data = data.filter(function (dataItem) {
                                return inArray(dataItem.UserId, dataId);
                            });

                            $scope.developers = data;
                        });
                }
            });

            $scope.selectDeveloper = function (index) {
                $scope.developers.forEach(function (developerItem, i) {
                    developerItem.isSelect = (index == i);
                    developerItem.Role = ''
                });
            };

            $scope.chooseDeveloper = function (index) {
                if ($scope.developers[index].Role) {
                    $scope.projectMemberships.push($scope.developers[index]);

                    ApiService.joinToProject(projectId, $scope.developers[index].UserId, JSON.stringify($scope.developers[index].Role)).then(function () {
                    });

                    $scope.developers = [];
                    $scope.toggleOpened();
                }
            };

            $scope.deleteDeveloper = function (index) {
                ApiService.escapeFromProject(projectId, $scope.projectMemberships[index].UserId);
                ApiService.removeCollaboratorFromRepositories(projectId, $scope.projectMemberships[index].UserId).then(function () {
                });
                $scope.projectMemberships.splice(index, 1);
                localStorage.setItem('saved_project', JSON.stringify($scope.editedProject));
                localStorage.setItem('chosen_developers', JSON.stringify($scope.projectMemberships));
                localStorage.setItem('categories', JSON.stringify($scope.categories));
            };

            // FOR GITHUB REPOSITORIES

            $scope.isGithubRepoDialogOpen = false;
            $scope.repositories = [];
            $scope.gottenRepositories = $scope.repositories;
            $scope.previousSearchString = "";

            $scope.githubRepoToggleOpened = function () {
                $scope.isGithubRepoDialogOpen = !$scope.isGithubRepoDialogOpen;

                if ($scope.isGithubRepoDialogOpen) {
                    $scope.getGithubRepositories();
                } else {
                    $scope.resetRepositories();
                }
            };

            $scope.getGithubRepositories = function () {
                ApiService.getAllGithubRepositoriesForTheOrganization().then(function (data) {
                    $scope.repositories = [];

                    if ($scope.editedProject.LinksToGithubRepositories.length == 0) {
                        $scope.repositories = $scope.repositories.concat(data);
                        return;
                    } else {
                        var repoUrls = data.map(function (repoItem) {
                            return repoItem.HtmlUrl;
                        });
                        var chosenRepoUrls = $scope.editedProject.LinksToGithubRepositories.map(function (repoItem) {
                            return repoItem.HtmlUrl;
                        });

                        repoUrls = repoUrls.filter(function (url) {
                            return !inArray(url, chosenRepoUrls);
                        });

                        data = data.filter(function (dataItem) {
                            return inArray(dataItem.HtmlUrl, repoUrls);
                        });
                        if (data.length == 0) {
                            $scope.getAllGithubRepositoriesForTheOrganization();
                        } else {
                            $scope.repositories = $scope.repositories.concat(data);
                        }
                    }
                    $scope.gottenRepositories = $scope.repositories;
                })
            };

            $scope.$watch("searchGithubRepository", function (searchString) {
                if ($scope.previousSearchString !== undefined && searchString !== undefined) {
                        if (searchString === '' || searchString.length < $scope.previousSearchString.length) {
                            $scope.repositories = $scope.gottenRepositories;
                        }
                    } 
                    $scope.repositories = $scope.repositories.filter(function (repo) {
                            return repo.Name.toLowerCase().includes(searchString.toLowerCase());
                        });
                $scope.previousSearchString = searchString;
            });

            $scope.resetRepositories = function () {
                $scope.repositories = [];
            }

            $scope.chooseRepo = function (index) {
                $scope.editedProject.LinksToGithubRepositories.push({
                    HtmlUrl: $scope.repositories[index].HtmlUrl
                });
                $scope.repositories = [];
                $scope.githubRepoToggleOpened();
            };

            $scope.deleteRepo = function (index) {
                $scope.changeDisable();
                $scope.editedProject.LinksToGithubRepositories.splice(index, 1);
                $scope.changeDisable();
            };

            $scope.isGithubRepoNameInputDialogOpen = false;
            $scope.newRepositoryName = "";

            $scope.createRepository = function () {
                $scope.changeDisable();
                ApiService.createGithubRepository($scope.newRepositoryName).then(function () {
                    $scope.changeDisable();
                });
                localStorage.setItem('saved_project', JSON.stringify($scope.editedProject));
                localStorage.setItem('chosen_developers', JSON.stringify($scope.projectMemberships));
                localStorage.setItem('categories', JSON.stringify($scope.categories));
                $scope.repoNameInputToggleOpened();
            }

            $scope.repoNameInputToggleOpened = function () {
                $scope.isGithubRepoNameInputDialogOpen = !$scope.isGithubRepoNameInputDialogOpen;
            }

            //   FOR SMALL IMAGES
            $scope.currentUploadStateImage = "waiting"; // waiting, uploading
            $scope.currentPercentImage = 0;

            $scope.$on('beforeSendImage', function (ev, args) {
                $scope.currentUploadStateImage = 'uploading';
                $scope.currentPercentImage = 0;
                $scope.$apply();
            });

            $scope.$on('errorUploadingImage', function (ev, args) {

                alert('Размер файла не должен превышать 10 Мб. Разрешённые форматы изображения: JPG, JPEG, PNG, SVG, BMP, GIF. ' +
                    'Или, возможно, вы не авторизовались.');
                $scope.currentUploadStateImage = 'waiting';
                $scope.currentPercentImage = 0;
                $scope.$apply();
            });

            $scope.$on('progressImage', function (ev, args) {
                $scope.currentPercentImage = args.progress_value;
                $scope.$apply();
            });

            $scope.$on('successUploadingImage', function (ev, args) {
                $scope.editedProject.Screenshots.push({
                    BigPhotoUri: API_DOMAIN_URL + '/image/' + args.data.BigPhotoName,
                    SmallPhotoUri: API_DOMAIN_URL + '/image/' + args.data.SmallPhotoName
                });

                $scope.currentUploadStateImage = 'waiting';

                $scope.$apply();
            }
            );

            $scope.deleteImage = function (fileItem, index) {
                $scope.editedProject.Screenshots.splice(index, 1);
            };

            //  FOR BIG IMAGE
            $scope.currentUploadStateBigImage = 'waiting'; // waiting, uploading
            $scope.currentPercentBigImage = 0;

            $scope.$on('beforeSendBigImage', function (ev, args) {
                $scope.currentUploadStateBigImage = 'uploading';
                $scope.currentPercentBigImage = 0;
                $scope.$apply();
            });

            $scope.$on('errorUploadingBigImage', function (ev, args) {

                alert('Размер файла не должен превышать 10 Мб. Разрешённые форматы изображения: JPG, JPEG, PNG, SVG, BMP, GIF. ' +
                    'Или, возможно, вы не авторизовались.');
                $scope.currentUploadStateBigImage = 'waiting';
                $scope.currentPercentBigImage = 0;
                $scope.$apply();


            });

            $scope.$on('progressBigImage', function (ev, args) {
                $scope.currentPercentBigImage = args.progress_value;
                $scope.$apply();
            });

            $scope.$on('successUploadingBigImage', function (ev, args) {
                $scope.editedProject.LandingImage = {
                    BigPhotoUri: API_DOMAIN_URL + '/image/' + args.data.BigPhotoName,
                    SmallPhotoUri: API_DOMAIN_URL + '/image/' + args.data.SmallPhotoName
                };

                $scope.currentUploadStateBigImage = 'waiting';

                $scope.$apply();
            });

            $scope.deleteBigImage = function () {
                $scope.editedProject.LandingImage = {};
            };

            //   GET REQUEST
            

            if ($state.params.success == 'False') {
                $scope.editedProject = JSON.parse(localStorage.getItem('saved_project'));
                $scope.projectMemberships = JSON.parse(localStorage.getItem('chosen_developers'));
                $scope.categories = JSON.parse(localStorage.getItem('categories'));
                localStorage.removeItem('saved_project');
                localStorage.removeItem('chosen_developers');
                localStorage.removeItem('categories');
                $scope.action = $state.params.action;
                if ($scope.action == 'add_collaborator') {
                    $scope.currentState = 'failed_to_add_collaborator';
                }
                if ($scope.action == 'remove_collaborator') {
                    $scope.currentState = 'failed_to_remove_collaborator';
                }
                if ($scope.action == 'create_repository') {
                    $scope.currentState = 'failed_to_create_repository';
                }
            }
            if ($state.params.success == 'True') {
                $scope.editedProject = JSON.parse(localStorage.getItem('saved_project'));
                $scope.projectMemberships = JSON.parse(localStorage.getItem('chosen_developers'));
                $scope.categories = JSON.parse(localStorage.getItem('categories'));
                localStorage.removeItem('saved_project');
                localStorage.removeItem('chosen_developers');
                localStorage.removeItem('categories');
                if ($state.params.action == 'create_repository') {
                    var repo = $state.params.repository_link;
                    $scope.editedProject.LinksToGithubRepositories.push({ 'HtmlUrl': repo });
                } else if ($state.params.action != 'remove_collaborator') {
                    $scope.currentState = 'success';
                }
            } else {
                ApiService.getProject(projectId)
                    .then(function (data) {
                        $scope.projectMemberships = data.data.ProjectMemberships.map(function (developer) {
                            return {
                                UserId: developer.DeveloperId,
                                FirstName: developer.FirstName,
                                LastName: developer.LastName,
                                Role: developer.Role
                            }
                        });
                        $scope.editedProject.Name = data.data.Name;
                        $scope.editedProject.ProjectTypes = data.data.ProjectType;
                        $scope.editedProject.Info = data.data.Info;
                        $scope.editedProject.AccessLevel = data.data.AccessLevel;
                        $scope.editedProject.ProjectStatus = data.data.ProjectStatus;
                        $scope.editedProject.LandingImage = data.data.LandingImage;
                        $scope.editedProject.Screenshots = data.data.Screenshots;
                        $scope.editedProject.LinksToGithubRepositories = data.data.LinksToGithubRepositories.map(function (link) {
                            return {
                                HtmlUrl: link
                            }
                        });

                        for (var i = 0; i < $scope.editedProject.ProjectTypes.length; i++) {
                            $scope.categories[$scope.editedProject.ProjectTypes[i]].status = true;
                        }

                        $scope.$emit('change_title', { title: $scope.editedProject.Name + ' - Лига Разработчиков НИТУ МИСиС' });
                    });
            };

            $location.url($location.path());

            //   PUT REQUEST
            $scope.editProject = function () {
                $scope.changeDisable();

                var j = 0;
                $scope.editedProject.ProjectTypes = [];
                for (var i = 0; i < $scope.categories.length; i++) {
                    if ($scope.categories[i].status) {
                        $scope.editedProject.ProjectTypes[j] = i;
                        j++;
                    }
                }

                $scope.editedProject.LinksToGithubRepositories = $scope.editedProject.LinksToGithubRepositories.map(function (link) {
                    return link.HtmlUrl;
                });

                ApiService.editProject(projectId, $scope.editedProject).then(function (isSuccess) {
                    if (isSuccess) {
                        $scope.currentState = 'success';
                        $scope.developerIds = [];
                        $scope.projectMemberships.forEach(function (developer) {
                            $scope.developerIds.push(developer.UserId);
                        });
                        ApiService.addCollaboratorToRepositories(projectId, $scope.developerIds);
                        localStorage.setItem('saved_project', JSON.stringify($scope.editedProject));
                        localStorage.setItem('chosen_developers', JSON.stringify($scope.projectMemberships));
                        localStorage.setItem('categories', JSON.stringify($scope.categories));
                        $scope.editedProject.LinksToGithubRepositories = $scope.editedProject.LinksToGithubRepositories.map(function (link) {
                            return {
                                HtmlUrl: link
                            }
                        });
                        $timeout(function () {
                            $scope.currentState = 'filling';
                        }, 3000);
                    } else {
                        $scope.currentState = 'failed';
                    }
                    $scope.changeDisable();
                });
            };

            $scope.$on('userRole_changed', function (e, args) {
                role = TokenService.getRole();
                if (role != 1) {
                    return $state.go('index');
                }
            });

            $scope.$emit('toggle_black', { isBlack: true });
        }])

    .controller('AdminNotificationCtrl', ['$scope', '$state',
        '$timeout',
        'ApiService',
        'TokenService',
        function ($scope, $state, $timeout, ApiService, TokenService) {
            var token = TokenService.getToken();
            var role = TokenService.getRole();
            $scope.notificationMessage = {};
            if (!token || role != 1) {
                return $state.go('index');
            }
            $scope.isDisabled = false;

            $scope.changeDisable = function () {
                $scope.isDisabled = !$scope.isDisabled;
            }

            $scope.createNotification = function () {
                $scope.changeDisable();
                $scope.notificationMessage = { InfoText: $scope.notification };
                ApiService.createNotification(JSON.stringify($scope.notificationMessage)).then(function (isSuccess) {
                    $scope.currentState = isSuccess ? 'success' : 'failed';
                    if (isSuccess) {
                        $scope.notification = '';

                        $timeout(function () {
                            $scope.currentState = '';
                        }, 4000);
                    }
                    $scope.changeDisable();
                });
            };

            $scope.$on('userRole_changed', function (e, args) {
                role = TokenService.getRole();
                if (role != 1) {
                    return $state.go('index');
                }
            });

            $scope.$emit('toggle_black', { isBlack: true });
            $scope.$emit('change_title', {
                title: 'Создание уведомления - Лига Разработчиков НИТУ МИСиС'
            })
        }])

    .controller('AdminDevelopersCtrl', ['$scope', '$state',
        'ApiService',
        'DateService',
        function ($scope, $state, ApiService, DateService) {
            $scope.developers = [];
            $scope.searchText = '';
            $scope.isMoreDevs = true;
            $scope.isOpen = false;
            var pageCounter = 0;

            $scope.isFailed = false;

            $scope.resetPageCounter = function () {
                pageCounter = 0;
            };
            $scope.isDisabled = false;

            $scope.changeDisable = function () {
                $scope.isDisabled = !$scope.isDisabled;
            }

            $scope.addDevelopers = function () {
                $scope.changeDisable();
                pageCounter++;
                ApiService.getFullDevelopers(pageCounter)
                    .then(function (data) {
                        if (!data || data.Data.length === 0) {
                            $scope.isMoreDevs = false;
                        } else {
                            data.Data.forEach(function (developer) {
                                $scope.developers.push({
                                    Name: developer.LastName + ' ' + developer.FirstName,
                                    UserId: developer.UserId,
                                    RegistrationDate: DateService.getDDMMYYFromISODate(Date.parse(developer.RegistrationDate)),
                                    ConfirmationStatus: developer.ConfirmationStatus,
                                    IsHidden: developer.IsHidden,
                                    AccountRole: developer.AccountRole
                                });
                            });

                            $scope.isMoreDevs = $scope.developers.length < data.CountOfEntities;
                        }
                        $scope.changeDisable();
                    });
            };

            $scope.callConfirmationWindow = function (developer, eventType, index) {
                $scope.developerForConfirmation = {
                    id: developer.UserId,
                    name: developer.Name,
                    registrationDate: developer.RegistrationDate,
                    newRegistrationDate: developer.RegistrationDate,
                    eventType: eventType,
                    index: index
                };

                if (eventType == 0 && $scope.developers[index].ConfirmationStatus == 1) {
                    $scope.message = ' будет подтверждён. Вы точно в этом уверены?';
                } else if (eventType == 1 && !$scope.developers[index].AccountRole) {
                    $scope.message = ' получит права администратора. Вы точно в этом уверены?';
                } else if (eventType == 2) {
                    if ($scope.developers[index].IsHidden) {
                        $scope.message = ' станет виден. Вы точно в этом уверены?';
                    } else {
                        $scope.message = ' будет скрыт. Вы точно в этом уверены?';
                    }
                } else if (eventType == 3) {
                    $scope.message = 'Изменить дату регистрации пользователя ';
                }
                else {
                    return;
                }

                $scope.isOpen = true;
            };

            $scope.closeWindow = function () {
                $scope.isOpen = false;
                $scope.developerForConfirmation = {};
            };

            $scope.sendRequest = function () {
                $scope.changeDisable();
                switch ($scope.developerForConfirmation.eventType) {
                    case 0:
                        $scope.isFailed = false;
                        ApiService.confirmDeveloper($scope.developerForConfirmation.id).then(function (isSuccess) {
                            if (isSuccess) {
                                $scope.developers[$scope.developerForConfirmation.index].ConfirmationStatus = 2;

                                $scope.developerForConfirmation = {};

                                $scope.closeWindow();
                            }
                            else {
                                $scope.isFailed = true;
                            }
                            $scope.changeDisable();
                        });
                        break;
                    case 1:
                        $scope.isFailed = false;
                        ApiService.changeAccountRole($scope.developerForConfirmation.id).then(function (isSuccess) {
                            if (isSuccess) {
                                $scope.developers[$scope.developerForConfirmation.index].AccountRole = 1;

                                $scope.developerForConfirmation = {};

                                $scope.closeWindow();
                            }
                            else {
                                $scope.isFailed = true;
                            }
                            $scope.changeDisable();
                        });
                        break;
                    case 2:
                        $scope.isFailed = false;
                        ApiService.changeHidingStatus($scope.developerForConfirmation.id, !$scope.developers[$scope.developerForConfirmation.index].IsHidden)
                            .then(function (isSuccess) {
                                if (isSuccess) {
                                    $scope.developers[$scope.developerForConfirmation.index].IsHidden = !$scope.developers[$scope.developerForConfirmation.index].IsHidden;

                                    $scope.developerForConfirmation = {};

                                    $scope.closeWindow();
                                }
                                else {
                                    $scope.isFailed = true;
                                }
                                $scope.changeDisable();
                            });
                        break;
                    case 3:
                        $scope.isFailed = false;
                        if ($scope.developerForConfirmation.registrationDate != $scope.developerForConfirmation.newRegistrationDate) {
                            var dateString = [$scope.developerForConfirmation.newRegistrationDate.slice(0, 2), '.',
                                $scope.developerForConfirmation.newRegistrationDate.slice(2)].join('');
                            dateString = [dateString.slice(0, 5), '.',
                                dateString.slice(5)].join('');
                            ApiService.changeDeveloperRegistrationDate($scope.developerForConfirmation.id, dateString)
                                .then(function (isSuccess) {
                                    if (isSuccess) {
                                        $scope.developers[$scope.developerForConfirmation.index].RegistrationDate = [dateString.slice(0, 6), '',
                                            dateString.slice(8)].join('');

                                        $scope.developerForConfirmation = {};

                                        $scope.closeWindow();
                                    }
                                    else {
                                        $scope.isFailed = true;
                                    }
                                    $scope.changeDisable();
                                });
                        }
                        else {
                            $scope.developerForConfirmation = {};
                            $scope.changeDisable();
                            $scope.closeWindow();
                        }
                        break;
                };
                $scope.isFailed = false;
            };


            $scope.$watch("searchText", function (newValue, oldValue) {
                if (newValue === '') {
                    $scope.resetPageCounter();

                    $scope.developers = [];

                    ApiService.getFullDevelopers(pageCounter)
                        .then(function (data) {
                            data.Data.forEach(function (developer) {
                                $scope.developers.push({
                                    Name: developer.LastName + ' ' + developer.FirstName,
                                    UserId: developer.UserId,
                                    RegistrationDate: DateService.getDDMMYYFromISODate(Date.parse(developer.RegistrationDate)),
                                    ConfirmationStatus: developer.ConfirmationStatus,
                                    IsHidden: developer.IsHidden,
                                    AccountRole: developer.AccountRole
                                });
                            });

                            $scope.isMoreDevs = $scope.developers.length < data.CountOfEntities;

                        });
                } else if (newValue !== oldValue) {
                    ApiService.getFullDevelopersBySearch($scope.searchText)
                        .then(function (data) {
                            $scope.isMoreDevs = false;

                            $scope.developers = [];

                            data.forEach(function (developer) {
                                $scope.developers.push({
                                    Name: developer.LastName + ' ' + developer.FirstName,
                                    UserId: developer.UserId,
                                    RegistrationDate: DateService.getDDMMYYFromISODate(Date.parse(developer.RegistrationDate)),
                                    ConfirmationStatus: developer.ConfirmationStatus,
                                    IsHidden: developer.IsHidden,
                                    AccountRole: developer.AccountRole
                                });
                            });
                        });
                }
            });

            $scope.$emit('toggle_black', { isBlack: true });
            $scope.$emit('change_title', { title: 'Редактирование разработчиков - Лига Разработчиков НИТУ МИСиС' });
        }])


    //other
    .controller('SignupCtrl', ['$scope', '$state', '$location', 'ApiService', '$timeout',
        function ($scope, $state, $location, ApiService, $timeout) {
        $scope.currentStates = {};
        $scope.newDeveloper = {};
        $scope.repeatedPassword = undefined;
        $scope.currentDate = new Date();
        $scope.isDisabled = false;

        if ($state.params.success == 'False') {
            $scope.newDeveloper = JSON.parse(localStorage.getItem('saved_profile_info'));
            localStorage.removeItem('saved_profile_info');
            $scope.newDeveloper.PhoneNumber = $scope.newDeveloper.PhoneNumber.slice(1);
            $scope.currentStates.isRegisteredGithubAccount = true;
            $location.url($location.path());
        };
        if ($state.params.success == 'True') {
            if ($state.params.registration_type == 'lod') {
                $scope.newDeveloper = JSON.parse(localStorage.getItem('saved_profile_info'));
                localStorage.removeItem('saved_profile_info');
                $scope.newDeveloper.PhoneNumber = $scope.newDeveloper.PhoneNumber.slice(1);
                $location.url($location.path());
                $scope.currentStates.isSuccess = true;
            } else {
                $state.go('success');
            }
        };

        $scope.signUp = function () {
            $scope.changeDisable();
            $scope.newDeveloper.PhoneNumber = '7' + $scope.newDeveloper.PhoneNumber;

            !$scope.isPasswordRequired ?
                ApiService.signUpWithGithub($scope.newDeveloper).then(function () {
                    localStorage.setItem('saved_profile_info', JSON.stringify($scope.newDeveloper));
                }) :
                ApiService.signUp($scope.newDeveloper).then(function (responseObject) {
                    $scope.currentStates = {};
                    localStorage.setItem('saved_profile_info', JSON.stringify($scope.newDeveloper));
                    if (responseObject) {
                        if (responseObject.status === 200) {
                            ApiService.getRedirectionToAuthenticationGithubForm(responseObject.data);
                        } else if (responseObject.status === 409) {
                            $scope.currentStates.isRegisteredEmail = true;
                        } else {
                            $scope.currentStates.isFailed = true;
                        }
                    } else {
                        $scope.currentStates.isFailed = true;
                    }
                    $scope.newDeveloper.PhoneNumber = $scope.newDeveloper.PhoneNumber.slice(1);
                    $scope.changeDisable();
                });
        };

        $scope.changeDisable = function () {
            $scope.isDisabled = !$scope.isDisabled;
        }

        $scope.$emit('toggle_black', { isBlack: true });
        $scope.$emit('change_title', { title: 'Стать разработчиком - Лига Разработчиков НИТУ МИСиС' });
    }])

    .controller('AboutCtrl', ['$scope', function ($scope) {
        ymaps.ready(init);
        var map, collection, polylines;

        function init() {
            map = new ymaps.Map("map", {
                center: [55.72667388793981, 37.60625375300586],
                zoom: 17,
                size: [null, 450],
                lang: "",
                type: "yandex#map",
                traffic: { "shown": false }
            },
                {
                    suppressMapOpenBlock: true
                });

            collection = new ymaps.GeoObjectCollection();
            polylines = [
                new ymaps.Placemark(
                    [55.726393150886125, 37.606740556111525],
                    {
                        hintContent: 'Лига Разработчиков (5й этаж, Г-588)',
                        balloonContent: 'Лига Разработчиков (5й этаж, Г-588)',
                    },
                    {
                        preset: "islands#orangeDotIcon"
                    }
                ),
                new ymaps.GeoObject({
                    geometry: {
                        type: "LineString",
                        coordinates: [[
                            55.72696229923229,
                            37.607824168555936
                        ],
                        [
                            55.726529384354315,
                            37.606568894736974
                        ]]
                    },
                    properties: {
                        hintContent: "Путь из корпуса \"А\"",
                        balloonContent: "Путь из корпуса \"А\"",
                    }
                },
                    {
                        strokeColor: "#177bc9",
                        strokeWidth: 5
                    }
                ),
                new ymaps.GeoObject({
                    geometry: {
                        type: "LineString",
                        coordinates: [[
                            55.72851118975991,
                            37.60874775027792
                        ],
                        [
                            55.728526325960175,
                            37.60895696258108
                        ],
                        [
                            55.72796628285632,
                            37.60994401549855
                        ],
                        [
                            55.72665544769674,
                            37.60768559550788
                        ],
                        [
                            55.72690066502515,
                            37.607229619975406
                        ],
                        [
                            55.726534352164826,
                            37.606559067721726
                        ]]
                    },
                    properties: {
                        hintContent: "Путь от главного входа НИТУ МИСиС",
                        balloonContent: "Путь от главного входа НИТУ МИСиС",
                    }
                },
                    {
                        strokeColor: "#1e98ff",
                        strokeWidth: 5
                    }),
                new ymaps.GeoObject({
                    geometry: {
                        type: "LineString",
                        coordinates: [[
                            55.72652303781649,
                            37.60654812898927
                        ],
                        [
                            55.7264594624862,
                            37.60643011179261
                        ]]
                    }
                },
                    {
                        strokeColor: "#b3b3b3",
                        strokeWidth: 3
                    }),
                new ymaps.GeoObject({
                    geometry: {
                        type: "LineString",
                        coordinates: [[
                            55.72690563942714,
                            37.60720795240702
                        ],
                        [
                            55.72713874578818,
                            37.60679489221874
                        ],
                        [
                            55.72670280548235,
                            37.60600632276835
                        ],
                        [
                            55.726336490751585,
                            37.60665541734995
                        ],
                        [
                            55.72639401146243,
                            37.6067519768745
                        ]]
                    },
                    properties: {
                        hintContent: "Проход через главный корпус Горного института (корпуса соединены проходом на втором и третьем этажах)",
                        balloonContent: "Проход через главный корпус Горного института (корпуса соединены проходом на втором и третьем этажах)",
                    }
                },
                    {
                        strokeColor: "#b3b3b3",
                        strokeWidth: 3
                    })
            ];

            for (var i = 0; i < polylines.length; i++) {
                collection.add(polylines[i]);
            }

            map.geoObjects.add(collection);
        }

        $scope.$emit('toggle_black', { isBlack: true });
        $scope.$emit('change_title', {
            title: 'О нас - Лига Разработчиков НИТУ МИСиС'
        });
    }])

    .controller('ContactCtrl', ['$scope', '$state', 'ApiService', function ($scope, $state, ApiService) {
        $scope.data = {};

        $scope.isDisabled = false;

        $scope.changeDisable = function () {
            $scope.isDisabled = !$scope.isDisabled;
        }

        $scope.Request = function () {
            $scope.changeDisable();
            ApiService.contact($scope.data).then(function (isSuccess) {
                if (isSuccess) {
                    $scope.isSuccess = isSuccess;

                    $scope.ContactForm.$setPristine();
                    $scope.data = {};

                    setTimeout(function () {
                        $scope.isSuccess = '';
                    }
                        , 2000);
                } else {
                    $state.go('error');
                }
                $scope.changeDisable();
            });
        }

        $scope.$emit('toggle_black', { isBlack: true });

        $scope.$emit('change_title', {
            title: 'Cвязаться - Лига Разработчиков НИТУ МИСиС'
        });
    }])

    .controller('LoginFormCtrl', ['$scope',
        'ApiService',
        '$state',
        '$timeout',
        'WebSocketService',
        function ($scope, ApiService, $state, $timeout, WebSocketService) {
            var date = new Date();
            var hour = date.getHours();
            $scope.timeOfDay = (hour > 4 && hour < 12) ? 'morning' :
                (hour >= 12 && hour <= 18) ? 'afternoon' :
                    (hour > 18 && hour < 24) ? 'evening' :
                        'night';
            $scope.isNoDeveloper = false;
            $scope.userLogin = {};
            $scope.status = 'loginForm';
            $scope.isDisabled = false;

            $scope.changeDisable = function () {
                $scope.isDisabled = !$scope.isDisabled;
            }

            $scope.cons = function () { console.log($scope.userLogin.emailForRecovery); }

            $scope.signIn = function () {
                $scope.changeDisable();
                ApiService.signIn($scope.userLogin).then(function (isSuccess) {
                    if (isSuccess) {
                        $scope.userLogin = {};
                        $scope.loginForm.$setPristine();
                        $scope.closeThisDialog('.form__close-button');
                        WebSocketService.start();
                        $state.reload();
                    } else {
                        $scope.isNoDeveloper = true;
                    }
                    $scope.changeDisable();
                });
            };

            $scope.signInWithGithub = function () {
                $scope.changeDisable()
                ApiService.signInWithGithub().then(function () {
                    $scope.changeDisable();
                });
            }

            $scope.toggleStatus = function () {
                $scope.status = ($scope.status == 'loginForm') ? 'passwordRecovery' : 'loginForm';
            };

            $scope.recoverPassword = function () {
                $scope.changeDisable();
                ApiService.getLinkForPasswordRecovery($scope.userLogin.emailForRecovery).then(function (isSuccess) {
                    if (isSuccess) {
                        $scope.isSuccess = true;
                        $scope.userLogin.emailForRecovery = '';
                        $timeout(function () { isSuccess = ''; }, 4000);
                    }
                    else {
                        $state.go('error');
                    }
                    $scope.changeDisable();
                });
            };

        }])

    .controller('GithubLoginCtrl', ['$scope', '$state', '$base64', 'ApiService', 'TokenService', 'WebSocketService',
        function ($scope, $state, $base64, ApiService, TokenService, WebSocketService) {
            if ($state.params.success == 'True') {
                $scope.isNoDeveloper = false;
                $scope.decodedToken = $base64.decode($state.params.encoded_token);
                var decodedToken = JSON.parse($scope.decodedToken);
                TokenService.setToken(decodedToken);
                WebSocketService.start();
                $state.transitionTo('index', {
                    location: true,
                    inherit: true,
                    relative: $state.$current,
                    notify: false
                });
            }
            else {
                $state.go('error');
            }
        }])

    .controller('EmailConfirmationCtrl', ['$scope', 'ApiService', '$state', function ($scope, ApiService, $state) {
        var token = $state.params.token;

        ApiService.developerConfirmation(token).then(function (isSuccess) {
            $scope.isSuccess = isSuccess;
        });

        $scope.$emit('toggle_black', { isBlack: true });
    }])

    .controller('NotificationsCtrl', ['$scope',
        '$state',
        'TokenService',
        'ApiService',
        '$timeout',
        function ($scope, $state, TokenService, ApiService, $timeout) {
            var token = TokenService.getToken();
            if (!token) {
                return $state.go('index');
            }

            $scope.isDisabled = false;

            $scope.changeDisable = function () {
                $scope.isDisabled = !$scope.isDisabled;
            }
            $scope.currentState = null;

            var pageCounter = 0;
            $scope.notifications = {
                Read: [],
                Unread: []
            };

            var inArray = function (value, array, strict) {
                var found = false, key, strict = !!strict;

                for (key in array) {
                    if ((strict && array[key] === value) || (!strict && array[key] == value)) {
                        found = true;
                        break;
                    }
                }
                return found;
            };

            var sortNotifications = function (notifications) {

                notifications.Read.sort(function compareNumeric(a, b) {
                    return b.OccuredOn - a.OccuredOn;
                });

                notifications.Unread.sort(function compareNumeric(a, b) {
                    return b.OccuredOn - a.OccuredOn;
                });

                return notifications;
            };

            var filterNotifications = function (notifications) {
                var newNotifications = {
                    Read: [],
                    Unread: []
                }

                newNotifications.Read = notifications.filter(function (item) {
                    return item.WasRead;
                });

                newNotifications.Unread = notifications.filter(function (item) {
                    return !item.WasRead;
                });

                var readNewNotifId = newNotifications.Read.map(function (notification) {
                    return notification.Id;
                });
                var unreadNewNotifId = newNotifications.Unread.map(function (notification) {
                    return notification.Id;
                });

                var readOldNotifId = $scope.notifications.Read.map(function (notification) {
                    return notification.Id;
                });
                var unreadOldNotifId = $scope.notifications.Unread.map(function (notification) {
                    return notification.Id;
                });

                readNewNotifId = readNewNotifId.filter(function (id) {
                    return !inArray(id, readOldNotifId);
                });
                unreadNewNotifId = unreadNewNotifId.filter(function (id) {
                    return !inArray(id, unreadOldNotifId);
                });

                newNotifications.Read = newNotifications.Read.filter(function (notification) {
                    return inArray(notification.Id, readNewNotifId);
                });
                newNotifications.Unread = newNotifications.Unread.filter(function (notification) {
                    return inArray(notification.Id, unreadNewNotifId);
                });

                return newNotifications;
            };

            var supplementInfo = function (notifications) {
                notifications = notifications.map(function (notification) {
                    switch (notification.EventType) {
                        case 'NewEmailConfirmedDeveloper':
                            if (notification.EventInfo.FirstName == undefined || notification.EventInfo.LastName == undefined) {
                                ApiService.getDeveloper(notification.EventInfo.UserId).then(function (data) {
                                    notification.EventInfo.FirstName = data.data.FirstName;
                                    notification.EventInfo.LastName = data.data.LastName;
                                });
                            }
                            break;
                        case 'NewFullConfirmedDeveloper':
                            if (notification.EventInfo.FirstName == undefined || notification.EventInfo.LastName == undefined) {
                                ApiService.getDeveloper(notification.EventInfo.NewDeveloperId).then(function (data) {
                                    notification.EventInfo.FirstName = data.data.FirstName;
                                    notification.EventInfo.LastName = data.data.LastName;
                                });
                            }
                            break;
                        case 'NewDeveloperOnProject':
                            if (notification.EventInfo.FirstName == undefined || notification.EventInfo.LastName == undefined) {
                                ApiService.getDeveloper(notification.EventInfo.UserId).then(function (data) {
                                    notification.EventInfo.FirstName = data.data.FirstName;
                                    notification.EventInfo.LastName = data.data.LastName;
                                });
                            }
                            if (notification.EventInfo.ProjectName == undefined) {
                                ApiService.getProject(notification.EventInfo.ProjectId).then(function (data) {
                                    notification.EventInfo.ProjectName = data.data.Name;
                                });
                            }
                            break;

                        case 'NewProjectCreated':
                            if (notification.EventInfo.ProjectName == undefined) {
                                ApiService.getProject(notification.EventInfo.ProjectId).then(function (data) {
                                    notification.EventInfo.ProjectName = data.data.Name;
                                });
                            }
                            break;
                        case 'DeveloperHasLeftProject':
                            if (notification.EventInfo.FirstName == undefined || notification.EventInfo.LastName == undefined) {
                                ApiService.getDeveloper(notification.EventInfo.UserId).then(function (data) {
                                    notification.EventInfo.FirstName = data.data.FirstName;
                                    notification.EventInfo.LastName = data.data.LastName;
                                });
                            }
                            if (notification.EventInfo.ProjectName == undefined) {
                                ApiService.getProject(notification.EventInfo.ProjectId).then(function (data) {
                                    notification.EventInfo.ProjectName = data.data.Name;
                                });
                            }
                            break;
                    }
                });

                return notifications;
            };

            $scope.addNotifications = function () {
                $scope.changeDisable();
                ApiService.getNotifications(pageCounter).then(function (data) {
                    var newNotifications = filterNotifications(data.Data);

                    var notifications = {
                        Read: $scope.notifications.Read.concat(newNotifications.Read),
                        Unread: $scope.notifications.Unread.concat(newNotifications.Unread)
                    };

                    $scope.notifications = sortNotifications(notifications);

                    supplementInfo($scope.notifications.Read);
                    supplementInfo($scope.notifications.Unread);

                    $scope.isMoreNotif = ($scope.notifications.Unread.length + $scope.notifications.Read.length) < data.CountOfEntities;

                    pageCounter++;
                    $scope.changeDisable();
                });
            };

            $scope.readNotifications = function () {
                var notifIds = $scope.notifications.Unread.map(function (notification) {
                    return notification.Id;
                });

                ApiService.readNotifications(notifIds).then(function (isSuccess) {
                    if (!isSuccess) {
                        $scope.currentState = 'failed';
                    }
                    else {
                        $scope.notifications.Unread.forEach(function (item) {
                            item.WasRead = true;
                        });

                        var newNotifications = filterNotifications($scope.notifications.Unread);

                        var notifications = {
                            Read: $scope.notifications.Read.concat(newNotifications.Read),
                            Unread: []
                        };

                        $scope.notifications = sortNotifications(notifications);
                    }
                });
            };

            $scope.addNotifications();

            $scope.$on('userRole_changed', function (e, args) {
                token = TokenService.getToken();
                if (!token || !token.UserId) {
                    return $state.go('index');
                }
            });

            $scope.$on('notificationsAmount_changed', function (e) {
                $timeout(function () {
                    pageCounter = 0;
                    $scope.addNotifications();
                    $scope.$apply();
                }, 1000);
            });

            $scope.$emit('change_title', {
                title: 'Оповещения - Лига Разработчиков НИТУ МИСиС'
            });
            $scope.$emit('toggle_black', { isBlack: true });
        }])

    .controller('PasswordRecoveryCtrl', ['$scope', 'ApiService', '$state', function ($scope, ApiService, $state) {
        $scope.data = {
            Token: $state.params.token,
            NewPassword: ''
        };

        $scope.isDisabled = false;

        $scope.changeDisable = function () {
            $scope.isDisabled = !$scope.isDisabled;
        }

        $scope.recoverPassword = function () {
            $scope.changeDisable();
            ApiService.recoverPassword($scope.data).then(function (isSuccess) {
                $scope.isSuccess = isSuccess;

                $scope.data = {
                    Token: '',
                    NewPassword: ''
                };
                $scope.repeatedPassword = '';
                $scope.changeDisable();
            });
        };

        $scope.$emit('change_title', {
            title: 'Восстановление пароля - Лига Разработчиков НИТУ МИСиС'
        });
        $scope.$emit('toggle_black', { isBlack: true });
    }])

    .controller('ErrorCtrl', ['$scope', '$state', function ($scope, $state) {
        $scope.errorMessage = 'выполнить действие';
        $scope.closeDialog = function () {
            $state.transitionTo('index', {
                location: true,
                inherit: true,
                relative: $state.$current,
                notify: false
            });
        }
    }])

    .controller('SuccessCtrl', ['$scope', '$state', function ($scope, $state) {
        $scope.successMessage = 'Вы были зарегистрированы. Ждите подтверждения администратора';
        $scope.closeDialog = function () {
            $state.transitionTo('index', {
                location: true,
                inherit: true,
                relative: $state.$current,
                notify: false
            });
        }
    }])
    ;