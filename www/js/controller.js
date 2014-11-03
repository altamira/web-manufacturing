var altamiraAppControllers = angular.module('altamiraAppControllers', []);

altamiraAppControllers.controller('ManufacturingProcsSearchCtrl',
        function($scope, $http, $location, $routeParams) {
            $scope.startPage = $routeParams.start;
            $scope.maxRecord = 1;
            $scope.currentPage = 1;
            $scope.pageSize = 1;
            $scope.pageStack = [];
            $scope.loadBom = function() {
                var httpRequest = $http({
                    method: 'GET',
                    url: 'http://data.altamira.com.br/manufacturing/process?start=' + $scope.startPage + '&max=' + $scope.maxRecord,
                    headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
                }).success(function(data) {
                    if (data != '')
                    {
                        $scope.processes = data;
                        $scope.range();
                    }else
                        {
                            $location.path('/manufacturing/process/' + (parseInt($scope.startPage) - 1 ));
                        }
                });
            };
            // default
            $scope.loadBom();
            $scope.newProcess = function() {
                $location.path('/manufacturing/process/create');
            }
            $scope.goPage = function(pageNumber) {
                var nextPage = parseInt(pageNumber) - 1;
                $location.path('/manufacturing/process/' + nextPage);
            }
            $scope.nextPage = function() {
                var nextPage = parseInt($scope.startPage) + parseInt($scope.maxRecord);
                $location.path('/manufacturing/process/' + nextPage);
            }
            $scope.prevPage = function(nextPage) {
                $location.path('/manufacturing/process/' + nextPage);
            }
            $scope.range = function() {
                var start = parseInt($scope.startPage) + 1;
                var input = [];
                for (var i = 1; i <= start; i++)
                    $scope.pageStack.push(i);
            };
        });
altamiraAppControllers.controller('ManufacturingProcsCreateCtrl',
        function($scope, $http, $location) {

        });