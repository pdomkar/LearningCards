'use strict';

var study = angular.module('study', []);


study.controller('StudyCtrl', ['$scope', '$routeParams', '$window', '$location', 'IndexedDb', '$timeout', function ($scope, $routeParams, $window, $location, IndexedDb, $timeout) {
    $scope.collectionId = $routeParams.id;
    $scope.cards = [];
    $scope.card = null;
    $scope.displayAnswer = false;
    $scope.timer = null;

    const CARD_GRADE = {
        0: 'Again',
        1: 'Hard',
        3: 'Good',
        5: 'Easy'
    };
    $scope.CARD_GRADE = CARD_GRADE;


    $scope.showAnswer = function () {
        $scope.displayAnswer = true;
        $timeout.cancel($scope.countdownRef);
    };

    $scope.evaluateCard = function (grade) {
        console.log("OLD interval = " + $scope.card.interval);
        if ($scope.card.interval < 6) {
            if (grade >= 3) {
                var nextShowDay = moment().add(1, "d");
                nextShowDay.set({'hour': 0, 'minute': 0, 'second': 0});
                $scope.card.nextShow = nextShowDay.toDate();
            } else {
                $scope.card.nextShow = moment().add(5, "m").toDate();
            }
            console.log(" next Show = " + $scope.card.nextShow);
        } else {
            if (grade == 0) {
                $scope.card.nextShow = moment().add(5, "m").toDate();
            } else {
                var fraction = 1;
                if (grade == 3) {
                    fraction = 2 / 3;
                } else if (grade == 1) {
                    fraction = 1 / 3;
                }
                console.log("fraction = " + fraction);
                var nextShowDay = moment().add(Math.round($scope.card.interval * fraction), "d");
                nextShowDay.set({'hour': 0, 'minute': 0, 'second': 0});
                $scope.card.nextShow = nextShowDay.toDate();
            }
            console.log(" next Show = " + $scope.card.nextShow);
        }


        if (grade >= 3) {
            if ($scope.card.numberOfIteration == 0) {
                $scope.card.numberOfIteration = 1;
                $scope.card.interval = 1;
            } else if ($scope.card.numberOfIteration == 1) {
                $scope.card.numberOfIteration = 2;
                $scope.card.interval = 6;
            } else {
                $scope.card.numberOfIteration += 1;
                $scope.card.interval = Math.round($scope.card.interval * $scope.card.ef);
            }

            var newEf = ($scope.card.ef + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02)));
            $scope.card.ef = ( newEf < 1.3 ) ? 1.3 : newEf;
        } else {
            $scope.card.numberOfIteration = 1;
            $scope.card.interval = 1;
        }
        $scope.oldCardDirty = $scope.card.dirty;
        if (grade == 0) {
            $scope.card.dirty = "true";
        } else {
            $scope.card.dirty = "false";
        }

        $scope.card.lastShow = moment().toDate();
        console.log("n of itera = " + $scope.card.numberOfIteration);
        console.log("interval = " + $scope.card.interval);
        console.log(" last Show = " + $scope.card.lastShow);
        console.log("new ef = " + $scope.card.ef);


        IndexedDb.update(IndexedDb.STORES.CARD_STORE, $scope.card).then(function () {
            $scope.updateStatisticsAnswers(grade, $scope.oldCardDirty);
            $scope.loadStudyCard();
        }, function (err) {
            $window.alert(err);
        });
    };

    $scope.speakFrontCardText = function () {
        meSpeak.loadVoice("js/mespeak/voices/" + $scope.collectionSettings.languageOfVoice + ".json", function () {
            meSpeak.speak($scope.card.front, {
                volume: ($scope.collectionSettings.volumeOfVoice / 100),
                variant: $scope.collectionSettings.typeOfVoice
            });
        });
    };

    $scope.loadStudyCard = function () {
        IndexedDb.findCardToStudy($routeParams.id).then(
            function (data) {
                $scope.cards = data;
                if (data.length > 0) {
                    $scope.card = data[0];
                    if ($scope.collectionSettings.limitTAnswer.toLowerCase() == "true") {
                        $scope.timer = $scope.collectionSettings.maximalAnswerTime;
                        $timeout.cancel($scope.countdownRef);
                        $scope.countdown();
                    }
                } else {
                    $timeout.cancel($scope.countdownRef);
                    $location.path('/collections/' + $routeParams.id);
                }
                if ($scope.collectionSettings.playVoiceText.toLowerCase() === 'true') {
                    $scope.speakFrontCardText();
                }
            }, function (err) {
                $window.alert(err);
                $timeout.cancel($scope.countdownRef);
                $location.path('/collections/' + $routeParams.id);
            });
        $scope.displayAnswer = false;
    };

    $scope.getNewCards = function (allCards) {
        var newCards = [];

        for (var i = 0; i < allCards.length; i++) {
            if (allCards[i].lastShow == null) {
                newCards.push(allCards[i]);
            }
        }
        return newCards;
    };
    $scope.getRepeatedCards = function (allCards) {
        var repeatedCards = [];

        for (var i = 0; i < allCards.length; i++) {
            if (allCards[i].dirty == "true") {
                repeatedCards.push(allCards[i]);
            }
        }
        return repeatedCards;
    };

    $scope.updateStatisticsAnswers = function (grade, dirty) {
        var today = moment();
        today.set({'hour': 0, 'minute': 0, 'second': 0});
        today = today.format("YYYY-MM-DD");

        //Pro statistiky globalní (bez kolekce) --------------------
        IndexedDb.findByProperty(IndexedDb.STORES.STATISTICS_ANSWERS_STORE, 'collectionId', 0).then(function (response) {
            var record = null;
            angular.forEach(response, function (value, key) {
                if (moment(value.day).isSame(today, 'day')) {
                    record = value;
                }
            });

            if (record === null) { // neexistuje -> vytvořit
                var newStatisticsToday = {
                    day: today,
                    collectionId: 0,
                    again: 0, hard: 0, good: 0, easy: 0
                };
                if (dirty == "false") {
                    newStatisticsToday[CARD_GRADE[grade].toLowerCase()] = 1;
                }
                IndexedDb.add(IndexedDb.STORES.STATISTICS_ANSWERS_STORE, newStatisticsToday).then(function () {
                    //ok
                }, function (err) {
                    $window.alert(err);
                });
            } else {    //existuje - melo by být jedno -> upravit grade
                if (dirty == "false") {
                    record[CARD_GRADE[grade].toLowerCase()] += 1;
                }

                IndexedDb.update(IndexedDb.STORES.STATISTICS_ANSWERS_STORE, record).then(function () {
                    //ok
                }, function (err) {
                    $window.alert(err);
                });
            }
        }, function (err) {
            $window.alert(err);
        });


        //Pro statistiky kolekci--------------------
        IndexedDb.findByProperty(IndexedDb.STORES.STATISTICS_ANSWERS_STORE, 'collectionId', parseInt($scope.collectionId)).then(function (response) {
            var record = null;
            angular.forEach(response, function (value, key) {
                if (moment(value.day).isSame(today, 'day')) {
                    record = value;
                }
            });

            if (record === null) { // neexistuje -> vytvořit
                var newStatisticsToday = {
                    day: today,
                    collectionId: parseInt($scope.collectionId),
                    again: 0, hard: 0, good: 0, easy: 0
                };
                if (dirty == "false") {
                    newStatisticsToday[CARD_GRADE[grade].toLowerCase()] = 1;
                }
                IndexedDb.add(IndexedDb.STORES.STATISTICS_ANSWERS_STORE, newStatisticsToday).then(function () {
                    //ok
                }, function (err) {
                    $window.alert(err);
                });
            } else {    //existuje - melo by být jedno -> upravit grade
                if (dirty == "false") {
                    record[CARD_GRADE[grade].toLowerCase()] += 1;
                }
                IndexedDb.update(IndexedDb.STORES.STATISTICS_ANSWERS_STORE, record).then(function () {
                    //ok
                }, function (err) {
                    $window.alert(err);
                });
            }
        }, function (err) {
            $window.alert(err);
        });

    };

    $scope.goBack = function() {
        $timeout.cancel($scope.countdownRef);
        $location.path('/collections/' + $routeParams.id);
    };

    $scope.countdown = function () {
        $scope.countdownRef = $timeout(function () {
            if ($scope.timer <= 0) {
                $scope.evaluateCard(0);
                $scope.timer++;
            }
            $scope.timer--;
            $scope.countdown();
        }, 1000);
    };



    $scope.init = function () {
        IndexedDb.open().then(function () {
            IndexedDb.getById(IndexedDb.STORES.COLLECTION_SETTINGS_STORE, $routeParams.id).then(function (response) {
                $scope.collectionSettings = response;
                $scope.loadStudyCard();
                meSpeak.loadConfig("js/mespeak/mespeak_config.json");
            }, function (err) {
                $window.alert(err);
            });
        });
    }
}]);
