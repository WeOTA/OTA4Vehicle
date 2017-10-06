(function() {
  'use strict';

  angular
    .module('otaRm')
    .config(pmcontrolRouterConfig);

  /** @ngInject */
  function pmcontrolRouterConfig($stateProvider, $urlRouterProvider) {
    $stateProvider

      // pmcontrol
      .state('pmcontrol.list',{
        url:'',
        templateUrl:'app/pmcontrol/templates/pmcontrol.list.html',
        controller:'PmcontrolListController',
        controllerAs:'pmcontrolList'
      })
      .state('pmcontrol.detail',{
        url:'/{versionId:[A-Za-z0-9]{24}}',
        templateUrl:'app/pmcontrol/templates/pmcontrol.detail.html',
        controller:'PmcontrolDetailController',
        controllerAs:'pmcontrolDetail'
      })
  }

})();