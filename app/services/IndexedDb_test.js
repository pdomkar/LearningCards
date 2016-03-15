'use strict';

describe('indexed db test', function () {
    beforeEach(module('IndexedDbServices'));

    var IndexedDb;
    var idbOpened;

    beforeEach(inject(function (_IndexedDb_) {
        IndexedDb = _IndexedDb_;
    }));

    beforeEach(function (done) {
        idbOpened = false;
        console.log(1);
        IndexedDb.open(false).then(function () {
            console.log(3);
            idbOpened = true;
            done();
        });
        console.log(2);
    });
    //
    //it('opens', function () {
    //    expect(idbOpened).toBe(true);
    //    console.log(4);
    //});



    //it('add item to store', function (done) {

        //console.log('4');
        //IndexedDb.findAll(IndexedDb.STORES.COLLECTION_STORE).then(function(value) {
        //    console.log('5');
        //    expect(value.length).toBe(0);
        //    done();
        //    console.log('6');
        //}, function(err) {
        //    console.log('7');
        //});
        //
        //console.log('8');
        //IndexedDb.add(IndexedDb.STORES.COLLECTION_STORE, {name: "AngličtinaTest", description: "baliček pro ajTest", hidden: "false"}).then(function(value) {
        //    console.log(9);
        //    done();
        //}, function(err) {
        //    done();
        //    console.log(10);
        //});
        //console.log(11);
        //IndexedDb.findAll(IndexedDb.STORES.COLLECTION_STORE).then(function(value) {
        //    console.log(12);
        //    expect(value.length).toBe(1);
        //    expect(value[0].name).toBe("AngličtinaTest");
        //    expect(value[0].description).toBe("baliček pro ajTest");
        //    done();
        //    console.log(13);
        //}, function(err) {
        //
        //});
        //console.log(14);


    //});


    //it('find all data from STORE', function () {
    //    IndexedDb.getById(IndexedDb.STORES.COLLECTION_STORE, 1).then(function (value) {
    //        console.log("df");
    //        expect(value.name).toBe("AnglfičtinaT");
    //    });
    //});


//    var idbOpened = false;
//    var IndexedDb, $rootScope;
//    var findAll = false;
//
//    beforeEach(module('IndexedDbServices'));
//
//    beforeEach(inject(function (_IndexedDb_, _$rootScope_) {
//        IndexedDb = _IndexedDb_;
//        $rootScope = _$rootScope_;
//    }));
//
//    beforeEach(function (done) {
//        IndexedDb.open().then(
//
//            function () {
//                idbOpened = true;
//            },
//
//            function () {
//                idbOpened = false;
//            })['finally'](done);
//
//        $rootScope.$digest();
//    });
//
//    it('checks if indexeddb is opened', function () {
//        expect(idbOpened).toBeTruthy();
//    });
//
//    it('checks if indexeddb is opened', function () {
//        IndexedDb.findAll().then(
//            function() {
//    findAll = true;
//            }, function() {
//findAll = true;
//            });
//        expect(findAll).toBeTruthy();
//    });
});
