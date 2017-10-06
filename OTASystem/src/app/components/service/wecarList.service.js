(function () {
  'use strict';

  angular
    .module('otaRm')
    .factory('wecarListService', wecarListService);
  /** @ngInject */
  function wecarListService($log, $http, API_HOST) {
    var apiHost = API_HOST;

    var service = {
      apiHost: apiHost,
      getWecarList: getWecarList
    };

    return service;

    //fn getWecarList
    function getWecarList(query) {
      if (!query) {
        $log.error('请求参数错误.');
        return;
      }
      if (!query.pageIndex) {
        query.pageIndex = 0;    //0表示查询所有值
      }
      if (query.wecarId) {
        var apiParam = "/search/wecar?callback=JSON_CALLBACK&output=jsonp" + "&wecarId=" + query.wecarId +
          (query.hasOwnProperty('versionname') ? "&versionname=" + query.versionname : "");
      } else {
        // 根据参数拼接不同请求
        var apiParam = "/search/wecar?callback=JSON_CALLBACK&output=jsonp" + "&page_index=" + query.pageIndex +
          (query.hasOwnProperty('channel') ? "&channel=" + query.channel : "") +
          (query.hasOwnProperty('percent') ? "&percent=" + query.percent : "") +
          (query.hasOwnProperty('versionname') ? "&versionname=" + query.versionname : "");

      }
      return $http.jsonp(apiHost + apiParam)
        .then(getVersionListComplete)
        .catch(getVersionListFailed);
      function getVersionListComplete(res) {
        return res.data;
      }

      function getVersionListFailed(error) {
        $log.error('XHR Failed for getWecarList.\n' + error.status)
      }
    }

  }
})();
