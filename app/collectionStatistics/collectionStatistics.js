'use strict';

var collectionStatistics = angular.module('collectionStatistics', []);


collectionStatistics.controller('CollectionStatisticsCtrl', ['$scope', '$routeParams', '$window', '$location', 'IndexedDb', function($scope, $routeParams, $window, $location, IndexedDb) {
    $scope.collectionId = $routeParams.id;
    function setGraphData(cardsData) {
        /**
         * Array for data to graph by cards type
         * @type {{new: number, young: number, mature: number}} New(lastShow=null), Young(interval<35), Maure(interval>=35)
         */
        var seriesCards = {'new': 0, 'young': 0, 'mature': 0};
        angular.forEach(cardsData, function(value, key) {
            if(value.lastShow === null) {
                seriesCards.new++;
            } else if(value.interval < 35) {
                seriesCards.young++;
            } else if(value.interval >= 35) {
                seriesCards.mature++;
            }
        });

        var dataPie = {
            labels: ['New', 'Young', 'Mature'],
            series: [
                seriesCards.new,
                seriesCards.young,
                seriesCards.mature
            ]
        };

        var optionsPie = {
            labelInterpolationFnc: function (value) {
                value = seriesCards[value.toLowerCase()]; // get data by labels
                return (value == 0) ? '': '(' + Math.round(value / dataPie.series.reduce(sum) * 100) + '%)';
            }
        };

        var sum = function (a, b) {
            return a + b
        };

        var legendPie = $('.ct-legend.legend-pie');

        new Chartist.Pie('#chart1', dataPie, optionsPie);
        $.each(dataPie.labels, function(i, val) {
            $('<li />')
                .addClass('ct-series-' + i)
                .html('<strong>' + val + '</strong>: ' + dataPie.series[i] + ' (' + Math.round(dataPie.series[i] / dataPie.series.reduce(sum) * 100) + '%)')
                .appendTo(legendPie);
        });

        IndexedDb.findByProperty(IndexedDb.STORES.STATISTICS_ANSWERS_STORE, 'collectionId', parseInt($routeParams.id) ).then(function(response) {
            generateBarGraph(response, 6);
            generateBarGraph(response, 13);
            generateBarGraph(response, 20);
            generateBarGraph(response, 27);

            var legendBar = $('.ct-legend.legend-bar');
            $.each(['Again','Hard', 'Good', 'Easy'], function(i, val) {
                $('<li />')
                    .addClass('ct-series-' + i)
                    .html('<strong>' + val + '</strong>')
                    .appendTo(legendBar);
            });
        }, function(err) {
            $window.alert(err);
        });

    }

    function generateBarGraph(response, subtractDays) {
        var before = moment().subtract(subtractDays, 'days');
        before.set({'hour': 0, 'minute': 0, 'second': 0});

        response.sort(function(a,b) {
            return new Date(b.day).getTime() - new Date(a.day).getTime()
        });

        var data = [[],[],[],[]];
        for(var i = 0; i < 7 ; i++) {
            var actualDay = null;
            for(var j = 0; j < response.length; j++) {
                if(moment(response[j].day).isSame(before.format("YYYY-MM-DD"), 'day')) {
                    actualDay = response[j];
                    break;
                }
            }
            if(actualDay !== null) {
                data[0][i] = actualDay.again;
                data[1][i] = actualDay.hard;
                data[2][i] = actualDay.good;
                data[3][i] = actualDay.easy;
            } else {
                data[0][i] = data[1][i] = data[2][i] = data[3][i] = 0;
            }
            before = before.add(1, 'days');
        }

        var labels = [];
        for(var k = 0; k < 7; k++) {
            var negativeDays = (subtractDays - k);
            if( negativeDays == 0)
                labels.push('Today');
            else if ( negativeDays == 1)
                labels.push('-' + negativeDays + ' day');
            else
                labels.push('-' + negativeDays + ' days');
        }

        var dataBar = {
            labels: labels,
            series: data
        };

        var optionsBar = {
            stackBars: true,
            axisY: {
                labelInterpolationFnc: function(value) {
                    return (value);
                }
            }
        };

        new Chartist.Bar('#chart2-' + subtractDays, dataBar, optionsBar).on('draw', function(data) {
            if(data.type === 'bar') {
                data.element.attr({
                    style: 'stroke-width: 10px'
                });
            }
        });
    }

    $scope.isTwoOrHigherVer = function() {
        var userAgent = $window.navigator.userAgent;
        var userAgentBySpace= userAgent.split(" ");
        var lastTextBySlash =userAgentBySpace[userAgentBySpace.length-1].split("/");
        var version =parseFloat(lastTextBySlash[lastTextBySlash.length-1]);

        if((userAgent.indexOf("Gecko") > -1) && (userAgent.indexOf("Mobile") > -1)) {
            return (version>32.0 && lastTextBySlash[0] == "Firefox" );
        } else {
            return true;
        }

    };

    $scope.initGraphSlider = function () {
        $(function () {
            // wait till load event fires so all resources are available
            $scope.$slider = $('.my-graph-slider').unslider({nav: false, index: 'last', arrows: {prev: '<a class="unslider-arrow-my prev">Previous week</a>',
                next: '<a class="unslider-arrow-my next">Next week'}})
        });
    };

    $scope.initGraphSlider();

    $scope.init = function() {
        IndexedDb.open().then(function(){
            IndexedDb.findByProperty(IndexedDb.STORES.CARD_STORE, 'collectionId', parseInt($routeParams.id)).then(function (data) {
                setGraphData(data);
            });
        });
    }

}]);
