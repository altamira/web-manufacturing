'use strict';

angular.module('altamiraAppControllers')
	.controller('BOMListCtrl', function($scope, $http, $location, $routeParams) {

        $scope.search = {
        	criteria : '',
        	run : function() {
	        	if (this.criteria.trim().length > 0) {
	        		$http({
			            method: 'GET',
			            url: 'http://data.altamira.com.br/manufacturing/bom/search/',
			            params: { "search": this.criteria, "start": 0, "max": 10}, 
			            headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
			        }).then(function(response) {
			            $scope.orders = response.data;
			        });
	        	} else {
	        		$http({
			            method: 'GET',
			            url: 'http://data.altamira.com.br/manufacturing/bom/',
			            params: {"start": 0, "max": 10},
			            headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
			        }).then(function(response) {
			            $scope.orders = response.data;
			        });
	        	}
	        }
        }

	});