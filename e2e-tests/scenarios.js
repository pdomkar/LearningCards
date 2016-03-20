'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('my app', function () {
    beforeEach(function() {
        browser.get('index.html');
    });


    describe('load App and go to first collection detail', function () {
        it('load App', function () {
            expect(browser.getCurrentUrl()).toMatch(/collections/);
            expect(element(by.tagName("h1")).getText()).toEqual("Collections");
        });

        it('go to first collection detail', function () {
            waitForElement(element(by.css('.collectionRow')));
            var collRow = element(by.css('.collectionRow b'));
            var text = collRow.getText();
            collRow.click();

            expect(browser.getCurrentUrl()).toMatch(/collections\/1/);
            expect(element(by.tagName("h1")).getText()).toEqual(text);
        });
    });

    describe('test top button on collection list page', function() {
       it('show menu', function() {
           waitForElement(element(by.css('i[data-icon="effects"]')));
           element(by.css('span.icon.icon-menu')).click();
           browser.driver.sleep(1000);
           expect(element(by.cssContainingText('h1', 'Menu')).isDisplayed()).toBe(true);
           expect(element(by.cssContainingText('a', 'Display hidden collection')).isDisplayed()).toBe(true);
           expect(element(by.cssContainingText('a', 'Display all cards')).isDisplayed()).toBe(true);
           expect(element(by.cssContainingText('a', 'Create filtered collection')).isDisplayed()).toBe(true);
           expect(element(by.cssContainingText('a', 'Settings')).isDisplayed()).toBe(true);
           expect(element(by.cssContainingText('a', 'Statistics')).isDisplayed()).toBe(true);
       });

        it('add new collection', function() {
            waitForElement(element(by.css('span.icon.icon-add')));
            element(by.css('span.icon.icon-add')).click();

            expect(element(by.cssContainingText('h1', 'Add collection')).isDisplayed()).toBe(true);

            waitForElement(element(by.cssContainingText('button', 'Add')));
            expect(element(by.cssContainingText('button', 'Add')).getAttribute('disabled')).toEqual('true');

            waitForElement(element(by.model('coll.name')));
            element(by.model('coll.name')).clear().sendKeys('InsertedTestOne');
            waitForElement(element(by.model('coll.description')));
            element(by.model('coll.description')).clear().sendKeys('InsertedTestOne Description');

            expect(element(by.cssContainingText('button', 'Add')).getAttribute('disabled')).toBe(null);
            element(by.cssContainingText('button', 'Add')).click();

            waitForElement(element(by.cssContainingText('div.collectionRow b', 'InsertedTestOne')));
            expect(element(by.cssContainingText('div.collectionRow b', 'InsertedTestOne')).isDisplayed()).toBe(true);
            expect(element(by.cssContainingText('div.collectionRow span', 'InsertedTestOne Description')).isDisplayed()).toBe(true);
        });
    });

    describe('Test posibilities in menu', function() {
        it('display all cards', function() {
            waitForElement(element(by.css('i[data-icon="effects"]')));
           element(by.css('span.icon.icon-menu')).click();
           browser.driver.sleep(1000);
           element(by.cssContainingText('a', 'Display all cards')).click();

            expect(browser.getCurrentUrl()).toMatch(/cards/);
            expect(element(by.cssContainingText('h1', 'Cards')).isDisplayed()).toBe(true);
            waitForElement(element(by.css('div.row.cardItem')));
            expect(element(by.css('div.row.cardItem')).isDisplayed()).toBe(true);
            element(by.css('span.icon.icon-back')).click();
            expect(browser.getCurrentUrl()).toMatch(/collections/);
        });

        it('create filtered collection from all collection', function() {
            waitForElement(element(by.css('i[data-icon="effects"]')));
               element(by.css('span.icon.icon-menu')).click();
               browser.driver.sleep(1000);
               element(by.cssContainingText('a', 'Create filtered collection')).click();

                waitForElement(element(by.cssContainingText('h1', 'Create new collection from cards')));
                expect(element(by.cssContainingText('h1', 'Create new collection from cards')).isDisplayed()).toBe(true);

                waitForElement(element(by.model('filteredColl.name')));
                waitForElement(element(by.model('filteredColl.description')));
                element(by.model('filteredColl.name')).clear().sendKeys('Filtered coll');
                element(by.model('filteredColl.description')).clear().sendKeys('Filtered coll description');
                element(by.cssContainingText('button', 'Create')).click();
                waitForElement(element(by.cssContainingText('h1', 'Filtered coll')));
        });

        it('display settings', function() {
            waitForElement(element(by.css('i[data-icon="effects"]')));
            element(by.css('span.icon.icon-menu')).click();
            browser.driver.sleep(1000);
            element(by.cssContainingText('a', 'Settings')).click();

            expect(browser.getCurrentUrl()).toMatch(/settings/);
            expect(element(by.cssContainingText('h1', 'Settings')).isDisplayed()).toBe(true);
            expect(element(by.cssContainingText('label', 'Language of voice:')).isDisplayed()).toBe(true);

            waitForElement(element(by.model('settings.playVoiceText')));
            element(by.model('settings.playVoiceText')).element(by.xpath('ancestor::label')).click();
            expect(element(by.cssContainingText('label', 'Language of voice:')).isDisplayed()).toBe(false);
            browser.get('index.html#/settings/');
            expect(element(by.cssContainingText('label', 'Language of voice:')).isDisplayed()).toBe(false);
            element(by.css('span.icon.icon-back')).click();
            expect(browser.getCurrentUrl()).toMatch(/collections/);
        });

        it('display statistics', function() {
            waitForElement(element(by.css('i[data-icon="effects"]')));
            element(by.css('span.icon.icon-menu')).click();
            browser.driver.sleep(1000);
            element(by.cssContainingText('a', 'Statistics')).click();

            expect(browser.getCurrentUrl()).toMatch(/statistics/);
            expect(element(by.cssContainingText('h1', 'Statistics')).isDisplayed()).toBe(true);

            element(by.css('span.icon.icon-back')).click();
            expect(browser.getCurrentUrl()).toMatch(/collections/);
        });
    });

    describe('Testing buttons on collection list - Edit, Hide, Delete', function () {
        it('hide first collection and go to hidden collection and restore collection', function () {
            waitForElement(element(by.css('i[data-icon="effects"]')));
            element.all(by.css('i[data-icon="effects"]')).count().then(function(amount) {
                element(by.css('i[data-icon="effects"]')).click();
                var allWithoutOne = element.all(by.css('i[data-icon="effects"]'));
                expect(allWithoutOne.count()).toEqual(amount-1);
            });

            element(by.css('span.icon.icon-menu')).click();
            browser.driver.sleep(1000);
            element(by.cssContainingText('a', 'Display hidden collection')).click();
            expect(browser.getCurrentUrl()).toMatch(/collections\/hidden/);

            waitForElement(element(by.css('i[data-icon="reload"]')));
            element.all(by.css('i[data-icon="reload"]')).count().then(function(amount) {
                element(by.css('i[data-icon="reload"]')).click();
                var allWithoutOne = element.all(by.css('i[data-icon="reload"]'));
                expect(allWithoutOne.count()).toEqual(amount-1);
            });

            element(by.css('span.icon.icon-back')).click();
            expect(browser.getCurrentUrl()).toMatch(/collections/);
        });

        it('edit collection', function() {
            waitForElement(element(by.css('i[data-icon="compose"]')));
            element(by.css('i[data-icon="compose"]')).click();

            waitForElement(element(by.model('coll.name')));
            element(by.model('coll.name')).clear().sendKeys('English - Czech - Edit');
            waitForElement(element(by.model('coll.description')));
            element(by.model('coll.description')).clear().sendKeys('English - Czech - Description of edit collection');

            waitForElement(element(by.cssContainingText('button', 'Edit')));
            element(by.cssContainingText('button', 'Edit')).click();

            expect(element(by.css('div.collectionRow b')).getText()).toBe("English - Czech - Edit");
            expect(element(by.css('div.collectionRow span')).getText()).toBe("English - Czech - Description of edit collection");
        });

        it('delete collection', function() {
            waitForElement(element(by.css('i[data-icon="delete"]')));

            element.all(by.css('i[data-icon="delete"]')).count().then(function(amount) {
                element(by.css('i[data-icon="delete"]')).click();
                waitForElement(element(by.cssContainingText('button', 'Delete')));
                element(by.cssContainingText('button', 'Delete')).click();

                expect(element.all(by.css('i[data-icon="delete"]')).count()).toEqual(amount-1);
            });
        });
    });

    describe('Test fot detail of collection', function() {
        beforeEach(function () {
            waitForElement(element(by.css('.collectionRow')));
            element(by.css('.collectionRow b')).click();
        });
        it('add new card', function() {
            waitForElement(element(by.css('span.icon.icon-add')));
            element(by.css('span.icon.icon-add')).click();

            expect(element(by.cssContainingText('h1', 'Add card')).isDisplayed()).toBe(true);

            waitForElement(element(by.cssContainingText('button', 'Add')));
            expect(element(by.cssContainingText('button', 'Add')).getAttribute('disabled')).toEqual('true');

            waitForElement(element(by.model('card.front')));
            element(by.model('card.front')).clear().sendKeys('InsertedCard');
            waitForElement(element(by.model('card.back')));
            element(by.model('card.back')).clear().sendKeys('InsertedCard back');

            expect(element(by.cssContainingText('button', 'Add')).getAttribute('disabled')).toBe(null);
            element(by.cssContainingText('button', 'Add')).click();

            waitForElement(element(by.cssContainingText('span.cardItemFrontBack', 'InsertedCard')));
            expect(element(by.cssContainingText('span.cardItemFrontBack', 'InsertedCard')).isDisplayed()).toBe(true);
            expect(element(by.cssContainingText('span.cardItemFrontBack', 'InsertedCard back')).isDisplayed()).toBe(true);
        });

        describe('Testing buttons on card list - Edit, Hide, Delete', function () {
            it('hide first card and go to hidden cards and restore card', function () {
                waitForElement(element(by.css('i[data-icon="effects"]')));
                element(by.css('i[data-icon="effects"]')).click();



                element(by.css('span.icon.icon-menu')).click();
                browser.driver.sleep(1000);
                element(by.cssContainingText('a', 'Display hidden cards')).click();
                expect(browser.getCurrentUrl()).toMatch(/\/hidden/);

                element(by.css('i[data-icon="reload"]')).click();


                element(by.css('span.icon.icon-back')).click();
                expect(browser.getCurrentUrl()).toMatch(/collections/);
            });

            it('edit card', function() {
                waitForElement(element(by.css('i[data-icon="compose"]')));
                element(by.css('i[data-icon="compose"]')).click();

                waitForElement(element(by.model('card.front')));
                element(by.model('card.front')).clear().sendKeys('EditCard');
                waitForElement(element(by.model('card.back')));
                element(by.model('card.back')).clear().sendKeys('EditCard back');

                waitForElement(element(by.cssContainingText('button', 'Edit')));
                element(by.cssContainingText('button', 'Edit')).click();
                browser.driver.sleep(1000);
                expect(element(by.cssContainingText('span.cardItemFrontBack', 'EditCard')).getText()).toBe("EditCard");
                expect(element(by.cssContainingText('span.cardItemFrontBack', 'EditCard back')).getText()).toBe("EditCard back");
            });

            it('delete card', function() {
                waitForElement(element(by.css('i[data-icon="delete"]')));

                element.all(by.css('i[data-icon="delete"]')).count().then(function(amount) {
                    element(by.css('i[data-icon="delete"]')).click();
                    waitForElement(element(by.cssContainingText('button', 'Delete')));
                    element(by.cssContainingText('button', 'Delete')).click();

                    expect(element.all(by.css('i[data-icon="delete"]')).count()).toEqual(amount-1);
                });
            });
        });

        describe('learnng cards - study and repeat cards', function () {

            it('learning - study cards check answers and edit type of cards', function() {
                waitForElement(element(by.css('div.cardItem')));
                waitForElement(element(by.css('span.cardItemFrontBack')));
                expect(element.all((by.css('div.cardItem'))).count()).toBeGreaterThan(1);

                waitForElement(element(by.css('a.btnStartStudy')));
                element(by.css('a.btnStartStudy')).click();
                expect(browser.getCurrentUrl()).toMatch(/study/);

                waitForElement(element(by.cssContainingText('button', 'Show answer')));
                element(by.cssContainingText('button', 'Show answer')).click();

                (element.all(by.css('section.pagebody div span')).get(0)).getText().then(function(beforeNew) {
                    (element.all(by.css('section.pagebody div span')).get(1)).getText().then(function(beforeBad) {
                        (element.all(by.css('section.pagebody div span')).get(2)).getText().then(function(beforeAll) {
                            waitForElement(element(by.cssContainingText('button', 'Again (<5min)')));
                            element(by.cssContainingText('button', 'Again (<5min)')).click();

                            expect((element.all(by.css('section.pagebody div span')).get(0)).getText()).toBe((parseInt(beforeNew) - 1).toString());
                            expect((element.all(by.css('section.pagebody div span')).get(1)).getText()).toBe((parseInt(beforeBad) + 1).toString());
                            expect((element.all(by.css('section.pagebody div span')).get(2)).getText()).toBe((parseInt(beforeAll)).toString());
                        });
                    });
                });

                waitForElement(element(by.cssContainingText('button', 'Show answer')));
                expect(element((by.cssContainingText('button', 'Show answer'))).isDisplayed()).toBe(true);
                element(by.cssContainingText('button', 'Show answer')).click();

                (element.all(by.css('section.pagebody div span')).get(0)).getText().then(function(beforeNew) {
                    (element.all(by.css('section.pagebody div span')).get(1)).getText().then(function(beforeBad) {
                        (element.all(by.css('section.pagebody div span')).get(2)).getText().then(function(beforeAll) {
                            waitForElement(element(by.cssContainingText('button', 'Good (1 day)')));
                            element(by.cssContainingText('button', 'Good (1 day)')).click();

                            expect((element.all(by.css('section.pagebody div span')).get(0)).getText()).toBe((beforeNew - 1).toString());
                            expect((element.all(by.css('section.pagebody div span')).get(1)).getText()).toBe((beforeBad).toString());
                            expect((element.all(by.css('section.pagebody div span')).get(2)).getText()).toBe((beforeAll - 1).toString());});
                    });
                });

                waitForElement(element(by.cssContainingText('button', 'Show answer')));
                expect(element((by.cssContainingText('button', 'Show answer'))).isDisplayed()).toBe(true);

                element(by.css('span.icon.icon-back')).click();
                expect(browser.getCurrentUrl()).toMatch(/collections/);

            });

            it('learning - repeating cards check answers and edit remaining cards', function() {
                waitForElement(element(by.css('div.cardItem')));
                waitForElement(element(by.css('span.cardItemFrontBack')));
                expect(element.all((by.css('div.cardItem'))).count()).toBeGreaterThan(1);

                waitForElement(element(by.css('a.btnRepeatCards')));
                element(by.css('a.btnRepeatCards')).click();
                expect(browser.getCurrentUrl()).toMatch(/repeatCards/);

                waitForElement(element(by.cssContainingText('button', 'Show answer')));
                element(by.cssContainingText('button', 'Show answer')).click();

                (element.all(by.css('section.pagebody div span')).get(0)).getText().then(function(beforeAll) {
                    waitForElement(element(by.cssContainingText('button', 'Again')));
                    element(by.cssContainingText('button', 'Again')).click();

                    expect((element.all(by.css('section.pagebody div span')).get(0)).getText()).toBe((parseInt(beforeAll)).toString());
                });

                waitForElement(element(by.cssContainingText('button', 'Show answer')));
                expect(element((by.cssContainingText('button', 'Show answer'))).isDisplayed()).toBe(true);
                element(by.cssContainingText('button', 'Show answer')).click();

                (element.all(by.css('section.pagebody div span')).get(0)).getText().then(function(beforeAll) {
                    waitForElement(element(by.cssContainingText('button', 'Good')));
                    element(by.cssContainingText('button', 'Good')).click();

                    expect((element.all(by.css('section.pagebody div span')).get(0)).getText()).toBe((parseInt(beforeAll)-1).toString());
                });

                waitForElement(element(by.cssContainingText('button', 'Show answer')));
                expect(element((by.cssContainingText('button', 'Show answer'))).isDisplayed()).toBe(true);

                element(by.css('span.icon.icon-back')).click();
                expect(browser.getCurrentUrl()).toMatch(/collections/);
            });
        });

        describe('Test posibilities in menu', function () {

            it('create filtered collection from all collection', function() {
                waitForElement(element(by.css('i[data-icon="effects"]')));
                   element(by.css('span.icon.icon-menu')).click();
                   browser.driver.sleep(1000);
                   element(by.cssContainingText('a', 'Create filtered collection')).click();

                    waitForElement(element(by.cssContainingText('h1', 'Create new collection from collection')));
                    expect(element(by.cssContainingText('h1', 'Create new collection from collection')).isDisplayed()).toBe(true);

                    waitForElement(element(by.model('filteredColl.name')));
                    waitForElement(element(by.model('filteredColl.description')));
                    element(by.model('filteredColl.name')).clear().sendKeys('Filtered coll FC');
                    element(by.model('filteredColl.description')).clear().sendKeys('Filtered coll description');
                    element(by.cssContainingText('button', 'Create')).click();
                    waitForElement(element(by.cssContainingText('h1', 'Filtered coll FC')));
            });

            it('display settings', function() {
                waitForElement(element(by.css('i[data-icon="effects"]')));
                element(by.css('span.icon.icon-menu')).click();
                browser.driver.sleep(1000);
                element(by.cssContainingText('a', 'Collection settings')).click();

                expect(browser.getCurrentUrl()).toMatch(/collectionSettings/);
                expect(element(by.cssContainingText('h1', 'Collection settings')).isDisplayed()).toBe(true);
                expect(element(by.cssContainingText('label', 'Language of voice:')).isDisplayed()).toBe(true);

                waitForElement(element(by.model('collectionSettings.playVoiceText')));
                element(by.model('collectionSettings.playVoiceText')).element(by.xpath('ancestor::label')).click();
                expect(element(by.cssContainingText('label', 'Language of voice:')).isDisplayed()).toBe(false);
                element(by.css('span.icon.icon-back')).click();
                expect(browser.getCurrentUrl()).toMatch(/collections/);
            });

            it('display statistics', function() {
                waitForElement(element(by.css('i[data-icon="effects"]')));
                element(by.css('span.icon.icon-menu')).click();
                browser.driver.sleep(1000);
                element(by.cssContainingText('a', 'Collection statistics')).click();

                expect(browser.getCurrentUrl()).toMatch(/collectionStatistics/);
                expect(element(by.cssContainingText('h1', 'Collection statistics')).isDisplayed()).toBe(true);

                element(by.css('span.icon.icon-back')).click();
                expect(browser.getCurrentUrl()).toMatch(/collections/);
            });
        });
    });


    function waitForElement(elem) {
        browser.wait(function () {
            var deferred = protractor.promise.defer();
            var q = elem.isPresent();
            q.then(function (isPresent) {
                deferred.fulfill(isPresent);
            });
            return deferred.promise;
        }, 5000);
    }
});
