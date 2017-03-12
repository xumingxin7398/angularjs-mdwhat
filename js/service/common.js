'use strict';
angular.module('modaowang')
	.service('common', ['apiService', '$rootScope', '$state', 'storageH',
		'cfpLoadingBar', '$uibModal', '$pinyinTranslate', '$q', '$previousState', 'utils',
		function(apiService, $rootScope, $state, storageH,
			cfpLoadingBar, $uibModal, $pinyinTranslate, $q, $previousState, utils) {

			$rootScope.currentTime = new Date();
			$rootScope.editPost = function(postId, e) {
				if(e) {
					e.stopPropagation();
				}
				$state.go("forum.post-edit", {
					postId: postId
				});
			};
			$rootScope.getSiteDescription=function(site){
				if(site.description){
					return;
				}
				site.description="loading...";
				var siteId=site.id||site.siteId;
				apiService.siteGetDescription({
					siteId:siteId
				}).then(function(data){
					if(!data.errCode){
						site.description=data.data.description;
					}
				});
			};
			$rootScope.delPost = function(postId, e) {
				if(e) {
					e.stopPropagation();
				}
				$rootScope.showConfirm("确定要删除吗?").then(function() {
					apiService.postDel({
						postId: postId
					}).then(function(data) {
						if(!data.errCode) {
							$rootScope.tips.showSuccess("删除成功");
							$state.reload();
						}
					});
				});
			};
			$rootScope.praisePost = function(post) {
				var params = {
					postId: post.id,
				};
				if(post.userPraised) {
					apiService.postPraiseDel(params).then(function(data) {
						if(!data.errCode) {
							post.praiseCount = data.data;
							post.userPraised = 0;
							$rootScope.tips.showSuccess("取消成功");
						}
					});
					return;
				}

				apiService.postPraiseAdd(params).then(function(data) {
					if(!data.errCode) {
						post.praiseCount = data.data;
						post.userPraised = 1;
						$rootScope.tips.showSuccess("点赞成功");
					}
				});
			};

			$rootScope.$watch(function() {
				return $previousState.get('previousCaller');
			}, function(newval, oldval) {
				if(!newval || !newval.state || newval.state.abstract) {
					$rootScope.previous = null;
				} else {
					$rootScope.previous = newval;
				}
			});
			$rootScope.goPrevious = function() {
				$previousState.go('previousCaller');
			};
			//全局成功
			$rootScope.tips = {
				message: [],
				showSuccess: function(message, duration) {
					this.message.push({
						text: message || '成功',
						duration: duration || 2000,
						type: 'success'
					});
				},
				showError: function(message, duration) {
					this.message.push({
						text: message || '失败',
						duration: duration || 2000,
						type: 'danger'
					});
				},
				close: function(index) {
					this.message.splice(index, 1);
				}
			};
			$rootScope.getNewMessageCount = function() {
				var userInfo = storageH.getUserInfo();
				if(!userInfo || !userInfo.user || !userInfo.token) {
					return false;
				};
				apiService.postMessageUserCount().then(function(data) {
					if(!data.errCode) {
						$rootScope.postMessageCount=data.data;
						apiService.privateMessageUserCount().then(function(data){
							if(!data.errCode){
								$rootScope.privateMessageCount=data.data;
								$rootScope.newMessageCount = $rootScope.postMessageCount+$rootScope.privateMessageCount;
							}
							
						});
					}
					
				});	
			};
			$rootScope.getNewMessageCount();

			//正在加载提示
			$rootScope.showLoading = function(duration) {
				cfpLoadingBar.start();
			};
			$rootScope.hideLoading = function() {
				cfpLoadingBar.complete();
			};

			//四个主菜单
			$rootScope.openContentModal = function(modalName, size, data, e) {
				if(e) {
					e.stopPropagation();
				}

				var modalInstance = $uibModal.open({
					animation: true,
					ariaLabelledBy: 'modal-title',
					ariaDescribedBy: 'modal-body',
					templateUrl: 'templates/public/component/' + modalName + '.html',
					controller: modalName + 'Ctrl',
					controllerAs: '$scope',
					size: angular.isDefined(size) ? size : 'center',
					resolve: {
						modalParams: function() {
							return data;
						}
					}
				});
				return modalInstance;
			};

			$rootScope.showConfirm = function(tips) {
				var deferred = $q.defer();
				var confirmModal = $rootScope.openContentModal("confirmModal", 'sm', tips);
				confirmModal.result.then(function() {
					deferred.resolve();
				});
				return deferred.promise;
			};

			$rootScope.logout = function() {
				apiService.userLogout({
					id: $rootScope.modaowangUser.user.id
				}).then(function(data) {
					storageH.removeUser();
				});
				QC.Login.signOut();
			};

			$rootScope.$on("UserAuthFailed", function(e, data) {
				if(QC.Login.check()) {
					QC.Login.signOut();
				}
				if(!$rootScope.loginModalInstance) {
					$rootScope.loginModalInstance = $rootScope.openContentModal('loginModal', '');
					$rootScope.loginModalInstance.result.then(function() {
						$rootScope.loginModalInstance = undefined;

					}, function() {
						$rootScope.loginModalInstance = undefined;
					});
				}

			});
			$rootScope.$on("UserAuthSuccess", function(e, data) {
				$rootScope.getNewMessageCount();
				$state.reload();

			});

			$rootScope.categoryFilt = function(categoryAll, keyword) {
				if(!keyword) {
					return categoryAll;
				} else {
					var categoryList = [];
					var keywordLowerCase = keyword.toLowerCase();
					angular.forEach(categoryAll, function(category) {

						if(category.name.toLowerCase().indexOf(keywordLowerCase) != -1) {
							categoryList.push(category);
						} else {
							var categoryPinyin = $pinyinTranslate.getFullChars(category.name).toLowerCase();
							var categoryCamelChars = $pinyinTranslate.getCamelChars(category.name).toLowerCase();
							var categoryTag = category.tag ? category.tag.toLowerCase() : '';

							if(categoryPinyin.indexOf(keywordLowerCase) != -1 ||
								categoryCamelChars.indexOf(keywordLowerCase) != -1 ||
								categoryTag.indexOf(keywordLowerCase) != -1
							) {
								categoryList.push(category);
							}
						}

					});
					return categoryList;
				}
			};

		}
	]);