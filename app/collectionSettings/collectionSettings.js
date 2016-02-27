'use strict';

var collectionSettings = angular.module('collectionSettings', []);


collectionSettings.controller('CollectionSettingsCtrl', ['$scope', '$routeParams', '$window', '$location', 'IndexedDb', function($scope, $routeParams, $window, $location, IndexedDb) {
    $scope.collectionId = $routeParams.id;

    $scope.getCollectionSettings = function() {
        IndexedDb.getById(IndexedDb.STORES.COLLECTION_SETTINGS_STORE, $routeParams.id).then(function(response) {
            $scope.collectionSettings = response;
        }, function(err) {
            $window.alert(err);
        });
    };

    $scope.$watch('collectionSettings', function(oldValue, newValue) {
        if(oldValue !== newValue) {
            IndexedDb.update(IndexedDb.STORES.COLLECTION_SETTINGS_STORE, $scope.collectionSettings).then(function (response) {
                //ok
            }, function (err) {
                $window.alert(err);
            });
        }
    }, true);

    $scope.init = function() {
        IndexedDb.open().then(function(){
            $scope.getCollectionSettings();
        });
    }
}]);
