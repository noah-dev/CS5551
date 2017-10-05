const G_API_KEY = "AIzaSyCkfleD2A-9zHcVW8BS_wluHRP34jwJYys";
const CX_ID = "012017816240971408663:q2xl2tk9laa";
var text = "demo";
var image_search_url = "https://www.googleapis.com/customsearch/v1?" +
  "key=" + G_API_KEY + "&" +
  "q=" + text + "&" +
  "searchType=image&" +
  "cx=" + CX_ID;
  var items = [{"link":"https://samples.clarifai.com/demo-001.jpg"}]

// testing controller
describe('labCtrl', function() {
  var $httpBackend, $rootScope, createController, authRequestHandler, scope;

  // Set up the module
  beforeEach(module('labApp'));
  beforeEach(inject(function($injector) {
    // Set up the mock http service responses
    $httpBackend = $injector.get('$httpBackend');
    // backend definition common for all tests

    authRequestHandler = $httpBackend.when('GET', image_search_url)
                           .respond({"items": items}, {'A-Token': 'xxx'});

    // Get hold of a scope (i.e. the root scope)
    $rootScope = $injector.get('$rootScope');
    // The $controller service is used to create instances of controllers
    var $controller = $injector.get('$controller');

    scope = $rootScope.$new();
    $controller('labCtrl', {$scope: scope});
  }));
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  // Unit tests go here
  it("Does it connect to the mock google search backend?", function() {
    $httpBackend.whenGET(image_search_url).respond({"items": items});
    $httpBackend.expectGET(image_search_url)
    scope.imageSearch(image_search_url);
    $httpBackend.flush();
  });
  it("Does the url builder work?", function(){
    var test = scope.urlBuilder("demo");
    expect(test).toEqual(image_search_url)
  });
  it("If input is undefined, no errors should be raised", function(){
    scope.input = undefined;
  });
});
