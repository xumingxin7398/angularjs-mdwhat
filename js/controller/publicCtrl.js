'use strict';
angular.module('modaowang')
	.controller('publicCreateFavoriteSiteCtrl', ['$scope', '$rootScope', '$log', 'apiService',
		 '$state', '$stateParams', '$timeout','storageH',
		function($scope, $rootScope, $log, apiService, $state, $stateParams, $timeout,storageH) {
			$scope.site = JSON.parse($stateParams.site);
			$scope.site.url = decodeURIComponent($scope.site.url);
			$scope.activeTab = 0;
			//获取收藏夹列表
			$scope.getFavorite = function() {
				
				var userInfo = storageH.getUserInfo();
				if(!userInfo || !userInfo.user || !userInfo.token) {
					$rootScope.tips.showError("请先登录");
					$rootScope.$broadcast("UserAuthFailed");
					return;
				};
				
				
				apiService.userFavoriteList().then(function(data) {
					if(!data.errCode) {

						$scope.favoriteList = data.data;

					}
				});
			};

			$scope.getFavorite();
			$scope.createSuccess = false;
			$scope.createFavoriteSite = function() {
				var params = angular.copy($scope.site);
				if(!$scope.favoriteList||$scope.favoriteList.length==0){
					$rootScope.tips.showError("请先添加一个收藏夹");
					return;
				}
				params.favoriteId = $scope.favoriteList[$scope.activeTab].favoriteId;
				apiService.favoriteSiteCreate(
					params
				).then(function(data) {
					if(!data.errCode) {
						$scope.createSuccess = true;
						apiService.favoriteSiteSiteCount({
							favoriteId: $scope.favoriteList[$scope.activeTab].favoriteId
						}).then(function(data) {
							if(!data.errCode) {
								$scope.favoriteList[$scope.activeTab].siteCount = data.data;
							}
						});
						$timeout(function() {
							window.opener = null;
							window.close();
						}, 1500);
					}
				});
			};
		}
	])
	.controller('publicCommonCtrl', ['$scope', '$rootScope', '$log', 'apiService',
		 '$state', '$stateParams',
		function($scope, $rootScope, $log, apiService, $state, $stateParams) {
			$scope.getRecommendCommon = function() {
				apiService.userCommonRecommend().then(function(data) {
					if(!data.errCode) {
						$scope.commonList = data.data;
					}
				})
			};
			$scope.addCommonSite = function(index, e) {
				e.stopPropagation();
				apiService.userCommonAdd({
					siteId: $scope.commonList[index].siteId
				}).then(function(data) {
					if(!data.errCode) {
						$scope.commonList[index].userFollowed = 1;
						$rootScope.$broadcast("CommonSiteListChanged");
						$rootScope.tips.showSuccess("添加成功");
					} else {
						$rootScope.tips.showError("添加失败");
					}
				});
			};
			$scope.getRecommendCommon();
		}
	])
	.controller('publicFavoriteCtrl', ['$scope', '$rootScope', '$log', 'apiService',
		 '$state', '$stateParams',
		function($scope, $rootScope, $log, apiService, $state, $stateParams) {
			$scope.activeTab = 0;
			$scope.getRecommendFavorite = function() {
				apiService.userFavoriteListRecommend().then(function(data) {
					if(!data.errCode) {
						$scope.favoriteList = data.data;
						if($scope.favoriteList.length > 0) {
							$scope.getSiteByFavorite($scope.favoriteList[$scope.activeTab].favoriteId);
						}

					}
				})
			};
			//获取某个收藏夹网站

			$scope.getSiteByFavorite = function(favoriteId) {
				apiService.favoriteSiteSite({
					favoriteId: favoriteId
				}).then(function(data) {
					if(!data.errCode) {
						$scope.favoriteSiteList = data.data;
					}
				});
			};
			$scope.getRecommendFavorite();

			$scope.followFavorite = function() {
				apiService.userFavoriteFollow({
					favoriteId: $scope.favoriteList[$scope.activeTab].favoriteId
				}).then(function(data) {
					if(!data.errCode) {
						$scope.favoriteList[$scope.activeTab].userFollowed = 1;
						$rootScope.$broadcast("FavoriteListChanged");
						console.log("关注成功");
					}
				});
			};
			$scope.delFollowFavorite = function() {
				apiService.userFavoriteFollowDel({
					favoriteId: $scope.favoriteList[$scope.activeTab].favoriteId
				}).then(function(data) {
					if(!data.errCode) {
						$scope.favoriteList[$scope.activeTab].userFollowed = 0;
						$rootScope.$broadcast("FavoriteListChanged");
						console.log("取消成功");
					}
				});
			};
		}
	])

.controller('publicUserProfileCtrl', ['$scope', '$rootScope', 'apiService',
		'$stateParams', '$pinyinTranslate', '$state', 'Upload','storageH',
		function($scope, $rootScope, apiService, $stateParams,
			$pinyinTranslate, $state, Upload,storageH) {
			$scope.getUserInfo = function() {
				apiService.userInfoProfile().then(function(data) {
					if(!data.errCode) {
						data.data.icon=data.data.icon.replace('.','-lg.');
						$scope.userInfo = data.data;
					}
				});
			};
			$scope.getUserInfo();
			$scope.openUploadIconModal = function() {
				var modal = $rootScope.openContentModal('uploadIconModal', '', $scope.userInfo.icon);
				modal.result.then(function(file) {
					$scope.uploadFile(file);
				});
			};

			$scope.uploadFile = function(file) {
				var userInfo = storageH.getUserInfo();
				var upload = Upload.upload({
					url: apiService.userIconUrl,
					data: {
						file: file
					},
					headers: userInfo ? {
						token: userInfo.token,
						userId: userInfo.user.userId
					} : {}
				});

				upload.then(function(data) {
					if(!data.data.errCode) {
						userInfo.user.icon = data.data.data;
						storageH.setUser(userInfo);
						$scope.userInfo.icon = data.data.data;
						apiService.userInfoEdit($scope.userInfo).then(function(data) {
							if(!data.errCode) {

								$scope.getUserInfo();
							}
						});
					}
				});
			};

			$scope.$on("UserProfileChanged", $scope.getUserInfo);

			$scope.getPrizeCount = function() {
				apiService.userPrizeCount().then(function(data) {
					if(!data.errCode) {
						$scope.prizeCount = data.data;

					}
				});
			};
			$scope.getPrizeCount();
			$scope.getPostCount = function() {
				apiService.postUserCount($scope.postParams).then(function(data) {
					if(!data.errCode) {
						$scope.postCount = data.data;
					}
				});
			};
			$scope.getPostCount();

		}
	])
	.controller('publicUserProfilePrizeCtrl', ['$scope', '$rootScope', 'apiService',
		'$stateParams', '$pinyinTranslate', '$state','$previousState',
		function($scope, $rootScope, apiService, $stateParams,
			$pinyinTranslate, $state,$previousState) {
			$scope.prizeParams = {
				pageNum: $state.params.pageNum || 1,
				pageSize: 10,
				orderBy: '',
				keyword: '',
				userId: $scope.userId
			};
			$scope.getPrize = function() {
				apiService.userPrizeList($scope.prizeParams).then(function(data) {
					if(!data.errCode) {
						$scope.prizeList = data.data;
						$scope.prizeParams.total = data.pageParams.total;
					}
				});
			};
			$scope.changePage = function() {
				$state.go($state.current.name, {
					pageNum: $scope.prizeParams.pageNum
				});
			};
			$previousState.memo("previousCaller");
			$scope.$on("UserPrizeChanged", $scope.getPrize);

		}
	])
	.controller('publicUserProfilePostCtrl', ['$scope', '$rootScope', 'apiService',
		'$stateParams', '$pinyinTranslate', '$state','$previousState',
		function($scope, $rootScope, apiService, $stateParams,
			$pinyinTranslate, $state,$previousState) {
			$scope.postParams = {
				pageNum: $state.params.pageNum || 1,
				pageSize: 10,
				orderBy: '',
				keyword: '',
				userId: $scope.userId
			};
			$scope.getPost = function() {

				apiService.postUserList($scope.postParams, {
					cache: true
				}).then(function(data) {
					if(!data.errCode) {

						$scope.postList = data.data;
						$scope.postParams.total = data.pageParams.total;
					}
				});
			};

			$scope.changePage = function() {
				$state.go($state.current.name, {
					pageNum: $scope.postParams.pageNum
				});
			};
			$previousState.memo("previousCaller");
			

		}
	])
	.controller('publicUserProfilePrizePageCtrl', ['$scope', '$rootScope', 'apiService',
		'$stateParams', '$pinyinTranslate', '$state',
		function($scope, $rootScope, apiService, $stateParams,
			$pinyinTranslate, $state) {
			$scope.prizeParams.pageNum = $scope.prizeParams.pageNum || parseInt($state.params.pageNum) || 1;
			$scope.prizeParams.total = $scope.prizeParams.total || 0;

			$scope.getPrize();

		}
	])
	.controller('publicUserProfilePostPageCtrl', ['$scope', '$rootScope', 'apiService',
		'$stateParams', '$pinyinTranslate', '$state',
		function($scope, $rootScope, apiService, $stateParams,
			$pinyinTranslate, $state) {
			$scope.postParams.pageNum = $scope.postParams.pageNum || parseInt($state.params.pageNum) || 1;
			$scope.postParams.total = $scope.postParams.total || 0;

			$scope.getPost();

		}
	])

.controller('publicRankingCtrl', ['$scope', '$rootScope', 'apiService',
	'$stateParams', '$state','$previousState',
	function($scope, $rootScope, apiService, $stateParams,
		$state,$previousState) {
		$scope.params = {
			pageNum: $state.params.pageNum || 1,
			pageSize: 10,
			orderBy: '',
			keyword: $state.params.keyword || "",
		};
		$scope.getRanking = function() {
			apiService.rankingList($scope.params).then(function(data) {
				if(!data.errCode) {
					$scope.rankingList = data.data;
					$scope.params.total = data.pageParams.total;
				}
			});
		};
		$scope.search = function() {
			$scope.params.pageNum=1;
			$state.go($state.current.name, {
				keyword: $scope.params.keyword
			});
		};
		$scope.changePage = function() {
			$state.go($state.current.name, {
				pageNum: $scope.params.pageNum
			});
		};
		$previousState.memo("previousCaller");
	}
])

.controller('publicRankingPageCtrl', ['$scope', '$rootScope', 'apiService',
		'$stateParams', '$state',
		function($scope, $rootScope, apiService, $stateParams,
			$state) {
			$scope.params.pageNum = $scope.params.pageNum || parseInt($state.params.pageNum) || 1;
			$scope.params.total = $scope.params.total || 0;

			$scope.getRanking();

		}
	])
	.controller('publicUserZoneCtrl', ['$scope', '$rootScope', 'apiService',
		'$stateParams', '$pinyinTranslate', '$state',
		function($scope, $rootScope, apiService, $stateParams,
			$pinyinTranslate, $state) {
			$scope.userId = $state.params.userId;
			$scope.params = {
				pageNum: $state.params.pageNum || 1,
				pageSize: 10,
				orderBy: '',
				keyword: '',
				userId: $scope.userId
			};

			$scope.getUserInfo = function(userId) {

				apiService.userInfoProfile({
					userId: userId
				}).then(function(data) {
					if(!data.errCode) {
						data.data.icon=data.data.icon.replace('.','-lg.');
						$scope.userInfo = data.data;
					}
				});
			};
			$scope.getPostCount = function() {
				apiService.postUserCount($scope.params).then(function(data) {
					if(!data.errCode) {
						$scope.postCount = data.data;
					}
				});
			};
			$scope.getFavoriteCount = function(ownerId) {
				apiService.userFavoritePublicCount({
					ownerId: ownerId
				}).then(function(data) {
					if(!data.errCode) {
						$scope.favoriteCount = data.data;
					}
				});
			};
			$scope.getPostCount();
			$scope.getFavoriteCount($scope.userId);
			$scope.getUserInfo($scope.userId);

		}
	])
	.controller('publicUserZoneFavoriteCtrl', ['$scope', '$rootScope', 'apiService',
		'$stateParams', '$pinyinTranslate', '$state', 'favoriteList',
		function($scope, $rootScope, apiService, $stateParams,
			$pinyinTranslate, $state, favoriteList) {
			$scope.favoriteList = favoriteList;
			//获取收藏夹列表
			$scope.favoriteId = $state.params.favoriteId || (favoriteList.length > 0 ? favoriteList[0].favoriteId : '');

			$scope.getSiteByFavorite = function(favoriteId) {
				apiService.favoriteSiteSite({
					favoriteId: favoriteId
				}).then(function(data) {
					if(!data.errCode) {
						angular.forEach($scope.favoriteList, function(favorite) {
							if(favorite.favoriteId == favoriteId) {
								favorite.siteCount = data.data.length;
							}
						});

						$scope.favoriteSiteList = data.data;
					}
				});
			};
			$scope.followFavorite = function() {
				apiService.userFavoriteFollow({
					favoriteId: $scope.favoriteId
				}).then(function(data) {
					if(!data.errCode) {
						$rootScope.$broadcast("FavoriteListChanged");
					}
				});
			};

			angular.forEach($scope.favoriteList, function(favorite) {
				if(favorite.favoriteId == $scope.favoriteId) {
					$scope.favorite = favorite;
				}
			});

		}
	])
	.controller('publicUserZoneFavoriteDetailCtrl', ['$scope', '$rootScope', 'apiService',
		'$stateParams', '$pinyinTranslate', '$state',
		function($scope, $rootScope, apiService, $stateParams,
			$pinyinTranslate, $state) {
			$scope.$on("FavoriteSiteListChanged", function(e, data) {
				$scope.getSiteByFavorite(data);
			});

			if(!$stateParams.favoriteId && $scope.favoriteId) {
				$state.go($state.current.name, {
					favoriteId: $scope.favoriteId
				});
			} else {

				$scope.getSiteByFavorite($stateParams.favoriteId);

			}

		}
	])
	.controller('publicUserZonePostCtrl', ['$scope', '$rootScope', 'apiService',
		'$stateParams', '$pinyinTranslate', '$state','$previousState',
		function($scope, $rootScope, apiService, $stateParams,
			$pinyinTranslate, $state,$previousState) {

			$scope.getPost = function() {

				apiService.postUserList($scope.params, {
					cache: true
				}).then(function(data) {
					if(!data.errCode) {

						$scope.postList = data.data;
						$scope.params.total = data.pageParams.total;
					}
				});
			};
			$scope.changePage = function() {
				$state.go($state.current.name, {
					pageNum: $scope.params.pageNum
				});
			};
			$previousState.memo("previousCaller");
		}
	])
	.controller('publicUserZonePostPageCtrl', ['$scope', '$rootScope', 'apiService',
		'$stateParams', '$pinyinTranslate', '$state',
		function($scope, $rootScope, apiService, $stateParams,
			$pinyinTranslate, $state) {
			$scope.params.pageNum = $scope.params.pageNum || parseInt($state.params.pageNum) || 1;
			$scope.params.total = $scope.params.total || 0;
			$scope.params.userId = $scope.params.userId || $state.params.userId;

			$scope.getPost();

		}
	])
	.controller('publicMessageCtrl', ['$scope', '$rootScope', 'apiService',
		'$stateParams', '$state','$previousState',
		function($scope, $rootScope, apiService, $stateParams,
			$state,$previousState) {
			$scope.getPrivateMessageCount=function(){
				apiService.privateMessageUserCount().then(function(data){
					if(!data.errCode){
						$scope.privateMessageCount=data.data;
					}
				});
			};
			$scope.getPostMessageCount=function(){
				apiService.postMessageUserCount().then(function(data){
					if(!data.errCode){
						$scope.postMessageCount=data.data;
					}
				})
			};
			$scope.getPrivateMessageCount();
			$scope.getPostMessageCount();
		}
	])
	.controller('publicMessagePostCtrl', ['$scope', '$rootScope', 'apiService',
		'$stateParams', '$state','$previousState',
		function($scope, $rootScope, apiService, $stateParams,
			$state,$previousState) {
			$scope.params = {
				pageNum: $state.params.pageNum || 1,
				pageSize: 10,
				orderBy: '',
				keyword: $stateParams.keyword || "",
			};
			$scope.getMessage = function() {
				apiService.postMessageUserList($scope.params).then(function(data) {
					if(!data.errCode) {
						$scope.messageList = data.data;
						$scope.params.total = data.pageParams.total;
					}
					$rootScope.getNewMessageCount();
				});
			};
			$scope.delMessage = function(messageId) {
				apiService.postMessageDel({
					messageId:messageId
				}).then(function(data) {
					if(!data.errCode) {
						$rootScope.tips.showSuccess("删除成功");
						$scope.getMessage();
					}
				});
			};
			$scope.search = function() {
				$scope.params.pageNum=1;
				$state.go($state.current.name, {
					keyword: $scope.params.keyword
				});
			};
			$scope.changePage = function() {
				$state.go($state.current.name, {
					pageNum: $scope.params.pageNum
				});
			};
			$previousState.memo("previousCaller");
			
			

		}
	])
	.controller('publicMessagePostPageCtrl', ['$scope', '$rootScope', 'apiService',
		'$stateParams', '$state',
		function($scope, $rootScope, apiService, $stateParams,
			$state) {
			$scope.params.pageNum = $scope.params.pageNum || parseInt($state.params.pageNum) || 1;
			$scope.params.total = $scope.params.total || 0;

			$scope.getMessage();

		}
	])

.controller('publicMessagePrivateCtrl', ['$scope', '$rootScope', 'apiService',
		'$stateParams', '$state','$previousState',
		function($scope, $rootScope, apiService, $stateParams,
			$state,$previousState) {
			$scope.params = {
				pageNum: $state.params.pageNum || 1,
				pageSize: 10,
				orderBy: 'create_time desc',
				keyword: $stateParams.keyword || "",
			};
			$scope.getMessage = function() {
				apiService.privateMessageUserList($scope.params).then(function(data) {
					if(!data.errCode) {
						$scope.messageList = data.data;
						$scope.params.total = data.pageParams.total;
					}
					$rootScope.getNewMessageCount();
				});
			};
			$scope.search = function() {
				$scope.params.pageNum=1;
				$state.go($state.current.name, {
					keyword: $scope.params.keyword
				});
			};
			$scope.changePage = function() {
				$state.go($state.current.name, {
					pageNum: $scope.params.pageNum
				});
			};
			$previousState.memo("previousCaller");

		}
	])
	.controller('publicMessagePrivatePageCtrl', ['$scope', '$rootScope', 'apiService',
		'$stateParams', '$state',
		function($scope, $rootScope, apiService, $stateParams,
			$state) {
			$scope.params.pageNum = $scope.params.pageNum || parseInt($state.params.pageNum) || 1;
			$scope.params.total = $scope.params.total || 0;

			$scope.getMessage();

		}
	])

.controller('publicUserChatCtrl', ['$scope', '$rootScope', 'apiService',
	'$stateParams', '$state','$previousState',
	function($scope, $rootScope, apiService, $stateParams,
		$state,$previousState) {
		$scope.userId = $state.params.userId;
		$scope.newParams={
			toUserId:$scope.userId,
			content:''
		}
		$scope.getUserInfo = function(userId) {

			apiService.userInfoProfile({
				userId: userId
			}).then(function(data) {
				if(!data.errCode) {
					$scope.userInfo = data.data;
				}
			});
		};
		$scope.getUserInfo($scope.userId);
		$scope.params={
			pageNum: $state.params.pageNum || 1,
			pageSize: 10,
			orderBy: 'create_time desc',
			keyword: '',
			toUserId:$scope.userId
		};
		$scope.changePage = function() {
				$state.go($state.current.name, {
					pageNum: $scope.params.pageNum
				});
			};
		$previousState.memo("previousCaller");
		$scope.getChatList=function(){
			apiService.privateMessageChatList($scope.params).then(function(data){
				if(!data.errCode){
					$scope.params.total = data.pageParams.total;
					$scope.messageList=data.data;
				}
			});
		};
		
		$scope.clear = function() {
			$scope.newParams.content = '';
		};
		$scope.submit=function(){
			apiService.privateMessageAdd($scope.newParams).then(function(data){
				if(!data.errCode){
					$rootScope.tips.showSuccess("发送成功");
					$scope.getChatList();
				}
			})
		};
	}
])
.controller('publicUserChatPageCtrl', ['$scope', '$rootScope', 'apiService',
	'$stateParams', '$state',
	function($scope, $rootScope, apiService, $stateParams,
		$state) {
		$scope.params.pageNum = $scope.params.pageNum || parseInt($state.params.pageNum) || 1;
		$scope.params.total = $scope.params.total || 0;
		$scope.getChatList();
	}
])

.controller('publicScoreExplainCtrl', ['$scope', '$rootScope', 'apiService',
	'$stateParams', '$state',
	function($scope, $rootScope, apiService, $stateParams,
		$state) {
		
	}
])

.controller('publicLoginRedirectCtrl', ['$scope', '$rootScope', 'apiService',
	'$stateParams', '$state','storageH','$window',
	function($scope, $rootScope, apiService, $stateParams,
		$state,storageH,$window) {
		var hash=$window.location.hash.replace('#','');
		var params=hash.split('&');
		var accessToken,expiresIn;
		angular.forEach(params,function(param){
			if(param.indexOf('access_token=')!=-1){
				accessToken=param.replace('access_token=','');
			}
			if(param.indexOf('expires_in=')!=-1){
				expiresIn=param.replace('expires_in=','');
			}
		});
		$scope.qqLogin=function(accessToken,expiresIn){
			apiService.userQqLogin({
				accessToken:accessToken,
				expiresIn:expiresIn
			}).then(function(data){
				if(!data.errCode){
					storageH.setUser(data.data);
					if($window.opener){
						$window.opener.location.reload(true);
						$window.open("","_self");
						$window.close();
						if($window){
							$state.go('home.index.site.common',{reload:true});
						}
					}else{
						$state.go('home.index.site.common',{reload:true});
					}
				}
			});
		};
		$scope.qqLogin(accessToken,expiresIn);
		
	}
])
.controller('publicIntroduceCtrl', ['$scope', '$rootScope', 'apiService',
	'$stateParams', '$state',
	function($scope, $rootScope, apiService, $stateParams,
		$state) {
		
	}
])
.controller('publicSensitiveCtrl', ['$scope', '$rootScope', 'apiService',
	'$stateParams', '$state',
	function($scope, $rootScope, apiService, $stateParams,
		$state) {
		$scope.content=$stateParams.content;
	}
])

;