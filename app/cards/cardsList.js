'use strict';

var cardsList = angular.module('cardsList', ['globalDirectives']);


cardsList.controller('CardsListCtrl', ['$scope', '$routeParams', 'IndexedDb', '$window', function($scope, $routeParams, IndexedDb, $window) {
    var cl = this;
    cl.cards = [];
    $scope.addEditCardModalMode = "add";
    $scope.updateId = null;
    $scope.showModal = false;
    $scope.removeCardId = null;
    $scope.showConfirmRemove = false;


    $scope.showUpdateCardModal = function(id) {
        $scope.updateId = id;
        $scope.addEditCardModalMode = "update";
        $scope.showModal = true;
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

    $scope.show = function(card) {
        card.hidden = "false";
        IndexedDb.update(IndexedDb.STORES.CARD_STORE, card).then(function() {
            $scope.refreshList();
        }, function(err) {
            $window.alert(err);
        });
    };

    $scope.refreshList = function(){
        IndexedDb.findAll(IndexedDb.STORES.CARD_STORE).then(function(data){
            cl.cards=data;
        }, function(err){
            $window.alert(err);
        });

    };

    $scope.init = function() {
        IndexedDb.open().then(function(){
            $scope.refreshList();
        });
    };


}]);
