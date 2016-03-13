'use strict';
/**
 * Created by Petr on 22. 11. 2015.
 */
angular.module('ImportServices', [])
    .config(['$provide', function ($provide) {
    }])
    .factory('ImportService',  ['$rootScope', function($rootScope) {
        return Import;
    }]);

    var Import = function ( pathToJson ) {
        this.pathToJson = pathToJson;
        this.json = {};

        this.setPath = function(path) {
            this.pathToJson = path;
        };

        this.loadJson = function() {
            $.ajaxSetup( { "async": false } );
            this.json = JSON.parse((JSON.parse(JSON.stringify($.getJSON(pathToJson))).responseText));
            $.ajaxSetup( { "async": true } );
        };

        this.getPath = function() {
            return this.pathToJson;
        };
        this.getJson = function() {
            return this.json;
        };
        this.getCollection = function() {
            return this.json.collection; // osetrit ze existuje
        };
        this.getCollectionCards = function() {
            return this.json.cards;
        };
        this.getCollectionSettings = function() {
            return this.json.settings;
        };

    };
