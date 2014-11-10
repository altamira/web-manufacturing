var altamiraAppControllers = angular.module('altamiraAppControllers', []);

altamiraAppControllers.controller('ManufacturingProcsSearchCtrl',
        function($scope, $http, $location, $routeParams, $localStorage) {
            $scope.startPage = $routeParams.start;
            $scope.maxRecord = 4;
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

                $scope.processData.id = data.id;
                $scope.processData.code = data.code;
                $scope.processData.description = data.description;
                $scope.processData.revisions = data.revision;
                $scope.processData.operations = data.operation;
                $scope.orderProp = 'id';

                $scope.operationDetail = {};
                var counter = 1;
                var mainCounter = 1;
                for (var i in $scope.processData.operations)
                {
                    $scope.operationDetail[mainCounter] = {};
                    $scope.operationDetail[mainCounter]["id"] = $scope.processData.operations[i].id;
                    $scope.operationDetail[mainCounter]["sequence"] = $scope.processData.operations[i].sequence;
                    $scope.operationDetail[mainCounter]["name"] = $scope.processData.operations[i].name;
                    $scope.operationDetail[mainCounter]["description"] = $scope.processData.operations[i].description;
                    $scope.operationDetail[mainCounter].item = {};
                    $scope.operationDetail[mainCounter].class = '';
                    if ((mainCounter % 2) == 0)
                    {
                        $scope.operationDetail[mainCounter].class = 'last';
                    }
                    for (var j in $scope.processData.operations[i])
                    {
                        if (j == 'produce')
                        {
                            $scope.temp = {};
                            for (var k in $scope.processData.operations[i][j])
                            {
                                $scope.temp = $scope.processData.operations[i][j][k];
                                $scope.temp['type'] = 'produto';
                                $scope.temp['alias'] = 'P';
                                $scope.operationDetail[mainCounter].item[counter] = $scope.temp;
                                counter++;
                            }
                        }
                        if (j == 'consume')
                        {
                            $scope.temp = {};
                            for (var k in $scope.processData.operations[i][j])
                            {
                                $scope.temp = $scope.processData.operations[i][j][k];
                                $scope.temp['type'] = 'consumo';
                                $scope.temp['alias'] = 'C';
                                $scope.operationDetail[mainCounter].item[counter] = $scope.temp;
                                counter++;
                            }
                        }

                    }

                    mainCounter++;
                }
                console.log($scope.operationDetail);
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
        $scope.goUpdateOperation = function(operationId) {
            $location.path('/manufacturing/process/operation/update/' + $scope.processId + '/' + operationId);
        };
        $scope.goUpdateOperationType = function(operationType, operationTypeId, operationId) {
            if (operationType == 'produto')
            {
                $location.path('/manufacturing/process/operation/produce/update/' + $scope.processId + '/' + operationId + '/' + operationTypeId);
            }
            if (operationType == 'consumo')
            {
                $location.path('/manufacturing/process/operation/consume/update/' + $scope.processId + '/' + operationId + '/' + operationTypeId);
            }
        };
        $scope.removeOperation = function(operationId) {
            $http({
                method: 'DELETE',
                url: 'http://data.altamira.com.br/manufacturing/process/' + $scope.processId + '/operation/' + operationId,
            }).success(function(data) {
                $location.path('/manufacturing/update/process/' + $scope.processId);
            });
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
                $scope.postdata.consume = [];
                $scope.postdata.produce = [];
                console.log(JSON.stringify($scope.postdata));
                $http({
                    method: 'POST',
                    url: 'http://data.altamira.com.br/manufacturing/process/' + $scope.processId + '/operation',
                    data: $scope.postdata, // pass in data as strings
                    headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
                }).success(function(data, status, headers, config) {
                    console.log(data);
                    $location.path('/manufacturing/process/operation/update/' + $scope.processId + '/' + data.id);

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

altamiraAppControllers.controller('ManufacturingProcessUpdateOperationCtrl', ['$scope', '$http', '$location', '$routeParams', '$upload',
    function($scope, $http, $location, $routeParams, $upload) {
        $scope.processId = $routeParams.processId;
        $scope.operationId = $routeParams.operationId;
        $scope.operationData = {};
        $scope.operationData.sequence = '';
        $scope.operationData.name = '';
        $scope.operationData.description = '';
        $scope.operationData.sketch = '';
        $scope.loadOperation = function() {
            var httpRequest = $http({
                method: 'GET',
                url: 'http://data.altamira.com.br/manufacturing/process/' + $scope.processId + '/operation/' + $scope.operationId,
                headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
            }).success(function(data) {
                if (data != '')
                {
                    $scope.operationData.sequence = data.sequence;
                    $scope.operationData.name = data.name;
                    $scope.operationData.description = data.description;
                    $scope.operationData.sketch = data.sketch;
                    $scope.operationData.consume = data.consume;
                    $scope.operationData.produce = data.produce;
                }
            });
        };
        $scope.loadOperation();
        $scope.submitOperationForm = function(isValid) {
            if (isValid) {
                $scope.postdata = {};
                $scope.postdata.id = parseInt($scope.processId);
                $scope.postdata.sequence = parseInt($scope.operationData.sequence);
                $scope.postdata.name = $scope.operationData.name;
                $scope.postdata.description = $scope.operationData.description;
                $scope.postdata.sketch = '';
//                $scope.postdata.sketch = $scope.operationData.sketch;
                $scope.postdata.consume = [];
                $scope.postdata.produce = [];
                console.log(JSON.stringify($scope.postdata));
                $http({
                    method: 'PUT',
                    url: 'http://data.altamira.com.br/manufacturing/process/' + $scope.processId + '/operation/' + $scope.operationId,
                    data: $scope.postdata, // pass in data as strings
                    headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
                }).success(function(data, status, headers, config) {

                    $location.path('/manufacturing/process/operation/update' + $scope.processId + '/' + $scope.operationId);

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
        $scope.createUso = function() {
            $location.path('/manufacturing/process/operation/uso/' + $scope.processId + '/' + $scope.operationId);
        };
        $scope.createConsume = function() {
            $location.path('/manufacturing/process/operation/consume/' + $scope.processId + '/' + $scope.operationId);
        };
        $scope.createProduce = function() {
            $location.path('/manufacturing/process/operation/produce/' + $scope.processId + '/' + $scope.operationId);
        };
        $scope.removeOperationType = function(type, typeId) {
            if (type == 'consume')
            {
                $http({
                    method: 'DELETE',
                    url: 'http://data.altamira.com.br/manufacturing/process/' + $scope.processId + '/operation/' + $scope.operationId + '/consume/' + typeId,
                }).success(function(data) {
                    $location.path('/manufacturing/process/operation/update/' + $scope.processId + '/' + $scope.operationId);
                });
            }
            if (type == 'produce')
            {
                $http({
                    method: 'DELETE',
                    url: 'http://data.altamira.com.br/manufacturing/process/' + $scope.processId + '/operation/' + $scope.operationId + '/produce/' + typeId,
                }).success(function(data) {
                    $location.path('/manufacturing/process/operation/update/' + $scope.processId + '/' + $scope.operationId);
                });
            }

            $location.path('/manufacturing/process/operation/produce/' + $scope.processId + '/' + $scope.operationId);
        };
    }]);

altamiraAppControllers.controller('ManufacturingProcessOperationConsumeCtrl', ['$scope', '$http', '$location', '$routeParams', '$upload',
    function($scope, $http, $location, $routeParams, $upload) {
        $scope.processId = $routeParams.processId;
        $scope.operationId = $routeParams.operationId;
        $scope.consumeId = $routeParams.consumeId;

        $scope.consumeData = {};
        if ($scope.consumeId != '' && $scope.consumeId != undefined)
        {
            $http({
                method: 'GET',
                url: 'http://data.altamira.com.br/manufacturing/process/' + $scope.processId + '/operation/' + $scope.operationId + '/consume/' + $scope.consumeId,
                headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
            }).success(function(data, status, headers, config) {
                console.log(data);
                $scope.consumeData.code = data.code;
                $scope.consumeData.description = data.description;
                $scope.consumeData.quantity = data.quantity;
                $scope.consumeData.unit = data.unit;

            }).error(function(data, status, headers, config) {
                console.log(data);
                console.log(status);
                console.log(headers);
                console.log(config);
            });
        }
        else
        {
            $scope.consumeData.code = '';
            $scope.consumeData.description = '';
            $scope.consumeData.quantity = '';
            $scope.consumeData.unit = '';
        }

        $scope.submitConsumeForm = function(isValid) {
            if (isValid) {
                $scope.postdata = {};
                var method = 'POST';
                var url = 'http://data.altamira.com.br/manufacturing/process/' + $scope.processId + '/operation/' + $scope.operationId + '/consume';
                if ($scope.consumeId != '' && $scope.consumeId != undefined)
                {
                    $scope.postdata.id = $scope.consumeId
                    method = 'PUT';
                    url = 'http://data.altamira.com.br/manufacturing/process/' + $scope.processId + '/operation/' + $scope.operationId + '/consume/' + $scope.consumeId;
                }
                $scope.postdata.code = $scope.consumeData.code;
                $scope.postdata.description = $scope.consumeData.description;
                $scope.postdata.quantity = parseInt($scope.consumeData.quantity);
                $scope.postdata.unit = $scope.consumeData.unit;
                console.log(JSON.stringify($scope.postdata));
                $http({
                    method: method,
                    url: url,
                    data: $scope.postdata, // pass in data as strings
                    headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
                }).success(function(data, status, headers, config) {
                    console.log(data);
                    $location.path('/manufacturing/process/operation/consume/update/' + $scope.processId + '/' + $scope.operationId + '/' + data.id);

                }).error(function(data, status, headers, config) {
                    console.log(data);
                    console.log(status);
                    console.log(headers);
                    console.log(config);
                });
            }
        };
        $scope.goBack = function() {
            $location.path('/manufacturing/process/operation/update/' + $scope.processId + '/' + $scope.operationId);
        };
    }]);

altamiraAppControllers.controller('ManufacturingProcessOperationProduceCtrl', ['$scope', '$http', '$location', '$routeParams', '$upload',
    function($scope, $http, $location, $routeParams, $upload) {
        $scope.processId = $routeParams.processId;
        $scope.operationId = $routeParams.operationId;
        $scope.produceId = $routeParams.produceId;

        $scope.produceData = {};
        if ($scope.produceId != '' && $scope.produceId != undefined)
        {
            $http({
                method: 'GET',
                url: 'http://data.altamira.com.br/manufacturing/process/' + $scope.processId + '/operation/' + $scope.operationId + '/produce/' + $scope.produceId,
                headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
            }).success(function(data, status, headers, config) {
                console.log(data);
                $scope.produceData.code = data.code;
                $scope.produceData.description = data.description;
                $scope.produceData.quantity = data.quantity;
                $scope.produceData.unit = data.unit;

            }).error(function(data, status, headers, config) {
                console.log(data);
                console.log(status);
                console.log(headers);
                console.log(config);
            });
        }
        else
        {
            $scope.produceData.code = '';
            $scope.produceData.description = '';
            $scope.produceData.quantity = '';
            $scope.produceData.unit = '';
        }

        $scope.submitProduceForm = function(isValid) {
            if (isValid) {
                $scope.postdata = {};
                var method = 'POST';
                var url = 'http://data.altamira.com.br/manufacturing/process/' + $scope.processId + '/operation/' + $scope.operationId + '/produce';
                if ($scope.produceId != '' && $scope.produceId != undefined)
                {
                    $scope.postdata.id = $scope.produceId
                    method = 'PUT';
                    url = 'http://data.altamira.com.br/manufacturing/process/' + $scope.processId + '/operation/' + $scope.operationId + '/produce/' + $scope.produceId;
                }
                $scope.postdata.code = $scope.produceData.code;
                $scope.postdata.description = $scope.produceData.description;
                $scope.postdata.quantity = parseInt($scope.produceData.quantity);
                $scope.postdata.unit = $scope.produceData.unit;
                console.log(JSON.stringify($scope.postdata));
                $http({
                    method: method,
                    url: url,
                    data: $scope.postdata, // pass in data as strings
                    headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
                }).success(function(data, status, headers, config) {
                    console.log(data);
                    $location.path('/manufacturing/process/operation/produce/update/' + $scope.processId + '/' + $scope.operationId + '/' + data.id);

                }).error(function(data, status, headers, config) {
                    console.log(data);
                    console.log(status);
                    console.log(headers);
                    console.log(config);
                });
            }
        };
        $scope.goBack = function() {
            $location.path('/manufacturing/process/operation/update/' + $scope.processId + '/' + $scope.operationId);
        };
    }]);

altamiraAppControllers.controller('ManufacturingProcessOperationUsoCtrl', ['$scope', '$http', '$location', '$routeParams', '$upload',
    function($scope, $http, $location, $routeParams, $upload) {
        $scope.processId = $routeParams.processId;
        $scope.operationId = $routeParams.operationId;
        $scope.usoId = $routeParams.usoId;

        $scope.usoData = {};
        if ($scope.usoId != '' && $scope.usoId != undefined)
        {
            $http({
                method: 'GET',
                url: 'http://data.altamira.com.br/manufacturing/process/' + $scope.processId + '/operation/' + $scope.operationId + '/uso/' + $scope.usoId,
                headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
            }).success(function(data, status, headers, config) {
                console.log(data);
                $scope.usoData.code = data.code;
                $scope.usoData.description = data.description;
                $scope.usoData.quantity = data.quantity;
                $scope.usoData.unit = data.unit;

            }).error(function(data, status, headers, config) {
                console.log(data);
                console.log(status);
                console.log(headers);
                console.log(config);
            });
        }
        else
        {
            $scope.usoData.code = '';
            $scope.usoData.description = '';
            $scope.usoData.quantity = '';
            $scope.usoData.unit = '';
        }

        $scope.submitUsoForm = function(isValid) {
            if (isValid) {
                $scope.postdata = {};
                var method = 'POST';
                var url = 'http://data.altamira.com.br/manufacturing/process/' + $scope.processId + '/operation/' + $scope.operationId + '/uso';
                if ($scope.usoId != '' && $scope.usoId != undefined)
                {
                    $scope.postdata.id = $scope.usoId
                    method = 'PUT';
                    url = 'http://data.altamira.com.br/manufacturing/process/' + $scope.processId + '/operation/' + $scope.operationId + '/uso/' + $scope.usoId;
                }
                $scope.postdata.code = $scope.usoData.code;
                $scope.postdata.description = $scope.usoData.description;
                $scope.postdata.quantity = parseInt($scope.usoData.quantity);
                $scope.postdata.unit = $scope.usoData.unit;
                console.log(JSON.stringify($scope.postdata));
                $http({
                    method: method,
                    url: url,
                    data: $scope.postdata, // pass in data as strings
                    headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
                }).success(function(data, status, headers, config) {
                    console.log(data);
                    $location.path('/manufacturing/process/operation/uso/update/' + $scope.processId + '/' + $scope.operationId + '/' + data.id);

                }).error(function(data, status, headers, config) {
                    console.log(data);
                    console.log(status);
                    console.log(headers);
                    console.log(config);
                });
            }
        };
        $scope.goBack = function() {
            $location.path('/manufacturing/process/operation/update/' + $scope.processId + '/' + $scope.operationId);
        };
    }]);
altamiraAppControllers.controller('BomItemCreateCtrl', ['$scope', '$http', '$location', '$routeParams', '$upload',
    function($scope, $http, $location, $routeParams, $upload) {

    }]);
altamiraAppControllers.controller('BomPartCreateCtrl', ['$scope', '$http', '$location', '$routeParams', '$upload',
    function($scope, $http, $location, $routeParams, $upload) {

    }]);