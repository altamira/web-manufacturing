var altamiraAppControllers = angular.module('altamiraAppControllers', []);

altamiraAppControllers.controller('ManufacturingProcsSearchCtrl',
        function($scope, $http) {
            $scope.currentPage = 1;
            $scope.pageSize = 1;
            $scope.loadBom = function() {
                var httpRequest = $http({
                    method: 'GET',
                    url: 'http://data.altamira.com.br/manufacturing/process',
                    headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
                }).success(function(data) {

                    $scope.processes = data;
                });
            };
            // default
            $scope.loadBom();
        });