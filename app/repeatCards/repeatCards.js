'use strict';

var repeatCards = angular.module('repeatCards', []);


repeatCards.controller('RepeatCardsCtrl', ['$scope', '$routeParams', '$window', '$location', 'IndexedDb', function($scope, $routeParams, $window, $location, IndexedDb) {
    $scope.collectionId = $routeParams.id;
    $scope.cards = [];
    $scope.displayAnswer = false;

    const CARD_GRADE = { // PREMISTIt do definice konstatnt
        0: 'Again',
        3: 'Good'
    };
    $scope.CARD_GRADE = CARD_GRADE;


    $scope.showAnswer = function() {
        $scope.displayAnswer = true;
    };

    $scope.evaluateCard = function(grade) {
        if(grade === 3) {
            $scope.cards.splice(0, 1);
            $scope.displayAnswer = false;
        } else {
            for(var i = 0; i < $scope.cards.length; i++) {
                if (i < Math.min(10, $scope.cards.length)) { // to move max 10 place
                    if(i+1< $scope.cards.length) {              // to not go out of array bounds
                        var tmp = $scope.cards[i + 1];
                        $scope.cards[i + 1] = $scope.cards[i];
                        $scope.cards[i] = tmp;
                    }
                }
            }
            $scope.displayAnswer = false;
        }
        if( $scope.cards.length === 0 ) {
            $location.path('/collections/' + $routeParams.id);
        }
    };

    $scope.speakFrontCardText = function() {
        meSpeak.loadVoice("js/mespeak/voices/" + $scope.collectionSettings.languageOfVoice + ".json", function() {
            meSpeak.speak($scope.card.front, {volume: ($scope.collectionSettings.volumeOfVoice/100), variant: $scope.collectionSettings.typeOfVoice});
        });
    };

    $scope.loadRepeatCards = function() {
        IndexedDb.findByProperty(IndexedDb.STORES.CARD_STORE, 'collectionId', parseInt($routeParams.id)).then(
            function(data) {
                $scope.cards = data;
                if(data.length > 0) {
                    $scope.card = data[0];
                } else {
                    $location.path('/collections/' + $routeParams.id);
                }
                if($scope.collectionSettings.playVoiceText.toLowerCase() === 'true') {
                    $scope.speakFrontCardText();
                }
            }, function(err) {
                $window.alert(err);
                $location.path('/collections/' + $routeParams.id);
            });
        $scope.displayAnswer = false;
    };


    $scope.init = function() {
        IndexedDb.open().then(function(){
            $scope.loadRepeatCards();
            IndexedDb.getById(IndexedDb.STORES.COLLECTION_SETTINGS_STORE, $routeParams.id).then(function(response) {
                $scope.collectionSettings = response;
                meSpeak.loadConfig("js/mespeak/mespeak_config.json");
            }, function(err) {
                $window.alert(err);
            });
        });
    }
}]);
