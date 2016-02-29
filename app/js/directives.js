'use strict';

/* Directives */

angular.module('LodSite.directives', [])
  //header and footer directives
  .directive('pageHeader', function () {
    return {
      restrict: 'E',
      scope: {
        isblack: '='
      },
      templateUrl: templateUrl('directives', 'page-header'),
      controller: 'HeaderCtrl'
    }
  })
  .directive('pageFooter', function () {
    return {
      restrict: 'E',
      scope: true,
      templateUrl: templateUrl('directives', 'page-footer'),
      controller: 'FooterCtrl'
    }
  })

  //developers directives
  .directive('randomDevelopers', function () {
    return {
      restrict: 'E',
      scope: true,
      templateUrl: templateUrl('directives', 'random-developers'),
      controller: 'RandomDevelopersCtrl'
    }
  })

  //projects directives
  .directive('randomProjects', function () {
    return {
      restrict: 'E',
      scope: true,
      templateUrl: templateUrl('directives', 'random-projects'),
      controller: 'RandomProjectsCtrl'
    }
  })
  .directive('yandexMap', function () {
    return {
      restrict: 'EA',
      scope: true,
      templateUrl: templateUrl('directives', 'yandex-map'),
      controller: ['$scope', function ($scope) {
      }],
      link: function (scope, element) {
        var script = document.createElement('script');
        script.src = 'https://api-maps.yandex.ru/services/constructor/1.0/js/?sid=4Yg6W87x5Mr-mGZLObfvYf8IoDh7KTsm&width=100%&height=450&lang=ru_RU&sourceType=constructor';
        script.async = true;
        element[0].querySelector('#map').appendChild(script);
      }
    };
  })
  .directive('uploadFile', ['$rootScope', function ($rootScope) {
    return {
      resctrict: 'A',
      link: link
    };

    function link($scope, element, attrs) {
      // Set promptzone
      $(element[0]).ajaxUploadPrompt({
        url: 'http://api.lod-misis.ru/file',
        beforeSend: function () {
          $rootScope.$broadcast('beforeSend');
          console.log('before send');
        },
        onprogress: function (e) {
          if (e.lengthComputable) {
            var percentComplete = e.loaded / e.total;
            $rootScope.$broadcast('progress', {
              progress_value: Math.round(percentComplete * 100)
            });
          }
        },
        error: function () {
          $rootScope.$broadcast('errorUploading');
        },
        success: function (data) {
          $rootScope.$broadcast('successUploading', {
            data: data
          });
        }
      });
    }
  }])
  .directive('dropzoneFile', ['$rootScope', function ($rootScope) {
    return {
      resctrict: 'A',
      link: link
    };

    function link($scope, element, attrs) {
      // Set promptzone
      $(element[0]).ajaxUploadDrop({
        url: 'http://api.lod-misis.ru/file',
        beforeSend: function () {
          $rootScope.$broadcast('beforeSend');
          console.log('before send');
        },
        onprogress: function (e) {
          if (e.lengthComputable) {
            var percentComplete = e.loaded / e.total;
            $rootScope.$broadcast('progress', {
              progress_value: Math.round(percentComplete * 100)
            });
          }
        },
        error: function () {
          $rootScope.$broadcast('errorUploading');
        },
        success: function (data) {
          $rootScope.$broadcast('successUploading', {
            data: data
          });
        }
      });
    }
  }])

;