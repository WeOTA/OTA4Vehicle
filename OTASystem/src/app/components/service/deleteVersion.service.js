(function() {
	'use strict';

	angular
		.module('otaRm')
		.factory('deleteVersionService',deleteVersionService);

	/** @ngInject */
	function deleteVersionService($log, $http,API_HOST){
		var apiHost  = API_HOST;

		var service = {
			apiHost : apiHost,
			delete : deletefn
		};

		return service;

		//fn delete
		function deletefn(query){

			if(!query.versionname){
				return $log.error('parame is error!')
			}
			var apiParam = "/version/delete?callback=JSON_CALLBACK&output=jsonp"+
				"&version_id="+query.versionname+"&rtx="+query.rtx;
			return $http.jsonp(apiHost+apiParam)
			.then(deleteComplete)
			.catch(deleteFailed);
			function deleteComplete(res){
				return res.data;
			}

			function deleteFailed(error){
				$log.error('XHR Failed for getVersionList.\n'+error.status)
			}
		}
	}
})();
