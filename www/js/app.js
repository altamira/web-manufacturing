// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var altamiraApp = angular.module('altamira', ['ionic','altamiraAppControllers', 'ngRoute','angularUtils.directives.dirPagination'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)''
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

altamiraApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/manufacturing/process/:start', {
        templateUrl: 'templates/mf-process-list.html',
        controller: 'ManufacturingProcsSearchCtrl'
      }).when('/manufacturing/process/create', {
        templateUrl: 'templates/mf-create.html',
        controller: 'ManufacturingProcsCreateCtrl'
      }).when('/manufacturing/bom', {
        templateUrl: 'templates/bom/list.html',
        controller: 'BOMListCtrl'
      }).when('/manufacturing/bom/edit', {
        templateUrl: 'templates/bom/edit.html',
        controller: 'BOMEditCtrl',
        resolve: {
          bom: function() {
            var dt = new Date();
            dt.setHours(0,0,0,0);
            return {'id': 0, 'number': '', 'customer': 'xxxxxxxxxx', 'representative': '', 'created': dt.getTime(), 'delivery': dt.getTime(), 'quotation': '', 'comment': '', 'finish': '', 'project': 0, 'checked': 0, 'items' : []};
          }
        }
      }).when('/manufacturing/bom/edit/:id', {
        templateUrl: 'templates/bom/edit.html',
        controller: 'BOMEditCtrl',
        resolve: {
            bom: function($http, $route) {
                return $http({
                    method: 'GET',
                    url: 'http://data.altamira.com.br/manufacturing/bom/' + $route.current.params.id,
                    headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
                }).then(function(response) {
                    return response.data;
                });
            }
        }
      }).when('/manufacturing/bom/:id', {
        templateUrl: 'templates/bom/view.html',
        controller: 'BOMListCtrl',
        resolve: {
            bom: function($http, $route) {
                return $http({
                    method: 'GET',
                    url: 'http://data.altamira.com.br/manufacturing/bom/' + $route.current.params.id,
                    headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
                }).then(function(response) {
                    return response.data;
                });
            }
        }
      }).otherwise({
        redirectTo: '/manufacturing/process/0'
      });
  }]);