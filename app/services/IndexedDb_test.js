'use strict';

describe('indexed db test', function () {
    var idbOpened = false;
    var IndexedDb, $rootScope;
    var findAll = false;

    beforeEach(module('IndexedDbServices'));

    beforeEach(inject(function (_IndexedDb_, _$rootScope_) {
        IndexedDb = _IndexedDb_;
        $rootScope = _$rootScope_;
    }));

    beforeEach(function (done) {
        IndexedDb.open().then(

            function () {
                idbOpened = true;
            },

            function () {
                idbOpened = false;
            })['finally'](done);

        $rootScope.$digest();
    });

    it('checks if indexeddb is opened', function () {
        expect(idbOpened).toBeTruthy();
    });

    it('checks if indexeddb is opened', function () {
        IndexedDb.findAll().then(
            function() {
    findAll = true;
            }, function() {
findAll = true;
            });
        expect(findAll).toBeTruthy();
    });
});
