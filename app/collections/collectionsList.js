'use strict';

var collectionsList = angular.module('collectionsList', ['globalDirectives']);


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
                //Update collectionName in cadrs in this collection
            IndexedDb.findByProperty(IndexedDb.STORES.CARD_STORE, "collectionId", parseInt(collection.id)).then(function(data) {
                for(var i = 0; i<data.length; i++) {
                    data[i].collectionName = collection.name;
                    IndexedDb.update(IndexedDb.STORES.CARD_STORE, data[i]).then(function() {
                    }, function(err) {
                        $window.alert(err);
                    });
                }
            }, function(err) {
                $window.alert(err);
            });

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

    $scope.isHigherThenTwo = function() {
        var userAgent = $window.navigator.userAgent;
        var userAgentBySpace= userAgent.split(" ");
        var lastTextBySlash =userAgentBySpace[userAgentBySpace.length-1].split("/");
        var version =parseFloat(lastTextBySlash[lastTextBySlash.length-1]);

        if((userAgent.indexOf("Gecko") > -1) && (userAgent.indexOf("Mobile") > -1)) {
            return (version>32.0 && lastTextBySlash[0] == "Firefox" );
        } else {
            return true;
        }

    };

    $scope.init = function(){
        IndexedDb.open().then(function(){
            IndexedDb.getGlobalSettings().then(function (response) {
                $scope.settings = response;
                $scope.refreshList();
            }, function (err) {
                $window.alert(err);
            });
        }, function(err) {
            console.log(err);
            console.log("not open db");
        });
    };

}]);
