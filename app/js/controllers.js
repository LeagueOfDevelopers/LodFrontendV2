'use strict';

/* Controllers */

angular.module('LodSite.controllers', [])
  //main controllers
  .controller('PageCtrl', ['$scope', function ($scope) {
    $scope.$on('$viewContentLoaded', function () {
      setPaddingBottom();
    });
    var defaultTitle = 'Лига Разработчиков НИТУ МИСиС';
    $scope.$on('change_title', function (e, args) {
      $scope.title = args.title !== undefined && args.title.length ? args.title : defaultTitle;
    });
  }])
  .controller('AppCtrl', ['$scope', function ($scope) {
    $scope.isblack = false;
    $scope.$on('toggle_black', function (e, args) {
      $scope.isblack = args ? args.isblack : false;
    });
  }])
  .controller('IndexCtrl', ['$scope', function ($scope) {
    $scope.$emit('change_title', {
      title: 'Лига Разработчиков НИТУ МИСиС'
    });
    $scope.$emit('toggle_black');
  }])

  //header and footer controllers
  .controller('HeaderCtrl', ['$scope', 'ngDialog', function ($scope, ngDialog) {
    $scope.opened = false;
    $scope.activeToggle = function () {
      $scope.opened = !$scope.opened;
    };
    $scope.$on('$locationChangeSuccess', function () {
      $scope.opened = false;
    });

    $scope.openLoginDialog = function () {
      $scope.$dialog = ngDialog.open({
        template: 'loginTemplate',
        showClose: true,
        closeByNavigation: true
      });
    };
  }])
  .controller('FooterCtrl', ['$scope', function ($scope) {
    $scope.currentDate = new Date();
  }])

  //developers controllers
  .controller('RandomDevelopersCtrl', ['$scope', 'ApiService', function ($scope, ApiService) {
    var numberOfDevelopers = 6;
    ApiService.getRandomDevelopers(numberOfDevelopers).then(function (data) {
      $scope.randomDevelopers = data;
    })
  }])
  .controller('FullDevelopersCtrl', ['$scope', 'ApiService', function ($scope, ApiService) {
    $scope.searchText = '';
    $scope.$watch(
      "searchText",
      function (newValue, oldValue) {
        if (newValue === '') {
          ApiService.getFullDevelopers().then(function (data) {
            $scope.fullDevelopers = data;
          });
        } else if (newValue !== oldValue) {
          ApiService.getFullDevelopersBySearch($scope.searchText).then(function (data) {
            $scope.fullDevelopers = data;
          });
        }
      }
    );

    $scope.$emit('toggle_black', {isblack: true});
    $scope.$emit('change_title', {
      title: 'Разработчики - Лига Разработчиков НИТУ МИСиС'
    });
  }])
  .controller('DeveloperCtrl', ['$scope', '$state', 'ApiService', function ($scope, $state, ApiService) {
    var developerId = $state.params.id;
    ApiService.getDeveloper(developerId).then(function (data) {
      $scope.developer = data;
      $scope.$emit('change_title', {
        title: $scope.developer.FirstName + ' ' + $scope.developer.LastName +
        ' - Лига Разработчиков НИТУ МИСиС'
      });
    });
    $scope.$emit('toggle_black', {isblack: true});
  }])

  //projects controllers
  .controller('RandomProjectsCtrl', ['$scope', 'ApiService', function ($scope, ApiService) {
    var numberOfProjects = 6;
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

    $scope.toggleCategory = function (targetCategory) {
      targetCategory.status = !targetCategory.status;
      $scope.updateProjects();
    };
    $scope.updateProjects = function () {
      var indexes = $scope.categories.filter(function (category) {
        return category.status;
      }).map(function (category) {
        return category.index;
      });
      var requestParams = {};
      if (indexes.length) {
        angular.extend(requestParams, {
          categories: indexes.join(',')
        });
      }

      ApiService.getFullProjects(requestParams).then(function (data) {
        $scope.fullProjects = data;
      })
    };
    $scope.updateProjects();

    $scope.$emit('toggle_black', {isblack: true});
    $scope.$emit('change_title', {
      title: 'Проекты - Лига Разработчиков НИТУ МИСиС'
    });
  }])
  .controller('ProjectCtrl', ['$scope', '$state', 'ApiService', 'ngDialog', '$rootScope', function ($scope, $state, ApiService, ngDialog, $rootScope) {
    var projectId = $state.params.id;
    $scope.openViewer = function () {
      $scope.$dialog = ngDialog.open({
        template: 'viewer',
        showClose: true,
        closeByNavigation: true,
        controller: ['$rootScope', '$scope', function ($rootScope, $scope) {
          $scope.openedScreenshotUrl = $rootScope.openedScreenshotUrl;
        }]
      });
    };

    ApiService.getProject(projectId).then(function (data) {
      $scope.project = data;
      $scope.projectTypes = $scope.project.ProjectType;
      $scope.projectIssues = $scope.project.Issues;
      if ($scope.project.ProjectMemberships.length === 0) {
        $scope.replacementText = "В данный момент на проекте нет разработчиков.";
      }

      $scope.openViewerDialog = function (imgIndex) {
        $rootScope.openedScreenshotUrl = $scope.project.Screenshots[imgIndex];
        $scope.openViewer();
      };

      $scope.$emit('change_title', {
        title: $scope.project.Name + ' - Лига Разработчиков НИТУ МИСиС'
      });
    });

    $scope.$emit('toggle_black', {isblack: true});
  }])

  .controller('SignupCtrl', ['$scope', 'ApiService', '$timeout', function ($scope, ApiService, $timeout) {
    $scope.currentState = 'filling';
    $scope.newDeveloper = {};

    $scope.signUp = function () {
      ApiService.signUp($scope.newDeveloper).then(function (isSuccess) {
        if (isSuccess) {
          $scope.currentState = 'success';
          $scope.newDeveloper = {};
          $scope.repeatedPassword = '';
          $scope.newDeveloper.Password = '';
          $scope.signForm.$setPristine();
          $timeout(function () {
            $scope.currentState = 'filling';
          }, 3000);
        } else {
          $scope.currentState = 'failed';
        }
      });
    };

    $scope.$emit('toggle_black', {isblack: true});
    $scope.$emit('change_title', {
      title: 'Стать разработчиком - Лига Разработчиков НИТУ МИСиС'
    });
  }])
  .controller('AboutCtrl', ['$scope', function ($scope) {

    $scope.$emit('toggle_black', {isblack: true});
    $scope.$emit('change_title', {
      title: 'О нас - Лига Разработчиков НИТУ МИСиС'
    });
  }])
  .controller('OrderCtrl', ['$scope', '$http', '$timeout', function ($scope, $http, $timeout) {

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

      $http.post('http://api.lod-misis.ru/orders', $scope.data).success(function () {

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

      }).error(function (err) {
        console.log(err);
      });
    };

    $scope.$emit('toggle_black', {isblack: true});

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
      alert('Что-то пошло не так!')
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
    }
  }])
  //TODO-andrey Переделать http запросы в ContactCtrl, EmailConfirmationCtrl и EditDeveloperCtrl через ApiService.
  .controller('ContactCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.data = {};

    $scope.Request = function (form) {
      $http.post('http://api.lod-misis.ru/contact', $scope.data).success(function () {

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

      });
    };

    $scope.$emit('toggle_black', {isblack: true});

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
  .controller('LoginFormCtrl', ['$scope', 'ApiService', function ($scope, ApiService) {
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
        } else {
          $scope.isNoDeveloper = true;
        }
      });
    };
  }])
  .controller('EmailConfirmationCtrl', ['$scope', '$http', '$state', function ($scope, $http, $state) {
    var token = $state.params.token;
    $http.post('http://api.lod-misis.ru/developers/confirmation/' + token).success(function (data) {
      $scope.currentState = !data.Message;
      $scope.isSuccess = true;
    }).error(function () {
      $scope.isSuccess = false;
    });

    $scope.$emit('toggle_black', {isblack: true});
  }])

  .controller('EditDeveloperCtrl', ['$scope', '$http', '$state', function ($scope, $http, $state) {
    var developerId = $state.params.id;
    $("[name='phone']").mask("+7 (999) 999-9999");

    $http.get('http://api.lod-misis.ru/developers/' + developerId).success(function (data) {
      $scope.developer = data;
      var dateOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
      var date = new Date();
      var formattedDate = new Date(Date.parse($scope.developer.RegistrationDate));

      if ($scope.developer.PhotoUri == null) {
        $scope.developer.PhotoUri = '/app/imgs/developer-default-photo.png';
      }
      $scope.developer.studyingYear = date.getFullYear() - $scope.developer.StudentAccessionYear || 1;
      $scope.developer.RegistrationDate = formattedDate.toLocaleString("ru", dateOptions);
      $scope.$emit('change_title', {
        title: $scope.developer.FirstName + ' ' + $scope.developer.LastName + ' - Лига Разработчиков НИТУ МИСиС'
      });
    });
    $scope.$emit('toggle_black', {isblack: true});
  }])
;
