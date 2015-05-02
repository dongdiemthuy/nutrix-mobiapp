
angular.module('starter.controllers', [])
.constant('baseurl', 'http://192.168.1.87:7777')
.controller('AppCtrl', function($scope, $ionicModal, $timeout, baseurl) {
  // Form data for the login modal
  $scope.loginData = {};
  $scope.modal = [];

  // $scope.registrationData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal['login'] = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal['login'].hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal['login'].show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

  $ionicModal.fromTemplateUrl('templates/registration.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal['registration'] = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeRegistration = function() {
    $scope.modal['registration'].hide();
  };

  // Open the login modal
  $scope.registration = function() {
    $scope.modal['registration'].show();
  };

  // Perform the login action when the user submits the login form
  $scope.doRegistration = function() {
    console.log('Doing registration', $scope.registrationData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeRegistration();
    }, 1000);
  };
})

// .controller('NutrientlistsCtrl', function($scope, $http) {
//   $scope.nutrients = [];
//    $http.get('http://localhost:7777/nutrix-app/ws/nutrix/adm/nutrient').then(function(resp) {
//     console.log('Success', resp);
//     $scope.nutrients = resp.data.collection;
//   }, function(err) {
//     console.error('ERR', err);
//   })
// })

.controller('NutrientlistsCtrl', function($scope, $http, baseurl) {
  $scope.nutrients = [];
  $scope.nutrientMeta = {};

  $scope.nutrientMeta['start'] = 0;
  $scope.nutrientMeta['limit'] = 150;
  //$scope.nutrientMeta['range'] = 150;

  $scope.loadMoreNutrients = function() {
    $http.get(baseurl + '/nutrix-app/ws/nutrix/adm/nutrient', {
      params: {
         offset: $scope.nutrientMeta['start'],
         max: $scope.nutrientMeta['limit']
      }
    }).then(function(resp) {
        console.log('Success', resp);
        $scope.nutrients = $scope.nutrients.concat(resp.data.collection);
        $scope.nutrientMeta['start'] += resp.data.collection.length;
        $scope.$broadcast('scroll.infiniteScrollComplete');
      }, function(err) {
        console.error('ERR', err);
      });
  };

  $scope.$on('$stateChangeSuccess', function() {
    //$scope.loadMoreIngredients();
  });
})

.controller('NutrientDetailCtrl', function($scope, $http, $stateParams, baseurl) {

    $scope.nutrient = [];
    var id = $stateParams.id;
    $http.get(baseurl + '/nutrix-app/ws/nutrix/adm/nutrient/' + id).then(function(resp) {
    console.log('Success', resp);
    $scope.nutrient = resp.data;
    
  }, function(err) {
    console.error('ERR', err);
  
  })
})

.controller('IngredientlistsCtrl', function($scope, $http, nutrientList, baseurl) {
  $scope.ingredients = [];
  $scope.ingredientMeta = {};

  $scope.init = function() {
    $scope.ingredients = [];
    $scope.ingredientMeta['total'] = -1;
    $scope.ingredientMeta['start'] = 0;
    $scope.ingredientMeta['limit'] = 30;
    $scope.ingredientMeta['range'] = 50;
    delete $scope.ingredientMeta['query'];
  }

  $scope.moreDataCanBeLoaded = function() {
    console.log('aaaa');
    if (($scope.ingredientMeta['total'] == -1) || 
        ($scope.ingredientMeta['start'] < $scope.ingredientMeta['total'])) {
      return true;
    }
    return false;
  }

  $scope.loadMoreIngredients = function() {
    var myparams = {
        offset: $scope.ingredientMeta['start'],
        max: $scope.ingredientMeta['limit']
    }

    if ($scope.ingredientMeta['query'] != undefined && $scope.ingredientMeta['query'] != null) {
      myparams['q'] = $scope.ingredientMeta['query'];
    }

    $http.get(baseurl + '/nutrix-app/ws/nutrix/adm/ingredient', {
        params: myparams
      }).then(function(resp) {
          console.log('Success', resp);
          $scope.ingredientMeta['total'] = resp.data.total;
          $scope.ingredients = $scope.ingredients.concat(resp.data.collection);
          $scope.ingredientMeta['start'] += resp.data.collection.length;
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }, function(err) {
          console.error('ERR', err);
        });
  };

  $scope.$on('$stateChangeSuccess', function() {
    $scope.loadMoreIngredients();
  });

  $scope.doSearchIngredients = function(q) {
      console.log('doSearchIngredients');
      $scope.init();
      $scope.ingredientMeta['query'] = q;
      $scope.loadMoreIngredients();
  };

  $scope.init();
 
})


.controller('IngredientDetailCtrl', function($scope, $http, $stateParams,nutrientList, baseurl) {

    $scope.ingredient = [];
    var id = $stateParams.id;
    $http.get(baseurl + '/nutrix-app/ws/nutrix/adm/ingredient/' + id).then(function(resp) {
    console.log('Success', resp);
    $scope.ingredient = resp.data;
    
  }, function(err) {
    console.error('ERR', err);
  })
     $scope.getNutrientUnitType = function(id) {
        // console.log(id);
        return nutrientList.getNutrient(id).unitType;
    };
})

.factory('nutrientList', function() {
    var nutrients = {};

    return {
        setNutrients: function(_nutrients) {
            for(var i=0; i<_nutrients.length; i++) {
                var _nutrient = _nutrients[i];
                nutrients[_nutrient.id] = _nutrient;
            }
        },
        getNutrients: function() {
            return nutrients;
        },
        getNutrient: function(id) {
            return nutrients[id];
        }
    }
})

.run(function(nutrientList, $http, baseurl) {

    $http.get(baseurl + '/nutrix-app/ws/nutrix/adm/nutrient', { 
        params: {
            offset: 0, max: 1000
        }
    })
    .success(function(data) {
        console.log(data);
        nutrientList.setNutrients(data.collection);
    });
});
