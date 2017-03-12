'use strict';
angular.module('modaowang')

.controller('forumCtrl', ['$scope', '$rootScope', 'apiService',
		'$stateParams', '$state', 
		function($scope, $rootScope, apiService, $stateParams,
			$state) {

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
						angular.forEach(data.data, function(category) {

							if($state.params.tags && $state.params.tags.indexOf(category.name) != -1) {
								category.selected = true;
							} else {
								category.selected = false;
							}

						});
						$rootScope.categoryListAll = data.data;
						$scope.categoryFilt();

					}
				});
			};
			$scope.categoryFilt = function() {
				$scope.categoryList = $rootScope.categoryFilt($rootScope.categoryListAll, $scope.categoryKeyword.inputText);
			};
			$scope.getCategory();

		}
	])
	.controller('forumPostCtrl', ['$scope', '$rootScope', 'apiService',
		'$stateParams', '$state', 'utils',
		function($scope, $rootScope, apiService, $stateParams,
			$state, utils) {
			$scope.params = {
				pageSize: 10,
				orderBy: 'create_time desc',
				keyword: $state.params.keyword || "",
				tags: $state.params.tags || ""
			};

			$scope.noSelected = {
				check: $state.params.tags ? false : true
			};
			$scope.selectTags = function(noSelected, changeUrl) {
				$scope.params.tags = [];
				if(noSelected && $scope.noSelected.check) {
					angular.forEach($scope.categoryList, function(category) {
						category.selected = false;

					});
				} else {
					angular.forEach($scope.categoryList, function(category) {
						if(category.selected) {
							$scope.params.tags.push(category.name);
						}
					});

					$scope.noSelected.check = $scope.params.tags ? false : true;
				}
				$scope.params.tags = $scope.params.tags.length > 0 ? $scope.params.tags.join(',') : "";
				if(changeUrl) {
					$scope.changeUrl();
				}

			};

			$scope.changeUrl = function() {
				var keyword = utils.scriptFilt($scope.params.keyword);
				if(!keyword && $scope.params.keyword) {
					$rootScope.tips.showError("请输入合法的关键字");
				};
				$state.go($state.current.name, {
					keyword: keyword,
					tags: $scope.params.tags
				});
			};
			
			

			$scope.getPostCount = function() {
				apiService.postCount($scope.params).then(function(data) {
					if(!data.errCode) {
						$scope.postCount = data.data;
					}
				});
			};
			$scope.getPostCount();
			
			

		}
	])
	.controller('forumPostAllCtrl', ['$scope', '$rootScope', 'apiService',
		'$stateParams', '$state', '$previousState',
		function($scope, $rootScope, apiService, $stateParams,
			$state,$previousState) {
			var allParams = angular.copy($scope.params);

			allParams.type = -1;

			$scope.allParams = allParams;
			$scope.getPost = function() {
				apiService.postAll($scope.allParams, {
					cache: true
				}).then(function(data) {
					if(!data.errCode) {

						$scope.postList = data.data;
						$scope.allParams.total = data.pageParams.total;
					}
				});
			};
			$scope.changePage = function() {
				$state.go($state.current.name, {
					pageNum: $scope.allParams.pageNum
				});
			};
			$previousState.memo("previousCaller");
		}
	])
	.controller('forumPostRequestCtrl', ['$scope', '$rootScope', 'apiService',
		'$stateParams', '$state', '$previousState',
		function($scope, $rootScope, apiService, $stateParams,
			$state,$previousState) {
			var requestParams = angular.copy($scope.params);

			requestParams.type = 0;

			$scope.requestParams = requestParams;
			$scope.getPost = function() {
				apiService.postAll($scope.requestParams, {
					cache: true
				}).then(function(data) {
					if(!data.errCode) {

						$scope.postList = data.data;
						$scope.requestParams.total = data.pageParams.total;
					}
				});
			};
			
			
			$scope.changePage = function() {
				$state.go($state.current.name, {
					pageNum: $scope.requestParams.pageNum
				});
			};
			$previousState.memo("previousCaller");
		}
	])
	.controller('forumPostShareCtrl', ['$scope', '$rootScope', 'apiService',
		'$stateParams', '$state', '$previousState',
		function($scope, $rootScope, apiService, $stateParams,
			$state,$previousState) {
			var shareParams = angular.copy($scope.params);

			shareParams.type = 1;

			$scope.shareParams = shareParams;
			$scope.getPost = function() {
				apiService.postAll($scope.shareParams, {
					cache: true
				}).then(function(data) {
					if(!data.errCode) {

						$scope.postList = data.data;
						$scope.shareParams.total = data.pageParams.total;
					}
				});
			};
			$scope.changePage = function() {
				$state.go($state.current.name, {
					pageNum: $scope.shareParams.pageNum
				});
			};
			$previousState.memo("previousCaller");

		}
	])

.controller('forumPostAllPageCtrl', ['$scope', '$rootScope', 'apiService',
		'$stateParams', '$state', '$previousState',
		function($scope, $rootScope, apiService, $stateParams,
			$state,$previousState) {
			$scope.allParams.pageNum = $scope.allParams.pageNum || parseInt($state.params.pageNum) || 1;
			$scope.allParams.total = $scope.allParams.total || 0;
			
			$scope.getPost();
			
		}
	])
	.controller('forumPostRequestPageCtrl', ['$scope', '$rootScope', 'apiService',
		'$stateParams', '$state', '$previousState',
		function($scope, $rootScope, apiService, $stateParams,
			$state,$previousState) {
			$scope.requestParams.pageNum = $scope.requestParams.pageNum || parseInt($state.params.pageNum) || 1;
			$scope.requestParams.total = $scope.requestParams.total || 0;
			
			$scope.getPost();
			
		}
	])
	.controller('forumPostSharePageCtrl', ['$scope', '$rootScope', 'apiService',
		'$stateParams', '$state', '$previousState',
		function($scope, $rootScope, apiService, $stateParams,
			$state,$previousState) {
			$scope.shareParams.pageNum = $scope.shareParams.pageNum || parseInt($state.params.pageNum) || 1;
			$scope.shareParams.total = $scope.shareParams.total || 0;
			

			$scope.getPost();
			
		}
	])

.controller('postEditCtrl', ['$scope', '$rootScope', 'apiService',
	'$stateParams', '$state', 'utils', 'storageH',
	function($scope, $rootScope, apiService, $stateParams,
		 $state, utils, storageH) {

		$scope.categoryList = [];

		//alert($pinyinTranslate.getFullChars(category.name));
		$scope.categoryKeyword = {
			inputText: ""
		};

		$scope.activeTab = 0;
		$scope.changeTab = function(tabIndex) {
			$scope.activeTab = tabIndex;
			$scope.params.type = tabIndex;
		};
		//左边分类菜单
		$scope.getCategory = function() {
			apiService.categoryChild({
				parentId: 0
			}, {
				cache: true
			}).then(function(data) {
				if(!data.errCode) {
					angular.forEach(data.data, function(category) {
						category.selected = false;
					});
					$rootScope.categoryListAll = data.data;
					$scope.categoryFilt();

				}
			});
		};
		$scope.categoryFilt = function() {
			$scope.categoryList = $rootScope.categoryFilt($rootScope.categoryListAll, $scope.categoryKeyword.inputText);
		};
		$scope.getCategory();

		$scope.params = {
			type: 0,
			title: '',
			content: '',
			tags: '',
			bonusScore: 1,
			urls: ''
		};
		$scope.getPostDetail = function(postId) {
			if(postId) {
				apiService.postDetail({
					postId: postId
				}).then(function(data) {
					if(!data.errCode) {
						$scope.params = data.data;
					}

				});
			}
		};
		$scope.getPostDetail($stateParams.postId);

		$scope.submit = function() {
			if(!$scope.params.title){
				$rootScope.tips.showError("标题不能为空");
				return;
			}
			if(!$scope.params.content){
				$rootScope.tips.showError("内容不能为空");
				return;
			}
			if($scope.params.type == 0){
					if(!$scope.params.bonusScore){
						$rootScope.tips.showError("找网贴最低消耗一个积分");
						return;
					}
					if($rootScope.modaowangUser.user.score<$scope.params.bonusScore){
						$rootScope.tips.showError("积分不足");
						return;
					}
				}
			if($scope.params.type == 1) {
				if($scope.params.urls && !$scope.params.urls.startsWith("http")) {
					$scope.params.urls = "http://" + $scope.params.urls;
				}
				if(!$scope.params.urls || !utils.isUrl($scope.params.urls)) {
					$rootScope.tips.showError("url有误");
					return;
				}
			}
			if($scope.params.id) {
				apiService.postEdit($scope.params).then(function(data) {
					if(!data.errCode) {
						$rootScope.tips.showSuccess("修改成功");
						$state.go('public.user-profile');
					}
				});
			} else {
				
				apiService.postAdd($scope.params).then(function(data) {
					if(!data.errCode) {
						$rootScope.modaowangUser.user.score = data.data;
						storageH.setUser($rootScope.modaowangUser);
						$rootScope.$broadcast("UserProfileChanged");
						$rootScope.tips.showSuccess("发布成功");
						$state.go('forum.index.post');
					}
				});
			}

		};
	}
])

.controller('postDetailCtrl', ['$scope', '$rootScope', 'apiService',
	'$stateParams', '$state','$previousState',
	function($scope, $rootScope, apiService, $stateParams, 
		$state,$previousState) {
		
		$scope.postId = $state.params.postId;

		$scope.getDetail = function() {
			apiService.postDetail({
				postId: $scope.postId
			}).then(function(data) {
				if(!data.errCode) {
					$state.current.data.pageTitle=data.data.title;
					$scope.postDetail = data.data;
				}
			});
		};
		$scope.getDetail();
		$scope.params = {
			postId: $scope.postId,
			pageNum: $state.params.pageNum||1,
			pageSize: 10,
			orderBy: 'create_time desc'
		};

		$scope.newParams = {
			postId: $scope.postId,
			content: '',
		};

		$scope.newSubParams = {
			postId: $scope.postId,
			content: '',
		};

		$scope.toggleGroup = function(x) {
			if($scope.openGroup != x) {
				$scope.openGroup = x;
			} else {
				$scope.openGroup = -1;
			}
		};

		$scope.clear = function() {
			$scope.newParams.content = '';
		};
		$scope.subClear = function() {
			$scope.newSubParams.content = '';
		};
		$scope.submit = function() {
			if(!$scope.newParams.content){
				$rootScope.tips.showError("内容不能为空");
				return;
			}
			apiService.replyAdd($scope.newParams).then(function(data) {
				if(!data.errCode) {
					$rootScope.tips.showSuccess("评论成功");
					$scope.getReply();
				}
			});
		};
		$scope.subSubmit = function(index) {
			if(!$scope.newSubParams.content){
				$rootScope.tips.showError("内容不能为空");
				return;
			}
			$scope.newSubParams.parentId = $scope.replyList[index].id;
			apiService.replyAdd($scope.newSubParams).then(function(data) {
				if(!data.errCode) {
					$rootScope.tips.showSuccess("回复成功");
					$scope.openGroup = -1;
					$scope.getSubReply(index);

				}
			});
		};
		$scope.getReply = function() {
			apiService.replyList($scope.params).then(function(data) {
				if(!data.errCode) {
					$scope.replyList = data.data;
					$scope.params.total = data.pageParams.total;
				}
			});
		};
		$scope.delReply = function(replyId) {
			apiService.replyDel({
				replyId:replyId
			}).then(function(data){
				if(!data.errCode) {
					$rootScope.tips.showSuccess("删除成功");
					$scope.getReply();
				}
			});
		};
		$scope.getSubReply = function(index) {
			if($scope.replyList[index].subList && $scope.replyList[index].subList.length > 0) {
				$scope.replyList[index].subList = undefined;
				return;
			}
			apiService.replyChild({
				postId: $scope.postId,
				parentId: $scope.replyList[index].id
			}).then(function(data) {
				if(!data.errCode) {
					$scope.replyList[index].replyCount = data.data.length;
					$scope.replyList[index].subList = data.data;
				}
			});
		};

		$scope.postPraise = function(postId) {
			var params = {
				postId: postId,
			};
			if($scope.postDetail.userPraised) {
				apiService.postPraiseDel(params).then(function(data) {
					if(!data.errCode) {
						$scope.postDetail.praiseCount = data.data;
						$scope.postDetail.userPraised = 0;
						$rootScope.tips.showSuccess("取消成功");
					}
				});
				return;
			}

			apiService.postPraiseAdd(params).then(function(data) {
				if(!data.errCode) {
					$scope.postDetail.praiseCount = data.data;
					$scope.postDetail.userPraised = 1;
					$rootScope.tips.showSuccess("点赞成功");
				}
			});
		};
		$scope.replyPraise = function(index) {
			var params = {
				replyId: $scope.replyList[index].id,
			};
			if($scope.replyList[index].userPraised) {
				apiService.replyPraiseDel(params).then(function(data) {
					if(!data.errCode) {
						$scope.replyList[index].praiseCount = data.data;
						$scope.replyList[index].userPraised = 0;
						$rootScope.tips.showSuccess("取消成功");
					}
				});
				return;
			}

			apiService.replyPraiseAdd(params).then(function(data) {
				if(!data.errCode) {
					$scope.replyList[index].praiseCount = data.data;
					$scope.replyList[index].userPraised = 1;
					$rootScope.tips.showSuccess("点赞成功");
				}
			});
		};

		$scope.replyAwarded = function(index) {
			var params = {
				postId: $scope.postId,
				replyId: $scope.replyList[index].id,
			};
			$rootScope.showConfirm("确定要把赏分赏给该用户吗?").then(function() {
				apiService.postAwarded(params).then(function(data) {
					if(!data.errCode) {
						$state.reload();
					}
				});
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

.controller('postDetailPageCtrl', ['$scope', '$rootScope', 'apiService',
	'$stateParams', '$state','$previousState',
	function($scope, $rootScope, apiService, $stateParams, 
		$state,$previousState) {
		
		$scope.params.pageNum = $scope.params.pageNum || parseInt($state.params.pageNum) || 1;
		$scope.params.total = $scope.params.total || 0;
		
		$scope.getReply();
		
		
	}
]);