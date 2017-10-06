(function() {
  'use strict';

  angular
    .module('otaRm')
    .config(versioningRouterConfig);

  /** @ngInject */
  function versioningRouterConfig($stateProvider, $urlRouterProvider) {
    $stateProvider

      // versioning
      .state('versioning.list',{
        url:'',
        templateUrl:'app/versioning/templates/versioning.list.html',
        controller:'VersioningListController',
        controllerAs:'versioningList'
      })
      .state('versioning.detail',{
        url:'/:versionname',
        templateUrl:'app/versioning/templates/versioning.detail.html',
        controller:'VersioningDetailController',
        controllerAs:'versioningDetail'
      })
  }

})();
