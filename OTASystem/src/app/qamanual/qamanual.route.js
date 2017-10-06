(function() {
  'use strict';

  angular
    .module('otaRm')
    .config(qamanualRouterConfig);

  /** @ngInject */
  function qamanualRouterConfig($stateProvider, $urlRouterProvider) {
    $stateProvider

      // qamanual
      .state('qamanual.list',{
        url:'',
        templateUrl:'app/qamanual/templates/qamanual.list.html',
        controller:'QamanualListController',
        controllerAs:'qamanualList'
      })
      .state('qamanual.detail',{
        url:'/{versionId:[A-Za-z0-9]{24}}',
        templateUrl:'app/qamanual/templates/qamanual.detail.html',
        controller:'QamanualDetailController',
        controllerAs:'qamanualDetail'
      })
  }

})();