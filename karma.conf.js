module.exports = function(config){
  config.set({

    basePath : './',

    files : [
      'app/dist/angular/angular.js',
      'app/dist/angular-route/angular-route.js',
      'app/dist/angular-mocks/angular-mocks.js',
      'app/collections*/*.js',
      'app/services/*.js',
      'app/directives*/*.js',
      'app/dist/moment/moment.js',
      'app/dist/jquery/dist/jquery.min.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-junit-reporter'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
