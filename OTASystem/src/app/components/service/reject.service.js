(function(){
	'use strict';

	angular
		.module('otaRm')
		.factory('refuseService',refuseService);
	/** @ngInject */
	function refuseService($log,$http,API_HOST){
		var apiHost = API_HOST;

		var service = {
			apiHost : apiHost,
			refuse : refuse
		};

		return service;

		//fn submit
		function refuse(query){
      if (!query) {
        var apiParam = "/publish/refuse?callback=JSON_CALLBACK&output=jsonp";
      } else {
        var apiParam = "/publish/refuse?callback=JSON_CALLBACK&output=jsonp" +
          (query.hasOwnProperty('name') ? "&name=" + query.name : "") +
          (query.hasOwnProperty('version') ? "&version=" + query.version : "") +
          (query.hasOwnProperty('report') ? "&report" + query.report : "") +
          (query.hasOwnProperty('role') ? "&role=" + query.role : "")  +
          (query.hasOwnProperty('module') ? "&module" + query.module : "") +
          (query.hasOwnProperty('rtx') ? "&rtx=" + query.rtx : "");
      }
      return $http.jsonp(apiHost + apiParam)
        .then(refuseComplete)
        .catch(refuseFailed);
      function refuseComplete(res) {
        return res.data;
      }

      function refuseFailed(error) {
        $log.error('XHR Failed for refuseFailed.\n' + error.status)
      }

    }

	}
})();
