var app = angular.module('app', ['ngRoute']);

app.config(function($routeProvider) {
    $routeProvider
    	.when('/', {
    		templateUrl: 'home.html',
            controller: 'con_home'
    	})
    	.when('/twitter', {
    		templateUrl: 'twitter.html',
            controller: 'con_twitter'
    	})
    	.when('/mashup', {
    		templateUrl: 'mashup.html',
            controller: 'con_mashup'
    	});

});

app.controller('con_home', function($scope) {
    $scope.pageClass = 'home';
    $scope.title = "Home";
});

app.controller('con_twitter', function($scope) {
    $scope.pageClass = 'twitter';
    $scope.title = "Twitter"
});

app.controller('con_mashup', function($scope) {
    $scope.pageClass = 'mashup';
});