'use strict';

angular.module('LodSite', [
         'ng',
         'ngRoute',
         'ui.router',
         'ngDialog',
         'base64',
         'ui.mask',

         'LodSite.directives',
         'LodSite.controllers',
         'LodSite.services'
       ])

       .run(function setFastMobileClick() {
         FastClick.attach(document.body);
         $(window).resize(setPaddingBottom);
         
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

             .state('success', {
               url: '/success/:occuredOnActionType',
               templateUrl: templateUrl('index', 'index'),
               controller: 'SuccessCtrl',
               onEnter: ['ngDialog', function (ngDialog) {
                   ngDialog.open({
                       template: 'successTemplate',
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
var DOMAIN_URL = 'https://'+ DOMAIN_NAME;
var API_DOMAIN_URL = 'https://api.' + DOMAIN_NAME;
var WEBSOCKET_CLIENT_URL = 'wss://api.' + DOMAIN_NAME + '/socket';
var numberOfProjects = null;

// other functions
function templateUrl(module, name) {
  return 'app/templates/' + module + '/' + name + '.html?' + Math.random();
}
function getDevsSectionAmount() {
  var _devsAmount = 4;
  var viewportWidth = $(window).width();

  if (viewportWidth >= 656 && viewportWidth <= 887) {
      _devsAmount = 3;
  }
  return _devsAmount;
}

function setPaddingBottom() {
  angular.element('.content').css('padding-bottom', $('footer').innerHeight());
}
setPaddingBottom();
setTimeout(setPaddingBottom, 3000);