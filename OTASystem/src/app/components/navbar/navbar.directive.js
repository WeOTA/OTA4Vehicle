(function() {
  'use strict';

  angular
    .module('otaRm')
    .directive('navBar', navBar);


  function navBar() {

    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/navbar/navbar.html',
      scope: {},
      controller: NavbarController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function NavbarController($scope,$state,roleNav) {

      var vm = this;

      vm.navbarrole =roleNav.nav;
      vm.name = roleNav.ename; 
      
      //解决指令里 ng-class="{active: $state.includes('selftest')}"
      $scope.$state = $state;
    }
  }
})();
