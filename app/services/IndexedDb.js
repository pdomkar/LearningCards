'use strict';
/**
 * Created by Petr on 22. 11. 2015.
 */
var IndexedDbServices = angular.module('IndexedDbServices', []);

IndexedDbServices.factory('IndexedDb', ['$window', '$q', '$rootScope', function($window, $q, $rootScope){
    var indexedDB = $window.indexedDB;
    var db=null;
    const COLLECTION_STORE = "collections";
    const CARD_STORE = "cards";
    const GLOBAL_SETTINGS_STORE = "settings";
    const COLLECTION_SETTINGS_STORE = "collection_settings";
    const STORES = {
        COLLECTION_STORE: COLLECTION_STORE,
        CARD_STORE: CARD_STORE,
        GLOBAL_SETTINGS_STORE: GLOBAL_SETTINGS_STORE,
        COLLECTION_SETTINGS_STORE: COLLECTION_SETTINGS_STORE
    };

    var open = function() {
        var deferred = $q.defer();
        var version = 1;
        var request = indexedDB.open("lCApp", version);

        request.onupgradeneeded = function(e) {
            db = e.target.result;

            e.target.transaction.onerror = indexedDB.onerror;

            if(db.objectStoreNames.contains("collections")) {
                db.deleteObjectStore("collections");
            }



            var storeColl = db.createObjectStore("collections", {
                keyPath: "id", autoIncrement : true
            });
            storeColl.createIndex("name", "name", { unique: true });
            storeColl.createIndex("description", "description", { unique: false });
            storeColl.createIndex("hidden", "hidden", { unique: false });


            if(db.objectStoreNames.contains("cards")) {
                db.deleteObjectStore("cards");
            }

            var storeCard = db.createObjectStore("cards", {
                keyPath: "id", autoIncrement : true
            });
            storeCard.createIndex("front", "front", { unique: false });
            storeCard.createIndex("back", "back", { unique: false });
            storeCard.createIndex("urlOfImgFront", "urlOfImgFront", { unique: false });
            storeCard.createIndex("collectionId", "collectionId", { unique: false });
            storeCard.createIndex("lastShow", "lastShow", { unique: false });
            storeCard.createIndex("nextShow", "nextShow", { unique: false });
            storeCard.createIndex("interval", "interval", { unique: false });
            storeCard.createIndex("hidden", "hidden", { unique: false });
            storeCard.createIndex("ef", "ef", { unique: false});
            storeCard.createIndex("numberOfIteration", "numberOfIteration", { unique: false});
            storeCard.createIndex('collectionId_hidden', ['collectionId','hidden'], { unique: false });
            storeCard.createIndex('collectionId_hidden_nextShow', ['collectionId','hidden', 'nextShow'], { unique: false });


            if(db.objectStoreNames.contains("settings")) {
                db.deleteObjectStore("settings");
            }

            var storeSettings = db.createObjectStore("settings", {
                keyPath: "id"
            });
            storeSettings.createIndex("id", "id", { unique: true });
            storeSettings.createIndex("playVoiceText", "playVoiceText", { unique: false });
            storeSettings.createIndex("languageOfVoice", "languageOfVoice", { unique: false });
            storeSettings.createIndex("typeOfVoice", "typeOfVoice", { unique: false });
            storeSettings.createIndex("volumeOfVoice", "volumeOfVoice", {unique: false});

            if(db.objectStoreNames.contains("collection_settings")) {
                db.deleteObjectStore("collection_settings");
            }

            var storeCollectionSettings = db.createObjectStore("collection_settings", {
                keyPath: "id"
            });
            storeCollectionSettings.createIndex("id", "id", { unique: false });
            storeCollectionSettings.createIndex("playVoiceText", "playVoiceText", { unique: false });
            storeCollectionSettings.createIndex("languageOfVoice", "languageOfVoice", { unique: false });
            storeCollectionSettings.createIndex("typeOfVoice", "typeOfVoice", { unique: false });
            storeCollectionSettings.createIndex("volumeOfVoice", "volumeOfVoice", {unique: false});



            var transaction = e.target.transaction;

            // Store values in the newly created objectStore.
            var collAddStore = transaction.objectStore("collections");
            collAddStore.add({name: "Angličtina", description: "baliček pro aj", hidden: "false"});
            collAddStore.add({name: "Němčina", description: "baliček pro nemcina", hidden: "false"});
            collAddStore.add({name: "Francouzština", description: "baliček pro fr", hidden: "false"});
            collAddStore.add({name: "Španělština", description: "baliček pro šp", hidden: "false"});
            collAddStore.add({name: "Norština", description: "baliček pro norštinu", hidden: "false"});
            collAddStore.add({name: "Znaková řeč", description: "baliček pro znakovou řeč", hidden: "false"});

            //Store values in the newly created objectStore.
            var cardAddStore = transaction.objectStore("cards");
            var unixStartDate = moment("01-01-1970", "MM-DD-YYYY").toDate();
            cardAddStore.add({front: "dog", back: "pes", urlOfImgFront: null, collectionId: 1, lastShow: null, nextShow: unixStartDate, interval: 0, hidden: "false", ef: 2.5, numberOfIteration: 0});
            cardAddStore.add({front: "cat", back: "kočka", urlOfImgFront: null, collectionId: 1, lastShow: moment("11-20-2015", "MM-DD-YYYY").toDate(), nextShow: moment("12-10-2015", "MM-DD-YYYY").toDate(), interval: 16, hidden: "false", ef: 2.7, numberOfIteration: 3});
            cardAddStore.add({front: "parrot", back: "papoušek", urlOfImgFront: null, collectionId: 1, lastShow: null, nextShow: unixStartDate, interval: 0, hidden: "false", ef: 2.5, numberOfIteration: 0});
            cardAddStore.add({front: "cow", back: "kráva", urlOfImgFront: null, collectionId: 1, lastShow: null, nextShow: unixStartDate, interval: 0, hidden: "false", ef: 2.5, numberOfIteration: 0});
            cardAddStore.add({front: "rabbit", back: "králík", urlOfImgFront: null, collectionId: 1, lastShow: null, nextShow: unixStartDate, interval: 0, hidden: "false", ef: 2.5, numberOfIteration: 0});
            cardAddStore.add({front: "girrafe", back: "žirafa", urlOfImgFront: null, collectionId: 1, lastShow: null, nextShow: unixStartDate, interval: 0, hidden: "false", ef: 2.5, numberOfIteration: 0});
            cardAddStore.add({front: "snake", back: "had", urlOfImgFront: null, collectionId: 1, lastShow: moment("12-03-2015", "MM-DD-YYYY").toDate(), nextShow: moment("12-10-2015", "MM-DD-YYYY").toDate(), interval: 6, hidden: "false", ef: 2.6, numberOfIteration: 2});
            cardAddStore.add({front: "žítlaza", back: "zizta", urlOfImgFront: null, collectionId: 1, lastShow: null, nextShow: unixStartDate, interval: 2, hidden: "false", ef: 2.5, numberOfIteration: 1});
            cardAddStore.add({front: "kocka", back: "kočka", urlOfImgFront: null, collectionId: 2, lastShow: null, nextShow: unixStartDate, interval: 0, hidden: "false", ef: 2.5, numberOfIteration: 0});

            //Store values in the newly created objectStore.
            var settingsAddStore = transaction.objectStore("settings");
            settingsAddStore.add({id: 1, playVoiceText: "true", languageOfVoice: "en/en", typeOfVoice: "f2", volumeOfVoice: 100});

            //Store values in the newly created objectStore.
            var collectionSettingsAddStore = transaction.objectStore("collection_settings");
            collectionSettingsAddStore.add({id: 1, playVoiceText: "true", languageOfVoice: "en/en", typeOfVoice: "f2", volumeOfVoice: 100});
            collectionSettingsAddStore.add({id: 2, playVoiceText: "true", languageOfVoice: "en/en", typeOfVoice: "f2", volumeOfVoice: 100});
            collectionSettingsAddStore.add({id: 3, playVoiceText: "true", languageOfVoice: "en/en", typeOfVoice: "f2", volumeOfVoice: 100});
            collectionSettingsAddStore.add({id: 4, playVoiceText: "true", languageOfVoice: "en/en", typeOfVoice: "f2", volumeOfVoice: 100});
            collectionSettingsAddStore.add({id: 5, playVoiceText: "true", languageOfVoice: "en/en", typeOfVoice: "f2", volumeOfVoice: 100});
            collectionSettingsAddStore.add({id: 6, playVoiceText: "true", languageOfVoice: "en/en", typeOfVoice: "f2", volumeOfVoice: 100});



        };

        request.onsuccess = function(e) {
            db = e.target.result;
            deferred.resolve();
            $rootScope.$digest();
        };

        request.onerror = function(){
            deferred.reject();
        };

        return deferred.promise;
    };


    var findAll = function(store) {
        var deferred = $q.defer();
        if(store === null || store === undefined) {
            deferred.reject("Name of store canot be null or undefined");
        }else if(db === null || db === undefined) {
            deferred.reject("IndexDB is not opened yet!");
        } else{
            var trans = db.transaction([store]);
            var store = trans.objectStore(store);
            var data = [];

            // Get everything in the store;
            var keyRange = IDBKeyRange.lowerBound(0);
            var cursorRequest = store.openCursor(keyRange);

            cursorRequest.onsuccess = function(e) {
                var result = e.target.result;
                if(result === null || result === undefined)
                {
                    deferred.resolve(data);
                }
                else{
                    data.push(result.value);
                    result.continue();
                }
            };

            cursorRequest.onerror = function(e){
                console.log(e.value);
                deferred.reject("Something went wrong!!!");
            };
        }

        return deferred.promise;
    };


    var findByProperty = function(store, propertyName, value) {
        var deferred = $q.defer();
        if (propertyName === undefined || propertyName === null) {
            deferred.reject("propertyName can not be null");
        }
        if (value === undefined || value === null) {
            deferred.reject("value can not be null");
        }
        if(store === null || store === undefined) {
            deferred.reject("Name of store canot be null or undefined");
        }else if(db === null || db === undefined) {
            deferred.reject("IndexDB is not opened yet!");
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

    var findByProperies = function(store, propNameValuePairObj) {
        var deferred = $q.defer();
        var values = [];
        var indexName = '';
        for (var key in propNameValuePairObj) {
            if (propNameValuePairObj.hasOwnProperty(key)) {
                indexName += key+'_';
                values.push(propNameValuePairObj[key]);
            }
        }
        if(indexName.slice(-1) == "_") {
            indexName = indexName.slice(0, -1);
        }
        if(store === null || store === undefined) {
            deferred.reject("Name of store canot be null or undefined");
        }else if(db === null || db === undefined) {
            deferred.reject("IndexDB is not opened yet!");
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

    var findCardToStudy = function(collId) {
        collId = parseInt(collId);
        var deferred = $q.defer();
        var endOfThisDay = moment();
        endOfThisDay.set({'hour': 23, 'minute': 59, 'second': 59});
        var upperBound = [collId, 'false', endOfThisDay.toDate()];
        var lowerBound = [collId, 'false', moment("01-01-1970", "MM-DD-YYYY").toDate()];
        var indexName = 'collectionId_hidden_nextShow';
       if(db === null || db === undefined) {
            deferred.reject("IndexDB is not opened yet!");
        } else {
            var trans = db.transaction([STORES.CARD_STORE]);
            var store = trans.objectStore(STORES.CARD_STORE);
            var myIndex = store.index(indexName);
            var data = [];

            var cursorRequest = myIndex.openCursor(IDBKeyRange.bound(lowerBound,upperBound), "next");
            cursorRequest.onsuccess = function (e) {

                var cursor = e.target.result;
                if (cursor === null || cursor === undefined) {
                    deferred.resolve(data);
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

    var getById = function(store, id) {
        var deferred = $q.defer();
        if(store === null || store === undefined) {
            deferred.reject("Name of store canot be null or undefined");
        }else if(id === undefined || id === null || id <= 0) {
            deferred.reject("ID can not be null, zero or negative.");
        }
        if(db === null || db === undefined) {
            deferred.reject("IndexDB is not opened yet!");
        } else{
            var trans = db.transaction([store]);
            var store = trans.objectStore(store);
            var request = store.get(parseInt(id));
            request.onerror = function(e) {
                console.log(e.value);
                deferred.reject("Something went wrong!!!");
            };
            request.onsuccess = function(e) {
                deferred.resolve(request.result);
            }
        }
        return deferred.promise;
    };

    var getGlobalSettings = function() {
      return getById(STORES.GLOBAL_SETTINGS_STORE, 1);
    };


    var add = function(store, collection) {

        //KOntrola vstupnich dat

        var deferred = $q.defer();
        if(store === null || store === undefined) {
            deferred.reject("Name of store canot be null or undefined");
        }else if(db === null || db === undefined) {
            deferred.reject("IndexDB is not opened yet!");
        } else {
            var trans = db.transaction([store], "readwrite");
            var store = trans.objectStore(store);
            var request = store.add(collection);

            request.onsuccess = function(e) {
                deferred.resolve(e.target.result);
            };

            request.onerror = function(e) {
                console.log(e);
                deferred.reject("Something went wrong while adding new collection.");
            };
        }

        return deferred.promise;
    };

    var remove = function(store, id) {
        var deferred = $q.defer();
        if(store === null || store === undefined) {
            deferred.reject("Name of store canot be null or undefined");
        }else if(db === null || db === undefined) {
            deferred.reject("IndexDB is not opened yet!");
        } else {
            var trans = db.transaction([store], "readwrite");
            var store = trans.objectStore(store);
            var request = store.delete(id);

            request.onsuccess = function(e) {
                deferred.resolve();
            };

            request.onerror = function(e) {
                console.log(e);
                deferred.reject("Something went wrong while deleting collection.");
            };

        }

        return deferred.promise;
    };

    var removeBy = function(store, propertyName, value) {
        var deferred = $q.defer();
        if (propertyName === undefined || propertyName === null) {
            deferred.reject("propertyName can not be null");
        }
        if (value === undefined || value === null) {
            deferred.reject("value can not be null");
        }
        if(store === null || store === undefined) {
            deferred.reject("Name of store canot be null or undefined");
        }else if(db === null || db === undefined) {
            deferred.reject("IndexDB is not opened yet!");
        } else {
            var trans = db.transaction([store], "readwrite");
            var store = trans.objectStore(store);
            var myIndex = store.index(propertyName);

            var cursorRequest = myIndex.openCursor(IDBKeyRange.only(value));
            cursorRequest.onsuccess = function (e) {
                var cursor = e.target.result;
                if (cursor === null || cursor === undefined) {
                    deferred.resolve();
                }
                else {
                    cursor.delete();
                    cursor.continue();
                }
            };

            cursorRequest.onerror = function(e) {
                console.log(e.value);
                deferred.reject("Something went wrong while deleting!!!");
            };
        }
        return deferred.promise;
    };

    var update = function(store, item) {
        var deferred = $q.defer();
        if(store === null || store === undefined) {
            deferred.reject("Name of store canot be null or undefined");
        }else if(db === null || db === undefined) {
            deferred.reject("IndexDB is not opened yet!");
        } else {
            var trans = db.transaction([store], "readwrite");
            var store = trans.objectStore(store);
            var request = store.get(item.id);
            request.onsuccess = function(e) {
                var data = request.result;

                for (var property in data) {
                    if (data.hasOwnProperty(property)) {
                        if (data[property] !== undefined) {
                            data[property] = item[property];
                        }
                    }
                }

                var requestUpdate = store.put(data);
                requestUpdate.onerror = function(e) {
                    console.log(e);
                    deferred.reject("Something went wrong while updating collection.");
                };
                requestUpdate.onsuccess = function(e) {
                    deferred.resolve();
                };
            };

            request.onerror = function(e) {
                console.log(e);
                deferred.reject("Something went wrong while geting collection in update.");
            };

        }

        return deferred.promise;
    };


    return {
        open: open,
        add: add,
        update: update,
        remove: remove,
        removeBy: removeBy,
        findAll: findAll,
        findByProperty: findByProperty,
        findByProperties: findByProperies,
        findCardToStudy: findCardToStudy,
        getById: getById,
        getGlobalSettings: getGlobalSettings,
        STORES: STORES
    };
}]);
