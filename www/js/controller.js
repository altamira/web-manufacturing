var altamiraAppControllers = angular.module('altamiraAppControllers', []);

altamiraAppControllers.controller('ManufacturingProcsSearchCtrl',
        function($scope, $http, $location, $routeParams, $localStorage) {
            $scope.startPage = $routeParams.start;
            $scope.maxRecord = 2;
            $scope.currentPage = 1;
            $scope.pageSize = 1;
            $scope.pageStack = [];
            $scope.searchText = '';

            $scope.loadBom = function(searchText) {
                var url = '';

                $scope.$storage = $localStorage.$default({
                    x: ''
                });
                $scope.deleteX = function() {
                    delete $scope.$storage.x;
                };
                $scope.searchText = $scope.$storage.x;
                if (searchText != '')
                {
                    $scope.deleteX();
                    $scope.$storage = $localStorage.$default({
                        x: searchText
                    });
                } else
                {
                    $scope.deleteX();
                }
                if ($scope.$storage.x == '' || $scope.$storage.x == undefined)
                {
                    url = 'http://data.altamira.com.br/manufacturing/process?start=' + $scope.startPage + '&max=' + $scope.maxRecord;
                }
                else
                {
                    url = 'http://data.altamira.com.br/manufacturing/process/search?search=' + $scope.$storage.x + '&start=' + $scope.startPage + '&max=' + $scope.maxRecord;
                }

                var httpRequest = $http({
                    method: 'GET',
                    url: url,
                    headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
                }).success(function(data) {
                    if (data != '')
                    {
                        $scope.processes = data;
                        $scope.range();
                    } else
                    {
                        $location.path('/manufacturing/process/' + (parseInt($scope.startPage) - 1));
                    }
                });
            };
            $scope.searchProcess = function(searchVal) {
                $scope.searchText = searchVal;
                $scope.loadBom($scope.searchText);
            };
            if ($scope.searchText == '')
            {
                $scope.loadBom($scope.searchText);
            }

            $scope.newProcess = function() {
                $location.path('/manufacturing/create/process');
            }
            $scope.goPage = function(pageNumber) {
                var nextPage = parseInt(pageNumber) - 1;
                $location.path('/manufacturing/process/' + nextPage);
            }
            $scope.nextPage = function(len) {
                var nextPage = parseInt(len);
                $location.path('/manufacturing/process/' + nextPage);
            }
            $scope.prevPage = function(nextPage) {
                $location.path('/manufacturing/process/' + nextPage);
            }
            $scope.goUpdate = function(processId) {
                $location.path('/manufacturing/update/process/' + processId);
            }
            $scope.range = function() {
                var start = parseInt($scope.startPage) + 1;
                var input = [];
                for (var i = 1; i <= start; i++)
                    $scope.pageStack.push(i);
            };
        });

altamiraAppControllers.controller('ManufacturingProcessCreateCtrl', ['$scope', '$http', '$location',
    function($scope, $http, $location) {
        $scope.processData = {};
        $scope.postdata = {};
        $scope.submitCreateProcess = function(isValid) {
            if (isValid) {
                $scope.postdata.code = $scope.processData.code;
                $scope.postdata.description = $scope.processData.description;
                console.log(JSON.stringify($scope.postdata));
                $http({
                    method: 'POST',
                    url: 'http://data.altamira.com.br/manufacturing/process/',
                    data: $scope.postdata, // pass in data as strings
                    headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
                }).success(function(data, status, headers, config) {

                    $location.path('/manufacturing/update/process/' + data.id);

                }).error(function(data, status, headers, config) {
                    console.log(data);
                    console.log(status);
                    console.log(headers);
                    console.log(config);
                });
            }
        };
        $scope.goBack = function() {
            $location.path('/manufacturing/process/' + 0);
        };
    }]);
altamiraAppControllers.controller('ManufacturingProcessUpdateCtrl', ['$scope', '$http', '$location', '$routeParams',
    function($scope, $http, $location, $routeParams) {
        $scope.processId = $routeParams.processId;
        $scope.processData = {};
        $scope.loadProcess = function() {
            $http({
                method: 'GET',
                url: 'http://data.altamira.com.br/manufacturing/process/' + $scope.processId,
                headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
            }).success(function(data) {
                console.log(data);
                $scope.processData.id = data.id;
                $scope.processData.code = data.code;
                $scope.processData.description = data.description;
            });
        };
        $scope.loadProcess();
        $scope.submitUpdateProcess = function(isValid) {
            if (isValid) {
                $scope.postdata = {};
                $scope.postdata.id = $scope.processData.id;
                $scope.postdata.code = $scope.processData.code;
                $scope.postdata.description = $scope.processData.description;
                console.log(JSON.stringify($scope.postdata));
                $http({
                    method: 'PUT',
                    url: 'http://data.altamira.com.br/manufacturing/process/' + $scope.postdata.id,
                    data: $scope.postdata, // pass in data as strings
                    headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
                }).success(function(data, status, headers, config) {

                    $location.path('/manufacturing/update/process/' + data.id);

                }).error(function(data, status, headers, config) {
                    console.log(data);
                    console.log(status);
                    console.log(headers);
                    console.log(config);
                });
            }
        };
        $scope.goBack = function() {
            $location.path('/manufacturing/process/' + 0);
        };
        $scope.updateOperation = function() {
            $location.path('/manufacturing/process/operation/' + $scope.processId);
        };
    }]);
altamiraAppControllers.controller('ManufacturingProcessOperationCtrl', ['$scope', '$http', '$location', '$routeParams', '$upload',
    function($scope, $http, $location, $routeParams, $upload) {
        $scope.processId = $routeParams.processId;
        $scope.operationData = {};
        $scope.operationData.sequence = '';
        $scope.operationData.name = '';
        $scope.operationData.description = '';
        $scope.operationData.sketch = '';
        $scope.submitOperationForm = function(isValid) {
            if (isValid) {
                $scope.postdata = {};
                $scope.postdata.sequence = parseInt($scope.operationData.sequence);
                $scope.postdata.name = $scope.operationData.name;
                $scope.postdata.description = $scope.operationData.description;
                $scope.postdata.sketch = $scope.operationData.sketch;
//                $scope.postdata.sketch = "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wgARCAAeAB4DASIAAhEBAxEB/8QAGAAAAwEBAAAAAAAAAAAAAAAABAUGAgP/xAAXAQEAAwAAAAAAAAAAAAAAAAACAAQF/9oADAMBAAIQAxAAAAF0FPYz6ndA3EaHftVrIM/UTjn/xAAdEAABBAMBAQAAAAAAAAAAAAABAAIDEgQREyEi/9oACAEBAAEFAu9U7JDlNtSXv1uvqxBaG+EjTm+MyE8rLgZwkj5iQ/BZs//EABcRAQEBAQAAAAAAAAAAAAAAAAEAERL/2gAIAQMBAT8B7YkyG//EABsRAAEEAwAAAAAAAAAAAAAAAAABAhESITFR/9oACAECAQE/Aa9G4JRdjYP/xAAiEAABBAEDBQEAAAAAAAAAAAABAAIRITEDEmEQQVFisYH/2gAIAQEABj8Cu+ERj8VQVu0rOFlXKvaPqJ3WfCbMyMrT7zlS0V0a1oiz8Kbw5EeqK//EAB4QAQEBAQACAgMAAAAAAAAAAAERACFRcYGxMWHB/9oACAEBAAE/ISbwD5aiD4Ssoec8YOFhUl3BOVcPIP1rbp5L1ocB+g/ekXpQukePWLIWqrqfC80QWfZfzFW+nw42axF1sT8u/9oADAMBAAIAAwAAABA76ND/xAAXEQADAQAAAAAAAAAAAAAAAAAAAREx/9oACAEDAQE/EEw3WQFj/8QAFxEBAQEBAAAAAAAAAAAAAAAAAQARIf/aAAgBAgEBPxDsyAOnZxkI4X//xAAhEAEAAgICAgIDAAAAAAAAAAABESEAQTFRYYFxkaHB8P/aAAgBAQABPxBUI7lPs4IBtfYzFx6y6ZBrIHneMSyCBBvjqRyXVKnl1zixNJGJDXM4uWUwQaOzV7qsAHAp0+QMYM8iKRBB+3nEGgtzI19YRjANFtN/3OA0lgBSrfGBQXKHSb5Zh+OsU0UpFUmvOQdolVZv5xmYdxn/2Q==";
                $scope.postdata.consume = [];
                $scope.postdata.produce = [];
                console.log(JSON.stringify($scope.postdata));
//                {"id":446,"sequence":23,"name":"asd fasdf asdfasdf","description":"asdfasdf asf asdf asdf","sketch":"","consume":[],"produce":[]}
                $http({
                    method: 'POST',
                    url: 'http://data.altamira.com.br/manufacturing/process/'+$scope.processId+'/operation',
                    data: $scope.postdata, // pass in data as strings
                    headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
                }).success(function(data, status, headers, config) {

                    console.log(data);

                }).error(function(data, status, headers, config) {
                    console.log(data);
                    console.log(status);
                    console.log(headers);
                    console.log(config);
                });
            }
        };
        $scope.goBack = function() {
            $location.path('/manufacturing/update/process/' + $scope.processId);
        };
    }]);
altamiraAppControllers.controller('ManufacturingProcessOperationUsoCtrl', ['$scope', '$http', '$location', '$routeParams', '$upload',
    function($scope, $http, $location, $routeParams, $upload) {
    }]);