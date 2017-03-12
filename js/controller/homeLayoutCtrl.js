'use strict';
angular.module('modaowang')
	.controller('homeLayoutCtrl', ['$scope', '$rootScope', '$uibModal', '$log', 'apiService',
		'storageH', '$state', '$pinyinTranslate', 'utils',
		function($scope, $rootScope, $uibModal, $log, apiService, storageH, $state,
			 $pinyinTranslate, utils) {
				
			//sidebar category
			//todo,给category数据库添加关键字字段，用来更精确定位分类。
			$rootScope.categoryLocal = {
				createTime: new Date(),
				deepPath: "0",
				id: 0,
				isHot: false,
				isNew: false,
				name: "所有分类",
				parentId: 0,
				sortIndex: 0,
				status: true
			};
			//alert($pinyinTranslate.getFullChars(category.name));
			$scope.categoryKeyword = {
				inputText: ""
			};

			//左边分类菜单

			$scope.getCategory = function() {
				apiService.categoryChild({
					parentId: 0
				}, {
					cache: true
				}).then(function(data) {
					if(!data.errCode) {

						data.data.unshift($rootScope.categoryLocal);

						$rootScope.categoryListAll = data.data;
						$scope.categoryFilt();
					}
				});
			};
			$scope.getCategory();
			$scope.categoryFilt = function() {
				$rootScope.categoryList = $rootScope.categoryFilt($rootScope.categoryListAll, $scope.categoryKeyword.inputText);
				$scope.categorySort();
				for(var i = 0; i < $rootScope.categoryList.length; i++) {
					if($state.params.categoryId && $state.params.categoryId == $rootScope.categoryList[i].id) {
						$scope.categoryIndex = i;
						$rootScope.categoryList[i].selected = true;
					} else {
						$rootScope.categoryList[i].selected = false;
					}
				}
				return $rootScope.categoryList;
			};
			$scope.clearTopCategoryList=function(){
				$scope.topCategoryList=undefined;
				storageH.removeObj("topCategoryList");
				$state.reload();
			};
			$scope.categorySort = function() {
				$scope.topCategoryList = storageH.getObj("topCategoryList");
				if(!$scope.topCategoryList) {
					$scope.topCategoryList = [];
					return;
				} else {
					var topCategoryList = [];
					var categoryList = angular.copy($rootScope.categoryList);
					if(categoryList && categoryList.length > 0 && categoryList[0].id == 0) {
						topCategoryList.push(categoryList[0]);
						categoryList.splice(0, 1);
					}

					for(var i = 0; i < $scope.topCategoryList.length; i++) {
						for(var index = 0; index < $rootScope.categoryList.length; index++) {
							if($rootScope.categoryList[index].id == $scope.topCategoryList[i].id) {

								topCategoryList.push($scope.topCategoryList[i]);
								for(var k = 0; k < categoryList.length; k++) {
									if(categoryList[k].id == $scope.topCategoryList[i].id) {
										categoryList.splice(k, 1);
									}
								}

							}
						}
					}
					var categoryAll=topCategoryList.concat(categoryList);
					for(var j=0;j<categoryAll.length;j++){
						categoryAll[j].sortIndex=j;
					}
					$rootScope.categoryList =categoryAll;

				}

			};

			$scope.topCategoryAdd = function(index, e) {
				if(e) {
					e.stopPropagation();
				}
				//如果已经存在本地排序，则先删除
				for(var i = 0; i < $scope.topCategoryList.length; i++) {
					if($scope.topCategoryList[i].id == $rootScope.categoryList[index].id) {
						$scope.topCategoryList.splice(i, 1);
					}
				}
				//添加到本地排序的头部
				$scope.topCategoryList.unshift($rootScope.categoryList[index]);
				storageH.setObj("topCategoryList", $scope.topCategoryList);

				$scope.categorySort();
				return;
			};
			
			
			
			
			/*$scope.selectCategory = function(index) {
				$scope.categoryIndex = index;
				for(var i = 0; i < $rootScope.categoryList.length; i++) {
					if(i != $scope.categoryIndex) {
						$rootScope.categoryList[i].selected = false;
					} else {
						$rootScope.categoryList[i].selected = true;
					}
				}
				if($state.current.name.indexOf('home.index.site')!=-1){
					$state.go($state.current.name, {
						categoryId: $rootScope.categoryList ? $rootScope.categoryList[$scope.categoryIndex].id : 0
					});
				}else{
					$state.go('home.index.site.common', {
						categoryId: $rootScope.categoryList ? $rootScope.categoryList[$scope.categoryIndex].id : 0
					});
				}
				$rootScope.settings.layoutHome.sidebar.toggle();
				
			};*/
			

			$scope.createFavoriteSiteScript = 'javascript:(function(x,a,v,m,t){var url=location.href;if(url.charAt(url.length-1)=="/"){url=url.substr(0,url.length-1)}var name=x.title;var keyword="";var description="";var b=x.getElementsByTagName("meta");for(var s=0;s<b.length;s++){if(b[s].name.toLowerCase()=="keywords"||b[s].name.toLowerCase()=="keyword"){keyword=b[s].content}if(b[s].name.toLowerCase()=="description"){description=b[s].content}}var site={url:v(url),name:name,keyword:keyword,description:description};var siteStr=JSON.stringify(site);var n="' + apiService.serverUrl + '/public/create-favorite-site/"+v(siteStr);if(!window.open(n,"modaowang","toolbar=0,resizable=1,scrollbars=yes,status=1,width="+m+",height="+t+",left="+(a.width-m)/2+",top="+(a.height-t)/2)){window.location.href=n}})(document,screen,encodeURIComponent,720,540);';

			

			$scope.getRankingTop = function() {
				apiService.rankingTop({
					number: 3
				}).then(function(data) {
					if(!data.errCode) {
						$scope.rankingList = data.data;
					}
				});
			};
			$scope.getRankingTop();

		}
	])

;