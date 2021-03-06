/* global malarkey:false, moment:false */
(function() {
  'use strict';

  angular
    .module('otaRm')
    .constant('malarkey', malarkey)
    .constant('moment', moment)
    // 配置后端接口

   	// 用户权限配置
   	.constant('ROLE_SCHEME',{
   		"RD":['home','rdupdate','releases.list','versioning.list'],
   		"QA":['home','rdupdate','releases.list','versioning.list'],
   		"PM":['home','rdupdate','releases.list','versioning.list'],
   		"OP":['home','rdupdate','releases.list','versioning.list'],
   		"ADMIN":['home','rdupdate','releases.list','versioning.list']
   	})
    // nav 配置
    .value('roleNav',{
      nav : -1,
      ename : -1
    })

})();
