(function(){
	'use strict';

	angular
		.module('otaRm')
		.factory('submitService',submitService);
	/** @ngInject */
	function submitService($log,$http,API_HOST){
		var apiHost = API_HOST;

		var service = {
			apiHost : apiHost,
			submit : submit
		};

		return service;

		//fn submit
		function submit(query){
      if (!query) {
        var apiParam = "/publish/submit?callback=JSON_CALLBACK&output=jsonp";
      } else {
        var apiParam = "/publish/submit?callback=JSON_CALLBACK&output=jsonp" +
          (query.hasOwnProperty('name') ? "&name=" + query.name : "") +
          (query.hasOwnProperty('version') ? "&version=" + query.version : "") +
          (query.hasOwnProperty('report') ? "&report" + query.report : "") +
          (query.hasOwnProperty('role') ? "&role=" + query.role : "")  +
          (query.hasOwnProperty('module') ? "&module" + query.module : "") +
          (query.hasOwnProperty('rtx') ? "&rtx=" + query.rtx : "");
      }
      return $http.jsonp(apiHost + apiParam)
        .then(submitComplete)
        .catch(submitFailed);
      function submitComplete(res) {
        return res.data;
      }

      function submitFailed(error) {
        $log.error('XHR Failed for updateFailed.\n' + error.status)
      }


		}
	}
})();
