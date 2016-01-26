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
  .directive('fullDevelopers', function () {
    return {
      restrict: 'E',
      scope: true,
      templateUrl: templateUrl('directives', 'full-developers'),
      controller: 'FullDevelopersCtrl'
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
  .directive('fullProjects', function () {
    return {
      restrict: 'E',
      scope: true,
      templateUrl: templateUrl('directives', 'full-projects'),
      controller: 'FullProjectsCtrl'
    }
  })
  .directive('pageProject', function () {
    return {
      restrict: 'E',
      scope: true,
      templateUrl: templateUrl('directives', 'page-project'),
      controller: 'ProjectCtrl'
    }
  });