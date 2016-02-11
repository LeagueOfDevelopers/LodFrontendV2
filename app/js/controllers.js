'use strict';

/* Controllers */

angular.module('LodSite.controllers', [])
  //main controllers
  .controller('PageCtrl', ['$scope', function ($scope) {
    var defaultTitle = 'Лига Разработчиков НИТУ МИСиС';
    $scope.$on('change_title', function (e, args) {
      $scope.title = args.title !== undefined && args.title.length ? args.title : defaultTitle;
    });
  }])
  .controller('AppCtrl', ['$scope', function ($scope) {
    $scope.isblack = false;
    $scope.$on('toggle black', function (e, args) {
      $scope.isblack = args ? args.isblack : false;
    });
  }])
  .controller('IndexCtrl', ['$scope', function ($scope) {
    $scope.$emit('change_title', {
      title: 'Лига Разработчиков НИТУ МИСиС'
    });
    $scope.$emit('toggle black');
  }])

  //header and footer controllers
  .controller('HeaderCtrl', ['$scope', 'ngDialog', function ($scope, ngDialog) {
    $scope.opened = false;
    $scope.activeToggle = function () {
      $scope.opened = !$scope.opened;
    };

    $scope.openLoginDialog = function () {
      $scope.$dialog = ngDialog.open({
        template: 'loginTemplate',
        showClose: true,
        closeByNavigation: true
      });
    };

    $scope.closeDialog = function () {
      ngDialog.close($scope.dialog);
    };
  }])
  .controller('FooterCtrl', ['$scope', function ($scope) {
    $scope.currentDate = new Date();
  }])

  //developers controllers
  .controller('RandomDevelopersCtrl', ['$scope', '$http', function ($scope, $http) {
    $http.get('http://api.lod-misis.ru/developers/random/6').success(function (data) {
      $scope.randomDevelopers = data;
    });
  }])
  .controller('FullDevelopersCtrl', ['$scope', '$http', function ($scope, $http) {
    var dateOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };

    $http.get('http://api.lod-misis.ru/developers').success(function (data) {
      $scope.fullDevelopers = data;
      for (var i = 0; i < $scope.fullDevelopers.length; i++) {
        var formattedDate = new Date(Date.parse($scope.fullDevelopers[i].RegistrationDate));
        $scope.fullDevelopers[i].RegistrationDate = formattedDate.toLocaleString("ru", dateOptions);
        if($scope.fullDevelopers[i].PhotoUri == null){
          $scope.fullDevelopers[i].PhotoUri = '/app/imgs/developer-default-photo.png';
        }
      }
    });

    $scope.$emit('toggle black', {isblack: true});
    $scope.$emit('change_title', {
      title: 'Разработчики - Лига Разработчиков НИТУ МИСиС'
    });
  }])
  .controller('DeveloperCtrl', ['$scope', '$http', '$state', function ($scope, $http, $state) {
    var developerId = $state.params.id;
    $http.get('http://api.lod-misis.ru/developers/' + developerId).success(function (data) {
      $scope.developer = data;
      var dateOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
      var date = new Date();
      var formattedDate = new Date(Date.parse($scope.developer.RegistrationDate));

      if($scope.developer.PhotoUri == null){
        $scope.developer.PhotoUri = '/app/imgs/developer-default-photo.png';
      }
      $scope.developer.studyingYear = date.getFullYear() - $scope.developer.StudentAccessionYear || 1;
      $scope.developer.RegistrationDate =  formattedDate.toLocaleString("ru", dateOptions);
      $scope.$emit('change_title', {
        title: $scope.developer.FirstName + ' ' + $scope.developer.LastName + ' - Лига Разработчиков НИТУ МИСиС'
      });
    });
    $scope.$emit('toggle black', {isblack: true});
  }])

  //projects controllers
  .controller('RandomProjectsCtrl', ['$scope', '$http', function ($scope, $http) {
    $http.get('http://api.lod-misis.ru/projects/random/6').success(function (data) {
      $scope.randomProjects = data;
    });
  }])
  .controller('FullProjectsCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.$emit('toggle black', {isblack: true});
    $scope.$emit('change_title', {
      title: 'Проекты - Лига Разработчиков НИТУ МИСиС'
    });

    var projectsApiUrl = 'http://api.lod-misis.ru/projects';

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
      $http.get(projectsApiUrl, {params: requestParams}).success(function (data) {
        $scope.fullProjects = data;
      });
    };

    $scope.updateProjects();
  }])
  .controller('ProjectCtrl', ['$scope', '$http', '$state', function ($scope, $http, $state) {
    var projectId = $state.params.id;
    $http.get('http://api.lod-misis.ru/projects/' + projectId).success(function (data) {
      $scope.project = data;
      $scope.projectTypes = $scope.project.ProjectType;
      $scope.projectIssues = $scope.project.Issues;
      if ($scope.project.ProjectMemberships.length === 0) {
        $scope.replacementText = "В данный момент на проекте нет разработчиков.";
      }
      $scope.$emit('change_title', {
        title: $scope.project.Name + ' - Лига Разработчиков НИТУ МИСиС'
      });
    });
    $scope.$emit('toggle black', {isblack: true});
  }])

  .controller('SignupCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.isSuccess = '';
    $scope.emptyNewDeveloper = {
      "Email": "",
      "FirstName": "",
      "LastName": "",
      "Password": "",
      "VkProfileUri": "",
      "PhoneNumber": "",
      "StudyingProfile": "",
      "InstituteName": "",
      "Department": "",
      "AccessionYear": ""
    };
    $scope.newDeveloper = angular.copy($scope.emptyNewDeveloper);
    $scope.repeatPassword = "";

    $scope.$emit('toggle black', {isblack: true});
    $scope.$emit('change_title', {
      title: 'Стать разработчиком - Лига Разработчиков НИТУ МИСиС'
    });

    $scope.register = function () {
      $http.post('http://api.lod-misis.ru/developers', $scope.newDeveloper).success(function () {
        $scope.isSuccess = true;
        $scope.newDeveloper = angular.copy($scope.emptyNewDeveloper);
        $scope.repeatPassword = "";
      })
        .error(function () {
          $scope.isSuccess = false;
        });
    };
  }])
  .controller('AboutCtrl', ['$scope', function ($scope) {

    $scope.$emit('toggle black', {isblack: true});

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
    $scope.data.Attachments = [];
    $scope.Request = function (form) {
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
        console.log('Error:' + err.message);
      });
    };

    $scope.$emit('toggle black', {isblack: true});

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
        if(dataSplit[dataSplit.length - 2].length == 17) {
          dataSplit[dataSplit.length - 2] = '';
        }
        else {
          dataSplit[dataSplit.length - 2] =  dataSplit[dataSplit.length - 2].slice(0, dataSplit[dataSplit.length - 2].length - 17);
        }


        $scope.files.push(dataSplit.join('.'));
        $scope.data.Attachments.push('http://api.lod-misis.ru/file' + args.data);
      }
      console.dir($scope.files);
      alert($scope.files);
      if ($scope.files.length <= 2) {
        $scope.currentUploadState = 'waiting';
      }
      else if ($scope.files.length > 2) {
        $scope.currentUploadState = 'nothing';
        $('.order-upload-file__wrap').css('display', 'none');
      }

      $scope.$apply();
    });

    $scope.deleteFile = function (fileItem, index) {
      $scope.files.splice(index, 1);

      $scope.currentUploadState = 'waiting';
      $('.order-upload-file__wrap').css('display', 'inline-block');
    }
  }])
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

    $scope.$emit('toggle black', {isblack: true});

    $scope.$emit('change_title', {
      title: 'Cвязаться - Лига Разработчиков НИТУ МИСиС'
    });

  }])
  .controller('FormValidationCtrl', ['$scope', function ($scope) {
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
  .controller('LoginFormCtrl', ['$scope', '$http', function ($scope, $http) {
    var date = new Date();
    var hour = date.getHours();
    $scope.noDeveloperData = false;
    $scope.userLogin = {
      'Email': '',
      'Password': ''
    };

    $scope.timeOfDay = (hour > 4 && hour < 12) ? 'morning' :
      (hour >= 12 && hour <= 18) ? 'afternoon' :
        (hour > 18 && hour < 24) ? 'evening' :
          'night';

    $scope.login = function () {
      $http.post('http://api.lod-misis.ru//developers/authorize', $scope.userLogin).error(function () {
        $scope.noDeveloperData = true;
      });
    };
  }])
;
