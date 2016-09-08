'use strict';

/* Directives */

angular.module('LodSite.directives', [])

       //header and footer
       .directive('pageHeader', function () {
         return {
           restrict: 'EA',
           scope: true,
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

       //developers
       .directive('randomDevelopers', function () {
         return {
           restrict: 'E',
           scope: true,
           templateUrl: templateUrl('directives', 'random-developers'),
           controller: 'RandomDevelopersCtrl'
         }
       })

       //projects
       .directive('randomProjects', function () {
         return {
           restrict: 'E',
           scope: true,
           templateUrl: templateUrl('directives', 'random-projects'),
           controller: 'RandomProjectsCtrl'
         }
       })

       //other
       .directive('uploadFile', ['$rootScope', 'TokenService', function ($rootScope, TokenService) {
         return {
           resctrict: 'A',
           link: link
         };

         function link($scope, element, attrs) {
           var token = TokenService.getToken();
           if (!token) {
             return;
           }
           var tokenValue = token.Token;

           var headers = {};
           if (tokenValue) {
             headers.Authorization = 'Basic ' + tokenValue;
           }
           // Set promptzone
           $(element[0]).ajaxUploadPrompt({
             url: 'http://api.lod-misis.ru/file',
             headers: headers,

             beforeSend: function () {
               $rootScope.$broadcast('beforeSend');
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

       .directive('dropzoneFile', ['$rootScope', 'TokenService', function ($rootScope, TokenService) {
         return {
           resctrict: 'A',
           link: link
         };

         function link($scope, element, attrs) {
           var token = TokenService.getToken();
           if (!token) {
             return;
           }
           var tokenValue = token.Token;

           var headers = {};
           if (tokenValue) {
             headers.Authorization = 'Basic ' + tokenValue;
           }
           // Set promptzone
           $(element[0]).ajaxUploadDrop({
             url: 'http://api.lod-misis.ru/file',
             headers: headers,

             beforeSend: function () {
               $rootScope.$broadcast('beforeSend');
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

       .directive('dropzoneImage', ['$rootScope', 'TokenService', function ($rootScope, TokenService) {
         return {
           resctrict: 'A',
           link: link
         };

         function link($scope, element, attrs) {
           var token = TokenService.getToken();
           if (!token) {
             return;
           }
           var tokenValue = token.Token;

           var headers = {};
           if (tokenValue) {
             headers.Authorization = 'Basic ' + tokenValue;
           }
           // Set promptzone
           $(element[0]).ajaxUploadDrop({
             url: 'http://api.lod-misis.ru/image',
             headers: headers,

             beforeSend: function () {
               $rootScope.$broadcast('beforeSendImage');
             },
             onprogress: function (e) {
               if (e.lengthComputable) {
                 var percentComplete = e.loaded / e.total;
                 $rootScope.$broadcast('progressImage', {
                   progress_value: Math.round(percentComplete * 100)
                 });
               }
             },
             error: function () {
               $rootScope.$broadcast('errorUploadingImage');
             },
             success: function (data) {
               $rootScope.$broadcast('successUploadingImage', {
                 data: data
               });
             }
           });
         }
       }])

       .directive('uploadImage', ['$rootScope', 'TokenService', function ($rootScope, TokenService) {
         return {
           resctrict: 'A',
           link: link
         };

         function link($scope, element, attrs) {
           var token = TokenService.getToken();
           if (!token) {
             return;
           }
           var tokenValue = token.Token;

           var headers = {};
           if (tokenValue) {
             headers.Authorization = 'Basic ' + tokenValue;
           }
           // Set promptzone
           $(element[0]).ajaxUploadPrompt({
             url: 'http://api.lod-misis.ru/image',
             headers: headers,

             beforeSend: function () {
               $rootScope.$broadcast('beforeSendImage');
             },
             onprogress: function (e) {
               if (e.lengthComputable) {
                 var percentComplete = e.loaded / e.total;
                 $rootScope.$broadcast('progressImage', {
                   progress_value: Math.round(percentComplete * 100)
                 });
               }
             },
             error: function () {
               $rootScope.$broadcast('errorUploadingImage');
             },
             success: function (data) {
               $rootScope.$broadcast('successUploadingImage', {
                 data: data
               });
             }
           });
         }
       }])

       .directive('dropzoneBigImage', ['$rootScope', 'TokenService', function ($rootScope, TokenService) {
         return {
           resctrict: 'A',
           link: link
         };

         function link($scope, element, attrs) {
           var token = TokenService.getToken();
           if (!token) {
             return;
           }
           var tokenValue = token.Token;

           var headers = {};
           if (tokenValue) {
             headers.Authorization = 'Basic ' + tokenValue;
           }
           // Set promptzone
           $(element[0]).ajaxUploadDrop({
             url: 'http://api.lod-misis.ru/image',
             headers: headers,

             beforeSend: function () {
               $rootScope.$broadcast('beforeSendBigImage');
             },
             onprogress: function (e) {
               if (e.lengthComputable) {
                 var percentComplete = e.loaded / e.total;
                 $rootScope.$broadcast('progressBigImage', {
                   progress_value: Math.round(percentComplete * 100)
                 });
               }
             },
             error: function () {
               $rootScope.$broadcast('errorUploadingBigImage');
             },
             success: function (data) {
               $rootScope.$broadcast('successUploadingBigImage', {
                 data: data
               });
             }
           });
         }
       }])

       .directive('uploadBigImage', ['$rootScope', 'TokenService', function ($rootScope, TokenService) {
         return {
           resctrict: 'A',
           link: link
         };

         function link($scope, element, attrs) {
           var token = TokenService.getToken();
           if (!token) {
             return;
           }
           var tokenValue = token.Token;

           var headers = {};
           if (tokenValue) {
             headers.Authorization = 'Basic ' + tokenValue;
           }
           // Set promptzone
           $(element[0]).ajaxUploadPrompt({
             url: 'http://api.lod-misis.ru/image',
             headers: headers,

             beforeSend: function () {
               $rootScope.$broadcast('beforeSendBigImage');
             },
             onprogress: function (e) {
               if (e.lengthComputable) {
                 var percentComplete = e.loaded / e.total;
                 $rootScope.$broadcast('progressBigImage', {
                   progress_value: Math.round(percentComplete * 100)
                 });
               }
             },
             error: function () {
               $rootScope.$broadcast('errorUploadingBigImage');
             },
             success: function (data) {
               $rootScope.$broadcast('successUploadingBigImage', {
                 data: data
               });
             }
           });
         }
       }])

    .directive('slideToggle', function() {
      return {
        restrict: 'A',
        scope: {},
        controller: function ($scope) {
        },
        link: function (scope, element, attr) {
          element.bind('click', function () {
            var $slideBox = angular.element(attr.slideToggle);
            var slideDuration = parseInt(attr.slideToggleDuration, 10) || 200;
            $slideBox.stop().slideToggle(slideDuration);
          });
        }
      }
    })

;