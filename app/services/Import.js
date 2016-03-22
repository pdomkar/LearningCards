'use strict';

angular.module('ImportServices', [])
    .config(['$provide', function ($provide) {
    }])
    .factory('ImportService',  ['$rootScope', function($rootScope) {
        return Import;
    }]);

    var Import = function ( pathToJson ) {
        var pathToJson = pathToJson;
        var json = {};

        this.setPath = function(path) {
            pathToJson = path;
        };
        this.getPath = function() {
            return pathToJson;
        };

        this.loadJson = function() {
            $.ajaxSetup( { "async": false } );

            json = $.parseJSON($.getJSON(pathToJson).responseText);
            $.ajaxSetup( { "async": true } );
        };

        this.setJson = function(data) {
            json = data;
        };
        this.getJson = function() {
            return json;
        };
        this.getCollection = function() {
            if(json.collection !== undefined) {
                return json.collection;
            } else {
                return null; //nothing insert
            }
        };
        this.getCollectionCards = function() {
            if(json.cards !== undefined) {
                return json.cards;
            } else {
                return [];
            }
        };
        this.getCollectionSettings = function() {
            if(json.settings !== undefined) {
                return json.settings;
            } else {
                return {
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
                };
            }
        };

    };
