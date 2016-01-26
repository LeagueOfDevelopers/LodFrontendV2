'use strict';

angular.module('LodSite', [
    'ng',
    'ngRoute',
    'ui.router',

    'LodSite.directives',
    'LodSite.controllers'
  ])
  .config(['$locationProvider', '$stateProvider', '$urlRouterProvider',
    function ($locationProvider, $stateProvider, $urlRouterProvider) {
      $locationProvider.hashPrefix('!');
      $locationProvider.html5Mode(true);

      $urlRouterProvider
        .otherwise('/');

      $stateProvider
        .state('index', {
          url: '/',
          templateUrl: templateUrl('index', 'index'),
          controller: 'IndexCtrl'
        })

        //projects
        .state('projects', {
          url: '/projects',
          template: '<ui-view/>',
          abstract: true
        })
        .state('projects.index', {
          url: '',
          templateUrl: templateUrl('projects', 'projects-index')
        })
        .state('projects.item', {
          url: '/:id',
          templateUrl: templateUrl('projects', 'projects-item')
        })

        //developers
        .state('developers', {
          url: '/developers',
          templateUrl: '<ui-view/>',
          abstract: true
        })
        .state('developers.index', {
          url: '',
          templateUrl: templateUrl('index', 'developers-index')
        })
        .state('developers.item', {
          url: '/:id',
          templateUrl: templateUrl('projects', 'developers-item')
        })

        .state('login', {
          url: '/login',
          templateUrl: templateUrl('login', 'login-index'),
          controller: 'LoginCtrl'
        })
        .state('signup', {
          url: '/signup',
          templateUrl: templateUrl('signup', 'signup-index'),
          controller: 'SignupCtrl'
        })
        .state('order', {
          url: '/order',
          templateUrl: templateUrl('order', 'order-index'),
          controller: 'OrderCtrl'
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

    }
  ]);

// other functions
function templateUrl(module, name) {
  return 'app/templates/' + module + '/' + name + '.html';
}
function setPaddingBottom() {
  $('.content').css('padding-bottom', $('footer').innerHeight());
}
setTimeout(setPaddingBottom, 500);
$(window).resize(setPaddingBottom);
