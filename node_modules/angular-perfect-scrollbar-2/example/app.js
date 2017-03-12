angular.module('app', [ 'angular-perfect-scrollbar-2' ])
.controller('ctrl', ['$scope', '$interval', function ($scope, $interval) {
  $scope.scrollopts = {
    wheelSpeed: 2,
    wheelPropagation: true,
    minScrollbarLength: 20
  };
  $scope.list = [];
  $scope.show = true;
  var counter = 0;
  var direction = true;
  var timer = $interval(function () {
    var len = $scope.list.length;
    if ( (len === 0 && !direction) || len === 50) {
      direction = !direction;
    }
    if (direction) {
      $scope.list.push('line' + (counter++));
    } else {
      $scope.list.pop();
      counter--;
    }
  }, 100);
}]);
