angular.module('modaowang')
	.service('gameService', ['$rootScope', '$scope', '$timeout', '$log', '$uibModal', function($rootScope, $scope, $timeout, $log, $uibModal) {

		this.game = function() {
			this.init = function() {
				this.gameModal = $uibModal.open({
					animation: $ctrl.animationsEnabled,
					ariaLabelledBy: 'modal-title',
					ariaDescribedBy: 'modal-body',
					templateUrl: 'templates/home/gameModal.html',
					controller: 'gameCtrl',
					controllerAs: 'gameCtrl',
					size: size,
					resolve: {
						items: function() {
							return gameCtrl.items;
						}
					}
				});

				this.gameModal.result.then(function(selectedItem) {
					gameCtrl.selected = selectedItem;
				}, function() {
					$log.info('Modal dismissed at: ' + new Date());
				});
				return this.gameModal;
			};
			this.start = function() {

			};
		};
		$rootScope.game = game;
	}])
	.controller('gameCtrl', [function() {

	}]);