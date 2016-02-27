'use strict';

var collectionDetail = angular.module('collectionDetail', ['globalDirectives']);


collectionDetail.controller('CollectionDetailCtrl', ['$scope', '$routeParams', 'IndexedDb', '$window', function($scope, $routeParams, IndexedDb, $window) {
    var cd = this;
    cd.collectionDetail = null;
    cd.cards = [];
    cd.newCards = [];
    cd.repeatedCards = [];
    cd.cardsToStudy = [];
    $scope.addEditCardModalMode = "add";
    $scope.updateId = null;
    $scope.showModal = false;
    $scope.showEditCollModal = false;
    $scope.updateCollId = $routeParams.id;
    $scope.editCollModalMode = "update";
    $scope.removeCardId = null;
    $scope.showConfirmRemove = false;
    $scope.showFilteredNewColl = false;
    $scope.filteredBaseCollId = null;


    $scope.showAddCardModal = function() {
        $scope.addEditCardModalMode = "add";
        $scope.showModal = true;
    };

    $scope.showUpdateCardModal = function(id) {
        $scope.updateId = id;
        $scope.addEditCardModalMode = "update";
        $scope.showModal = true;
    };

    $scope.showFilteredNewCollModal = function() {
        $scope.showFilteredNewColl = true;
    };

    $scope.showEditCollModalFce = function(id) {
        $scope.updateCollId = id;
        $scope.showEditCollModal = true;
    };


    $scope.add = function(card) {
        card.collectionId = cd.collectionDetail.id;
        card.collectionName = cd.collectionDetail.name;
        card.lastShow = null;
        card.nextShow = moment("01-01-1970", "MM-DD-YYYY").toDate();
        card.interval = 0;
        card.ef = 2.5;
        card.numberOfIteration = 0;
        card.hidden = "false";
        IndexedDb.add(IndexedDb.STORES.CARD_STORE, card).then(function() {
            $scope.refreshList();
        }, function(err) {
            $window.alert(err);
        });

    };

    $scope.update = function(card) {
        IndexedDb.update(IndexedDb.STORES.CARD_STORE, card).then(function() {
            $scope.refreshList();
        }, function(err) {
            $window.alert(err);
        });
    };

    $scope.callRemove = function(id) {
        $scope.removeCardId = id;
        $scope.showConfirmRemove = true;
    };

    $scope.remove = function(id) {
        IndexedDb.remove(IndexedDb.STORES.CARD_STORE, id).then(function() {
            $scope.refreshList();
        }, function(err) {
            $window.alert(err);
        });
    };

    $scope.hide = function(card) {
        card.hidden = "true";
        IndexedDb.update(IndexedDb.STORES.CARD_STORE, card).then(function() {
            $scope.refreshList();
        }, function(err) {
            $window.alert(err);
        });
    };



    $scope.getById = function(id){
        IndexedDb.getById(IndexedDb.STORES.COLLECTION_STORE, id).then(function(data){
            cd.collectionDetail = data;
        }, function(err){
            $window.alert(err);
        });
    };

    $scope.findCardsToStudy = function(id){
        IndexedDb.findCardToStudy(id).then(
            function(data) {
                cd.cardsToStudy = data;
            }, function(err) {
                $window.alert(err);
            });
    };

    $scope.refreshList = function(){
        IndexedDb.findByProperties(IndexedDb.STORES.CARD_STORE, {collectionId: parseInt($routeParams.id), hidden: "false"}).then(function(data){
            cd.cards=data;
        }, function(err){
            $window.alert(err);
        });
    };

    $scope.updateColl = function(coll) {
        IndexedDb.update(IndexedDb.STORES.COLLECTION_STORE, coll).then(function() {
            //Update collectionName in cadrs in this collection
            IndexedDb.findByProperty(IndexedDb.STORES.CARD_STORE, "collectionId", parseInt(coll.id)).then(function(data) {
                for(var i = 0; i<data.length; i++) {
                    data[i].collectionName = coll.name;
                    IndexedDb.update(IndexedDb.STORES.CARD_STORE, data[i]).then(function() {
                    }, function(err) {
                        $window.alert(err);
                    });
                }

            }, function(err) {
                $window.alert(err);
            });
            $scope.editCollModalMode = "update";
            $scope.getById($routeParams.id);
            $scope.refreshList();
        }, function(err) {
            $window.alert(err);
        });
    };

    $scope.$watch("cd.cardsToStudy",
        function ( newValue, oldValue ) {
            cd.newCards = [];
            cd.repeatedCards = [];

            for(var i = 0; i<newValue.length; i++) {
                if(newValue[i].lastShow == null) {
                    cd.newCards.push(newValue[i]);
                }
                if(newValue[i].dirty == "true") {
                    cd.repeatedCards.push(newValue[i]);
                }
            }
        }
    );

    $scope.$watch("cd.cards",
        function ( newValue, oldValue ) {
            $scope.findCardsToStudy($routeParams.id);
        }
    );

    $scope.init = function() {
        IndexedDb.open().then(function(){
            $scope.filteredBaseCollId = $routeParams.id;
            $scope.getById($routeParams.id);
            $scope.refreshList();
        });
    }


}]);
