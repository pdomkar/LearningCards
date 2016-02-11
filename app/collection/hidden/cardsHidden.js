'use strict';

var cardsHidden = angular.module('cardsHidden', []);

cardsHidden.controller('CardsHiddenCtrl', ['$scope', '$routeParams', 'IndexedDb', function($scope, $routeParams, IndexedDb) {
    var ch = this;
    ch.cards = [];
    $scope.collectionId = $routeParams.id;
    $scope.removeCardId = null;
    $scope.showConfirmRemove = false;

    $scope.refreshList = function(){
        IndexedDb.findByProperties(IndexedDb.STORES.CARD_STORE, {collectionId: parseInt($routeParams.id), hidden: "true"}).then(function(data){
            ch.cards=data;
        }, function(err){
            $window.apy
            ert(err);
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

    $scope.show = function(card) {
        card.hidden = "false";
        IndexedDb.update(IndexedDb.STORES.CARD_STORE, card).then(function() {
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
