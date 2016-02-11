'use strict';

var collectionStatistics = angular.module('collectionStatistics', ['mobile-angular-ui']);


collectionStatistics.controller('CollectionStatisticsCtrl', ['$scope', '$routeParams', '$window', '$location', 'IndexedDb', function($scope, $routeParams, $window, $location, IndexedDb) {
    $scope.collectionId = $routeParams.id;


}]);
