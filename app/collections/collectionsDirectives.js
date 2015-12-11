'use strict';

var collectionsDirectives = angular.module('collectionsDirectives', []);

collectionsDirectives.directive('addEditCollModal', ['IndexedDb', '$window', function(IndexedDb, $window) {
    function link(scope) {
        scope.cancel = function() {
            scope.showModal = false;
            scope.addEditCollModalMode = "";
            scope.coll = {};
        };

        scope.add = function(coll) {
            scope.addFce({newColl: coll});
            scope.showModal = false;
            scope.addEditCollModalMode = "";
            scope.coll = {};
        };


        scope.update = function(coll) {
            scope.updateFce({newColl: coll});
            scope.showModal = false;
            scope.addEditCollModalMode = "";
            scope.coll = {};
        };


        scope.$watch('addEditCollModalMode', function(addEditCollModalMode) {
            if (addEditCollModalMode == "update") {
                IndexedDb.getById(IndexedDb.STORES.COLLECTION_STORE, scope.updateId).then(function(data) {
                    scope.coll = data;
                }, function(err) {
                    $window.alert(err);
                });
            }
        });

    }

    return {
        restrict: 'E',
        templateUrl: 'collections/addEditCollModalTemplate.html',
        scope: {
            addEditCollModalMode: '=',
            updateId: '=',
            addFce: '&',
            updateFce: '&',
            showModal: '='
        },
        link: link
    };
}]);


