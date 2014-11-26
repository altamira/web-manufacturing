'use strict';

angular.module('altamiraAppControllers').controller('BomEditCtrl', function($scope, $http, $location, $routeParams) {
    $scope.bomId = $routeParams.bomId;
    $scope.project = '';
    $scope.bomData = {};
    $scope.bomData.number = '';
    $scope.bomData.project = '';
    $scope.bomData.customer = '';
    $scope.bomData.representative = '';
    $scope.bomData.finish = '';
    $scope.bomData.quotation = '';
    $scope.bomData.created = '';
    $scope.bomData.delivery = '';
    var httpRequest = $http({
        method: 'GET',
        url: 'http://data.altamira.com.br/data-rest-0.7.0-SNAPSHOT/data-rest-0.7.0-SNAPSHOT/manufacturing/bom/' + $scope.bomId,
        headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
    }).success(function(data) {
        console.log(JSON.stringify(data));
        if (data != '')
        {
            $scope.bomData.number = data.number;
            $scope.bomData.project = data.project;
            $scope.bomData.customer = data.customer;
            $scope.bomData.representative = data.representative;
            $scope.bomData.finish = data.finish;
            $scope.bomData.quotation = data.quotation;
            var createdDate = new Date(data.created);
            var deliveryDate = new Date(data.delivery);

            $scope.bomData.created = createdDate.getDate()+'/'+createdDate.getMonth()+'/'+createdDate.getFullYear();
            $scope.bomData.delivery = deliveryDate.getDate()+'/'+deliveryDate.getMonth()+'/'+deliveryDate.getFullYear();
            $scope.bomData.items = data.items;
        }
    });
});
altamiraAppControllers.filter('setDecimal', function ($filter) {
    return function (input, places) {
        if (isNaN(input)) return input;
        // If we want 1 decimal place, we want to mult/div by 10
        // If we want 2 decimal places, we want to mult/div by 100, etc
        // So use the following to create that factor
        var factor = "1" + Array(+(places > 0 && places + 1)).join("0");
        return Math.round(input * factor) / factor;
    };
});