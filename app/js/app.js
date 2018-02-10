'use strict';

angular.module('LodSite', [
         'ng',
         'ngRoute',
         'ui.router',
         'ngDialog',
         'base64',
         'ngWebsocket',

         'LodSite.directives',
         'LodSite.controllers',
         'LodSite.services'
       ])

       .run(function setFastMobileClick($websocket) {
         FastClick.attach(document.body);
         $(window).resize(setPaddingBottom);
         $websocket.$new({ url: WEBSOCKET_CLIENT_URL, reconnect: true, protocols: ['binary', 'base64'] })
            .$on('$open', function () {
             console.log('Oh my gosh, websocket is really open! Fukken awesome!');
         })
            .$on('$close', function () {
             console.log('Closed');
         })
            .$on('$message', function (data) {
             console.log('The websocket server has sent the following data:');
             console.log(data);
         })
       })

       .config(['$locationProvider', '$stateProvider', '$urlRouterProvider',
         function ($locationProvider, $stateProvider, $urlRouterProvider) {
           $locationProvider.hashPrefix('!');
           $locationProvider.html5Mode(true);

           $urlRouterProvider.otherwise('/');


           $stateProvider
             .state('index', {
               url: '/',
               templateUrl: templateUrl('index', 'index'),
               controller: 'IndexCtrl'
             })

             .state('login-github', {
               url: '/login/github/:encodedToken',
               template: '<ui-view>',
               controller: 'GithubLoginCtrl'
             })

             .state('error', {
               url: '/error/:occuredOnActionType',
               templateUrl: templateUrl('index', 'index'), 
               controller: 'ErrorCtrl',
               onEnter: ['ngDialog', function (ngDialog) {
                   ngDialog.open({
                       template: 'errorTemplate',
                       showClose: true,
                       closeByNavigation: true
                   });
               }]
            })

             //projects
             .state('projects', {
               url: '/projects',
               template: '<ui-view/>',
               abstract: true
             })

             .state('projects.index', {
               url: '',
               templateUrl: templateUrl('projects', 'projects-index'),
               controller: 'FullProjectsCtrl'
             })

             .state('projects.item', {
               url: '/:id',
               templateUrl: templateUrl('projects', 'projects-item'),
               controller: 'ProjectCtrl'
             })


             //developers
             .state('developers', {
               url: '/developers',
               template: '<ui-view/>',
               abstract: true
             })

             .state('developers.index', {
               url: '',
               templateUrl: templateUrl('developers', 'developers-index'),
               controller: 'FullDevelopersCtrl'
             })

             .state('developers.item', {
               url: '/:id',
               templateUrl: templateUrl('developers', 'developers-item'),
               controller: 'DeveloperCtrl'
             })

             .state('developers.confirmation', {
               url: '/confirmation/:token',
               templateUrl: templateUrl('developers', 'developers-confirmation'),
               controller: 'EmailConfirmationCtrl'
             })

             .state('developers.edit', {
               url: '/profile/:id',
               templateUrl: templateUrl('developers', 'developers-edit'),
               controller: 'DeveloperEditCtrl'
             })


             //admin-panel
             .state('adminpanel', {
               url: '/admin',
               template: '<ui-view/>',
               abstract: true
             })

             .state('adminpanel.index', {
               url: '',
               templateUrl: templateUrl('adminpanel', 'adminpanel-index'),
               controller: 'AdminPanelCtrl'
             })

             .state('adminpanel.projects', {
               url: '/projects',
               templateUrl: templateUrl('adminpanel', 'adminpanel-projects'),
               controller: 'AllProjectsCtrl'
             })

             .state('adminpanel.projectAdd', {
               url: '/projects/add',
               templateUrl: templateUrl('adminpanel', 'adminpanel-projectAdd'),
               controller: 'AddProjectCtrl'
             })

             .state('adminpanel.projectEdit', {
               url: '/projects/edit/:id',
               templateUrl: templateUrl('adminpanel', 'adminpanel-projectEdit'),
               controller: 'EditProjectCtrl'
             })

             .state('adminpanel.notification', {
               url: '/notification',
               templateUrl: templateUrl('adminpanel', 'adminpanel-notification'),
               controller: 'AdminNotificationCtrl'
             })

             .state('adminpanel.developers', {
               url: '/developers',
               templateUrl: templateUrl('adminpanel', 'adminpanel-developers'),
               controller: 'AdminDevelopersCtrl'
             })

             //other
             .state('signup', {
               url: '/signup',
               templateUrl: templateUrl('signup', 'signup-index'),
               controller: 'SignupCtrl'
             })

             .state('about', {
               url: '/about',
               templateUrl: templateUrl('about', 'about-index'),
               controller: 'AboutCtrl'
             })

             .state('contact', {
               url: '/contact',
               templateUrl: templateUrl('contact', 'contact-index'),
               controller: 'ContactCtrl'
             })

             .state('notifications', {
               url: '/notifications',
               templateUrl: templateUrl('notifications', 'notifications-index'),
               controller: 'NotificationsCtrl'
             })

             .state('password-recovery', {
               url: '/password/recovery/:token',
               templateUrl: templateUrl('passwordRecovery', 'passwordRecovery-index'),
               controller: 'PasswordRecoveryCtrl'
             })
         }
       ])

;

var DOMAIN_NAME = 'lod-misis.ru';
var DOMAIN_URL = 'https//'+ DOMAIN_NAME;
var API_DOMAIN_URL = 'https//api.' + DOMAIN_NAME;
var WEBSOCKET_CLIENT_URL = "wss:" + API_DOMAIN_URL;
var numberOfProjects = null;


// other functions
function templateUrl(module, name) {
  return 'app/templates/' + module + '/' + name + '.html?' + Math.random();
}
function getDevsSectionAmount() {
  var _devsAmount = 4;
  var viewportWidth = $(window).width();

  if (viewportWidth <= 640) {
    _devsAmount = 4;
  } else if (viewportWidth > 640 && viewportWidth <= 890) {
    _devsAmount = 4;
  } else if (viewportWidth > 890 && viewportWidth <= 1230) {
    _devsAmount = 6;
  } else if (viewportWidth > 1230 && viewportWidth <= 1520) {
    _devsAmount = 4;
  } else if (viewportWidth > 1520 && viewportWidth <= 1810) {
    _devsAmount = 5;
  }

  return _devsAmount;
}
function getProjsSectionAmount() {
  var _projsAmount = 4;
  var viewportWidth = $(window).width();

  if (viewportWidth <= 1000) {
    _projsAmount = 3;
  } else if (viewportWidth > 1000 && viewportWidth <= 1300) {
    _projsAmount = 4;
  } else if (viewportWidth > 1300 && viewportWidth <= 1700) {
    _projsAmount = 3;
  } else if (viewportWidth > 1700 && viewportWidth <= 2000) {
    _projsAmount = 4;
  }

  return _projsAmount;
}

function setPaddingBottom() {
  angular.element('.content').css('padding-bottom', $('footer').innerHeight());
}
setPaddingBottom();
setTimeout(setPaddingBottom, 3000);