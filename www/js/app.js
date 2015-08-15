angular.module('starter', ['ionic', 'ngCordova', 'ionic.service.deploy'])

.config(['$ionicAppProvider', function($ionicAppProvider) {
  // Identify app
  $ionicAppProvider.identify({
    // The App ID (from apps.ionic.io) for the server
    app_id: '944e2660',
    // The public API key all services will use for this app
    api_key: 'a4742f36452eaab1546b88745e6033fe604aac349ace99a0',
    // Set the app to use development pushes
    dev_push: true
  });
}])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

// currentLocation factory is a service to obtain current lat & lng and use them accross the app
.factory('currentLocation', ['$cordovaGeolocation', function($cordovaGeolocation) {
  var latitude;
  var longitude;

  var posOptions = {timeout: 10000, enableHighAccuracy: false};
  $cordovaGeolocation
    .getCurrentPosition(posOptions)
    .then(function (position) {
      latitude  = position.coords.latitude;
      longitude = position.coords.longitude;
    })

    return {
      latitude : function () {
        return latitude;
      },
      longitude : function () {
        return longitude;
      }
    }   
}])


.controller('VenueCtrl', function($scope, $ionicModal, $http, currentLocation) {

  $scope.Math = window.Math;

  $scope.loading = true;
  $scope.categoryId = "";
  $scope.radius = {
    'distance' : '500'
  }

  $scope.venue = {
    id : '',
    name : '',
    lat : '',
    lng : '',
    address : '',
    checkinsCount : 0,
    tipCount : 0,
    hereNow : 0,
  }

  $scope.categories = [
    { title: 'Seafood', id: '4bf58dd8d48988d1ce941735'},
    { title: 'Vegetarian', id: '4bf58dd8d48988d1d3941735' },
    { title: 'Mexican', id: '4bf58dd8d48988d1c1941735' },
    { title: 'American', id: '4bf58dd8d48988d14e941735' },
    { title: 'Italian', id: '4bf58dd8d48988d110941735' },
    { title: 'Mediterranean', id: '4bf58dd8d48988d1c0941735' },
    { title: 'Breakfast spot', id: '4bf58dd8d48988d143941735'},
    { title: 'Entertainment', id: '4d4b7104d754a06370d81259' },
    { title: 'Outdoors', id: '4d4b7105d754a06377d81259'},
    { title: 'Coffee', id: '4bf58dd8d48988d1e0931735'},
    { title: 'Nightlife', id: '4d4b7105d754a06376d81259'}
  ];

  $scope.chooseCategory = function(categoryId) {
    $scope.categoryId = categoryId;
  }

  $scope.randomVenueSearch = function() {
    var base_url = "https://api.foursquare.com/v2/venues/search?";
    var client_id = "client_id=" + "NGDMGFSBXHKBKHJDJ0JL4BD3GD00LVCWLGWFMO4MXT2LT2TM" + "&";
    var client_secret = "client_secret=" + "QGKCATFKGL40EGWMICCKCIK5KCJ4XEYQ0KL5OIAYOTOAALVI" + "&";
    var version = "v=" + "20150606" + "&";
    var location = "ll=" + currentLocation.latitude() + "," + currentLocation.longitude() + "&";

    var categoryId = "categoryId=" + $scope.categoryId + "&";
    var limit = "limit=" + "50" + "&";
    var radius = "radius=" + $scope.radius.distance;
    // more intelligence variables - based on rates, your past places, etc. 

    var url = base_url + client_id + client_secret + version + location + categoryId + limit + radius;

    // http.get obtains information from the url and handles data in JSON format
    $http.get(url)
      .success(function(data){
        if (data.response.venues.length == 0) {
          $scope.venue.id = '';
        } else {
          random_number = parseInt((Math.random() * 10));
          $scope.venue.id = data.response.venues[random_number].id;
          $scope.venue.name = data.response.venues[random_number].name;
          $scope.venue.lat = data.response.venues[random_number].location.lat;
          $scope.venue.lng = data.response.venues[random_number].location.lng;
          $scope.venue.address = data.response.venues[random_number].location.address;
          $scope.venue.checkinsCount = data.response.venues[random_number].stats.checkinsCount;
          $scope.venue.tipCount = data.response.venues[random_number].stats.tipCount;
          $scope.venue.hereNow = data.response.venues[random_number].hereNow.count;
          console.log(data.response.venues[random_number]);
        }
      }).finally(function() {
        $scope.loading = false;
      });
  }


  // Logic to display modal, and what to do when opens or closes
  $ionicModal.fromTemplateUrl('my-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.openModal = function() {
      $scope.modal.show();
      $scope.venue.id = "";
      $scope.loading = true;
      $scope.randomVenueSearch();
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };

});
