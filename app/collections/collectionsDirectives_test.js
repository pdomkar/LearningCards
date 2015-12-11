'use strict';

describe('lCApp collectionsDirectives module', function() {

  var $compile,
      $rootScope;
  beforeEach(module('collectionsDirectives'));

  beforeEach(inject(function(_$compile_, _$rootScope_){
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));



  describe('Testing addEditCollModal directive', function(){
    //it('should', function() {
    //  element = $compile('<add-edit-coll-modal add-edit-coll-modal-mode="add" update-id="null" add-fce="add(newColl)" update-fce="update(newColl)" show-modal="true"></add-edit-coll-modal>')($rootScope);
    //  $rootScope.$digest();
    //});

  });
});
