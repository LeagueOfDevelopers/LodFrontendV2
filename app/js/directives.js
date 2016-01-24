'use strict';

angular.module('LodSite.directives', [])
  .directive('pageHeader',function(){
    return {
      restrict : 'E',
      scope: {
        isblack: '='
      },
      templateUrl: templateUrl('directives', 'page-header'),
      controller: 'HeaderController'
    }
  })

  .directive('pageFooter',function(){
    return {
      restrict: 'E',
      scope: true,
      templateUrl: templateUrl('directives', 'page-footer'),
      controller: 'FooterController'
    }
  })

  .directive('randomDevelopers',function(){
    return{
      restrict : 'E',
      scope: true,
      templateUrl: templateUrl('directives', 'random-developers'),
      controller: 'RandomDevelopersController'
    }
  })

  .directive('fullDevelopers',function(){
    return{
      restrict : 'E',
      scope: true,
      templateUrl: templateUrl('directives', 'full-developers'),
      controller: 'FullDevelopersController'
    }
  })

  .directive('randomProjects',function(){
    return{
      restrict : 'E',
      scope: true,
      templateUrl: templateUrl('directives', 'random-projects'),
      controller: 'RandomProjectsController'
    }
  })

  .directive('fullProjects',function(){
    return{
      restrict : 'E',
      scope: true,
      templateUrl: templateUrl('directives', 'full-projects'),
      controller: 'FullProjectsController'
    }
  })

  .directive('pageProject',function(){
    return{
      restrict : 'E',
      scope: true,
      templateUrl: templateUrl('directives', 'page-project'),
      controller: 'ProjectCtrl'
    }
  });