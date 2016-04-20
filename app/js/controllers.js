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
         $scope.$emit('change_title', {title: 'Лига Разработчиков НИТУ МИСиС'});
         $scope.$emit('toggle_black');
       }])


       //header and footer
       .controller('HeaderCtrl', ['$scope', 'ngDialog', 'TokenService', '$state', 'NotificationsService',
         function ($scope, ngDialog, TokenService, $state, NotificationsService) {
           $scope.isOpened = false;
           $scope.activeToggle = function () { $scope.isOpened = !$scope.isOpened; };
           $scope.openLoginDialog = function () {
             $scope.$dialog = ngDialog.open({
               template: 'loginTemplate',
               showClose: true,
               closeByNavigation: true
             });
           };
           $scope.signOut = function () {
             TokenService.resetToken();
             TokenService.getRole();
             NotificationsService.stopShowNotificationsAmount();
             $state.reload();
           };
           if (TokenService.getToken()) {
             NotificationsService.startShowNotificationsAmount();
           }

           $scope.$on('$locationChangeSuccess', function () {
             $scope.isOpened = false;
           });
         }])

       .controller('FooterCtrl', ['$scope', function ($scope) {
         $scope.currentDate = new Date();
       }])


       //developers
       .controller('RandomDevelopersCtrl', ['$scope', 'ApiService', function ($scope, ApiService) {
         var numberOfDevelopers = getDevsSectionAmount();

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

         $scope.resetPageCounter = function () {
           pageCounter = 0;
         };
         $scope.addDevelopers = function () {
           pageCounter++;
           ApiService.getFullDevelopers(pageCounter)
                     .then(function (data) {
                       if (!data || data.length === 0) {
                         $scope.isMoreDevs = false;
                       } else {
                         $scope.fullDevelopers = $scope.fullDevelopers.concat(data);
                         ;
                       }
                     });
         };

         $scope.$watch("searchText", function (newValue, oldValue) {
           if (newValue === '') {
             $scope.resetPageCounter();
             ApiService.getFullDevelopers(pageCounter)
                       .then(function (data) {
                         $scope.isMoreDevs = true;
                         $scope.fullDevelopers = data;
                       });
           } else if (newValue !== oldValue) {
             ApiService.getFullDevelopersBySearch($scope.searchText)
                       .then(function (data) {
                         $scope.isMoreDevs = false;
                         $scope.fullDevelopers = data;
                       });
           }
         });

         $scope.$emit('toggle_black', {isBlack: true});
         $scope.$emit('change_title', {title: 'Разработчики - Лига Разработчиков НИТУ МИСиС'});
       }])

       .controller('DeveloperCtrl', ['$scope', '$state', 'ApiService', function ($scope, $state, ApiService) {
         var developerId = $state.params.id;

         ApiService.getDeveloper(developerId)
                   .then(function (data) {
                     $scope.developer = data;
                     $scope.$emit('change_title', {
                       title: $scope.developer.FirstName + ' ' + $scope.developer.LastName +
                       ' - Лига Разработчиков НИТУ МИСиС'
                     });
                   });
         $scope.$emit('toggle_black', {isBlack: true});
       }])

       .controller('DeveloperEditCtrl', ['$scope', '$state', '$timeout', 'ApiService', 'TokenService',
         function ($scope, $state, $timeout, ApiService, TokenService) {
           var token = TokenService.getToken();
           if (!token) {
             return $state.go('index');
           }
           var developerId = token.UserId;

           $scope.state = [];
           $scope.currentState = null;
           $scope.profile = {};


           $scope.changeCurrentState = function () {
             for (var i = 0; i < 3; i++) {
               if (!$scope.state[i]) {
                 return;
               }
             }

             for (i = 0; i < 3; i++) {
               if ($scope.state[i] == 'failed') {
                 $scope.currentState = 'failed';

                 $scope.state = [];

                 $timeout(function () {
                   $scope.currentState = null;
                 }, 5000);
                 return;
               }
             }
             $scope.currentState = 'success';

             $scope.state = [];

             $timeout(function () {
               $scope.currentState = null;
             }, 3000);
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
             $scope.profile.BigPhotoUri = 'http://api.lod-misis.ru/image/' + args.data;
             $scope.profile.SmallPhotoUri = 'http://api.lod-misis.ru/image/' + args.data;

             $scope.currentUploadStateBigPhoto = 'waiting';

             $scope.$apply();
           });

           $scope.deleteBigPhoto = function () {
             $scope.profile.BigPhotoUri = null;
             $scope.profile.SmallPhotoUri = null;
           };

           /*FOR NOTIFICATIONS*/
           $scope.toggleNotifications = function (index) {
             $scope.notifications[index] = !$scope.notifications[index];
           };

           /*GET - REQUESTS*/
           ApiService.getDeveloperForProfileSttings(developerId).then(function (data) {

             $scope.profile.BigPhotoUri = data.PhotoUri;
             $scope.profile.SmallPhotoUri = data.PhotoUri;
             $scope.profile.InstituteName = data.InstituteName;
             $scope.profile.StudyingDirection = data.StudyingDirection;
             $scope.profile.Specialization = data.Specialization;
             $scope.profile.StudentAccessionYear = data.StudentAccessionYear;
             $scope.profile.VkProfileUri = data.VkProfileUri;
             $scope.profile.PhoneNumber = data.PhoneNumber;
           });
           ApiService.getNotificationsForProfileSttings(developerId).then(function (data) {
             $scope.notificationSettings = data;
             $scope.notifications = data.map(function (notification) {
               return (notification.NotificationSettingValue == 2);
             });
           });

           /*POST - REQUESTS*/

           $scope.changeProfileSettings = function () {

             ApiService.sendProfileSttings(developerId, $scope.profile).then(function (isSuccess) {
               if (isSuccess) {
                 $scope.state[0] = 'success';
               } else {
                 $scope.state[0] = 'failed';
               }
               $scope.changeCurrentState();
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
               $scope.changeCurrentState();
             });

             if ($scope.newPassword && $scope.repeatedPassword) {
               ApiService.sendNewPassword(developerId, JSON.stringify($scope.newPassword)).then(function (isSuccess) {
                 if (isSuccess) {
                   $scope.state[2] = 'success';
                 } else {
                   $scope.state[2] = 'failed';
                 }
                 $scope.changeCurrentState();
               });
             } else {
               $scope.state[2] = 'success';
             }
           };


           $scope.$on('userRole_changed', function (e, args) {
             token = TokenService.getToken();
             if (!token || !token.UserId) {
               return $state.go('index');
             }
           });

           $scope.$emit('toggle_black', {isBlack: true});
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
         var pageCounter = 0;

         $scope.resetPageCounter = function () {
           pageCounter = 0;
         };
         $scope.resetFullProjects = function () {
           $scope.fullProjects = [];
         };
         $scope.addProjects = function () {
           pageCounter++;
           $scope.updateProjects();
         };
         $scope.toggleCategory = function (targetCategory) {
           targetCategory.status = !targetCategory.status;
           $scope.resetPageCounter();
           $scope.resetFullProjects();
           $scope.updateProjects();
         };
         $scope.updateProjects = function () {
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

           ApiService.getFullProjects(requestParams, pageCounter)
                     .then(function (data) {
                       if (!data || data.length === 0) {
                         $scope.isMoreProjects = false;
                       } else {
                         $scope.fullProjects = $scope.fullProjects.concat(data);
                         $scope.isMoreProjects = true;
                       }
                     })
         };

         $scope.updateProjects();

         $scope.$emit('toggle_black', {isBlack: true});
         $scope.$emit('change_title', {title: 'Проекты - Лига Разработчиков НИТУ МИСиС'});
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
                 }
               ]
             });
           };
           $scope.joinToProject = function () {
             ApiService.joinToProject(projectId, userId, JSON.stringify($scope.projectDeveloperRole))
                       .then(function () {
                         $state.reload();
                       });
           };
           $scope.escapeFromProject = function () {
             ApiService.escapeFromProject(projectId, userId).then(function () {
               $state.reload();
             });
           };

           if (token) {
             var userId = TokenService.getToken().UserId;
           }

           ApiService.getProject(projectId)
                     .then(function (data) {
                       $scope.project = data;
                       $scope.projectTypes = $scope.project.ProjectType;
                       $scope.projectIssues = $scope.project.Issues;
                       if ($scope.project.ProjectMemberships.length === 0) {
                         $scope.replacementText = "В данный момент на проекте нет разработчиков.";
                       }
                       $scope.checkMembership = function () {
                         var isProjectMember = false;
                         var userId = TokenService.getToken().UserId;
                         for (var i = 0; i < $scope.project.ProjectMemberships.length; i++) {
                           if ($scope.project.ProjectMemberships[i].DeveloperId === userId) {
                             isProjectMember = true;
                           }
                         }
                         return isProjectMember;
                       };
                       $scope.openViewerDialog = function (imgIndex) {
                         $rootScope.openedScreenshot = $scope.project.Screenshots[imgIndex];
                         $scope.openViewer();
                       };

                       $scope.$emit('change_title', {
                         title: $scope.project.Name + ' - Лига Разработчиков НИТУ МИСиС'
                       });
                     });

           $scope.$emit('toggle_black', {isBlack: true});
         }])


       //admin
       .controller('AdminPanelCtrl', ['$scope', '$state', 'ApiService', function ($scope, $state, ApiService) {

         $scope.$emit('toggle_black', {iBblack: true});
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
           var pageCounter = 0;

           $scope.addProjects = function () {
             pageCounter++;
             $scope.updateProjects();
           };

           $scope.updateProjects = function () {
             ApiService.getFullProjects(null, pageCounter)
                       .then(function (data) {
                         if (!data || data.length === 0) {
                           $scope.isMoreProjects = false;
                         } else {
                           $scope.fullProjects = $scope.fullProjects.concat(data);
                           $scope.isMoreProjects = true;
                         }
                       })
           };

           $scope.updateProjects();

           $scope.$on('userRole_changed', function (e, args) {
             role = TokenService.getRole();
             if (role != 1) {
               return $state.go('index');
             }
           });

           $scope.$emit('toggle_black', {isBlack: true});
           $scope.$emit('change_title', {
             title: 'Проекты - Лига Разработчиков НИТУ МИСиС'
           });
         }])

       .controller('AddProjectCtrl', ['$scope', '$state', 'ApiService', 'TokenService', '$timeout',
         function ($scope, $state, ApiService, TokenService, $timeout) {
           var role = TokenService.getRole();
           if (role != 1) {
             return $state.go('index');
           }

           $scope.currentState = 'filling';
           $scope.newProject = {
             Name: '',
             ProjectTypes: [],
             Info: '',
             AccessLevel: '0',
             ProjectStatus: '0',
             LandingImageUri: '',
             Screenshots: []
           };

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

           //   FOR SMALL IMAGES
           $scope.images = [];
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
               $scope.images.push(args.data);

               $scope.currentUploadStateImage = 'waiting';

               $scope.$apply();
             }
           );

           $scope.deleteImage = function (fileItem, index) {
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
             $scope.newProject.LandingImage = 
			{
				BigPhotoUri: 'http://api.lod-misis.ru/image/' + args.data.BigPhotoName,
				SmallPhotoUri: 'http://api.lod-misis.ru/image/' + args.data.SmallPhotoName
			}

             $scope.currentUploadStateBigImage = 'waiting';

             $scope.$apply();
           });

           $scope.deleteBigImage = function () {
             $scope.newProject.LandingImageUri = null;
           };

           //   POST REQUEST
           $scope.registerProject = function () {

             $scope.newProject.Screenshots = $scope.images.map(function (image) {
               return {
				BigPhotoUri: 'http://api.lod-misis.ru/image/' + image.BigPhotoName,
				SmallPhotoUri: 'http://api.lod-misis.ru/image/' + image.SmallPhotoName
			}
             });

             var j = 0;
             for (var i = 0; i < $scope.categories.length; i++) {
               if ($scope.categories[i].status) {
                 $scope.newProject.ProjectTypes[j] = i;
                 j++;
               }
             }

             ApiService.addProject($scope.newProject).then(function (isSuccess) {
               if (isSuccess) {
                 $scope.currentState = 'success';
                 $scope.newProgect = {};
                 $scope.addProjectForm.$setPristine();
                 $timeout(function () {
                   $scope.currentState = 'filling';
                 }, 3000);
               } else {
                 $scope.currentState = 'failed';
               }
             });
           };

           $scope.$on('userRole_changed', function (e, args) {
             role = TokenService.getRole();
             if (role != 1) {
               return $state.go('index');
             }
           });

           $scope.$emit('toggle_black', {isBlack: true});
           $scope.$emit('change_title', {
             title: 'Добавление проекта - Лига Разработчиков НИТУ МИСиС'
           });
         }])

       .controller('EditProjectCtrl', ['$scope', '$state', 'ApiService', 'TokenService', '$timeout',
         function ($scope, $state, ApiService, TokenService, $timeout) {
           var role = TokenService.getRole();
           if (role != 1) {
             return $state.go('index');
           }

           var projectId = $state.params.id;
           $scope.currentState = 'filling';
           $scope.editedProject = {};
           $scope.images = [];

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
               $scope.editedProject.Screenshots.push(
                 'http://api.lod-misis.ru/image/' + args.data
               );

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
             $scope.editedProject.LandingImageUri = 'http://api.lod-misis.ru/image/' + args.data;

             $scope.currentUploadStateBigImage = 'waiting';

             $scope.$apply();
           });

           $scope.deleteBigImage = function () {
             $scope.editedProject.LandingImageUri = null;
           };

           //   GET REQUEST
           ApiService.getProject(projectId)
                     .then(function (data) {
                       $scope.editedProject = data;

                       for (var i = 0; i < $scope.editedProject.ProjectType.length; i++) {
                         $scope.categories[$scope.editedProject.ProjectType[i]].status = true;
                       }

                       $scope.$emit('change_title', {
                         title: $scope.editedProject.Name + ' - Лига Разработчиков НИТУ МИСиС'
                       });
                     });

           //   PUT REQUEST
           $scope.editProject = function () {
             var j = 0;

             for (var i = 0; i < $scope.categories.length; i++) {
               if ($scope.categories[i].status) {
                 $scope.editedProject.ProjectType[j] = i;
                 j++;
               }
             }

             ApiService.editProject(projectId, $scope.editedProject).then(function (isSuccess) {
               if (isSuccess) {
                 $scope.currentState = 'success';
                 $timeout(function () {
                   $scope.currentState = 'filling';
                 }, 3000);
               } else {
                 $scope.currentState = 'failed';
               }
             });
           };

           $scope.$on('userRole_changed', function (e, args) {
             role = TokenService.getRole();
             if (role != 1) {
               return $state.go('index');
             }
           });

           $scope.$emit('toggle_black', {isBlack: true});
         }])


       //other
       .controller('SignupCtrl', ['$scope', 'ApiService', '$timeout', function ($scope, ApiService, $timeout) {
         $scope.currentStates = {};
         $scope.newDeveloper = {};

         $scope.signUp = function () {
           ApiService.signUp($scope.newDeveloper).then(function (responseObject) {
             $scope.currentStates = {};

             if (responseObject) {
               if (responseObject.status === 200) {
                 $scope.currentStates.isSuccess = true;
               } else if (responseObject.status === 409) {
                 $scope.currentStates.isRegisteredEmail = true;
               } else {
                 $scope.currentStates.isFailed = true;
               }

             } else {
               $scope.currentStates.isFailed = true;
             }

             if ($scope.currentStates.isSuccess) {
               $scope.newDeveloper = {};
               $scope.repeatedPassword = null;
               $scope.newDeveloper.Password = null;
               $scope.signForm.$setPristine();

               $timeout(function () {
                 $scope.currentStates.isSuccess = null;
               }, 4000);
             }
           });
         };

         $scope.$emit('toggle_black', {isBlack: true});
         $scope.$emit('change_title', {title: 'Стать разработчиком - Лига Разработчиков НИТУ МИСиС'});
       }])

       .controller('AboutCtrl', ['$scope', function ($scope) {
         $scope.$emit('toggle_black', {isBlack: true});
         $scope.$emit('change_title', {
           title: 'О нас - Лига Разработчиков НИТУ МИСиС'
         });
       }])

       .controller('OrderCtrl', ['$scope', 'ApiService', '$timeout', function ($scope, ApiService, $timeout) {

         // FOR INPUT TYPE=DATE

         Array.from($("[name='deadline']"))
              .forEach(function (element) {
                element.addEventListener('focus', function () {
                  this.setAttribute('type', 'date');
                });
                element.addEventListener('blur', function () {
                  if (this.value.length == 0) {
                    this.setAttribute('type', 'text');
                  }
                });
              });

         // ACCORDION

         $(".order-accordion p:not(:first)").hide();
         $(".order-content > .order-accordion p:first").show();


         $(".span-wrap").click(function () {
           $(this).next("p").slideToggle("slow")
                  .siblings("p:visible").slideUp("slow");
         });

         // FILE SENDING

         // FORM SENDING

         $scope.data = {};

         $scope.Request = function (form) {

           $scope.data.Attachments = $scope.files.map(function (file) {
             return file.url;
           });

           ApiService.order($scope.data).then(function (isSuccess) {
             if (isSuccess) {
               var envelope = $("[type='submit']");
               var tick = $('.tick');
               var wrap_tick = $('.submit');

               $("input, select, textarea").removeClass('isValid');
               $('.order-form').trigger('reset');

               envelope.css('display', 'none');
               wrap_tick.css('background-color', '#2fd08e');
               tick.addClass('success');

               $timeout(function () {
                 envelope.css('display', 'inline-block');
                 wrap_tick.css('background-color', '#f1f1f1');
                 tick.removeClass('success');
               }, 4000);

             } else {
               alert("Произошла ошибка.");
             }
           });
         };
         $scope.$emit('toggle_black', {isBlack: true});

         $scope.$emit('change_title', {
           title: 'Заказать - Лига Разработчиков НИТУ МИСиС'
         });

         $scope.files = [];
         $scope.currentUploadState = "waiting"; // waiting, uploading
         $scope.currentPercent = 0;

         $scope.$on('beforeSend', function (ev, args) {
           $scope.currentUploadState = 'uploading';
           $scope.currentPercent = 0;
           $scope.$apply();
         });

         $scope.$on('errorUploading', function (ev, args) {
           alert('Размер файла не должен превышать 10 Мб. Разрешённые форматы изображения: DOC, DOCX, PDF, TTF, TXT. ' +
             'Или, возможно, вы не авторизовались.');
           $scope.currentUploadState = 'waiting';
           $scope.currentPercent = 0;
           $scope.$apply();
         });

         $scope.$on('progress', function (ev, args) {
           $scope.currentPercent = args.progress_value;
           $scope.$apply();
         });

         $scope.$on('successUploading', function (ev, args) {

           if (args.data) {
             var dataSplit = args.data.split('.');

             if (dataSplit[dataSplit.length - 2].length == 17) {
               dataSplit[dataSplit.length - 2] = '';
             }
             else {
               dataSplit[dataSplit.length - 2] = dataSplit[dataSplit.length - 2].slice(0, dataSplit[dataSplit.length - 2].length - 17);
             }

             var name = dataSplit.join('.');
             $scope.files.push({
               name: name,
               url: 'http://api.lod-misis.ru/file/' + args.data
             });

             $scope.currentUploadState = 'waiting';

             $scope.$apply();
           }

         });

         $scope.deleteFile = function (fileItem, index) {
           $scope.files.splice(index, 1);
         };
       }])

       .controller('ContactCtrl', ['$scope', 'ApiService', function ($scope, ApiService) {
         $scope.data = {};

         $scope.Request = function () {
           ApiService.contact($scope.data).then(function (isSuccess) {
             if (isSuccess) {
               var envelope = $("[type='submit']");
               var tick = $('.tick');
               var wrap_tick = $('.submit');

               $("input, textarea").removeClass('isValid');
               $('.contact-form').trigger('reset');

               envelope.css('display', 'none');
               wrap_tick.css('background-color', '#2fd08e');
               tick.addClass('success');

               setTimeout(function () {
                   envelope.css('display', 'inline-block');
                   wrap_tick.css('background-color', '#f1f1f1');
                   tick.removeClass('success');
                 }
                 , 1000);
             } else {
               alert("Произошла ошибка.")
             }
           });
         };

         $scope.$emit('toggle_black', {isBlack: true});

         $scope.$emit('change_title', {
           title: 'Cвязаться - Лига Разработчиков НИТУ МИСиС'
         });
       }])

       .controller('FormValidationCtrl', [function () {
         Array.from($("input, textarea"))
              .forEach(function (element) {
                element.addEventListener('focus', function () {
                  if (this.value.length == 0) {
                    this.className = '';
                  }
                  else {
                    this.className = 'isValid';
                  }
                });
                element.addEventListener('blur', function () {
                  if (this.value.length == 0) {
                    this.className = '';
                  }
                  else {
                    this.className = 'isValid';
                  }
                });
              });
       }])

       .controller('LoginFormCtrl', ['$scope',
         'ApiService',
         '$state',
         'NotificationsService',
         function ($scope, ApiService, $state, NotificationsService) {
           var date = new Date();
           var hour = date.getHours();
           $scope.timeOfDay = (hour > 4 && hour < 12) ? 'morning' :
                              (hour >= 12 && hour <= 18) ? 'afternoon' :
                              (hour > 18 && hour < 24) ? 'evening' :
                              'night';
           $scope.isNoDeveloper = false;
           $scope.userLogin = {};

           $scope.signIn = function () {
             ApiService.signIn($scope.userLogin).then(function (isSuccess) {
               if (isSuccess) {
                 $scope.userLogin = {};
                 $scope.loginForm.$setPristine();
                 $scope.closeThisDialog('.form__close-button');
                 NotificationsService.startShowNotificationsAmount();
                 $state.reload();
               } else {
                 $scope.isNoDeveloper = true;
               }
             });
           };
         }])

       .controller('EmailConfirmationCtrl', ['$scope', 'ApiService', '$state', function ($scope, ApiService, $state) {
         var token = $state.params.token;

         ApiService.developerConfirmation().then(function (isSuccess) {
           if (isSuccess) {
             $scope.isSuccess = isSuccess;
           } else {
             $scope.isSuccess = isSuccess;
           }
         });

         $scope.$emit('toggle_black', {isBlack: true});
       }])

       .controller('NotificationsCtrl', ['$scope',
         '$state',
         'TokenService',
         'ApiService',
         function ($scope, $state, TokenService, ApiService) {
           var token = TokenService.getToken();
           if (!token) {
             return $state.go('index');
           }
           $scope.notifications = [];
           ApiService.getNotifications(0).then(function (data) {
             $scope.notifications = data;
           });

           $scope.$emit('change_title', {
             title: 'Оповещения - Лига Разработчиков НИТУ МИСиС'
           });
           $scope.$emit('toggle_black', {isBlack: true});
         }])
;