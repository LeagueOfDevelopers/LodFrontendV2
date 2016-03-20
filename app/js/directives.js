'use strict';

/* Directives */

angular.module('LodSite.directives', [])

       //header and footer
       .directive('pageHeader', function () {
         return {
           restrict: 'E',
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
               console.log('before send');
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
               console.log('before send');
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
               console.log('before send');
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
               console.log('before send');
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

;