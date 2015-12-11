'use strict';

var globalDirectives = angular.module('globalDirectives', []);

globalDirectives.directive('confirmDialog', function() {
    function link($scope) {
        $scope.cancel = function() {
            $scope.showConfirm = false;
        };

        $scope.confirm = function() {
            $scope.confirmFce();
            $scope.showConfirm = false;
        };
    }

    return {
        restrict: 'E',
        templateUrl: 'directives/confirmDialogTemplate.html',
        scope: {
            btnCancel: '@',
            btnConfirm: '@',
            title: '@',
            body: '@',
            confirmFce: '&',
            showConfirm: '='
        },
        link: link
    };
}).directive('addEditCardModal', ['IndexedDb', '$window', function(IndexedDb, $window) {
    function link(scope) {
        scope.cancel = function() {
            scope.showModal = false;
            scope.addEditCardModalMode = "";
            scope.card = {};
        };

        scope.add = function(card) {
            scope.addFce({newCard: card});
            scope.showModal = false;
            scope.addEditCardModalMode = "";
            scope.card = {};
        };

        scope.update = function(card) {
            scope.updateFce({newCard: card});
            scope.showModal = false;
            scope.addEditCardModalMode = "";
            scope.card = {};
        };

        scope.$watch('addEditCardModalMode', function(addEditCardModalMode) {
            if (addEditCardModalMode == "update") {
                IndexedDb.getById(IndexedDb.STORES.CARD_STORE, scope.updateId).then(function(data) {
                    scope.card = data;
                }, function(err) {
                    $window.alert(err);
                });
            }
        });
    }

    return {
        restrict: 'E',
        templateUrl: 'directives/addEditCardModalTemplate.html',
        scope: {
            addEditCardModalMode: '=',
            updateId: '=',
            addFce: '&',
            updateFce: '&',
            showModal: '='
        },
        link: link
    };
}]);



