angular.module('modaowang')
	.controller('gameModalCtrl', ['$uibModalInstance', '$scope', '$rootScope', 'apiService', '$q', '$timeout', 'storageH', '$state',
		function($uibModalInstance, $scope, $rootScope, apiService, $q, $timeout, storageH, $state) {
			$scope.getUserInfo = function() {
				apiService.userInfoProfile().then(function(data) {
					if(!data.errCode) {
						$scope.userInfo = data.data;
					}
				});
			};
			$scope.getUserInfo();

			$scope.exchangeChance = function() {
				if($scope.userInfo.score <= 0) {
					$rootScope.tips.showError("积分不足");
					return;
				}
				$rootScope.showConfirm("确定要用1个积分兑换5次机会吗？").then(function() {
					apiService.userGameChanceExchange().then(function(data) {
						if(!data.errCode) {
							$scope.getUserGame();
							$scope.userInfo.score -= 1;
							$rootScope.modaowangUser.user.score -= 1;
							storageH.setUser($rootScope.modaowangUser);
							$rootScope.$broadcast("UserProfileChanged");
						}
					});
				});
			};

			$scope.getWinNumbers = function() {
				apiService.userPrizeWinNumbers().then(function(data) {
					if(!data.errCode) {
						$scope.scoreNumbers = data.data.scoreNumbers;
						$scope.cashNumbers = data.data.cashNumbers;
						$scope.getSite();
					}
				});
			};

			var getScoreSite = function() {
				var url = "http://" + location.host;
				var name = document.title;
				var keyword = "";
				var description = "";
				var b = document.getElementsByTagName("meta");
				for(var s = 0; s < b.length; s++) {
					if(b[s].name.toLowerCase() == "keywords" || b[s].name.toLowerCase() == "keyword") {
						keyword = b[s].content
					}
					if(b[s].name.toLowerCase() == "description") {
						description = b[s].content
					}
				}
				var site = {
					id: 0,
					url: url,
					name: name,
					favicon: url + "/favicon.ico",
					keyword: keyword,
					description: description,
					createTime: new Date()
				};
				return function() {
					return site;
				};
			};
			$scope.getScoreSite=getScoreSite();
			$scope.getCashSite = function() {
				var site = angular.copy($scope.getScoreSite());
				site.favicon = site.url + "/img/xiaomodao.png";
				return site;
			};

			$scope.siteParams = {
				pageNum: this.pages > 0 ? Math.round(Math.random() * (this.pages - 2) + 1) : Math.round(Math.random() * 4 + 1),
				pageSize: 20,
				orderBy: '',
				keyword: $scope.keyword,
				total: 0,
				pages: 0
			};
			$scope.getSite = function() {
				var deferred = $q.defer();
				apiService.siteAll($scope.siteParams).then(function(data) {
					if(!data.errCode) {
						$scope.siteMix(data.data);
						$scope.sites = data.data;
						$scope.siteParams.total = data.pageParams.total;
						$scope.siteParams.pages = data.pageParams.pages;
					}
					deferred.resolve(data);
				});
				return deferred.promise;
			};
			$scope.siteMix = function(sites) {
				for(var i = 0; i < $scope.siteParams.pageSize; i++) {
					if($scope.scoreNumbers.indexOf(i + 1) != -1) {
						sites.splice(i, 1, $scope.getScoreSite());
					}
					if($scope.cashNumbers.indexOf(i + 1) != -1) {
						sites.splice(i, 1, $scope.getCashSite());
					}
				}
			};

			$scope.getUserGame = function() {
				apiService.userGameToday().then(function(data) {
					if(!data.errCode) {
						$scope.userGame = data.data;
					}
				});
			};

			var rollingStart = function(gameNumbers, randTimeList) {
				var index = 0;
				angular.forEach(document.querySelectorAll(".vertical-scroll"), function(scrollElement) {
					var randTime = randTimeList[index];
					var randPercent = (gameNumbers[index] - 1) * (100 / $scope.siteParams.pageSize).toFixed(2) - (100 / $scope.siteParams.pageSize) / 2.5;
					randPercent=0-randPercent;
					angular.element(scrollElement).css("transition", randTime + "ms ease-in-out");
					angular.element(scrollElement).css("transform", "translateY(" + randPercent + "%)");
					index++;
				});

			};

			$scope.timeCount = 0;
			$scope.start = function() {
				if($scope.userGame.chanceCount <= 0) {
					$rootScope.tips.showError("施法机会已用完");
					return;
				}
				if($scope.timeCount>0){
					return;
				}
				$scope.siteParams.pageNum = $scope.siteParams.pages > 0 ? Math.round(Math.random() * ($scope.siteParams.pages-2) + 1) : Math.round(Math.random() * 4 + 1);
				apiService.userPrizeGameNumbers().then(function(data) {
					if(!data.errCode) {
						$scope.gameNumbers = data.data.gameNumbers;
						$scope.userPrize = data.data.userPrize;
						

						$scope.getSite().then(function(siteData) {

							var randTimeList = [];
							randTimeList.push(Math.round(Math.random() * 4 + 3) * 1000);
							randTimeList.push(Math.round(Math.random() * 4 + 3) * 1000);
							randTimeList.push(Math.round(Math.random() * 4 + 3) * 1000);

							rollingStart($scope.gameNumbers, randTimeList);
							var maxTime = Math.max.apply(null, randTimeList);
							$scope.timeCount = maxTime;
							$timeout(function() {
								$scope.timeCount = 0;
									if($scope.userPrize) {
										$rootScope.showConfirm("恭喜中奖,是否查看兑奖情况？").then(function() {
											var url = "/public/user-profile/prize/";
											if(!window.open(url, "_blank")) {
												window.location.href = url;
											}
										});
										$scope.getUserInfo();
									} else {
										$rootScope.tips.showSuccess("再接再厉");
									}
									$scope.getUserGame();
								
							}, $scope.timeCount);

						});
					}
				});

			};

			$scope.getWinNumbers();
			$scope.getUserGame();

			$scope.ok = function() {
				$uibModalInstance.close();
			};

			$scope.cancel = function() {
				$uibModalInstance.dismiss('cancel');
			};

		}
	]);