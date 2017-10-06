(function(){
	'use strict';

	angular
		.module('otaRm')
		.factory('upgradeService',upgradeService);
	/** @ngInject */
	function upgradeService($log,$http,API_HOST){
		var apiHost = API_HOST;

		var service = {
			apiHost : apiHost,
			upgrade : upgrade
		};

		return service;
		//fn upgrade

    function upgradeOnce(versionname,wecarId,rtx) {
      var apiParam = "/publish/upgrade?callback=JSON_CALLBACK&output=jsonp&versionname=" + versionname  + "&wecarId=" + wecarId + "&rtx=" + rtx ;
      return $http.jsonp(apiHost + apiParam)
        .then(upgradeFailedComplete)
        .catch(upgradeFailedFailed);
      function upgradeFailedComplete(res) {
        return res.data;
      }

      function upgradeFailedFailed(error) {
        $log.error('XHR Failed for upgradeFailedFailed.\n' + error.status)
      }
    }

		function upgrade(query) {
      var versionname = query.versionname;
      var rtx = query.rtx;
      var wecarIdCount = query.wecarId.length;
      $log.error('!!!!wecarIdCount.\n'+wecarIdCount)
      var requestCount =  Math.ceil(wecarIdCount / 100);
      var returndata;
      for(var i = 0; 100*i< wecarIdCount;i++) {
         var wecarIdRequest = query.wecarId.slice(i*100,(i+1)*100);
         returndata= upgradeOnce(versionname,wecarIdRequest,rtx);
      }
      return returndata;
    }
	}
})();
