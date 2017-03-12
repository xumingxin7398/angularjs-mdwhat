'use strict';
angular.module('modaowang')
	.factory('httpInterceptor', ['$location', '$log', '$timeout', '$rootScope','storageH',function($location, $log, $timeout, $rootScope,storageH) {
		return {
			response: function(response) {
				response = typeof response == 'object' ? response : JSON.parse(response);
				if(response.status == '200') {

					if(response.config.method == 'JSONP' || response.config.method == 'POST') {
						//console.log("http resp:"+JSON.stringify(response));
						if(typeof $rootScope.hideLoading == 'function') {
							$rootScope.hideLoading();
						}
						//远程请求完成后隐藏加载提示，并清除判断网络超时的定时器
						$timeout.cancel($rootScope.loadingTimer);

						if(response.data) {
							var dataObj = "";
							if(typeof response.data == 'string' && response.data.indexOf('{') == -1) {
								dataObj = response.data;
							} else {
								dataObj = typeof response.data == 'object' ? response.data : JSON.parse(response.data);
							}
							if(typeof dataObj == 'object') {
								if(angular.isDefined(dataObj.errCode)) {
									if(dataObj.errCode != 0) {
										if(dataObj.errCode != -3) {
											if(dataObj.errCode==-11){
												$rootScope.tips.showError("操作过于频繁，请稍后再试");
											}else if(dataObj.errCode==-2){
												$rootScope.tips.showError("参数错误");
											}else if(dataObj.errCode==-1){
												$rootScope.tips.showError("系统错误");
											}
											else{
												$rootScope.tips.showError("请求失败,错误码"+dataObj.errCode);
											}
											
										} else if(dataObj.errCode == -3) {
											storageH.removeUser();
											$rootScope.tips.showError("请先登录");
											$rootScope.$broadcast("UserAuthFailed");
										}
									}
								}
							} //end if object
						}

					}
				}
				return response;
			},
			request: function(request) {
				if(request.method == 'JSONP' || request.method == 'POST') {
					//console.log("http req:"+JSON.stringify(request));
					if(typeof $rootScope.showLoading == 'function') {
						$rootScope.showLoading(6000);
					}
					/*$rootScope.loadingTimer = $timeout(function() {
						$rootScope.showTips("请求超时");
					}, 5500);*/
				}

				return request;
			}
		}
	}]);