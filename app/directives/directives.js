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
}]).directive('filteredNewCollModal', ['IndexedDb', '$window', '$location', function(IndexedDb, $window, $location) {
    function link(scope) {
        scope.cards = [];
        scope.checkAll = false;

        scope.cancel = function() {
            scope.showFilteredNewCollModal = false;
        };

        scope.create = function() {
            scope.filteredColl.hidden = "false";

            IndexedDb.add(IndexedDb.STORES.COLLECTION_STORE, scope.filteredColl).then(function(addedCollId) {
                IndexedDb.getGlobalSettings().then(function(response) {
                    response.id = addedCollId;
                    //add next attribute which aren't in globalSettings

                    IndexedDb.add(IndexedDb.STORES.COLLECTION_SETTINGS_STORE, response).then(function() {
                        //ok
                        //insert selected cards
                        var dataIdToAdded = [];
                        var i = 0;
                        $('input[name="filteredCards"]:checked').parent('li').each(function( ) {
                            dataIdToAdded.push($( this ).data('id'));
                        });

                        getAddNext();

                        function getAddNext() {
                            if (i<dataIdToAdded.length) {
                                IndexedDb.getById(IndexedDb.STORES.CARD_STORE, dataIdToAdded[i]).then(function(data) {
                                    delete data['id'];
                                    data.collectionId = addedCollId;
                                    data.lastShow = null;
                                    data.nextShow = moment("01-01-1970", "MM-DD-YYYY").toDate();
                                    data.interval = 0;
                                    data.ef = 2.5;
                                    data.numberOfIteration = 0;
                                    data.hidden = "false";
                                    IndexedDb.add(IndexedDb.STORES.CARD_STORE, data).then(function(addedId) {
                                        console.log("added" + addedId);
                                        getAddNext();
                                    }, function(err) {
                                        $window.alert(err);
                                    });
                                }, function(err) {
                                    $window.alert(err);
                                });
                                ++i;
                            } else {   // complete
                                console.log('all data added');
                                $location.path('/collections/' + addedCollId);
                            }
                        }

                    }, function(err) {
                        $window.alert(err);
                    });
                }, function(err) {
                    $window.alert(err);
                });
            }, function(err) {
                $window.alert(err);
            });
            scope.showFilteredNewCollModal = false;
        };

        scope.selectDeselectAll = function(checkAll) {
            $('input[name="filteredCards"]').prop('checked', checkAll);
        };

        scope.$watch('showFilteredNewCollModal', function(showFilteredNewCollModal) {
            if (showFilteredNewCollModal == true) {
                scope.filteredColl = {};
                scope.checkAll = false;
                if(scope.collId == null) {
                    IndexedDb.findAll(IndexedDb.STORES.CARD_STORE).then(function(data) {
                        scope.cards = data;
                    }, function(err) {
                        $window.alert(err);
                    });
                } else {
                    IndexedDb.findByProperty(IndexedDb.STORES.CARD_STORE, "collectionId",  parseInt(scope.collId)).then(function(data) {
                        scope.cards = data;
                    }, function(err) {
                        $window.alert(err);
                    });
                }
            }
        });
    }

    return {
        restrict: 'E',
        templateUrl: 'directives/filteredNewCollModalTemplate.html',
        scope: {
            collId: '=',
            showFilteredNewCollModal: '='
        },
        link: link
    };
}]);



