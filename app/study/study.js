'use strict';

var study = angular.module('study', ['mobile-angular-ui', 'collectionsDirectives']);


study.controller('StudyCtrl', ['$scope', '$routeParams', '$window', '$location', 'IndexedDb', function($scope, $routeParams, $window, $location, IndexedDb) {
    $scope.collectionId = $routeParams.id;
    $scope.cards = [];
    $scope.card = null;
    $scope.displayAnswer = false;



    $scope.showAnswer = function() {
        $scope.displayAnswer = true;
    };

    $scope.evaluateCard = function(grade) {
        console.log("OLD interval = " +  $scope.card.interval);
        if($scope.card.interval < 6) {
            if(grade >= 3) {
                var nextShowDay = moment().add(1, "d");
                nextShowDay.set({'hour': 0, 'minute': 0, 'second': 0});
                $scope.card.nextShow = nextShowDay.toDate();
            } else{
                $scope.card.nextShow = moment().add(5, "m").toDate();
            }
            console.log(" next Show = " +  $scope.card.nextShow);
        } else {
            if (grade == 0) {
                $scope.card.nextShow = moment().add(5, "m").toDate();
            } else {
                var fraction = 1;
                if(grade == 3) {
                    fraction = 2/3;
                } else if(grade == 1) {
                    fraction = 1/3;
                }
                console.log("fraction = " + fraction);
                var nextShowDay = moment().add(Math.round($scope.card.interval * fraction), "d");
                nextShowDay.set({'hour': 0, 'minute': 0, 'second': 0});
                $scope.card.nextShow = nextShowDay.toDate();
            }
            console.log(" next Show = " +  $scope.card.nextShow);
        }


        if(grade >= 3) {
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
        $scope.card.lastShow = moment().toDate();
        console.log("n of itera = " +  $scope.card.numberOfIteration);
        console.log("interval = " +  $scope.card.interval);
        console.log(" last Show = " +  $scope.card.lastShow);
        console.log("new ef = " + $scope.card.ef);


        IndexedDb.update(IndexedDb.STORES.CARD_STORE, $scope.card).then(function() {
            $scope.loadStudyCard();
        }, function(err) {
            $window.alert(err);
        });
    };

    $scope.speakFrontCardText = function() {
        meSpeak.loadVoice("js/mespeak/voices/" + $scope.collectionSettings.languageOfVoice + ".json", function() {
            meSpeak.speak($scope.card.front, {volume: ($scope.collectionSettings.volumeOfVoice/100), variant: $scope.collectionSettings.typeOfVoice});
        });
    };

    $scope.loadStudyCard = function() {
        IndexedDb.findCardToStudy($routeParams.id).then(
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
            $scope.loadStudyCard();
            IndexedDb.getById(IndexedDb.STORES.COLLECTION_SETTINGS_STORE, $routeParams.id).then(function(response) {
                $scope.collectionSettings = response;
                meSpeak.loadConfig("js/mespeak/mespeak_config.json");
            }, function(err) {
                $window.alert(err);
            });
        });
    }
}]);
