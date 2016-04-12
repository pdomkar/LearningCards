'use strict';

var settings = angular.module('settings', []);


settings.controller('SettingsCtrl', ['$scope', '$routeParams', '$window', '$location', 'IndexedDb', function($scope, $routeParams, $window, $location, IndexedDb) {

    $scope.getGlobalSettings = function() {
        IndexedDb.getGlobalSettings().then(function(response) {
            $scope.settings = response;
        }, function(err) {
            $window.alert(err);
        });
    };

    $scope.$watch('settings', function(oldValue, newValue) {
        if(oldValue !== newValue) {
            IndexedDb.update(IndexedDb.STORES.GLOBAL_SETTINGS_STORE, $scope.settings).then(function (response) {
                //ok
            }, function (err) {
                $window.alert(err);
            });
        }
    }, true);

    $scope.playTestVoice = function() {
        meSpeak.loadVoice("js/mespeak/voices/" + $scope.settings.languageOfVoice + ".json", function() {
            meSpeak.speak("Test voice", {volume: ($scope.settings.volumeOfVoice/100), variant: $scope.settings.typeOfVoice});
        });
    };

    $scope.init = function() {
        IndexedDb.open().then(function(){
            $scope.getGlobalSettings();
            meSpeak.loadConfig("js/mespeak/mespeak_config.json");
        });
    }
}]);
