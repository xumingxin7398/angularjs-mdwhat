var Ps = require('perfect-scrollbar');
var angular = require('angular');
require('./app.css');

// Export globally at user request
global.PerfectScrollbar = Ps;

module.exports = 'angular-perfect-scrollbar-2';

angular.module(module.exports, [])
.directive('perfectScrollbar', ['$parse', function ($parse) {
  return {
    restrict: 'EA',
    transclude: true,
    template: '<div><div ng-transclude></div></div>',
    replace: true,
    link: function (scope, elem, attr) {
      var scroll_opts = $parse(attr['opts'])(scope);
      var el = elem[0];

      Ps.initialize(el, scroll_opts);

      obs_opts = {
        childList: true,
        subtree: true,
        characterData: true,
      };

      if(typeof MutationObserver === "function") {
        obs = new MutationObserver(function () {
          Ps.update(el);
        });
        obs.observe(el, obs_opts);
      } else {
        console.warn(module.exports + ': Your browser does not support MutationObserver.')
      }

      scope.$watch('update', function (n, o) {
        if (n) {
          Ps.update(el);
          scope.update = false;
        }
      });

      scope.$on('destroy', function () {
        obs.disconnect();
        Ps.destroy(el);
      });
    }
  };
}]);
