'use strict';

var collectionsList = angular.module('collectionsList', ['mobile-angular-ui', 'globalDirectives', 'collectionsDirectives']);


collectionsList.controller('CollectionsListCtrl', ['$scope', '$location', '$window', 'IndexedDb', function($scope, $location, $window, IndexedDb) {
    var cl = this;
    cl.collections = [];
    $scope.dropDownShow = false;
    $scope.addEditCollModalMode = "add";
    $scope.updateId = null;
    $scope.showModal = false;
    $scope.removeCollId = null;
    $scope.showConfirmRemove = false;
    $scope.showFilteredNewColl = false;

    $scope.showAddCollModal = function() {
        $scope.addEditCollModalMode = "add";
        $scope.showModal = true;
    };

    $scope.showUpdateCollModal = function(id) {
        $scope.updateId = id;
        $scope.addEditCollModalMode = "update";
        $scope.showModal = true;
    };

    $scope.showFilteredNewCollModal = function() {
        $scope.showFilteredNewColl = true;
    };


    $scope.refreshList = function(){
        IndexedDb.findByProperty(IndexedDb.STORES.COLLECTION_STORE, "hidden", "false").then(function(data){
            cl.collections=data;
        }, function(err){
            $window.alert(err);
        });
    };

    $scope.add = function(collection) {
        collection.hidden = "false";
        IndexedDb.add(IndexedDb.STORES.COLLECTION_STORE, collection).then(function(addedId) {
            IndexedDb.getGlobalSettings().then(function(response) {
                response.id = addedId;
                //add next attribute which aren't in globalSettings

                IndexedDb.add(IndexedDb.STORES.COLLECTION_SETTINGS_STORE, response).then(function() {
                    //ok
                }, function(err) {
                    $window.alert(err);
                });
            }, function(err) {
                $window.alert(err);
            });

            $scope.refreshList();
        }, function(err) {
            $window.alert(err);
        });
    };

    $scope.getById = function(id) {
        var coll = {};
       IndexedDb.getById(IndexedDb.STORES.COLLECTION_STORE, id).then(function(data) {
            coll.data = data;
        }, function(err) {
            $window.alert(err);
        });
        return coll.data;
    };

    $scope.update = function(collection) {
        IndexedDb.update(IndexedDb.STORES.COLLECTION_STORE, collection).then(function() {
            $scope.refreshList();
        }, function(err) {
            $window.alert(err);
        });
    };

    $scope.callRemove = function(id) {
        $scope.removeCollId = id;
        $scope.showConfirmRemove = true;
    };

    $scope.remove = function(id) {
        IndexedDb.remove(IndexedDb.STORES.COLLECTION_STORE, id).then(function() {
            //collection deleted, then delete all dependent cards
            console.log(id);
            IndexedDb.removeBy(IndexedDb.STORES.CARD_STORE, "collectionId", id).then(function() {

            }, function(err) {
                $window.alert(err);
            });
            $scope.refreshList();
        }, function(err) {
            $window.alert(err);
        });
    };

    $scope.hide = function(collection) {
        collection.hidden = "true";
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
