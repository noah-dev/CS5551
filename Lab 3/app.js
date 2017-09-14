const G_API_KEY = "AIzaSyCkfleD2A-9zHcVW8BS_wluHRP34jwJYys"

var app = angular.module('app', ['ngRoute']);

app.config(function($routeProvider, $locationProvider) {
    $routeProvider
    	.when('/', {
    		templateUrl: '/templates/home.html',
            controller: 'con_home'
    	})
    	.when('/login', {
    		templateUrl: '/templates/login.html',
            controller: 'con_login'
    	})
    	.when('/mashup', {
    		templateUrl: '/templates/mashup.html',
            controller: 'con_mashup'
        });
    $locationProvider.html5Mode(true);
});

app.controller('con_home', function($scope) {
    $scope.pageClass = 'home';
    nav_active($scope.pageClass);
    $scope.title = "Lab 3 Home Page";
});

app.controller('con_login', function($scope) {
    $scope.pageClass = 'login';
    nav_active($scope.pageClass);
    
    loadLogin();

    function loadLogin() {
        gapi.load('auth2', function() {
                gapi.auth2.init();
        });
        renderButton();
    }
    function renderButton() {
        gapi.signin2.render('login_button', {
          'scope': 'profile email',
          'width': 240,
          'height': 50,
          'longtitle': true,
          'theme': 'dark',
          'onsuccess': onSignIn,
        });
      }
    
    function onSignIn(googleUser) {
        profile = googleUser.getBasicProfile();
        $scope.$apply(_=>{
            $scope.name = profile.getName();
            $scope.email = profile.getEmail();
            $scope.profile_image_url = profile.getImageUrl();
        })
    }
});

app.controller('con_mashup', function($scope, $http) {
    $scope.pageClass = 'mashup';
    nav_active($scope.pageClass);

    $scope.submit = function(){
        //Google Translate
        var language = "fr";
        var google_translate_url = "https://translation.googleapis.com/language/translate/v2?"+
                                    "q=" + $scope.keywords + "&" +
                                    "target=" + language + "&" +
                                    "key=" + G_API_KEY;
        $http.get(google_translate_url).then(res=>{ 
            $scope.translation = res.data.data.translations[0].translatedText
        });

        //Youtube
        var number_of_results = 1;
        var youtube_api_url = "https://www.googleapis.com/youtube/v3/search?"+
                                "part=" + "snippet" + "&" +
                                "q=" + $scope.keywords + "&" +
                                "maxResults=" + number_of_results + "&" +
                                "key=" + G_API_KEY;
        $http.get(youtube_api_url).then(res=>{ 
            var top_result = res.data.items[0].snippet;

            $scope.title = top_result.title;
            //$scope.description = top_result.description;
            $scope.youtube_thumbnail = top_result.thumbnails.high.url
            
        });
    }
});

function nav_active(page){
    if (page == "home"){
        $("#nav_home").addClass("active");
        $("#nav_login").removeClass("active");
        $("#nav_mashup").removeClass("active");
    } else if (page == "login") {
        $("#nav_home").removeClass("active");
        $("#nav_login").addClass("active");
        $("#nav_mashup").removeClass("active");
    } else if (page == "mashup"){
        $("#nav_home").removeClass("active");
        $("#nav_login").removeClass("active");
        $("#nav_mashup").addClass("active");
    } else {
        $("#nav_home").removeClass("active");
        $("#nav_login").removeClass("active");
        $("#nav_mashup").removeClass("active");
    }
}

//Does not seem to work on localhost
/*
function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
            console.log('User signed out.');
    });
}
*/