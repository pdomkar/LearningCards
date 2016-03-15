'use strict';

describe('import test', function () {
    beforeEach(module('ImportServices'));

    var ImportService;
    var initData;
    var data = {
        "collection": {
            "name": "TestImportData",
            "description": "TestImportData desc",
            "hidden": "false"
        },
        "cards": [
            {
                "front": "Test1",
                "back": "Test1-1",
                "urlOfFrontImg": "",
                "urlOfBackImg": "",
                "collectionId": 1,
                "collectionName": "tt",
                "lastShow": null,
                "nextShow": "01-01-1970",
                "interval": 2,
                "hidden": "false",
                "dirty": "false",
                "ef": 2.5,
                "numberOfIteration": 1
            },
            {
                "front": "Test2",
                "back": "Test2",
                "urlOfFrontImg": "",
                "urlOfBackImg": "",
                "collectionId": 1,
                "collectionName": "tt",
                "lastShow": null,
                "nextShow": "01-01-1970",
                "interval": 2,
                "hidden": "false",
                "dirty": "false",
                "ef": 2.5,
                "numberOfIteration": 1
            }
        ],
        "settings": {
            "id": 1,
            "playVoiceText": "true",
            "languageOfVoice": "en/en",
            "typeOfVoice": "f2",
            "volumeOfVoice": 100,
            "displayAnswer": "false",
            "displayAnswerByRepeating": "false",
            "limitTAnswer": "false",
            "maximalAnswerTime": 60,
            "showAnswerTime": "false",
            "limitTAnswerByRepeating": "false",
            "maximalAnswerTimeByRepeating": 60,
            "showAnswerTimeByRepeating": "false",
            "filteringCards": "true"
        }
    };

    beforeEach(inject(function (_ImportService_) {
        ImportService = _ImportService_;
    }));

    beforeEach(function () {
        initData = new ImportService("./importTestData.json");
    });

    it('create init ImportService', function () {
        expect(initData).toBeDefined();
        expect(initData.getPath()).toBe("./importTestData.json");
    });

    it('get Path', function () {
        expect(initData.getPath()).toBe("./importTestData.json");
    });

    it('set another Path', function () {
        initData.setPath("another.json");
        expect(initData.getPath()).toBe("another.json");
    });

    //it('load Json from path', function () {
    //    //expect(initData.getJson()).toEqual({});
    //    //
    //    //initData.loadJson();
    //    //console.log(initData.getJson());
    //    //expect(initData.getJson()).not.toEqual({});
    //});

    it('getCollection', function () {
        initData.setJson(data);
        expect(initData.getCollection()).toEqual({
            name: 'TestImportData',
            description: 'TestImportData desc',
            hidden: 'false'
        });
    });
    it('getCollection invalid', function () {
        delete data.collection;
        initData.setJson(data);
        expect(initData.getCollection()).toBeNull();
    });

    it('getCards', function () {
        initData.setJson(data);
        expect(initData.getCollectionCards()).toEqual([{
            front: 'Test1',
            back: 'Test1-1',
            urlOfFrontImg: '',
            urlOfBackImg: '',
            collectionId: 1,
            collectionName: 'tt',
            lastShow: null,
            nextShow: '01-01-1970',
            interval: 2,
            hidden: 'false',
            dirty: 'false',
            ef: 2.5,
            numberOfIteration: 1
        }, {
            front: 'Test2',
            back: 'Test2',
            urlOfFrontImg: '',
            urlOfBackImg: '',
            collectionId: 1,
            collectionName: 'tt',
            lastShow: null,
            nextShow: '01-01-1970',
            interval: 2,
            hidden: 'false',
            dirty: 'false',
            ef: 2.5,
            numberOfIteration: 1
        }]);
    });
    it('getCards invalid', function () {
        delete data.cards;
        initData.setJson(data);
        expect(initData.getCollectionCards()).toEqual([]);
    });

    it('getSettings of collection', function () {
        initData.setJson(data);
        expect(initData.getCollectionSettings()).toEqual({
            id: 1,
            playVoiceText: 'true',
            languageOfVoice: 'en/en',
            typeOfVoice: 'f2',
            volumeOfVoice: 100,
            displayAnswer: 'false',
            displayAnswerByRepeating: 'false',
            limitTAnswer: 'false',
            maximalAnswerTime: 60,
            showAnswerTime: 'false',
            limitTAnswerByRepeating: 'false',
            maximalAnswerTimeByRepeating: 60,
            showAnswerTimeByRepeating: 'false',
            filteringCards: 'true'
        });
    });
    it('getSettings of collection invalid', function () {
        delete data.settings;
        initData.setJson(data);
        expect(initData.getCollectionSettings()).toEqual({
            id: 1,
            playVoiceText: 'true',
            languageOfVoice: 'en/en',
            typeOfVoice: 'f2',
            volumeOfVoice: 100,
            displayAnswer: 'false',
            displayAnswerByRepeating: 'false',
            limitTAnswer: 'false',
            maximalAnswerTime: 60,
            showAnswerTime: 'false',
            limitTAnswerByRepeating: 'false',
            maximalAnswerTimeByRepeating: 60,
            showAnswerTimeByRepeating: 'false',
            filteringCards: 'true'
        });
    });


});
