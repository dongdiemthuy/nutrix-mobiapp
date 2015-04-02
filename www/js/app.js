// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  // .state('app.createmenu', {
  //     url: "/createmenu",
  //     views: {
  //       'menuContent': {
  //         templateUrl: "templates/createmenu.html"
  //       }
  //     }
  //   })

  .state('app.ingredient', {
    url: "/ingredient",
    views: {
      'menuContent': {
        templateUrl: "templates/ingredient.html",
        controller: 'IngredientlistsCtrl'
      }
    }
  })

  .state('app.ingredientdetail', {
    url: "/ingredient/:id",
    views: {
      'menuContent': {
        templateUrl: "templates/detailingredient.html",
        controller: 'IngredientDetailCtrl'
      }
    }
  })
  
  .state('app.nutrients', {
      url: "/nutrientlists",
      views: {
        'menuContent': {
          templateUrl: "templates/nutrient.html",
          controller: 'NutrientlistsCtrl'
        }
      }
    })

  .state('app.single', {
    url: "/nutrient/:id",
    views: {
      'menuContent': {
        templateUrl: "templates/detailnutrientlist.html",
        controller: 'NutrientDetailCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/nutrientlists');
});

