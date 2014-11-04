'use strict';

angular.module('altamiraAppControllers')
	.controller('BOMEditCtrl', function($scope, $http, $location, $routeParams, bom) {
		$scope.order = bom;
	});