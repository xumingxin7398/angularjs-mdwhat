angular.module('modaowang')

	.service('apiService', ['$http', '$window', 'storageH', '$q', 'appConfig', '$rootScope',
		function($http, $window, storageH, $q, appConfig, $rootScope) {
			this.domain = "http://" + appConfig.host + ":" + appConfig.port;
			//host配置
			this.serverUrl = this.domain + "";
			$rootScope.serverUrl = this.serverUrl;
			//请求参数处理------------------
			this.handleParams = function(params) {
				params = params ? params : {};
				var userInfo = storageH.getUserInfo();
				if(userInfo) {
					if(userInfo.user && !params.userId) {
						params.userId = userInfo.user.userId
					}
				};
				params.request_time = new Date().getTime();
				return params;
			};
			//header参数处理------------------
			this.handleConfig = function(httpConfig) {
				httpConfig = httpConfig ? httpConfig : {};
				var userInfo = storageH.getUserInfo();

				if(!httpConfig.headers) {
					httpConfig.headers = {
						appId: appConfig.appId
					};
				}else{
					httpConfig.headers["appId"] = appConfig.appId;
				}
				if(userInfo && userInfo.token) {
					httpConfig.headers["token"] = userInfo.token;
					httpConfig.headers["userId"] = userInfo.user.userId;
				}
				

				return httpConfig;
			};
			//创建post请求-------------
			this.c_post = function(api, params, httpConfig) {
				var deferred = $q.defer();
				if(!this.checkAuth(api)) {
					$rootScope.tips.showError("请先登录");
					$rootScope.$broadcast("UserAuthFailed");

					deferred.reject("请先登录");
					return deferred.promise;
				};
				var allParams = this.handleParams(params);
				var allConfig = this.handleConfig(httpConfig);
				var url = this.serverUrl + api;

				$http.post(url, allParams, allConfig).success(
					function(data) {
						deferred.resolve(data);
					}
				).error(function(err) {
					$rootScope.tips.showError("请求失败");
					$rootScope.hideLoading();
					deferred.reject(err);
				});
				return deferred.promise;
			};
			this.c_get = function(api, params, httpConfig) {
				var deferred = $q.defer();
				if(!this.checkAuth(api)) {
					$rootScope.tips.showError("请先登录");
					$rootScope.$broadcast("UserAuthFailed");
					deferred.reject("请先登录");
					return deferred.promise;
				};
				var allParams = this.handleParams(params);
				var allConfig = this.handleConfig(httpConfig);
				var url = this.serverUrl + api;

				$http.get(url, allParams, allConfig).success(
					function(data) {
						deferred.resolve(data);
					}
				).error(function(err) {
					$rootScope.tips.showError("请求失败");
					$rootScope.hideLoading();
					deferred.reject(err);
				});
				return deferred.promise;
			};

			//登录

			this.postImageUrl = this.serverUrl + "/api/post/upload-image";
			this.userIconUrl = this.serverUrl + "/api/user-info/upload-icon";
			this.categoryAll = function(params, config) {
				var api = "/api/category/all";
				return this.c_post(api, params, config);
			};

			this.categoryChild = function(params, config) {
				var api = "/api/category/child";
				return this.c_post(api, params, config);
			};

			this.categorySiteGroup = function(params, config) {
				var api = "/api/category-site/group";
				return this.c_post(api, params, config);
			};
			this.categorySiteGroupPage = function(params, config) {
				var api = "/api/category-site/group-page";
				return this.c_post(api, params, config);
			};

			this.siteAll = function(params, config) {
				var api = "/api/site/all";
				return this.c_post(api, params, config);
			};
			this.siteCount = function(params, config) {
				var api = "/api/site/count";
				return this.c_post(api, params, config);
			};

			this.userCheckName = function(params, config) {
				var api = "/api/user/check-name";
				return this.c_post(api, params, config);
			};
			this.userCheckEmail = function(params, config) {
				var api = "/api/user/check-email";
				return this.c_post(api, params, config);
			};
			this.userRegister = function(params, config) {
				var api = "/api/user/register";
				return this.c_post(api, params, config);
			};

			this.userLogin = function(params, config) {
				var api = "/api/user/login";
				return this.c_post(api, params, config);
			};
			this.userQqLogin = function(params, config) {
				var api = "/api/user/qq-login";
				return this.c_post(api, params, config);
			};
			this.userLogout = function(params, config) {
				var api = "/api/user/logout";
				return this.c_post(api, params, config);
			};
			this.userVerifyCode = function(params, config) {
				var api = "/api/user/verify-code";
				return this.c_post(api, params, config);
			};
			this.userVerifyCodeCheck = function(params, config) {
				var api = "/api/user/verify-code-check";
				return this.c_post(api, params, config);
			};

			this.userInfoProfile = function(params, config) {
				var api = "/api/user-info/profile";
				return this.c_post(api, params, config);
			};
			this.userInfoEdit = function(params, config) {
				var api = "/api/user-info/edit";
				return this.c_post(api, params, config);
			};
			this.userGameToday = function(params, config) {
				var api = "/api/user-game/today";
				return this.c_post(api, params, config);
			};
			this.userGameChanceExchange = function(params, config) {
				var api = "/api/user-game/chance-exchange";
				return this.c_post(api, params, config);
			};
			this.userPrizeWinNumbers = function(params, config) {
				var api = "/api/user-prize/win-numbers";
				return this.c_post(api, params, config);
			};
			this.userPrizeGameNumbers = function(params, config) {
				var api = "/api/user-prize/game-numbers";
				return this.c_post(api, params, config);
			};
			this.userPrizeList = function(params, config) {
				var api = "/api/user-prize/list";
				return this.c_post(api, params, config);
			};
			this.userPrizeCount = function(params, config) {
				var api = "/api/user-prize/count";
				return this.c_post(api, params, config);
			};
			this.userPrizeEdit = function(params, config) {
				var api = "/api/user-prize/edit";
				return this.c_post(api, params, config);
			};

			this.favoriteSiteAdd = function(params, config) {
				var api = "/api/favorite-site/add";
				return this.c_post(api, params, config);
			};
			this.favoriteSiteDel = function(params, config) {
				var api = "/api/favorite-site/del";
				return this.c_post(api, params, config);
			};
			this.favoriteSiteSite = function(params, config) {
				var api = "/api/favorite-site/site";
				return this.c_post(api, params, config);
			};
			this.favoriteSiteSiteCount = function(params, config) {
				var api = "/api/favorite-site/site-count";
				return this.c_post(api, params, config);
			};
			this.favoriteSiteCreate = function(params, config) {
				var api = "/api/favorite-site/create";
				return this.c_post(api, params, config);
			};
			this.favoriteSiteUpdateMulti = function(params, config) {
				var api = "/api/favorite-site/update-multi";
				return this.c_post(api, params, config);
			};

			this.userFavoriteAdd = function(params, config) {
				var api = "/api/user-favorite/add";
				return this.c_post(api, params, config);
			};
			this.userFavoriteUpdate = function(params, config) {
				var api = "/api/user-favorite/update";
				return this.c_post(api, params, config);
			};
			this.userFavoriteUpdateSort = function(params, config) {
				var api = "/api/user-favorite/update-sort";
				return this.c_post(api, params, config);
			};
			this.userFavoriteUpdateSortMulti = function(params, config) {
				var api = "/api/user-favorite/update-sort-multi";
				return this.c_post(api, params, config);
			};

			this.userFavoriteList = function(params, config) {
				var api = "/api/user-favorite/list";
				return this.c_post(api, params, config);
			};
			this.userFavoritePublicList = function(params, config) {
				var api = "/api/user-favorite/public-list";
				return this.c_post(api, params, config);
			};
			this.userFavoritePublicCount = function(params, config) {
				var api = "/api/user-favorite/public-count";
				return this.c_post(api, params, config);
			};
			this.userFavoriteFollow = function(params, config) {
				var api = "/api/user-favorite/follow";
				return this.c_post(api, params, config);
			};
			this.userFavoriteFollowDel = function(params, config) {
				var api = "/api/user-favorite/follow-del";
				return this.c_post(api, params, config);
			};
			this.userFavoriteListRecommend = function(params, config) {
				var api = "/api/user-favorite/list-recommend";
				return this.c_post(api, params, config);
			};

			this.userCommonAdd = function(params, config) {
				var api = "/api/user-common/add";
				return this.c_post(api, params, config);
			};
			this.userCommonCreate = function(params, config) {
				var api = "/api/user-common/create";
				return this.c_post(api, params, config);
			};
			this.userCommonRecommend = function(params, config) {
				var api = "/api/user-common/recommend";
				return this.c_post(api, params, config);
			};

			this.userCommonDel = function(params, config) {
				var api = "/api/user-common/del";
				return this.c_post(api, params, config);
			};
			this.userCommonList = function(params, config) {
				var api = "/api/user-common/list";
				return this.c_post(api, params, config);
			};
			this.userCommonUpdate = function(params, config) {
				var api = "/api/user-common/update";
				return this.c_post(api, params, config);
			};
			this.userCommonUpdateMulti = function(params, config) {
				var api = "/api/user-common/update-multi";
				return this.c_post(api, params, config);
			};

			this.userToolList = function(params, config) {
				var api = "/api/user-tool/list";
				return this.c_post(api, params, config);
			};
			this.userToolAdd = function(params, config) {
				var api = "/api/user-tool/add";
				return this.c_post(api, params, config);
			};
			this.userToolDel = function(params, config) {
				var api = "/api/user-tool/del";
				return this.c_post(api, params, config);
			};

			this.toolSiteGroup = function(params, config) {
				var api = "/api/tool-site/group";
				return this.c_post(api, params, config);
			};

			this.activityList = function(params, config) {
				var api = "/api/activity/list";
				return this.c_post(api, params, config);
			};

			//---------------------------------社区
			this.postDelFile = function(params, config) {
				var api = "/api/post/del-file";
				return this.c_post(api, params, config);
			};
			this.postAdd = function(params, config) {
				var api = "/api/post/add";
				return this.c_post(api, params, config);
			};
			this.postAwarded = function(params, config) {
				var api = "/api/post/awarded";
				return this.c_post(api, params, config);
			};

			this.postEdit = function(params, config) {
				var api = "/api/post/edit";
				return this.c_post(api, params, config);
			};
			this.postDel = function(params, config) {
				var api = "/api/post/del";
				return this.c_post(api, params, config);
			};
			this.postAll = function(params, config) {
				var api = "/api/post/all";
				return this.c_post(api, params, config);
			};
			this.postCategoryList = function(params, config) {
				var api = "/api/post/category-list";
				return this.c_post(api, params, config);
			};
			this.postUserList = function(params, config) {
				var api = "/api/post/user-list";
				return this.c_post(api, params, config);
			};
			this.postCount = function(params, config) {
				var api = "/api/post/count";
				return this.c_post(api, params, config);
			};
			this.postUserCount = function(params, config) {
				var api = "/api/post/user-count";
				return this.c_post(api, params, config);
			};
			this.postDetail = function(params, config) {
				var api = "/api/post/detail";
				return this.c_post(api, params, config);
			};
			this.postPraiseAdd = function(params, config) {
				var api = "/api/post-praise/add";
				return this.c_post(api, params, config);
			};
			this.postPraiseDel = function(params, config) {
				var api = "/api/post-praise/del";
				return this.c_post(api, params, config);
			};

			this.postMessageUserList = function(params, config) {
				var api = "/api/post-message/user-list";
				return this.c_post(api, params, config);
			};
			this.postMessageDel = function(params, config) {
				var api = "/api/post-message/del";
				return this.c_post(api, params, config);
			};
			this.postMessageUserCount = function(params, config) {
				var api = "/api/post-message/user-count";
				return this.c_post(api, params, config);
			};

			this.privateMessageAdd = function(params, config) {
				var api = "/api/private-message/add";
				return this.c_post(api, params, config);
			};
			this.privateMessageChatList = function(params, config) {
				var api = "/api/private-message/chat-list";
				return this.c_post(api, params, config);
			};
			this.privateMessageUserList = function(params, config) {
				var api = "/api/private-message/user-list";
				return this.c_post(api, params, config);
			};
			this.privateMessageUserCount = function(params, config) {
				var api = "/api/private-message/user-count";
				return this.c_post(api, params, config);
			};

			this.replyAdd = function(params, config) {
				var api = "/api/reply/add";
				return this.c_post(api, params, config);
			};
			this.replyDel = function(params, config) {
				var api = "/api/reply/del";
				return this.c_post(api, params, config);
			};
			this.replyPraiseAdd = function(params, config) {
				var api = "/api/reply-praise/add";
				return this.c_post(api, params, config);
			};
			this.replyPraiseDel = function(params, config) {
				var api = "/api/reply-praise/del";
				return this.c_post(api, params, config);
			};

			this.replyList = function(params, config) {
				var api = "/api/reply/list";
				return this.c_post(api, params, config);
			};
			this.replyChild = function(params, config) {
				var api = "/api/reply/child";
				return this.c_post(api, params, config);
			};

			this.siteGetSite = function(params, config) {
				var api = "/api/site/get-site-by-url";
				return this.c_post(api, params, config);
			};
			this.siteGetDescription = function(params, config) {
				var api = "/api/site/get-description";
				return this.c_post(api, params, config);
			};

			this.rankingTop = function(params, config) {
				var api = "/api/ranking/top";
				return this.c_post(api, params, config);
			};
			this.rankingList = function(params, config) {
				var api = "/api/ranking/list";
				return this.c_post(api, params, config);
			};

			this.authApis = [
				"/api/favorite-site/add",
				"/api/favorite-site/del",
				"/api/favorite-site/create",
				"/api/favorite-site/update-multi",

				"/api/post/add",
				"/api/post/awarded",
				"/api/post/del",
				"/api/post/edit",
				"/api/post/upload-image",
				"/api/post/del-file",
				"/api/post-praise/add",
				"/api/post-praise/del",

				"/api/post-message/user-list",
				"/api/post-message/del",
				//"/api/post-message/user-count",

				"/api/private-message/add",
				"/api/private-message/user-list",
				"/api/private-message/chat-list",

				"/api/reply/add",
				"/api/reply/del",
				"/api/reply-praise/add",
				"/api/reply-praise/del",

				"/api/user/check-email",
				"/api/user/verify-code",
				"/api/user/verify-code-check",
				"/api/user/logout",
				"/api/user-info/edit",
				"/api/user-info/upload-icon",

				//"/api/user-common/list",
				"/api/user-common/add",
				"/api/user-common/create",
				"/api/user-common/del",
				"/api/user-common/update",
				"/api/user-common/update-multi",

				"/api/user-favorite/del",
				"/api/user-favorite/update",
				"/api/user-favorite/update-sort",
				"/api/user-favorite/update-sort-multi",
				"/api/user-favorite/add",
				/*"/api/user-favorite/list",*/
				"/api/user-favorite/count",
				"/api/user-favorite/follow",
				"/api/user-favorite/follow-del",

				"/api/user-game/today",
				"/api/user-prize/win-numbers",
				"/api/user-prize/game-numbers",
				"/api/user-prize/list",
				"/api/user-prize/count",
				"/api/user-prize/edit",

				"/api/user-tool/add",
				"/api/user-tool/del",
			];
			this.checkAuth = function(api) {
				if(this.authApis.indexOf(api) != -1) {
					var userInfo = storageH.getUserInfo();
					if(!userInfo || !userInfo.user || !userInfo.token) {
						return false;
					};
				}
				return true;
			};

		}
	])

;