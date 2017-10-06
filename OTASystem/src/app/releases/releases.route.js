(function() {
  'use strict';

  angular
    .module('otaRm')
    .config(releasesRouterConfig);

  /** @ngInject */
  function releasesRouterConfig($stateProvider, $urlRouterProvider) {
    $stateProvider

      // releases
      .state('releases.list',{
        url:'',
        templateUrl:'app/releases/templates/releases.list.html',
        controller:'ReleasesListController',
        controllerAs:'releasesList'
      })
      .state('releases.detail',{
        url:'/:versionname',
        templateUrl:'app/releases/templates/releases.detail.html',
        controller:'ReleasesDetailController',
        controllerAs:'releasesDetail'
      })
  }

})();
