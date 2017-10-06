(function() {
	'use strict';

	angular
		.module('otaRm')
		.factory('versionListService',versionListService);

	/** @ngInject */
	function versionListService($log, $http,API_HOST){
		var apiHost  = API_HOST;

		var service = {
			apiHost : apiHost,
			getVersionList : getVersionList
		};

		return service;

		//fn getVersionList
		function getVersionList(query){

			if(!query){
				var apiParam = "/search/version?callback=JSON_CALLBACK&output=jsonp";
			}else{
				var apiParam = "/search/version?callback=JSON_CALLBACK&output=jsonp"+
					(query.hasOwnProperty('versionname') ? "&versionname=" + query.versionname : "")+
					(query.hasOwnProperty('role') ? "&role=" + query.role : "")+
					(query.hasOwnProperty('page_size') ? "&page_size=" + query.page_size : "")+
					(query.hasOwnProperty('pageIndex') ? "&page_index=" + query.pageIndex : "");
			}
			return $http.jsonp(apiHost+apiParam)
			.then(getVersionListComplete)
			.catch(getVersionListFailed);
			function getVersionListComplete(res){
				return res.data;
			}

			function getVersionListFailed(error){
				$log.error('XHR Failed for getVersionList.\n'+error.status)
			}
		}
	}
})();
