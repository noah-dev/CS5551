angular.module('labApp', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
  }).controller('labCtrl', function($scope, $http){
    const G_API_KEY = "AIzaSyCkfleD2A-9zHcVW8BS_wluHRP34jwJYys";
    const CX_ID = "012017816240971408663:q2xl2tk9laa";

    $scope.$watch('input', _=>{
      if ($scope.input == "" || $scope.input == undefined){
      } else {
        $scope.imageSearchTag($scope.input)
      }
    });

    $scope.urlBuilder = function urlBuilder(text){
      var image_search_url = "https://www.googleapis.com/customsearch/v1?" +
        "key=" + G_API_KEY + "&" +
        "q=" + text + "&" +
        "searchType=image&" +
        "cx=" + CX_ID;
      return image_search_url
    }

    $scope.imageSearch = function imageSearch(url){
      return $http.get(url).then(res=>{
        var link = res.data.items[0].link;
        return link
      })
    }

    $scope.imageSearchTag = function imageSearchTag(text){
      var image_search_url = $scope.urlBuilder(text);
      $scope.imageSearch(image_search_url).then(link=>{
        const app = new Clarifai.App({
          apiKey: 'ff540abc3f394be89a378be44fb585b4'
        });
        var content = app.models.predict(Clarifai.GENERAL_MODEL, link).then(res=>{
          var tags=res.outputs[0].data.concepts;
          return {"link":link, "tags":tags};
        })
        return content
      }).then(content=>{
        $scope.image = content.link;
        var formattedTags = ""
        for(var i = 0; i<6; i++){
          formattedTags += content.tags[i].name + ", "
        }
        $scope.tags = formattedTags.slice(0,-2);
      });
    }
  });
