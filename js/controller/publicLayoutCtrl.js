'use strict';
angular.module('modaowang')
	.controller('publicLayoutCtrl', ['$scope', '$rootScope', '$uibModal', '$log', 'apiService',
		'storageH', '$state',
		function($scope, $rootScope, $uibModal, $log, apiService, storageH, $state) {

			$scope.addCommonSite = function(siteId, e) {
				e.stopPropagation();
				apiService.userCommonAdd({
					siteId: siteId
				}).then(function(data) {
					if(!data.errCode) {
						$rootScope.tips.showSuccess("添加成功");
					} else {
						$rootScope.tips.showError("添加失败");
					}
				});
			};
			
			
			
			

		}
	])

;