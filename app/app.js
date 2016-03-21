'use strict';

var learningCards = angular.module('lCApp', [
  'ngRoute',
  'collectionsList',
  'collectionsHidden',
  'cardsList',
  'cardsHidden',
  'collectionDetail',
  'study',
  'repeatCards',
  'settings',
  'collectionSettings',
  'statistics',
  'collectionStatistics',
  'IndexedDbServices',
  'ImportServices',
  'globalDirectives'
]);

learningCards.config(['$routeProvider', '$compileProvider', function($routeProvider,$compileProvider) {
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(file|https?|ftp|mailto|app):/);
  $routeProvider.when('/collections', {
    templateUrl: 'collections/collectionsList.html',
    controller: 'CollectionsListCtrl',
    controllerAs: 'cl'
  }).when('/collections/hidden', {
    templateUrl: 'collections/hidden/collectionsHidden.html',
    controller: 'CollectionsHiddenCtrl',
    controllerAs: 'ch'
  }).when('/cards', {
    templateUrl: 'cards/cardsList.html',
    controller: 'CardsListCtrl',
    controllerAs: 'cl'
  }).when('/collections/:id', {
    templateUrl: 'collection/collectionDetail.html',
    controller: 'CollectionDetailCtrl',
    controllerAs: 'cd'
  }).when('/collections/:id/hidden', {
    templateUrl: 'collection/hidden/cardsHidden.html',
    controller: 'CardsHiddenCtrl',
    controllerAs: 'ch'
  }).when('/collections/:id/study', {
    templateUrl: 'study/study.html',
    controller: 'StudyCtrl',
    controllerAs: 'sc'
  }).when('/collections/:id/repeatCards', {
    templateUrl: 'repeatCards/repeatCards.html',
    controller: 'RepeatCardsCtrl',
    controllerAs: 'rcc'
  }).when('/settings/', {
    templateUrl: 'settings/settings.html',
    controller: 'SettingsCtrl',
    controllerAs: 'sc'
  }).when('/collectionSettings/:id', {
    templateUrl: 'collectionSettings/collectionSettings.html',
    controller: 'CollectionSettingsCtrl',
    controllerAs: 'csc'
  }).when('/statistics/', {
    templateUrl: 'statistics/statistics.html',
    controller: 'StatisticsCtrl',
    controllerAs: 'stc'
  }).when('/collectionStatistics/:id', {
    templateUrl: 'collectionStatistics/collectionStatistics.html',
    controller: 'CollectionStatisticsCtrl',
    controllerAs: 'cstc'
  });
  $routeProvider.otherwise({redirectTo: '/collections'});

}]);


