(function() {
  'use strict';

  angular
    .module('otaRm')
    .config(config);

  /** @ngInject */
  function config($logProvider, toastrConfig, uibPaginationConfig,$httpProvider) {
    // Enable log
    $logProvider.debugEnabled(true);

    // Set options third-party lib
    toastrConfig.allowHtml = true;
    toastrConfig.timeOut = 3000;
    toastrConfig.positionClass = 'toast-top-right';
    toastrConfig.preventDuplicates = true;
    toastrConfig.progressBar = true;

    // 设置分页每页的条数
    uibPaginationConfig.itemsPerPage = 10;

  }

})();
