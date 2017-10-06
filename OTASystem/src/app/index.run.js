(function() {
  'use strict';

  angular
    .module('otaRm')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log,$rootScope,$state,$stateParams,$cookies,ROLE_SCHEME,roleNav) {

    $log.debug('otarm is ready.');
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    var ename = $cookies.get('ename');
    var cname = $cookies.get('cname');
    var role = $cookies.get('role');

    var ename = "chesterwan";
    var cname = "万秋生";
    var role = "ADMIN";

    $log.info("LOG[$cookies.ename]:",ename);
    $log.info("LOG[$cookies.cname]:",cname);
    $log.info("LOG[$cookies.role]:",role);

    roleNav.nav = role;
    roleNav.ename = ename;

    /**
     * 权限控制
     * @param  {[type]} event       [description]
     * @param  {[type]} toState     [目标路由]
     * @param  {[type]} toParams    [description]
     * @param  {[type]} fromState   [description]
     * @param  {[type]} fromParams) [description]
     * @return {[type]}             [description]
     */
    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {

       $log.info("LOG[ename]:",ename);
       $log.info("LOG[cname]:",cname);
       $log.info("LOG[role]:",role);

      $log.info("LOG[toState.name]:",toState.name)

       if(!ename || !role || !cname){
           roleNav.nav = 'ADMIN';
           $log.info('LOG[you are admin!]');
        // $log.info("LOG[未登录]:",ename)
        //window.location.replace('http://passport.oa.com/modules/passport/signin.ashx?url=http://10.170.5.148:8080/otainner/account/login');
        // window.location.replace('http://passport.oa.com/modules/passport/signin.ashx?url=http://tas.wecar.wsd.com/otainner/account/login');//need to modify
       }else {
         $log.info("LOG[已经登录]:",ename)
         if(role == "RD"){
            roleNav.nav = 'RD';
            if(!isUrl(toState.name,ROLE_SCHEME.RD)){
               $state.go('home');
               event.preventDefault();
            }

         }else if(role == "QA"){
            roleNav.nav = 'QA';
            if(!isUrl(toState.name,ROLE_SCHEME.QA)){
               $state.go('home');
               event.preventDefault();
            }

         }else if(role == "PM"){
            roleNav.nav = 'PM';
            if(!isUrl(toState.name,ROLE_SCHEME.PM)){
               $state.go('home');
               event.preventDefault();
            }

         }else if(role == "OP"){
            roleNav.nav = 'OP';
            if(!isUrl(toState.name,ROLE_SCHEME.OP)){
               $state.go('home');
               event.preventDefault();
            }

         }else if(role == "ADMIN"){
            roleNav.nav = 'ADMIN';
            $log.info('LOG[you are admin!]');

         }else{
            //$state.go('home');
            window.location.replace('http://naviotarm.wecar.wsd.com/otarm/403.html');
            //event.preventDefault();
         }
       }

    });
  };
  /**
   * 判断此路由是否有权访问
   * @param  {[type]}  name [toState.name]
   * @param  {[type]}  arr  [权限arr]
   * @return {Boolean}      [true/false]
   */
  function isUrl(name,arr){
    var tem = name.split(".")
    for(var i=0;i<arr.length;i++){
      if(arr[i].indexOf(tem[0])){
        return true;
      }
    }
    return false;
  }
})();
