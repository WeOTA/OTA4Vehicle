(function() {
    'use strict';

    angular
        .module('otaRm')
        .factory('publicUpgradeService',publicUpgradeService);

    /** @ngInject */
    function publicUpgradeService($log, $http, API_HOST){
        var apiHost  = API_HOST;

        var service = {
            apiHost : apiHost,
            public : publicfn
        };

        return service;

        //fn delete
        function publicfn(query){
            var apiParam = "/publish/pubUpgrade?callback=JSON_CALLBACK&output=jsonp"+
                "&version="+query.version+"&rtx="+query.rtx+"&module="+query.module+"&name="+query.name+"&role="+query.role;
            return $http.jsonp(apiHost+apiParam)
                .then(publicComplete)
                .catch(publicFailed);
            function publicComplete(res){
                return res.data;
            }

            function publicFailed(error){
                $log.error('XHR Failed for pubUpgrade.\n'+error.status)
            }
        }
    }
})();
