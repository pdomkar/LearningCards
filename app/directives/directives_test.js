'use strict';

describe('lCApp directives module', function() {

  var $compile,
      $rootScope;
  beforeEach(module('globalDirectives'));

  beforeEach(inject(function(_$compile_, _$rootScope_){
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));



  describe('Testing confirmDialog directive', function(){
    //it('should', function() {
    //  element = $compile('<confirm-dialog title="Delete collection" body="Do you realy want to delete the collection?" btn-cancel="Cancel" btn-confirm="Delete" show-confirm="true" confirm-fce="remove(removeCollId)" ></confirm-dialog>')($rootScope);
    //  $rootScope.$digest();
    //
    //
    //  expect($rootScope.clicked).toEqual(true);
    //});

  });
});
