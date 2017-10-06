(function() {
	'use strict';

	angular
		.module('otaRm')
		.filter('transitionStatus',transitionStatus)
		.filter('transitionMB',transitionMB)
		.filter('transitionUserLevel',transitionUserLevel)

	/** @ngInject */
	function transitionStatus(){
		var scheme = {
			0: '待发布',
			10: '已灰度发布',
			20: '已停止灰度发布',
		};
		return function(status){
			return scheme[status];
		}
	}
	/** @ngInject */
	function transitionMB(){
		return function(byte){
			return Math.floor(byte/1024/1024*100) /100
		}
	}
	/** @ngInject */
	function transitionUserLevel(){
		return function(num){
			var scheme = {
                '100': '内研',
                '150': '内测',
                '200': '种子',
                '250': '发售',
                '300': '普通'
			};
			return scheme[num]
		}
	}
})();
