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
  });