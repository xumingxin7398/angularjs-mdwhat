'use strict';
angular.module('modaowang')
	.directive('onOtherFalse', ['$rootElement', '$rootScope', function($rootElement, $rootScope) {
		var isChild = function(parent, child) {
			if(angular.isElement(child)) {
				if(angular.equals(parent, child)) {
					return true;
				}
				if(!angular.equals($rootElement[0], child)) {
					return isChild(parent, isChild(parent, angular.element(child).parent()[0]));
				} else {
					return false;
				}
			} else {
				return child;
			}

		};
		return {
			restrict: "A",
			link: function(scope, element, attr) {

				$rootElement.on('click', function(e) {
					var evalStr = attr.onOtherFalse.replace('$root', '$rootScope');
					if(eval(evalStr) == false) {
						return;
					}
					if(!isChild(element[0], e.target)) {
						$rootScope.$apply(eval(evalStr + '=false'));
					}
				});
			}
		}

	}])
	.directive('scrollToTop', ['$rootElement', '$rootScope', '$window', function($rootElement, $rootScope, $window) {

		return {
			restrict: "A",
			link: function(scope, element, attr) {
				$window.onscroll = function(e) {
					var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
					if(scrollTop > $window.screen.height / 2) {
						element.css("display", "block");
					} else {
						element.css("display", "none");
					}
				};
				element.on('click', function(e) {
					$window.scrollTo(0, 0);
				});

			}
		}

	}])
	//按回车触发确定事件
	.directive('ngEnter', function() {
		return function(scope, element, attrs) {
			element.bind("keydown keypress", function(event) {
				if(event.which === 13) {
					scope.$apply(function() {
						scope.$eval(attrs.ngEnter);
					});

					event.preventDefault();
				}
			});
		};
	})
	//输入框自动聚焦
	.directive('focusMe', function($timeout) {
		return {
			link: function(scope, element, attrs) {
				$timeout(function() {
					element[0].focus();
				}, 100);
			}
		};
	})
	.directive('focusMePc', function($timeout, $window) {
		return {
			link: function(scope, element, attrs) {
				if($window.innerWidth > 750) {
					$timeout(function() {

						element[0].focus();
					}, 100);
				}

			}
		};
	})
	.directive('onScrollTrue', ['$rootScope', function($rootScope) {
		return {
			restrict: "A",
			link: function(scope, element, attr) {
				element.on('scroll', function(e) {
					var evalStr = attr.onScrollTrue.replace('$root', '$rootScope');
					if(element[0].scrollTop > 55) {
						$rootScope.$apply(eval(evalStr + '=true'));
					} else {
						$rootScope.$apply(eval(evalStr + '=false'));
					}
				});

			}
		}
	}])
	/*.directive('uibDropdownInput', ['$rootScope', function($rootScope) {
		return {
			restrict: "AE",
			link: function(scope, element, attr) {
				element.on('focus', function(e) {
					var uibDropdown = element.parent();
					if(!uibDropdown.hasClass("open") && element[0].value) {
						uibDropdown.addClass("open");
					}
				});
				element.on('keyup', function(e) {
					var uibDropdown = element.parent();
					if(!uibDropdown.hasClass("open") && element[0].value) {
						uibDropdown.addClass("open");
					}
					if(uibDropdown.hasClass("open") && !element[0].value) {
						uibDropdown.removeClass("open");
					}
				});
				element.on('blur', function(e) {
					var uibDropdown = element.parent();
					if(uibDropdown.hasClass("open")) {
						uibDropdown.removeClass("open");
					}
				});

			}
		}
	}])*/
	
;