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

        scope.showImages = function() {
            var finder = new Applait.Finder({ type: "pictures", caseSensitive: false });
            finder.search("anikaja.jpg");
            finder.on("searchBegin", function (needle) {
                console.log("sdf");
            });
            finder.on("fileFound", function (file, fileinfo, storageName) {
                console.log("Found file " + fileinfo.name + " at " + fileinfo.path + " in " + storageName, file);
            });



                var sdcard = navigator.getDeviceStorage('sdcard');

                var request = sdcard.usedSpace();
                request.onsuccess = function () {
                    // The result is expressed in bytes, let's turn it into Gigabytes
                    var size = this.result / Math.pow(10,9);

                    console.log("The files on your SDCard take " + size.toFixed(2) + "GB of space.");
                };
                request.onerror = function () {
                    console.warn("Unable to get the space used by the SDCard: " + this.error.name);
                };

                // Let's retrieve files from last week.
                var param = {
                    since: new Date((new Date()) - 12*4*7*24*60*60*1000)
                };

                var cursor = sdcard.enumerate();

                cursor.onsuccess = function () {

                    if (this.result) {
                        var file = this.result;
                        console.log("File updated on: " + file.name);

                        // Once we found a file we check if there are other results
                        // Then we move to the next result, which calls the cursor
                        // success possibly with the next file as result.
                        this.continue();
                    } else {
                        console.log("nothing");
                    }
                };

            //var request = pics.get("December_2015_1920x1080.jpg");
            //request.onsuccess = function () {
            //    var file = this.result;
            //    console.log("Get the file: " + file.name);
            //}
            //
            //request.onerror = function () {
            //    console.warn("Unable to get the file: " + this.error);
            //}

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
                                    data.collectionName = scope.filteredColl.name;
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
}]).directive('collectionUnique', ['IndexedDb', '$window', function(IndexedDb, $window) {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$validators.unique =
                function(modelValue, viewValue) {
                    scope.a = {
                        val: "aaa",
                        setValue: function(v) {
                            this.val = v;
                        },
                        getValue: function() {
                            return this.val;
                        }
                    };
                    if(viewValue === undefined || viewValue === null) { viewValue = ""}
                    var askForPromise =  IndexedDb.findByProperty(IndexedDb.STORES.COLLECTION_STORE, "name", viewValue);
                    askForPromise.then(function (data) {
                                console.log(scope.a.val);
                                scope.a.setValue(data.length);
                        console.log(scope.a.getValue());
                            }, function (err) {
                                $window.alert(err);
                            });
                    //dont workkkk TODO
                    return true;
                };
        }
    };
}]);




