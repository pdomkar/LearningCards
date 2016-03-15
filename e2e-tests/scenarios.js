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
            element(by.model('coll.name')).clear().sendKeys('English - Czech - Updated');
            waitForElement(element(by.model('coll.description')));
            element(by.model('coll.description')).clear().sendKeys('English - Czech - Description of updated collection');

            waitForElement(element(by.cssContainingText('button', 'Update')));
            element(by.cssContainingText('button', 'Update')).click();

            expect(element(by.css('div.collectionRow b')).getText()).toBe("English - Czech - Updated");
            expect(element(by.css('div.collectionRow span')).getText()).toBe("English - Czech - Description of updated collection");
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

    desc

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
