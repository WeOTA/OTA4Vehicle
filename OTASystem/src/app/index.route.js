(function() {
  'use strict';

  angular
    .module('otaRm')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      // home
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'main'
      })
      // releases
      .state('releases',{
        abstract: true,
        url:'/releases',
        templateUrl:'app/releases/releases.html'
      })
      //rdupdate
      .state('rdupdate',{
        url:'/rdupdate',
        templateUrl:'app/rdupdate/rdupdate.html',
        controller:'RdupdateController',
        controllerAs:'rdupdate'
      })
      // selftest
      .state('selftest',{
        abstract: true,
        url:'/selftest',
        templateUrl:'app/selftest/selftest.html'
      })
      // versioning
      .state('versioning',{
        abstract:true,
        url:'/versioning',
        templateUrl:'app/versioning/versioning.html'
      })
      // pmcontrol
      .state('pmcontrol',{
        abstract:true,
        url:'/pmcontrol',
        templateUrl:'app/pmcontrol/pmcontrol.html'
      })
      // qamanual
      .state('qamanual',{
        abstract:true,
        url:'/qamanual',
        templateUrl:'app/qamanual/qamanual.html'
      })
    $urlRouterProvider.otherwise('/');
  }

})();
