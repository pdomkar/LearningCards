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
    function link(scope, element) {
        scope.cancel = function() {
            scope.showModal = false;
            scope.addEditCardModalMode = "";
            scope.card = {};
        };

        scope.showImages = function() {

            var pickImageActivity = new MozActivity({
                name: "pick",
                data: {
                    type: []
                }
            });

            pickImageActivity.onsuccess = function() {
                if (this.result.blob.type.indexOf("image") != -1) {
                    scope.card.urlOfFrontImg = window.URL.createObjectURL(this.result.blob);
                }

            };

            pickImageActivity.onerror = function() {
                alert("Cannot pick the image");
                console.log(this.result);
            };

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

        scope.removeFrontImg = function() {
            IndexedDb.getById(IndexedDb.STORES.CARD_STORE, scope.updateId).then(function(data) {
                data.urlOfFrontImg = '';
                IndexedDb.update(IndexedDb.STORES.CARD_STORE, data).then(function(dataIns) {
                    if (scope.addEditCardModalMode == "update") {
                        scope.card.urlOfFrontImg = '';
                    }
                }, function(err) {
                    $window.alert(err);
                 });
            }, function(err) {
                $window.alert(err);
            });
        };
        scope.removeBackImg = function() {
            IndexedDb.getById(IndexedDb.STORES.CARD_STORE, scope.updateId).then(function(data) {
                data.urlOfBackImg = '';
                IndexedDb.update(IndexedDb.STORES.CARD_STORE, data).then(function(dataIns) {
                    if (scope.addEditCardModalMode == "update") {
                        scope.card.urlOfBackImg = '';
                    }
                }, function(err) {
                    $window.alert(err);
                });
            }, function(err) {
                $window.alert(err);
            });
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

            var pomReverseSide = scope.filteredColl.reverseSide;
            delete scope.filteredColl.reverseSide;

            IndexedDb.add(IndexedDb.STORES.COLLECTION_STORE, scope.filteredColl).then(function(addedCollId) {
                IndexedDb.getGlobalSettings().then(function(response) {
                    response.id = addedCollId;
                    //add next attribute which aren't in globalSettings

                    IndexedDb.add(IndexedDb.STORES.COLLECTION_SETTINGS_STORE, response).then(function() {
                        //ok
                        //insert selected cards
                        var dataIdToAdded = [];
                        var i = 0;
                        $('input[name="filteredCards"]:checked').parent('label').parent('div.filterCollectionItem').each(function( ) {
                            dataIdToAdded.push($( this ).data('id'));
                        });

                        getAddNext();

                        function getAddNext() {
                            if (i<dataIdToAdded.length) {
                                IndexedDb.getById(IndexedDb.STORES.CARD_STORE, dataIdToAdded[i]).then(function(data) {
                                    delete data['id'];
                                    data.collectionId = addedCollId;
                                    data.collectionName = scope.filteredColl.name;
                                    data.lastShow = null;
                                    data.nextShow = moment("01-01-1970", "MM-DD-YYYY").toDate();
                                    data.interval = 0;
                                    data.ef = 2.5;
                                    data.numberOfIteration = 0;
                                    data.hidden = "false";

                                    if(pomReverseSide == 'true') {
                                        var pomFront = data.front;
                                        data.front = data.back;
                                        data.back = pomFront;
                                    }
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
}]).directive('addEditCollModal', ['IndexedDb', '$window', function(IndexedDb, $window) {
    function link(scope) {
        scope.cancel = function() {
            scope.showModal = false;
            scope.addEditCollModalMode = "";
            scope.coll = {};
        };

        scope.add = function(coll) {
            console.log(coll);
            console.log(coll.name.length);
            if(coll.name.length < 0 || coll.name.length > 50) {
                $window.alert("Fill name of collection");
            }
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
                IndexedDb.getById(IndexedDb.STORES.COLLECTION_STORE, parseInt(scope.updateId)).then(function(data) {
                    scope.coll = data;
                }, function(err) {
                    $window.alert(err);
                });
            }
        });

    }

    return {
        restrict: 'E',
        templateUrl: 'directives/addEditCollModalTemplate.html',
        scope: {
            addEditCollModalMode: '=',
            updateId: '=',
            addFce: '&',
            updateFce: '&',
            showModal: '='
        },
        link: link
    };
}]).directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                scope.$apply(function () {
                    scope.fileread = changeEvent.target.files[0].name;
                });
            });
            scope.$watch('fileread', function() {
                if(scope.fileread == '') {
                    element.val('');
                }
            });
        }
    }
}]);




