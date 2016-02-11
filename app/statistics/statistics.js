'use strict';

var statistics = angular.module('statistics', ['mobile-angular-ui']);


statistics.controller('StatisticsCtrl', ['$scope', '$routeParams', '$window', '$location', 'IndexedDb', function($scope, $routeParams, $window, $location, IndexedDb) {

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

        IndexedDb.findByProperty(IndexedDb.STORES.STATISTICS_ANSWERS_STORE, 'collectionId', 0 ).then(function(response) {



            var before = moment().subtract(6, 'days');
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

            var dataBar = {
                labels: ['Today', '-1 day', '-2 days', '-3 days', '-4 days','-5 days','-6 days'].reverse(),
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

            var legendBar = $('.ct-legend.legend-bar');

            new Chartist.Bar('#chart2', dataBar, optionsBar).on('draw', function(data) {
                if(data.type === 'bar') {
                    data.element.attr({
                        style: 'stroke-width: 10px'
                    });
                }
            });




            $.each(['Again','Hard', 'Good', 'Easy'], function(i, val) { //TODO asi potreba přidat nejaky json s moznostmi tlačítek, a pro ne barvy a legendy
                $('<li />')
                    .addClass('ct-series-' + i)
                    .html('<strong>' + val + '</strong>')
                    .appendTo(legendBar);
            });

        }, function(err) {
            $window.alert(err);
        });

    }

    $scope.init = function() {
        IndexedDb.open().then(function(){
            IndexedDb.findAll(IndexedDb.STORES.CARD_STORE).then(function (data) {
                setGraphData(data);
            });
        });
    }
}]);
