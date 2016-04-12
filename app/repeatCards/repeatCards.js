'use strict';

var repeatCards = angular.module('repeatCards', []);


repeatCards.controller('RepeatCardsCtrl', ['$scope', '$routeParams', '$window', '$location', 'IndexedDb', '$timeout', function($scope, $routeParams, $window, $location, IndexedDb, $timeout) {
    $scope.collectionId = $routeParams.id;
    $scope.cards = [];
    $scope.displayAnswer = false;
    $scope.onlyAnswer = false;
    $scope.timer = null;

    const CARD_GRADE = { // PREMISTIt do definice konstatnt
        0: 'Again',
        3: 'Good'
    };
    $scope.CARD_GRADE = CARD_GRADE;

    $scope.showAnswer = function() {
        $scope.displayAnswer = true;
        $timeout.cancel($scope.countdownRef);
    };

    $scope.evaluateCard = function(grade) {
        if(grade === 3) {
            $scope.cards.splice(0, 1);
        } else {
            moveCard();
        }
        $scope.displayAnswer = false;
        $scope.speakFrontCardText();
        $timeout.cancel($scope.countdownRef);
        if( $scope.cards.length === 0 ) {
            $location.path('/collections/' + $routeParams.id);
        }
        if ($scope.collectionSettings.limitTAnswerByRepeating.toLowerCase() == "true") {
            $scope.timer = $scope.collectionSettings.maximalAnswerTimeByRepeating;
            $scope.countdown();
        }
    };

    $scope.speakFrontCardText = function() {
        meSpeak.loadVoice("js/mespeak/voices/" + $scope.collectionSettings.languageOfVoice + ".json", function() {
            meSpeak.speak($scope.cards[0].front, {volume: ($scope.collectionSettings.volumeOfVoice/100), variant: $scope.collectionSettings.typeOfVoice});
        });
    };

    $scope.loadRepeatCards = function() {
        IndexedDb.findByProperty(IndexedDb.STORES.CARD_STORE, 'collectionId', parseInt($routeParams.id)).then(
            function(data) {
                shuffle(data);
                $scope.cards = data;
                if(data.length > 0) {
                    $scope.card = data[0];
                    if ($scope.collectionSettings.limitTAnswerByRepeating.toLowerCase() == "true") {
                        $scope.timer = $scope.collectionSettings.maximalAnswerTimeByRepeating;
                        $timeout.cancel($scope.countdownRef);
                        $scope.countdown();
                    }
                } else {
                    $timeout.cancel($scope.countdownRef);
                    $location.path('/collections/' + $routeParams.id);
                }
                if($scope.collectionSettings.playVoiceText.toLowerCase() === 'true') {
                    $scope.speakFrontCardText();
                }
            }, function(err) {
                $window.alert(err);
                $timeout.cancel($scope.countdownRef);
                $location.path('/collections/' + $routeParams.id);
            });
        $scope.displayAnswer = false;
    };

    function moveCard() {
        for(var i = 0; i < $scope.cards.length; i++) {
            if (i < Math.min(10, $scope.cards.length)) { // to move max 10 place
                if(i+1< $scope.cards.length) {              // to not go out of array bounds
                    var tmp = $scope.cards[i + 1];
                    $scope.cards[i + 1] = $scope.cards[i];
                    $scope.cards[i] = tmp;
                }
            }
        }
    }

    function shuffle(array) {
        var randomIndex, tmp, i;
        for (i = array.length; i > 0; i--) {
            randomIndex = Math.floor(Math.random() * i);
            tmp = array[i - 1];
            array[i - 1] = array[randomIndex];
            array[randomIndex] = tmp;
        }
    }

    $scope.goBack = function() {
        $timeout.cancel($scope.countdownRef);
        $location.path('/collections/' + $routeParams.id);
    };

    $scope.countdown = function () {
        $scope.countdownRef = $timeout(function () {
            if ($scope.timer <= 0) {
                $scope.onlyAnswer = true;
                $timeout(function() {
                    moveCard();
                    $scope.displayAnswer = false;
                    $scope.speakFrontCardText();
                    if ($scope.collectionSettings.limitTAnswerByRepeating.toLowerCase() == "true") {
                        $scope.timer = $scope.collectionSettings.maximalAnswerTimeByRepeating;
                        $scope.timer++;
                    }
                    $scope.onlyAnswer = false;
                    $scope.timer--;
                    $scope.countdown();
                }, 1500);
            } else {
                $scope.timer--;
                $scope.countdown();
            }
        }, 1000);
    };

    $scope.init = function() {
        IndexedDb.open().then(function(){
            IndexedDb.getById(IndexedDb.STORES.COLLECTION_SETTINGS_STORE, $routeParams.id).then(function(response) {
                $scope.collectionSettings = response;
                $scope.loadRepeatCards();
                meSpeak.loadConfig("js/mespeak/mespeak_config.json");
            }, function(err) {
                $window.alert(err);
            });
        });
    }
}]);
