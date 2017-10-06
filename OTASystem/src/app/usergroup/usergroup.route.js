(function() {
  'use strict';

  angular
    .module('otaRm')
    .config(usergroupConfig);

  /** @ngInject */
  function usergroupConfig($stateProvider, $urlRouterProvider) {
    $stateProvider

   // user group
   .state('usergroup',{
     abstract: true,
     url:'/usergroup',
     templateUrl:'app/usergroup/usergroup.html',
     controller:'UsergroupController',
     controllerAs:'usergroup'
   })
   .state('usergroup.userlist',{
     url:'/:level/:tasSysName',
     templateUrl:'app/usergroup/templates/userList.template.html',
     controller:'UserlistController',
     controllerAs:'userlist'
   })
  }

})();
