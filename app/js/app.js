'use strict';

angular.module('LodSite', [
    'ng',
    'ngRoute',
    'ui.router',
    'ngDialog',

    'LodSite.directives',
    'LodSite.controllers',
    'LodSite.services'
  ])

  .run(function setFastMobileClick() {
    FastClick.attach(document.body);
  })
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

        //other
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
  ])

;

// other functions
function templateUrl(module, name) {
  return 'app/templates/' + module + '/' + name + '.html?' + Math.random();
}
function setPaddingBottom() {
  $('.content').css('padding-bottom', $('footer').innerHeight());
}
$(window).resize(setPaddingBottom);
