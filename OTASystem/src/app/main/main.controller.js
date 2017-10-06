(function() {
  'use strict';

  angular
    .module('otaRm')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($timeout,toastr) {
    var vm = this;
    vm.arrText = ['We OTA', '2017', '祝大家','鸡年大吉','万事如意'];

  }
})();
