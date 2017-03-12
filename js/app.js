'use strict';

// Define the `phonecatApp` module
angular.module('modaowang', [
		'ngAnimate',
		'ngSanitize',
		'ngResource',
		'ngTouch',
		'angular-loading-bar',
		'ui.router',
		'ui.bootstrap',
		'ang-drag-drop',
		'angular-pinyin-translate',
		'angular-perfect-scrollbar-2',
		'LocalStorageModule',
		'oc.lazyLoad',
		'textAngular',
		/*'ngFileUpload',*/
		/*'ngImgCrop',*/
		'dndLists',
		'ct.ui.router.extras',
		'infinite-scroll'
	])
	
	.run(['$rootScope', 'settings','common','storageH','$state','$window', function($rootScope,settings,common,storageH,$state,$window) {
		$rootScope.$state = $state;
		$rootScope.modaowangUser=storageH.initUser();
		document.body.addEventListener('touchstart', function(){ });
		document.body.addEventListener('touchmove', function(){ });
		document.body.addEventListener('touchend', function(){ });

	    
	}]);

;