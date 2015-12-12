'use strict';

var collectionDetail = angular.module('collectionDetail', ['mobile-angular-ui', 'globalDirectives']);


collectionDetail.controller('CollectionDetailCtrl', ['$scope', '$routeParams', 'IndexedDb', '$window', function($scope, $routeParams, IndexedDb, $window) {
    var cd = this;
    cd.collectionDetail = null;
    cd.cards = [];
    cd.newCards = [];
    cd.cardsToStudy = [];
    $scope.addEditCardModalMode = "add";
    $scope.updateId = null;
    $scope.showModal = false;
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


    $scope.add = function(card) {
        card.collectionId =cd.collectionDetail.id;
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

    $scope.$watch("cd.cardsToStudy",
        function ( newValue, oldValue ) {
            cd.newCards = [];

            for(var i = 0; i<newValue.length; i++) {
                if(newValue[i].lastShow == null) {
                    cd.newCards.push(newValue[i]);
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
