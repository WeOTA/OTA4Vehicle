(function(){
  'use strict';

  angular
    .module('otaRm')
    .factory('systemsizeService',systemsizeService);
  /** @ngInject */
  function systemsizeService($log,$http,API_HOST){
    var apiHost = API_HOST;

    var service = {
      apiHost : apiHost,
      systemsize : systemsize
    };

    return service;

    //fn update
    function systemsize(query){
      if (!query) {
        var apiParam = "/version/systemsize?callback=JSON_CALLBACK&output=jsonp";
      } else {
        var apiParam = "/version/systemsize?callback=JSON_CALLBACK&output=jsonp" +
          (query.hasOwnProperty('version_id') ? "&version_id=" + query.version_id : "") +
          (query.hasOwnProperty('systemsize') ? "&systemsize=" + query.systemsize : "&systemsize=0") +
          (query.hasOwnProperty('role') ? "&role=" + query.role : "")  +
          (query.hasOwnProperty('rtx') ? "&rtx=" + query.rtx : "");
      }
      return $http.jsonp(apiHost + apiParam)
        .then(updateComplete)
        .catch(updateFailed);
      function updateComplete(res) {
        return res.data;
      }

      function updateFailed(error) {
        $log.error('XHR Failed for updateFailed.\n' + error.status)
      }

    }
  }
})();
