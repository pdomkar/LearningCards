'use strict';

var collectionsHidden = angular.module('collectionsHidden', []);

collectionsHidden.controller('CollectionsHiddenCtrl', ['$scope', 'IndexedDb', function($scope, IndexedDb) {
    var ch = this;
    ch.collections = [];
    $scope.removeCollId = null;
    $scope.showConfirmRemove = false;

    $scope.refreshList = function(){
        IndexedDb.findByProperty(IndexedDb.STORES.COLLECTION_STORE, "hidden", "true").then(function(data){
            ch.collections=data;
        }, function(err){
            $window.alert(err);
        });
    };

    $scope.callRemove = function(id) {
        $scope.removeCollId = id;
        $scope.showConfirmRemove = true;
    };

    $scope.remove = function(id) {
        IndexedDb.remove(IndexedDb.STORES.COLLECTION_STORE, id).then(function() {
            $scope.refreshList();
        }, function(err) {
            $window.alert(err);
        });
    };

    $scope.show = function(collection) {
        collection.hidden = "false";
        IndexedDb.update(IndexedDb.STORES.COLLECTION_STORE, collection).then(function() {
            $scope.refreshList();
        }, function(err) {
            $window.alert(err);
        });
    };

    $scope.init = function(){
        IndexedDb.open().then(function(){
            $scope.refreshList();
        });
    };

}]);
