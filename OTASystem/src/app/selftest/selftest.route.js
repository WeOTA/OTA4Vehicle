(function() {
  'use strict';

  angular
    .module('otaRm')
    .config(selftestRouterConfig);

  /** @ngInject */
  function selftestRouterConfig($stateProvider, $urlRouterProvider) {
    $stateProvider

      // selftest
      .state('selftest.list',{
        url:'',
        templateUrl:'app/selftest/templates/selftest.list.html',
        controller:'SelftestListController',
        controllerAs:'selftestList'
      })
      .state('selftest.detail',{
        url:'/{versionId:[A-Za-z0-9]{24}}',
        templateUrl:'app/selftest/templates/selftest.detail.html',
        controller:'SelftestDetailController',
        controllerAs:'selftestDetail'
      })
  }

})();