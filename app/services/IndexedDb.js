'use strict';
/**
 * Created by Petr on 22. 11. 2015.
 */
angular.module('IndexedDbServices', ['ImportServices'])
    .config(['$provide', function ($provide) {
        $provide.constant('indexedDB', window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB);
    }])
    .service('IndexedDb',  ['$q', '$rootScope', 'indexedDB', 'ImportService', function($q, $rootScope, indexedDB, ImportService) {
        var service = this;
        var db;

        const COLLECTION_STORE = "collections";
        const CARD_STORE = "cards";
        const GLOBAL_SETTINGS_STORE = "settings";
        const COLLECTION_SETTINGS_STORE = "collection_settings";
        const STATISTICS_ANSWERS_STORE = "statistics_answers";
        service.STORES = {
            COLLECTION_STORE: COLLECTION_STORE,
            CARD_STORE: CARD_STORE,
            GLOBAL_SETTINGS_STORE: GLOBAL_SETTINGS_STORE,
            COLLECTION_SETTINGS_STORE: COLLECTION_SETTINGS_STORE,
            STATISTICS_ANSWERS_STORE: STATISTICS_ANSWERS_STORE
        };

        var initDataColls = ["initData/en-cs-1-1.json", "initData/en-cs-1-2.json", "initData/en-cs-1-3.json", "initData/en-cs-1-4.json", "initData/en-cs-1-5.json", "initData/en-cs-1-6.json", "initData/en-cs-2-0.json", "initData/en-cs-2-1.json", "initData/en-cs-2-2.json", "initData/en-cs-2-3.json", "initData/en-cs-2-4.json", "initData/en-cs-2-5.json", "initData/en-cs-2-6.json", "initData/en-cs-3-0.json", "initData/en-cs-3-1.json", "initData/en-cs-3-2.json", "initData/en-cs-3-3.json", "initData/en-cs-3-4.json", "initData/en-cs-3-5.json", "initData/en-cs-3-6.json", "initData/en-cs-3-7.json", "initData/en-cs-3-8.json", "initData/en-cs-4-0.json", "initData/en-cs-4-1.json", "initData/en-cs-4-2.json", "initData/en-cs-4-3.json", "initData/en-cs-4-4.json", "initData/en-cs-4-5.json", "initData/en-cs-4-6.json", "initData/en-cs-4-7.json", "initData/en-cs-4-8.json", "initData/en-cs-5-0.json", "initData/en-cs-5-1.json", "initData/en-cs-5-2.json", "initData/en-cs-5-3.json", "initData/en-cs-5-4.json", "initData/en-cs-5-5.json", "initData/en-cs-5-6.json", "initData/en-cs-5-7.json", "initData/en-cs-5-8.json"];

        service.open = function (init) {

            if(init === null || init === undefined) {
                init = true;
            }
            var deferred = $q.defer();
            var version = 1;
            var request = indexedDB.open("lCApp", version);

            request.onupgradeneeded = function (e) {
                db = e.target.result;

                e.target.transaction.onerror = indexedDB.onerror;

                if (db.objectStoreNames.contains(COLLECTION_STORE)) {
                    db.deleteObjectStore(COLLECTION_STORE);
                }

                var storeColl = db.createObjectStore(COLLECTION_STORE, {
                    keyPath: "id", autoIncrement: true
                });
                storeColl.createIndex("name", "name", {unique: true});
                storeColl.createIndex("description", "description", {unique: false});
                storeColl.createIndex("hidden", "hidden", {unique: false});


                if (db.objectStoreNames.contains(CARD_STORE)) {
                    db.deleteObjectStore(CARD_STORE);
                }

                var storeCard = db.createObjectStore(CARD_STORE, {
                    keyPath: "id", autoIncrement: true
                });
                storeCard.createIndex("front", "front", {unique: false});
                storeCard.createIndex("back", "back", {unique: false});
                storeCard.createIndex("urlOfFrontImg", "urlOfFrontImg", {unique: false});
                storeCard.createIndex("urlOfBackImg", "urlOfBackImg", {unique: false});
                storeCard.createIndex("collectionId", "collectionId", {unique: false});
                storeCard.createIndex("collectionName", "collectionName", {unique: false});
                storeCard.createIndex("lastShow", "lastShow", {unique: false});
                storeCard.createIndex("nextShow", "nextShow", {unique: false});
                storeCard.createIndex("interval", "interval", {unique: false});
                storeCard.createIndex("hidden", "hidden", {unique: false});
                storeCard.createIndex("dirty", "dirty", {unique: false});
                storeCard.createIndex("ef", "ef", {unique: false});
                storeCard.createIndex("numberOfIteration", "numberOfIteration", {unique: false});
                storeCard.createIndex('collectionId_hidden', ['collectionId', 'hidden'], {unique: false});
                storeCard.createIndex('collectionId_hidden_nextShow', ['collectionId', 'hidden', 'nextShow'], {unique: false});


                if (db.objectStoreNames.contains(GLOBAL_SETTINGS_STORE)) {
                    db.deleteObjectStore(GLOBAL_SETTINGS_STORE);
                }

                var storeSettings = db.createObjectStore(GLOBAL_SETTINGS_STORE, {
                    keyPath: "id"
                });
                storeSettings.createIndex("id", "id", {unique: true});
                storeSettings.createIndex("playVoiceText", "playVoiceText", {unique: false});
                storeSettings.createIndex("languageOfVoice", "languageOfVoice", {unique: false});
                storeSettings.createIndex("typeOfVoice", "typeOfVoice", {unique: false});
                storeSettings.createIndex("volumeOfVoice", "volumeOfVoice", {unique: false});
                storeSettings.createIndex("displayAnswer", "displayAnswer", {unique: false});
                storeSettings.createIndex("displayAnswerByRepeating", "displayAnswerByRepeating", {unique: false});
                storeSettings.createIndex("limitTAnswer", "limitTAnswer", {unique: false});
                storeSettings.createIndex("maximalAnswerTime", "maximalAnswerTime", {unique: false});
                storeSettings.createIndex("showAnswerTime", "showAnswerTime", {unique: false});
                storeSettings.createIndex("limitTAnswerByRepeating", "limitTAnswerByRepeating", {unique: false});
                storeSettings.createIndex("maximalAnswerTimeByRepeating", "maximalAnswerTimeByRepeating", {unique: false});
                storeSettings.createIndex("showAnswerTimeByRepeating", "showAnswerTimeByRepeating", {unique: false});
                storeSettings.createIndex("filteringCollections", "filteringCollections", {unique: false});
                storeSettings.createIndex("filteringCards", "filteringCards", {unique: false});

                if (db.objectStoreNames.contains(COLLECTION_SETTINGS_STORE)) {
                    db.deleteObjectStore(COLLECTION_SETTINGS_STORE);
                }

                var storeCollectionSettings = db.createObjectStore(COLLECTION_SETTINGS_STORE, {
                    keyPath: "id"
                });
                storeCollectionSettings.createIndex("id", "id", {unique: false});
                storeCollectionSettings.createIndex("playVoiceText", "playVoiceText", {unique: false});
                storeCollectionSettings.createIndex("languageOfVoice", "languageOfVoice", {unique: false});
                storeCollectionSettings.createIndex("typeOfVoice", "typeOfVoice", {unique: false});
                storeCollectionSettings.createIndex("volumeOfVoice", "volumeOfVoice", {unique: false});
                storeCollectionSettings.createIndex("displayAnswer", "displayAnswer", {unique: false});
                storeCollectionSettings.createIndex("displayAnswerByRepeating", "displayAnswerByRepeating", {unique: false});
                storeCollectionSettings.createIndex("limitTAnswer", "limitTAnswer", {unique: false});
                storeCollectionSettings.createIndex("maximalAnswerTime", "maximalAnswerTime", {unique: false});
                storeCollectionSettings.createIndex("showAnswerTime", "showAnswerTime", {unique: false});
                storeCollectionSettings.createIndex("limitTAnswerByRepeating", "limitTAnswerByRepeating", {unique: false});
                storeCollectionSettings.createIndex("maximalAnswerTimeByRepeating", "maximalAnswerTimeByRepeating", {unique: false});
                storeCollectionSettings.createIndex("showAnswerTimeByRepeating", "showAnswerTimeByRepeating", {unique: false});
                storeCollectionSettings.createIndex("filteringCards", "filteringCards", {unique: false});

                if (db.objectStoreNames.contains(STATISTICS_ANSWERS_STORE)) {
                    db.deleteObjectStore(STATISTICS_ANSWERS_STORE);
                }

                var storeStatisticsAnswers = db.createObjectStore(STATISTICS_ANSWERS_STORE, {
                    keyPath: "id", autoIncrement: true
                });
                storeStatisticsAnswers.createIndex("day", "day", {unique: false});
                storeStatisticsAnswers.createIndex("collectionId", "collectionId", {unique: false});
                storeStatisticsAnswers.createIndex("again", "again", {unique: false});
                storeStatisticsAnswers.createIndex("hard", "hard", {unique: false});
                storeStatisticsAnswers.createIndex("good", "good", {unique: false});
                storeStatisticsAnswers.createIndex("easy", "easy", {unique: false});
                storeStatisticsAnswers.createIndex('day_collectionId', ['day', 'collectionId'], {unique: false});

                if(init) {
                    //Insert default / Init data -------------------------------
                    var transaction = e.target.transaction;

                    // Store values in the newly created objectStore.
                    var collAddStore = transaction.objectStore("collections");
                    var cardAddStore = transaction.objectStore("cards");
                    var collectionSettingsAddStore = transaction.objectStore("collection_settings");
                    var settingsAddStore = transaction.objectStore("settings");
                    settingsAddStore.add({
                        id: 1,
                        playVoiceText: "true",
                        languageOfVoice: "en/en",
                        typeOfVoice: "f2",
                        volumeOfVoice: 100,
                        displayAnswer: "false",
                        displayAnswerByRepeating: "false",
                        limitTAnswer: "false",
                        maximalAnswerTime: 60,
                        showAnswerTime: "false",
                        limitTAnswerByRepeating: "false",
                        maximalAnswerTimeByRepeating: 60,
                        showAnswerTimeByRepeating: "false",
                        filteringCollections: "true",
                        filteringCards: "true"
                    });

                    service.storeColl(collAddStore,collectionSettingsAddStore,cardAddStore,initDataColls,0);
                }
            };

            request.onsuccess = function (e) {
                db = e.target.result;
                deferred.resolve();
                $rootScope.$apply();
            };

            request.onerror = function () {
                deferred.reject();
            };

            return deferred.promise;
        };

        service.storeColl = function(collAddStore, collectionSettingsAddStore, cardAddStore, initDataColls, pomI) {
            var unixStartDate = moment("01-01-1970", "MM-DD-YYYY").toDate();
            var initData = new ImportService(initDataColls[pomI]);

            try {
                initData.loadJson();

                var collStoreReq = collAddStore.add(initData.getCollection());
                collStoreReq.onsuccess = function (event) {
                    var collectionSettings = initData.getCollectionSettings();
                    collectionSettings.id = event.target.result;

                    var collSettingsStoreReq = collectionSettingsAddStore.add(collectionSettings);
                    collSettingsStoreReq.onsuccess = function (event) {
                        var cards = initData.getCollectionCards();
                        var cLength = cards.length;
                        for (var j = 0; j < cLength; j++) {
                            cards[j].nextShow = unixStartDate;
                            cards[j].collectionId = event.target.result;
                            cards[j].collectionName = initData.getCollection().name;
                            cardAddStore.add(cards[j]);

                            if ((j + 1 == cLength) && (initDataColls.length >= pomI + 2)) {
                                service.storeColl(collAddStore, collectionSettingsAddStore, cardAddStore, initDataColls, pomI + 1);
                            }
                        }
                    };
                    collSettingsStoreReq.onerror = function (event) {
                        console.log(event);
                    };
                };
                collStoreReq.onerror = function (event) {
                    console.log(event);
                    if ((initDataColls.length >= pomI + 2)) {
                        service.storeColl(collAddStore, collectionSettingsAddStore, cardAddStore, initDataColls, pomI + 1);
                    }
                };
            } catch(err) {
                console.log(err);
                if ((initDataColls.length >= pomI + 2)) {
                    service.storeColl(collAddStore, collectionSettingsAddStore, cardAddStore, initDataColls, pomI + 1);
                }
            }
        };



        service.findAll = function (store) {
            var deferred = $q.defer();
            if (store === null || store === undefined) {
                deferred.reject("Name of store canot be null or undefined");
            } else if (db === null || db === undefined) {
                console.log("IndexDB is not opened yet!");
            } else {
                var trans = db.transaction([store]);
                var store = trans.objectStore(store);
                var data = [];

                // Get everything in the store;
                var keyRange = IDBKeyRange.lowerBound(0);
                var cursorRequest = store.openCursor(keyRange);

                cursorRequest.onsuccess = function (e) {
                    var result = e.target.result;
                    if (result === null || result === undefined) {
                        deferred.resolve(data);
                        $rootScope.$apply();
                    }
                    else {
                        data.push(result.value);
                        result.continue();
                    }
                };

                cursorRequest.onerror = function (e) {
                    console.log(e.value);
                    deferred.reject("Something went wrong!!!");
                };
            }

            return deferred.promise;
        };


        service.findByProperty = function (store, propertyName, value) {
            var deferred = $q.defer();
            if (propertyName === undefined || propertyName === null) {
                deferred.reject("propertyName can not be null");
            }
            if (value === undefined || value === null) {
                deferred.reject("value can not be null");
            }
            if (store === null || store === undefined) {
                deferred.reject("Name of store canot be null or undefined");
            } else if (db === null || db === undefined) {
                console.log("IndexDB is not opened yet!");
            } else {
                var trans = db.transaction([store]);
                var store = trans.objectStore(store);
                var myIndex = store.index(propertyName);
                var data = [];

                var cursorRequest = myIndex.openCursor(IDBKeyRange.only(value));
                cursorRequest.onsuccess = function (e) {

                    var cursor = e.target.result;
                    if (cursor === null || cursor === undefined) {
                        deferred.resolve(data);
                        $rootScope.$apply();
                    }
                    else {
                        data.push(cursor.value);
                        cursor.continue();
                    }

                };

                cursorRequest.onerror = function (e) {
                    console.log(e.value);
                    deferred.reject("Something went wrong!!!");
                };
            }
            return deferred.promise;
        };

        service.findByProperties = function (store, propNameValuePairObj) {
            var deferred = $q.defer();
            var values = [];
            var indexName = '';
            for (var key in propNameValuePairObj) {
                if (propNameValuePairObj.hasOwnProperty(key)) {
                    indexName += key + '_';
                    values.push(propNameValuePairObj[key]);
                }
            }
            if (indexName.slice(-1) == "_") {
                indexName = indexName.slice(0, -1);
            }
            if (store === null || store === undefined) {
                deferred.reject("Name of store canot be null or undefined");
            } else if (db === null || db === undefined) {
                console.log("IndexDB is not opened yet!");
            } else {
                var trans = db.transaction([store]);
                var store = trans.objectStore(store);
                var myIndex = store.index(indexName);
                var data = [];

                var cursorRequest = myIndex.openCursor(IDBKeyRange.only(values));
                cursorRequest.onsuccess = function (e) {

                    var cursor = e.target.result;
                    if (cursor === null || cursor === undefined) {
                        deferred.resolve(data);
                        $rootScope.$apply();
                    }
                    else {
                        data.push(cursor.value);
                        cursor.continue();
                    }

                };

                cursorRequest.onerror = function (e) {
                    console.log(e.value);
                    deferred.reject("Something went wrong!!!");
                };
            }
            return deferred.promise;
        };

        service.findCardToStudy = function (collId) {
            collId = parseInt(collId);
            var deferred = $q.defer();
            var endOfThisDay = moment();
            endOfThisDay.set({'hour': 23, 'minute': 59, 'second': 59});
            var upperBound = [collId, 'false', endOfThisDay.toDate()];
            var lowerBound = [collId, 'false', moment("01-01-1970", "MM-DD-YYYY").toDate()];
            var indexName = 'collectionId_hidden_nextShow';
            if (db === null || db === undefined) {
                console.log("IndexDB is not opened yet!");
            } else {
                var trans = db.transaction([service.STORES.CARD_STORE]);
                var store = trans.objectStore(service.STORES.CARD_STORE);
                var myIndex = store.index(indexName);
                var data = [];

                var cursorRequest = myIndex.openCursor(IDBKeyRange.bound(lowerBound, upperBound), "next");
                cursorRequest.onsuccess = function (e) {

                    var cursor = e.target.result;
                    if (cursor === null || cursor === undefined) {
                        deferred.resolve(data);
                        $rootScope.$apply();
                    }
                    else {
                        data.push(cursor.value);
                        cursor.continue();
                    }

                };

                cursorRequest.onerror = function (e) {
                    console.log(e.value);
                    deferred.reject("Something went wrong!!!");
                };
            }
            return deferred.promise;
        };

        service.getById = function (store, id) {
            var deferred = $q.defer();
            if (store === null || store === undefined) {
                deferred.reject("Name of store canot be null or undefined");
            } else if (id === undefined || id === null || id <= 0) {
                deferred.reject("ID can not be null, zero or negative.");
            }
            if (db === null || db === undefined) {
                console.log("IndexDB is not opened yet!");
            } else {
                var trans = db.transaction([store]);
                var store = trans.objectStore(store);
                var request = store.get(parseInt(id));
                request.onerror = function (e) {
                    console.log(e.value);
                    deferred.reject("Something went wrong!!!");
                };
                request.onsuccess = function (e) {
                    deferred.resolve(request.result);
                    $rootScope.$apply();
                }
            }
            return deferred.promise;
        };

        service.getGlobalSettings = function () {
            return service.getById(service.STORES.GLOBAL_SETTINGS_STORE, 1);
        };


        service.add = function (store, data) {
            var deferred = $q.defer();
            if (store === null || store === undefined) {
                deferred.reject("Name of store canot be null or undefined");
            } else if (db === null || db === undefined) {
                console.log("IndexDB is not opened yet!");
            } else {
                var trans = db.transaction([store], "readwrite");
                var store = trans.objectStore(store);
                var request = store.add(data);

                request.onsuccess = function (e) {
                    deferred.resolve(e.target.result);
                    $rootScope.$apply();
                };

                request.onerror = function (e) {
                    console.log(e);
                    if(e.srcElement.error.name == "ConstraintError") {
                        deferred.reject("Name of collection already exists. Please type another.");
                    } else {
                        deferred.reject("Something went wrong while adding new data.");
                    }
                };
            }

            return deferred.promise;
        };

        service.remove = function (store, id) {
            var deferred = $q.defer();
            if (store === null || store === undefined) {
                deferred.reject("Name of store canot be null or undefined");
            } else if (db === null || db === undefined) {
                console.log("IndexDB is not opened yet!");
            } else {
                var trans = db.transaction([store], "readwrite");
                var store = trans.objectStore(store);
                var request = store.delete(id);

                request.onsuccess = function (e) {
                    deferred.resolve();
                    $rootScope.$apply();
                };

                request.onerror = function (e) {
                    console.log(e);
                    deferred.reject("Something went wrong while deleting collection.");
                };

            }

            return deferred.promise;
        };

        service.removeBy = function (store, propertyName, value) {
            var deferred = $q.defer();
            if (propertyName === undefined || propertyName === null) {
                deferred.reject("propertyName can not be null");
            }
            if (value === undefined || value === null) {
                deferred.reject("value can not be null");
            }
            if (store === null || store === undefined) {
                deferred.reject("Name of store canot be null or undefined");
            } else if (db === null || db === undefined) {
                console.log("IndexDB is not opened yet!");
            } else {
                var trans = db.transaction([store], "readwrite");
                var store = trans.objectStore(store);
                var myIndex = store.index(propertyName);

                var cursorRequest = myIndex.openCursor(IDBKeyRange.only(value));
                cursorRequest.onsuccess = function (e) {
                    var cursor = e.target.result;
                    if (cursor === null || cursor === undefined) {
                        deferred.resolve();
                        $rootScope.$apply();
                    }
                    else {
                        cursor.delete();
                        cursor.continue();
                    }
                };

                cursorRequest.onerror = function (e) {
                    console.log(e.value);
                    deferred.reject("Something went wrong while deleting!!!");
                };
            }
            return deferred.promise;
        };

        service.update = function (store, item) {
            var deferred = $q.defer();
            if (store === null || store === undefined) {
                deferred.reject("Name of store canot be null or undefined");
            } else if (db === null || db === undefined) {
                console.log("IndexDB is not opened yet!");
            } else {
                var trans = db.transaction([store], "readwrite");
                var store = trans.objectStore(store);
                var request = store.get(item.id);
                request.onsuccess = function (e) {
                    var data = request.result;

                    for (var property in data) {
                        if (data.hasOwnProperty(property)) {
                            if (data[property] !== undefined) {
                                data[property] = item[property];
                            }
                        }
                    }

                    var requestUpdate = store.put(data);
                    requestUpdate.onerror = function (e) {
                        console.log(e);
                        deferred.reject("Something went wrong while updating collection.");
                    };
                    requestUpdate.onsuccess = function (e) {
                        deferred.resolve();
                        $rootScope.$apply();
                    };
                    $rootScope.$apply();
                };

                request.onerror = function (e) {
                    console.log(e);
                    deferred.reject("Something went wrong while geting collection in update.");
                };

            }

            return deferred.promise;
        };
    }]);
