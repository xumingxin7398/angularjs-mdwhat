'use strict';
angular.module('modaowang')

.controller('loginModalCtrl', ['$uibModalInstance', '$scope', 'apiService',
		'$rootScope', 'utils', 'storageH', '$timeout',
		function($uibModalInstance, $scope, apiService, $rootScope, utils, storageH, $timeout) {

			$scope.loginMode = true;
			$scope.changeMode = function(loginMode) {
				$scope.tips = "";
				$scope.loginMode = loginMode;
			};
			$scope.params = storageH.initUser();
			$scope.tips = "";

			$scope.checkName = function() {
				if(!$scope.params.user.userName) {
					return;
				}
				apiService.userCheckName({
					userName: $scope.params.user.userName
				}).then(function(data) {
					if(data.errCode) {
						$scope.tips = "用户名已存在";
					}
				});
			};
			$scope.login = function() {
				$scope.params.user.password = utils.md5($scope.params.user.inputPassword);
				apiService.userLogin($scope.params.user).then(function(data) {
					if(!data.errCode) {
						$scope.params.user.inputPassword = "";
						storageH.setUser(data.data);
						$scope.cancel();
						$rootScope.$broadcast("UserAuthSuccess");

					} else {
						$scope.tips = "帐号或密码错误";
					}
				});
			};
			$scope.qqLogin = function() {
				QC.Login({
					btnId: "qqLoginBtn",
					//用户需要确认的scope授权项，可选，默认all
					scope: "all",
					//按钮尺寸，可用值[A_XL| A_L| A_M| A_S|  B_M| B_S| C_S]，可选，默认B_S
					size: "A_M"
				}, function(reqData, opts) { //登录成功
					//根据返回数据，更换按钮显示状态方法
			       var dom = document.getElementById(opts['btnId']),
			       _logoutTemplate=[
			            //头像
			            '<span><img src="{figureurl}" class="{size_key}"/></span>',
			            //昵称
			            '<span>{nickname}</span>',
			            //退出
			            '<span><a href="javascript:QC.Login.signOut();">退出</a></span>'    
			       ].join("");
			       dom && (dom.innerHTML = QC.String.format(_logoutTemplate, {
			           nickname : QC.String.escHTML(reqData.nickname), //做xss过滤
			           figureurl : reqData.figureurl
			       }));
				}, function(opts) { //注销成功
					$rootScope.tips.showSuccess('QQ登录 注销成功');
				});
			};
			$uibModalInstance.rendered.then(function(){
				$scope.qqLogin();
				
			});
			
			$scope.register = function() {
				$scope.params.user.password = utils.md5($scope.params.user.inputPassword);
				apiService.userRegister($scope.params.user).then(function(data) {
					if(!data.errCode) {
						$scope.login();
						$uibModalInstance.close();
						$rootScope.tips.showSuccess("注册成功");
						$timeout(function() {
							$rootScope.openContentModal('emailModal', '');
						}, 500);

					} else {
						$scope.tips = "注册失败";
					}
				});
			};
	
			$scope.ok = function() {
				$uibModalInstance.close();
			};

			$scope.cancel = function() {
				$uibModalInstance.dismiss();
			};

		}
	])
	.controller('commonModalCtrl', ['$uibModalInstance', '$scope', 'apiService', '$rootScope', '$state',
		function($uibModalInstance, $scope, apiService, $rootScope, $state) {
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
			$scope.toFullSize = function() {
				$scope.cancel();
				$state.go("public.common");
			};
			$scope.ok = function() {
				$uibModalInstance.close($scope.selected.item);
			};

			$scope.cancel = function() {
				$uibModalInstance.dismiss('cancel');
			};

		}
	])

.controller('favoriteModalCtrl', ['$uibModalInstance', '$scope', 'apiService', '$rootScope', '$state',
		function($uibModalInstance, $scope, apiService, $rootScope, $state) {
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
			$scope.toFullSize = function() {
				$scope.cancel();
				$state.go("public.favorite");
			};
			$scope.ok = function() {
				$uibModalInstance.close($scope.selected.item);
			};

			$scope.cancel = function() {
				$uibModalInstance.dismiss('cancel');
			};

		}
	])
	.controller('newFavoriteModalCtrl', ['$uibModalInstance', '$scope', 'apiService', '$rootScope',
		function($uibModalInstance, $scope, apiService, $rootScope) {
			$scope.params = {
				favoriteName: '',
				isPrivate: false
			}
			$scope.addFavorite = function() {
				apiService.userFavoriteAdd($scope.params).then(function(data) {
					if(!data.errCode) {
						$rootScope.$broadcast("FavoriteListChanged");
						$uibModalInstance.dismiss('cancel');
						console.log("添加成功");
					}
				});
			};

			$scope.ok = function() {
				$uibModalInstance.close($scope.selected.item);
			};

			$scope.cancel = function() {
				$uibModalInstance.dismiss('cancel');
			};

		}
	])
	.controller('newCommonModalCtrl', ['$uibModalInstance', '$scope', 'apiService', '$rootScope', 'utils',
		function($uibModalInstance, $scope, apiService, $rootScope, utils) {
			$scope.params = {
				url: '',
				name: '',
				keyword: '',
				description: ''
			};
			$scope.getSiteByUrl = function() {
				if(!$scope.params.url.startsWith("http")) {
					$scope.params.url = "http://" + $scope.params.url;
				}
				if(!$scope.params.url || !utils.isUrl($scope.params.url)) {
					return;
				}

				apiService.siteGetSite($scope.params).then(function(data) {
					if(!data.errCode) {
						$scope.params = data.data;
					}
				});
			};
			$scope.createCommon = function() {
				apiService.userCommonCreate($scope.params).then(function(data) {
					if(!data.errCode) {
						$rootScope.$broadcast("CommonSiteListChanged");
						$uibModalInstance.dismiss('cancel');
					}
				});
			};

			$scope.ok = function() {
				$uibModalInstance.close($scope.selected.item);
			};

			$scope.cancel = function() {
				$uibModalInstance.dismiss('cancel');
			};

		}
	])
	.controller('newFavoriteSiteModalCtrl', ['$uibModalInstance', '$scope', 'apiService', '$rootScope', 'utils','storageH',
		function($uibModalInstance, $scope, apiService, $rootScope, utils,storageH) {
			$scope.params = {
				url: '',
				name: '',
				keyword: '',
				description: ''
			};
			$scope.getSiteByUrl = function() {
				if(!$scope.params.url.startsWith("http")) {
					$scope.params.url = "http://" + $scope.params.url;
				}
				if(!$scope.params.url || !utils.isUrl($scope.params.url)) {
					return;
				}

				apiService.siteGetSite($scope.params).then(function(data) {
					if(!data.errCode) {
						$scope.params = data.data;
					}
				});
			};
			$scope.activeTab = 0;
			$scope.createFavoriteSite = function() {
				$scope.params.favoriteId = $scope.favoriteList[$scope.activeTab].favoriteId;
				apiService.favoriteSiteCreate($scope.params).then(function(data) {
					if(!data.errCode) {
						$rootScope.$broadcast("FavoriteSiteListChanged", $scope.favoriteList[$scope.activeTab].favoriteId);
						$uibModalInstance.dismiss('cancel');
					}
				});
			};
			//获取收藏夹列表
			$scope.getFavorite = function() {
				var userInfo = storageH.getUserInfo();
				if(!userInfo || !userInfo.user || !userInfo.token) {
					$rootScope.tips.showError("请先登录");
					$rootScope.$broadcast("UserAuthFailed");
					return false;
				};
				apiService.userFavoriteList().then(function(data) {
					if(!data.errCode) {

						$scope.favoriteList = data.data;

					}
				});
			};

			$scope.getFavorite();
			$scope.ok = function() {
				$uibModalInstance.close($scope.selected.item);
			};

			$scope.cancel = function() {
				$uibModalInstance.dismiss('cancel');
			};

		}
	])
	.controller('selectFavoriteModalCtrl', ['$uibModalInstance', '$scope', 'apiService', '$rootScope', 'utils', 'modalParams',
		function($uibModalInstance, $scope, apiService, $rootScope, utils, modalParams) {
			modalParams.name = modalParams.name || modalParams.siteName;
			$scope.params = modalParams;

			$scope.activeTab = 0;

			$scope.addFavoriteSite = function() {
				if($scope.favoriteList.length == 0) {

					return;
				}
				apiService.favoriteSiteAdd({
					favoriteId: $scope.favoriteList[$scope.activeTab].favoriteId,
					siteId: $scope.params.siteId || $scope.params.id
				}).then(function(data) {
					if(!data.errCode) {
						$rootScope.$broadcast("FavoriteSiteListChanged", $scope.favoriteList[$scope.activeTab].favoriteId);
						$uibModalInstance.dismiss('cancel');
					} else {
						$rootScope.tips.showError("添加失败");
					}
				});
			};
			//获取收藏夹列表
			$scope.getFavorite = function() {

				apiService.userFavoriteList().then(function(data) {
					if(!data.errCode) {

						$scope.favoriteList = data.data;

					}
				});
			};

			$scope.getFavorite();
			$scope.ok = function() {
				$uibModalInstance.close($scope.selected.item);
			};

			$scope.cancel = function() {
				$uibModalInstance.dismiss('cancel');
			};

		}
	])

.controller('activityModalCtrl', ['$uibModalInstance', '$scope', function($uibModalInstance, $scope) {

		$scope.sites = function() {
			var sitesArray = [];
			for(var i = 0; i < 25; i++) {
				sitesArray.push(i);
			}
			return sitesArray;
		};

		var rollingStart = function(scrollElement, itemCount) {
			var randTime = Math.round(Math.random() * 4 + 4) * 1000;
			var randPercent = Math.round(Math.random() * 48) * 2;
			scrollElement.css("transition", randTime + "ms ease-in-out");
			scrollElement.css("transform", "translateY(-" + randPercent + "%)");
		};

		$scope.start = function() {

			angular.forEach(document.querySelectorAll(".vertical-scroll"), function(item) {

				rollingStart(angular.element(item), 25);
			});
		};
		$scope.ok = function() {
			$uibModalInstance.close($scope.selected.item);
		};

		$scope.cancel = function() {
			$uibModalInstance.dismiss('cancel');
		};

	}])
	.controller('uploadImageModalCtrl', ['$uibModalInstance', '$scope',
		'storageH', 'apiService', 'Upload', 'modalParams', '$rootScope',
		function($uibModalInstance, $scope, storageH, apiService, Upload,
			modalParams, $rootScope) {
			var userInfo = storageH.getUserInfo();
			$scope.previewList = [];
			$scope.uploadFiles = function(files) {
				if(files && files.length) {
					for(var i = 0; i < files.length; i++) {
						var upload = Upload.upload({
							url: apiService.postImageUrl,
							data: {
								file: files[i]
							},
							headers: userInfo ? {
								token: userInfo.token,
								userId: userInfo.user.userId
							} : {}
						});

						upload.then(function(data) {
							if(!data.data.errCode) {
								$scope.previewList.push(data.data.data);
							}
						});
					}
				}
			};
			$scope.delFile = function(index) {
				apiService.postDelFile({
					filePath: $scope.previewList[index]
				}).then(function(data) {

				}).finally(function() {
					$scope.previewList.splice(index, 1);
				});
			};

			$scope.ok = function() {
				$uibModalInstance.close($scope.previewList);
			};

			$scope.cancel = function() {
				for(var i = 0; i < $scope.previewList.length; i++) {
					$scope.delFile(i);
				}
				$uibModalInstance.dismiss();
			};

		}
	])
	.controller('addVideoModalCtrl', ['$uibModalInstance', '$scope', function($uibModalInstance, $scope) {
		$scope.params = {
			url: "http://"
		};
		$scope.ok = function() {
			$uibModalInstance.close($scope.params.url);
		};

		$scope.cancel = function() {
			$uibModalInstance.dismiss('cancel');
		};

	}])
	.controller('addImageModalCtrl', ['$uibModalInstance', '$scope', function($uibModalInstance, $scope) {
		$scope.params = {
			url: "http://"
		};
		$scope.ok = function() {
			$uibModalInstance.close($scope.params.url);
		};

		$scope.cancel = function() {
			$uibModalInstance.dismiss('cancel');
		};

	}])
	.controller('addLinkModalCtrl', ['$uibModalInstance', '$scope', 'apiService',
		'modalParams', '$rootScope',
		function($uibModalInstance, $scope, apiService, modalParams, $rootScope) {
			$scope.params = {
				url: "http://"
			};
			$scope.ok = function() {
				$uibModalInstance.close($scope.params.url);
			};

			$scope.cancel = function() {
				$uibModalInstance.dismiss('cancel');
			};

		}
	])

.controller('editProfileModalCtrl', ['$uibModalInstance', '$scope', 'apiService',
		'modalParams', '$rootScope',
		function($uibModalInstance, $scope, apiService, modalParams, $rootScope) {
			$scope.params = angular.copy(modalParams);

			$scope.editProfile = function() {
				apiService.userInfoEdit($scope.params).then(function(data) {
					if(!data.errCode) {
						$rootScope.$broadcast("UserProfileChanged");
						$uibModalInstance.close(true);
					}
				});

			};

			$scope.cancel = function() {
				$uibModalInstance.dismiss('cancel');
			};

		}
	])
	.controller('editPrizeModalCtrl', ['$uibModalInstance', '$scope', 'apiService',
		'modalParams', '$rootScope',
		function($uibModalInstance, $scope, apiService, modalParams, $rootScope) {
			$scope.params = angular.copy(modalParams);

			$scope.editPrize = function() {
				apiService.userPrizeEdit($scope.params).then(function(data) {
					if(!data.errCode) {
						$rootScope.$broadcast("UserPrizeChanged");
						$uibModalInstance.close(true);
					}
				});

			};

			$scope.cancel = function() {
				$uibModalInstance.dismiss('cancel');
			};

		}
	])

.controller('uploadIconModalCtrl', ['$uibModalInstance', '$scope', 'apiService',
	'modalParams', '$rootScope',
	function($uibModalInstance, $scope, apiService, modalParams, $rootScope) {
		$scope.params = angular.copy(modalParams);

		$scope.fileName = "";

		var dataURItoBlob = function(dataurl) {
			var arr = dataurl.split(','),
				mime = arr[0].match(/:(.*?);/)[1],
				bstr = atob(arr[1]),
				n = bstr.length,
				u8arr = new Uint8Array(n);
			while(n--) {
				u8arr[n] = bstr.charCodeAt(n);
			}
			var blob = new Blob([u8arr], {
				type: mime
			});
			return new File([blob], "user-icon.png");
		};
		$scope.ok = function() {
			var blob = dataURItoBlob($scope.croppedImage);
			$uibModalInstance.close(blob);

		};

		$scope.cancel = function() {
			$uibModalInstance.dismiss('cancel');
		};

		$scope.uploadImage = '';
		$scope.croppedImage = '';

		var handleFileSelect = function(evt) {
			var file = evt.currentTarget.files[0];

			$scope.fileName = file.name;
			var reader = new FileReader();
			reader.onload = function(evt) {
				$scope.$apply(function($scope) {
					$scope.uploadImage = evt.target.result;
				});
			};
			reader.readAsDataURL(file);
		};
		$uibModalInstance.rendered.then(function() {
			angular.element(document.querySelector('#uploadIconInput')).on('change', handleFileSelect);
		});

	}
])

.controller('confirmModalCtrl', ['$uibModalInstance', '$scope', 'apiService',
		'modalParams', '$rootScope',
		function($uibModalInstance, $scope, apiService, modalParams, $rootScope) {

			$scope.tips = modalParams;
			$scope.ok = function() {
				$uibModalInstance.close();
			};

			$scope.cancel = function() {
				$uibModalInstance.dismiss('cancel');
			};

		}
	])
	.controller('emailModalCtrl', ['$uibModalInstance', '$scope', 'apiService', '$rootScope', '$interval', 'storageH',
		function($uibModalInstance, $scope, apiService, $rootScope, $interval, storageH) {

			$scope.params = {
				userName: $rootScope.modaowangUser.user.userName,
				email: $rootScope.modaowangUser.user.email,
				verifyCode: ''
			};
			$scope.timeCount = 0;
			$scope.timer = undefined;
			$scope.getVerifyCode = function() {

				apiService.userVerifyCode($scope.params).then(function(data) {
					if(!data.errCode) {
						$scope.timeCount = 60;
						$scope.timer = $interval(function() {
							if($scope.timeCount > 0) {
								$scope.timeCount--;
							} else {
								$interval.cancel($scope.timer);
								$scope.timer = undefined;
							}
						}, 1000);
					} else {
						$rootScope.tips.showError("邮箱错误或已被验证");
					}
				});

			};
			$scope.checkEmail = function() {
				apiService.userCheckEmail($scope.params).then(function(data) {
					if(data.errCode) {
						$rootScope.tips.showError("邮箱已被验证");
					}
				});
			};

			$scope.ok = function() {
				apiService.userVerifyCodeCheck($scope.params)
					.then(function(data) {
						if(!data.errCode) {
							$rootScope.modaowangUser.user.status = data.data;
							$rootScope.modaowangUser.user.email = $scope.params.email;
							storageH.setUser($rootScope.modaowangUser);
							$rootScope.$broadcast("UserProfileChanged");
							$uibModalInstance.close();
							$rootScope.tips.showSuccess("验证成功");
						} else {
							$rootScope.tips.showError("验证失败");
						}
					});

			};

			$scope.cancel = function() {
				$uibModalInstance.dismiss('cancel');
			};

		}
	]);