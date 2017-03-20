'use strict';
angular.module('modaowang')
	.controller('homeCtrl', ['$scope', '$rootScope', 'apiService',  '$stateParams', '$state','utils','$window','$timeout',
		function($scope, $rootScope, apiService,  $stateParams, $state,utils,$window,$timeout) {
			
			//四个tab菜单和跳转
			//content-header menu
			$scope.contentHeader = {
				show: true,
				toggle: function() {
					this.show = !this.show;
				}
			};
			if(document.getElementById("searchInput")!=null){
						BaiduSuggestion.bind(
						document.getElementById("searchInput"),
							{
							    "XOffset": 0,
							    "YOffset": 0,
							    "width": 220,
							    "fontColor": "#666",
							    "fontColorHI": "#3385ff",
							    "fontSize": "12px",
							    "borderColor": "#dddddd",
							    "bgcolorHI": "#eeeeee",
							    "sugSubmit": false
							}, 
							function(sugStr){
								$scope.search.keyword=sugStr;
								$scope.search.bdSearch();
							});
					}
					
					
				
			
			$scope.search = {
				keyword: $state.params.keyword || "",
				toSearch: function() {
					
					var keyword = utils.scriptFilt(this.keyword);

					$state.go('home.index.search.site.page', {
						keyword: keyword
					});
				},
				bdSearch: function(e) {
					if(e){
						e.stopPropagation();
					}
					var data = BaiduHttps.useHttps();
					
					var keyword = utils.scriptFilt(this.keyword);
					var host='http://www.baidu.com/baidu';
					if($window.innerWidth<768){
						host='http://m.baidu.com/s';
					}
					var url =host + '?ssl_s=1&ssl_c=' + data.ssl_code + '&tn='+'SE_zzsearchcode_shhzc78w'+'&word='+keyword;
					if(!window.open(url, "_blank")) {
						window.location.href = url;
					}
				}
			};
			
			$scope.openGame=function(){
				if(!$rootScope.modaowangUser.token){
					$rootScope.$broadcast("UserAuthFailed");
					return;
				}
				if($rootScope.modaowangUser.user.status>1){
					$rootScope.openContentModal('gameModal');
				}else{
					$rootScope.openContentModal('emailModal','');
				}

			};

		}
	])

.controller('homeSiteCtrl', ['$scope', '$rootScope', 'apiService',  '$stateParams','$state',
		function($scope, $rootScope, apiService,  $stateParams,$state) {
			$rootScope.settings.layoutHome.sidebar.show=false;
			$scope.categorySiteParams = {
				pageNum: 1,
				pageSize: 10,
				categoryId: $stateParams.categoryId ? parseInt($stateParams.categoryId) : 0
			};
			$scope.toggleGroup=[];
			$scope.getSite = function() {
				apiService.categorySiteGroupPage($scope.categorySiteParams, {
					cache: true
				}).then(function(data) {
					if(!data.errCode) {
						
						$scope.sitesMap = data.data;
						$scope.categorySiteParams.pages=data.pageParams.pages;
						for(var i=0;i<$scope.sitesMap.length;i++){
							if($scope.toggleGroup[i]==undefined){
								$scope.toggleGroup[i]=false;
							}
						}
						
					}
				});
				
			};
			
			$scope.loadMoreSite=function(){
				
				if(!$scope.categorySiteParams.pages||$scope.categorySiteParams.pageNum>=$scope.categorySiteParams.pages){
					return;
				}
				$scope.loadMore={
					loading:true
				};
				$scope.categorySiteParams.pageNum++;
				
				apiService.categorySiteGroupPage($scope.categorySiteParams, {
					cache: true
				}).then(function(data) {
					if(!data.errCode) {
						$scope.sitesMap = $scope.sitesMap?$scope.sitesMap.concat(data.data):data.data;
						$scope.categorySiteParams.pages=data.pageParams.pages;
						for(var i=0;i<$scope.sitesMap.length;i++){
							if($scope.toggleGroup[i]==undefined){
								$scope.toggleGroup[i]=false;
							}
						}
					}
					$scope.loadMore.loading=false;
				});
			};
			
			$scope.addCommonSite = function(siteId, e) {
				if(e) {
					e.stopPropagation();
				}

				apiService.userCommonAdd({
					siteId: siteId
				}).then(function(data) {
					if(!data.errCode) {
						$rootScope.$broadcast("CommonSiteListChanged");
						$rootScope.tips.showSuccess("添加成功");
					} else {
						$rootScope.tips.showError("添加失败");
					}
				});
			};
			
			$scope.changeTab=function(stateSuffix){
				$state.go('home.index.site.'+stateSuffix, {
						categoryId: $state.params.categoryId
					});
			};

			$scope.getSite();
			
			
			
		}
	])
.controller('homePostCtrl', ['$scope', '$rootScope', 'apiService',  '$stateParams','$state',
		function($scope, $rootScope, apiService,  $stateParams,$state) {
			$scope.getCategoryPost=function(){
				apiService.postCategoryList({
					categoryId:$stateParams.categoryId ? parseInt($stateParams.categoryId) : 0
				}).then(function(data){
					if(!data.errCode){
						$scope.categoryName=data.data.categoryName;
						if(data.data.categoryName){
							$state.current.data.pageTitle=data.data.categoryName;
						}else{
							$state.current.data.pageTitle="发现优秀的网站";
						}
						$scope.postList=data.data.postList;
					}
				});
			};
			
			$scope.getCategoryPost();
		}
	])
	.controller('homeSiteCommonCtrl', ['$scope', '$rootScope', 'apiService',  '$stateParams','storageH',
		function($scope, $rootScope, apiService,  $stateParams,storageH) {

			//获取常用网站
			$scope.getCommon = function() {
				var userInfo = storageH.getUserInfo();
				if(!userInfo || !userInfo.user || !userInfo.token) {
					return false;
				};
				apiService.userCommonList().then(function(data) {
					if(!data.errCode) {
						$scope.commonList = data.data;
					}
				});
			};
			//删除常用网站
			$scope.delCommon = function(siteId, e) {
				e.stopPropagation();
				apiService.userCommonDel({
					siteId: siteId
				}).then(function(data) {
					if(!data.errCode) {
						$rootScope.$broadcast("CommonSiteListChanged");
						$rootScope.tips.showSuccess("删除成功");
					}
				});
			};
			

			$scope.$on("CommonSiteListChanged", function(e) {
				$scope.getCommon();
			});
			$scope.onCommonDrop = function(data, e) {
				if(!data.siteId) {
					return;
				}
				$scope.addCommonSite(data.siteId, e);

			};
			

			$scope.onCommonDndInserted = function(e, index, item, external) {
				if(e) {
					e.stopPropagation();
				}
				for(var i = 0; i < $scope.commonList.length; i++) {
					$scope.commonList[i].sortIndex = i;
				}
				apiService.userCommonUpdateMulti(
					$scope.commonList
				).then(function(data) {
					if(!data.errCode) {
						$rootScope.tips.showSuccess("更新排序成功");
					}
				})
			};
			
			$scope.getCommon();
			
			

		}
	])
	.controller('homeSiteFavoriteCtrl', ['$scope', '$rootScope', 'apiService',  
	'$stateParams','$state','favoriteList',
		function($scope, $rootScope, apiService,  $stateParams,$state,favoriteList) {
			$scope.$on("FavoriteListChanged", function(e) {
				$scope.getFavorite();
			});
			//获取收藏夹列表
			$scope.favoriteId = $state.params.favoriteId||(favoriteList.length>0?favoriteList[0].favoriteId:"");
			$scope.getFavorite = function() {
				apiService.userFavoriteList().then(function(data) {
					if(!data.errCode) {

						$scope.favoriteList = data.data;
						if($scope.favoriteList.length>0){
							$state.go($state.current.name,{
								favoriteId:$scope.favoriteList[0].favoriteId
							});
						}
						
					}
				});
			};
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
			$scope.onFavoriteDrop = function(data, e) {
				if(!data.siteId) {
					return;
				}
				$rootScope.openContentModal('selectFavoriteModal', '', data, e);
			};
			$scope.onFavoriteDndInserted = function(e, index, item, external) {
				if(e) {
					e.stopPropagation();
				}
				for(var i = 0; i < $scope.favoriteList.length; i++) {
					$scope.favoriteList[i].sortIndex = i;
				}
				apiService.userFavoriteUpdateSortMulti(
					$scope.favoriteList
				).then(function(data) {
					if(!data.errCode) {
						$rootScope.tips.showSuccess("更新排序成功");
					}
				})
			};

			
			//删除收藏夹的网站
			$scope.delFavorite = function(favoriteId, siteId, e) {
				e.stopPropagation();

				apiService.favoriteSiteDel({
					favoriteId: favoriteId,
					siteId: siteId
				}).then(function(data) {
					if(!data.errCode) {
						$rootScope.$broadcast("FavoriteSiteListChanged", favoriteId);
						$rootScope.tips.showSuccess("删除成功");
					}
				});
			};
			//取消关注收藏夹
			$scope.delFollowFavorite = function(e) {
				if(!$scope.favoriteList || $scope.favoriteList.length == 0) {
					$rootScope.tips.showError("没有选中的收藏夹");
					return;
				}
				e.stopPropagation();
				$rootScope.showConfirm("确定要删除吗?").then(function() {
					apiService.userFavoriteFollowDel({
						favoriteId: $state.params.favoriteId||$scope.favoriteId
					}).then(function(data) {
						if(!data.errCode) {
							$rootScope.$broadcast("FavoriteListChanged");
							
						}
					});
				});
			};
			
			$scope.favoriteList=favoriteList;
			angular.forEach($scope.favoriteList,function(favorite){
				if(favorite.favoriteId==$scope.favoriteId){
					$scope.favorite=favorite;
				}
			});

		}
	])
	
	.controller('homeSiteFavoriteDetailCtrl', ['$scope', '$rootScope', 'apiService',  '$stateParams','$state',
		function($scope, $rootScope, apiService,  $stateParams,$state) {
			
			$scope.$on("FavoriteSiteListChanged", function(e, data) {
				$scope.getSiteByFavorite(data);
			});
			$scope.onFavoriteSiteDndInserted = function(e, index, item, external) {
				if(e) {
					e.stopPropagation();
				}
				for(var i = 0; i < $scope.favoriteSiteList.length; i++) {
					$scope.favoriteSiteList[i].sortIndex = i;
				}
				apiService.favoriteSiteUpdateMulti(
					$scope.favoriteSiteList
				).then(function(data) {
					if(!data.errCode) {
						$rootScope.tips.showSuccess("更新排序成功");
					}
				})
			};
			
			if(!$stateParams.favoriteId){
				$state.go($state.current.name,{
					favoriteId:$scope.favoriteId
				});
			}else{
				$scope.getSiteByFavorite($stateParams.favoriteId);
			}
			
			
			

		}
	])
	.controller('homeSiteToolCtrl', ['$scope', '$rootScope', 'apiService',  '$stateParams',
		function($scope, $rootScope, apiService,  $stateParams) {

			//获取工具网站
			$scope.getTool = function() {
				$scope.getUserTool();
				apiService.toolSiteGroup().then(function(data) {
					if(!data.errCode) {
						var total = 0;
						for(var k in data.data) {

							total += data.data[k].length;
						}

						$scope.toolMap = data.data;
						$scope.toolLength = total;
					}
				});
			};
			//获取用户工具
			$scope.getUserTool = function() {
				apiService.userToolList().then(function(data) {
					if(!data.errCode) {
						$scope.userToolList = data.data;
					}
				});
			};
			$scope.addUserTool = function(toolId, e) {
				e.stopPropagation();
				apiService.userToolAdd({
					toolId: toolId
				}).then(function(data) {
					if(!data.errCode) {
						$scope.getTool();
					}
				});
			};
			$scope.delUserTool = function(toolId, e) {
				e.stopPropagation();
				apiService.userToolDel({
					toolId: toolId
				}).then(function(data) {
					if(!data.errCode) {
						$scope.getTool();
					}
				});
			};
			
			$scope.getTool();
			

		}
	])
	.controller('homeSiteActivityCtrl', ['$scope', '$rootScope', 'apiService',  '$stateParams',
		function($scope, $rootScope, apiService,  $stateParams) {

			//获取活动网站
			$scope.getActivity = function() {
				apiService.activityList().then(function(data) {
					if(!data.errCode) {
						$scope.activityList = data.data;
					}
				});
			};
			
			$scope.getActivity();
			

		}
	])
	.controller('homeSearchCtrl', ['$scope', '$rootScope', 'apiService',  '$stateParams','$state',
		function($scope, $rootScope, apiService,  $stateParams,$state) {

			$scope.keyword = $state.params.keyword || '';
			$scope.params = {
				pageNum: $state.params.pageNum||1,
				orderBy: '',
				keyword: $scope.keyword,
			};
			$scope.addCommonSite = function(siteId, e) {
				if(e) {
					e.stopPropagation();
				}

				apiService.userCommonAdd({
					siteId: siteId
				}).then(function(data) {
					if(!data.errCode) {
						$rootScope.$broadcast("CommonSiteListChanged");
						$rootScope.tips.showSuccess("添加成功");
					} else {
						$rootScope.tips.showError("添加失败");
					}
				});
			};

			$scope.getSiteCount = function() {
				apiService.siteCount({
					keyword:$scope.keyword
				}).then(function(data) {
					if(!data.errCode) {
						$scope.siteCount = data.data;
					}
				});
			};
			
			$scope.getPostCount = function() {
				apiService.postCount($scope.params).then(function(data) {
					if(!data.errCode) {
						$scope.postCount = data.data;
					}
				});
			};
			$scope.getSiteCount();
			$scope.getPostCount();

		}
	])
	.controller('homeSearchSiteCtrl', ['$scope', '$rootScope', 'apiService', 
	'$stateParams','$state','$previousState',
		function($scope, $rootScope, apiService,  $stateParams,$state,$previousState) {
			var siteParams=angular.copy($scope.params);
			siteParams.pageSize=48;
			$scope.siteParams=siteParams;
			
			$scope.getSite = function() {
				apiService.siteAll($scope.siteParams).then(function(data) {
					if(!data.errCode) {
						$scope.sites = data.data;
						$scope.siteParams.total = data.pageParams.total;
					}

				});
			};
			$scope.changePage=function(){
				$state.go($state.current.name, {
						pageNum:$scope.siteParams.pageNum
					});
			};
			$previousState.memo("previousCaller");
		}
	])
	.controller('homeSearchSitePageCtrl', ['$scope', '$rootScope', 'apiService',  '$stateParams','$state',
		function($scope, $rootScope, apiService,  $stateParams,$state) {
			$scope.siteParams.pageNum = $scope.siteParams.pageNum || parseInt($state.params.pageNum) || 1;
			$scope.siteParams.total = $scope.siteParams.total || 0;
			$scope.getSite();
			

		}
	])
	.controller('homeSearchPostCtrl', ['$scope', '$rootScope', 'apiService',  
	'$stateParams','$state','$previousState',
		function($scope, $rootScope, apiService,  $stateParams,$state,$previousState) {
			var postParams=angular.copy($scope.params);
			postParams.pageSize=10;
			$scope.postParams=postParams;
			$scope.getPost = function() {

				apiService.postAll($scope.postParams, {
					cache: true
				}).then(function(data) {
					if(!data.errCode) {

						$scope.postList = data.data;
						$scope.postParams.total = data.pageParams.total;
					}
				});
			};
			
			$scope.changePage=function(){
				$state.go($state.current.name, {
						pageNum:$scope.postParams.pageNum
					});
			};
			$previousState.memo("previousCaller");
		}
	])
	.controller('homeSearchPostPageCtrl', ['$scope', '$rootScope', 'apiService',  '$stateParams','$state',
		function($scope, $rootScope, apiService,  $stateParams,$state) {

			$scope.postParams.pageNum = $scope.postParams.pageNum || parseInt($state.params.pageNum) || 1;
			$scope.postParams.total = $scope.postParams.total || 0;
			$scope.getPost();
			

		}
	])
	
	
	;