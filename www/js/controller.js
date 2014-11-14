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
                $scope.loading = true;
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
                    $scope.loading = false;
                    if (data != '')
                    {
                        $scope.processes = data;
                        $scope.range();
                    } else
                    {
                        $location.path('/manufacturing/process/' + (parseInt($scope.startPage) - 1));
                    }
                }).error(function(data, status, headers, config) {
                    $scope.loading = false;
                    alert("Please try again")
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
            $scope.loading = true;
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
                    $scope.loading = false;
                    $location.path('/manufacturing/update/process/' + data.id);
                }).error(function(data, status, headers, config) {
                    $scope.loading = false;
                    alert("Please try again")
                });
            }
        };
        $scope.goBack = function() {
            $location.path('/manufacturing/process/' + 0);
        };
    }]);

altamiraAppControllers.controller('ManufacturingProcessUpdateCtrl', ['$scope', '$http', '$location', '$routeParams', '$route',
    function($scope, $http, $location, $routeParams, $route) {
        $scope.processId = $routeParams.processId;
        $scope.processData = {};
        $scope.loadProcess = function() {
            $scope.loading = true;
            $http({
                method: 'GET',
                url: 'http://data.altamira.com.br/manufacturing/process/' + $scope.processId,
                headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
            }).success(function(data) {
                $scope.loading = false;
                $scope.processData.id = data.id;
                $scope.processData.version = data.version;
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
                        if (j == 'use')
                        {
                            $scope.temp = {};
                            for (var k in $scope.processData.operations[i][j])
                            {
                                $scope.temp = $scope.processData.operations[i][j][k];
                                $scope.temp['type'] = 'uso';
                                $scope.temp['alias'] = 'S';
                                $scope.operationDetail[mainCounter].item[counter] = $scope.temp;
                                counter++;
                            }
                        }

                    }

                    mainCounter++;
                }
            });
        };
        $scope.loadProcess();
        $scope.submitUpdateProcess = function(isValid) {
            $scope.loading = true;
            if (isValid) {
                $scope.postdata = {};
                $scope.postdata.id = $scope.processData.id;
                $scope.postdata.version = $scope.processData.version;
                $scope.postdata.code = $scope.processData.code;
                $scope.postdata.description = $scope.processData.description;
                $http({
                    method: 'GET',
                    url: 'http://data.altamira.com.br/manufacturing/process/' + $scope.processId,
                    headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
                }).success(function(data1) {
                    $scope.postdata.version = data1.version;
                    $http({
                        method: 'PUT',
                        url: 'http://data.altamira.com.br/manufacturing/process/' + $scope.postdata.id,
                        data: $scope.postdata, // pass in data as strings
                        headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
                    }).success(function(data, status, headers, config) {
                        $scope.loading = false;
                        $location.path('/manufacturing/process/0');
                    }).error(function(data, status, headers, config) {
                        $scope.loading = false;
                        alert("Please try again")
                    });
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
            if (operationType == 'uso')
            {
                $location.path('/manufacturing/process/operation/use/update/' + $scope.processId + '/' + operationId + '/' + operationTypeId);
            }
        };
        $scope.removeProcess = function() {
            $scope.loading = true;
            $http({
                method: 'DELETE',
                url: 'http://data.altamira.com.br/manufacturing/process/' + $scope.processId,
            }).success(function(data) {
                $scope.loading = false;
                $location.path('/manufacturing/process/0');
            }).error(function(data, status, headers, config) {
                $scope.loading = false;
                alert('Please try again');
            });
        };
        $scope.removeOperation = function(operationId) {
            $scope.loading = true;
            $http({
                method: 'DELETE',
                url: 'http://data.altamira.com.br/manufacturing/process/' + $scope.processId + '/operation/' + operationId,
            }).success(function(data) {
                $scope.loading = false;
                $route.reload();
            }).error(function(data, status, headers, config) {
                $scope.loading = false;
                alert('Please try again');
            });
        };
    }]);

altamiraAppControllers.controller('ManufacturingProcessCreateOperationCtrl', ['$scope', '$http', '$location', '$routeParams', '$upload',
    function($scope, $http, $location, $routeParams, $upload) {
        $scope.processId = $routeParams.processId;
        $scope.operationData = {};
        $scope.operationData.sequence = '';
        $scope.operationData.name = '';
        $scope.operationData.description = '';
        $scope.operationData.sketch = '';
        $scope.operationData.format = '';
        $scope.operationData.filename = '';
        $scope.operationData.filetype = '';
        $scope.submitOperationForm = function(isValid) {
            $scope.loading = true;
            if (isValid) {
                $scope.postdata = {};
                $scope.postdata.sequence = parseInt($scope.operationData.sequence);
                $scope.postdata.name = $scope.operationData.name;
                $scope.postdata.description = $scope.operationData.description;
                $scope.postdata.sketch = {
                    "version": 0,
                    "format": $scope.operationData.format,
                    "filename": $scope.operationData.filename,
                    "extension": $scope.operationData.filetype,
                    "image": $scope.operationData.sketch
                };
                $scope.postdata.consume = [];
                $scope.postdata.produce = [];
                $http({
                    method: 'POST',
                    url: 'http://data.altamira.com.br/manufacturing/process/' + $scope.processId + '/operation',
                    data: $scope.postdata, // pass in data as strings
                    headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
                }).success(function(data, status, headers, config) {
                    $scope.loading = false;
                    $location.path('/manufacturing/process/operation/update/' + $scope.processId + '/' + data.id);

                }).error(function(data, status, headers, config) {
                    $scope.loading = false;
                    alert('Please try again');
                });
            }
        };
        $scope.goBack = function() {
            $location.path('/manufacturing/update/process/' + $scope.processId);
        };

    }]);

altamiraAppControllers.controller('ManufacturingProcessUpdateOperationCtrl', ['$scope', '$http', '$location', '$routeParams', '$upload', '$route',
    function($scope, $http, $location, $routeParams, $upload, $route) {
        $scope.processId = $routeParams.processId;
        $scope.operationId = $routeParams.operationId;
        $scope.operationData = {};
        $scope.operationData.sequence = '';
        $scope.operationData.name = '';
        $scope.operationData.description = '';
        $scope.operationData.sketch = '';
        $scope.operationData.format = '';
        $scope.operationData.filename = '';
        $scope.operationData.filetype = '';
        $scope.loadOperation = function() {
            $scope.loading = true;
            var httpRequest = $http({
                method: 'GET',
                url: 'http://data.altamira.com.br/manufacturing/process/' + $scope.processId + '/operation/' + $scope.operationId,
                headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
            }).success(function(data) {
                if (data != '')
                {
                    $scope.operationData.operationVersion = data.version;
                    $scope.operationData.sequence = data.sequence;
                    $scope.operationData.name = data.name;
                    $scope.operationData.description = data.description;
                    $scope.operationData.use = data.use;
                    $scope.operationData.consume = data.consume;
                    $scope.operationData.produce = data.produce;
                    if (data.sketch != '' && data.sketch != undefined)
                    {
                        var httpRequest = $http({
                            method: 'GET',
                            url: 'http://data.altamira.com.br/manufacturing/process/' + $scope.processId + '/operation/' + $scope.operationId + '/sketch/' + data.sketch.id,
                            headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
                        }).success(function(da) {
                            $scope.loading = false;
                            $scope.operationData.sketchVersion = da.version;
                            $scope.operationData.sketchId = da.id;
                            $scope.operationData.sketch = da.image;
                            $scope.operationData.format = da.format;
                            $scope.operationData.filename = da.filename;
                            $scope.operationData.filetype = da.extension;
                        });
                    }
                }
            }).error(function(data, status, headers, config) {
                $scope.loading = false;
                alert("Please try again")
            });
        };
        $scope.loadOperation();
        $scope.submitOperationForm = function(isValid) {
            $scope.loading = true;
            if (isValid) {
                $scope.postdata = {};
                $scope.postdata.id = parseInt($scope.operationId);
                $scope.postdata.version = parseInt($scope.operationData.operationVersion);
                $scope.postdata.sequence = parseInt($scope.operationData.sequence);
                $scope.postdata.name = $scope.operationData.name;
                $scope.postdata.description = $scope.operationData.description;
                $scope.postdata.sketch = {
                    "id": parseInt($scope.operationData.sketchId),
                    "version": parseInt($scope.operationData.sketchVersion),
                    "format": $scope.operationData.format,
                    "filename": $scope.operationData.filename,
                    "extension": $scope.operationData.filetype,
                    "image": $scope.operationData.sketch
                };
                $http({
                    method: 'PUT',
                    url: 'http://data.altamira.com.br/manufacturing/process/' + $scope.processId + '/operation/' + $scope.operationId,
                    data: $scope.postdata,
                    headers: {'Content-Type': 'application/json'}
                }).success(function(data, status, headers, config) {
                    $scope.loading = false;
                    $location.path('manufacturing/update/process/' + $scope.processId);
                }).error(function(data, status, headers, config) {
                    $scope.loading = false;
                    alert('Please try again');
                });
            }
        };
        $scope.removeOperation = function() {
            $scope.loading = true;
            $http({
                method: 'DELETE',
                url: 'http://data.altamira.com.br/manufacturing/process/' + $scope.processId + '/operation/' + $scope.operationId,
            }).success(function(data) {
                $scope.loading = false;
                $location.path('/manufacturing/update/process/' + $scope.processId);
            }).error(function(data, status, headers, config) {
                $scope.loading = false;
                alert('Please try again');
            });
        };
        $scope.goBack = function() {
            $location.path('/manufacturing/update/process/' + $scope.processId);
        };
        $scope.createUse = function() {
            $location.path('/manufacturing/process/operation/use/' + $scope.processId + '/' + $scope.operationId);
        };
        $scope.updateUse = function(useId) {
            $location.path('/manufacturing/process/operation/use/update/' + $scope.processId + '/' + $scope.operationId + '/' + useId);
        };
        $scope.createConsume = function() {
            $location.path('/manufacturing/process/operation/consume/' + $scope.processId + '/' + $scope.operationId);
        };
        $scope.updateConsume = function(consumeId) {
            $location.path('/manufacturing/process/operation/consume/update/' + $scope.processId + '/' + $scope.operationId + '/' + consumeId);
        };
        $scope.createProduce = function() {
            $location.path('/manufacturing/process/operation/produce/' + $scope.processId + '/' + $scope.operationId);
        };
        $scope.updateProduce = function(produceId) {
            $location.path('/manufacturing/process/operation/produce/update/' + $scope.processId + '/' + $scope.operationId + '/' + produceId);
        };
        $scope.removeOperationType = function(type, typeId) {
            $scope.loading = true;
            if (type == 'use')
            {
                $http({
                    method: 'DELETE',
                    url: 'http://data.altamira.com.br/manufacturing/process/' + $scope.processId + '/operation/' + $scope.operationId + '/use/' + typeId,
                }).success(function(data) {
                    $scope.loading = false;
                    $route.reload();
                }).error(function(data, status, headers, config) {
                    $scope.loading = false;
                    alert("Please try again")
                });
            }
            if (type == 'consume')
            {
                $http({
                    method: 'DELETE',
                    url: 'http://data.altamira.com.br/manufacturing/process/' + $scope.processId + '/operation/' + $scope.operationId + '/consume/' + typeId,
                }).success(function(data) {
                    $scope.loading = false;
                    $route.reload();
                }).error(function(data, status, headers, config) {
                    $scope.loading = false;
                    alert("Please try again")
                });
            }
            if (type == 'produce')
            {
                $http({
                    method: 'DELETE',
                    url: 'http://data.altamira.com.br/manufacturing/process/' + $scope.processId + '/operation/' + $scope.operationId + '/produce/' + typeId,
                }).success(function(data) {
                    $scope.loading = false;
                    $route.reload();
                }).error(function(data, status, headers, config) {
                    $scope.loading = false;
                    alert("Please try again")
                });
            }
        };
    }]);

altamiraAppControllers.controller('ManufacturingProcessOperationConsumeCtrl', ['$scope', '$http', '$location', '$routeParams', '$upload',
    function($scope, $http, $location, $routeParams, $upload) {
        $scope.processId = $routeParams.processId;
        $scope.operationId = $routeParams.operationId;
        $scope.consumeId = $routeParams.consumeId;
        $scope.action = 'create';

        $scope.consumeData = {};
        if ($scope.consumeId != '' && $scope.consumeId != undefined)
        {
            $scope.action = 'update';
            $scope.loading = true;
            $http({
                method: 'GET',
                url: 'http://data.altamira.com.br/manufacturing/process/' + $scope.processId + '/operation/' + $scope.operationId + '/consume/' + $scope.consumeId,
                headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
            }).success(function(data, status, headers, config) {
                $scope.loading = false;
                $scope.consumeData.code = data.code;
                $scope.consumeData.version = data.version;
                $scope.consumeData.description = data.description;
                $scope.consumeData.quantity = data.quantity;
                $scope.consumeData.unit = data.unit;

            }).error(function(data, status, headers, config) {
                $scope.loading = false;
                alert('Please try again');
            });
        }
        else
        {
            $scope.consumeData.code = '';
            $scope.consumeData.version = '';
            $scope.consumeData.description = '';
            $scope.consumeData.quantity = 1;
            $scope.consumeData.unit = 'unid';
        }

        $scope.submitConsumeForm = function(isValid) {
            if (isValid) {
                $scope.loading = true;
                $scope.postdata = {};
                var method = 'POST';
                var url = 'http://data.altamira.com.br/manufacturing/process/' + $scope.processId + '/operation/' + $scope.operationId + '/consume';
                if ($scope.consumeId != '' && $scope.consumeId != undefined)
                {
                    $scope.postdata.id = $scope.consumeId;
                    $scope.postdata.version = $scope.consumeData.version;
                    method = 'PUT';
                    url = 'http://data.altamira.com.br/manufacturing/process/' + $scope.processId + '/operation/' + $scope.operationId + '/consume/' + $scope.consumeId;
                }
                $scope.postdata.code = $scope.consumeData.code;
                $scope.postdata.description = $scope.consumeData.description;
                $scope.postdata.quantity = parseInt($scope.consumeData.quantity);
                $scope.postdata.unit = $scope.consumeData.unit;
                $http({
                    method: method,
                    url: url,
                    data: $scope.postdata, // pass in data as strings
                    headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
                }).success(function(data, status, headers, config) {
                    $scope.loading = false;
                    /*if ($scope.action == 'create')
                    {
                        $location.path('/manufacturing/process/operation/consume/update/' + $scope.processId + '/' + $scope.operationId + '/' + data.id);
                    }
                    else
                    {*/
                        $location.path('/manufacturing/process/operation/update/' + $scope.processId + '/' + $scope.operationId);
                    //}

                }).error(function(data, status, headers, config) {
                    $scope.loading = false;
                    alert('Please try again');
                });
            }
        };
        $scope.removeConsume = function() {
            $scope.loading = true;
            $http({
                method: 'DELETE',
                url: 'http://data.altamira.com.br/manufacturing/process/' + $scope.processId + '/operation/' + $scope.operationId + '/consume/' + $scope.consumeId,
            }).success(function(data) {
                $scope.loading = false;
                $location.path('/manufacturing/process/operation/update/' + $scope.processId + '/' + $scope.operationId);
            }).error(function(data, status, headers, config) {
                $scope.loading = false;
                alert('Please try again');
            });
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
        $scope.action = 'create';
        $scope.produceData = {};
        if ($scope.produceId != '' && $scope.produceId != undefined)
        {
            $scope.action = 'update';
            $scope.loading = true;
            $http({
                method: 'GET',
                url: 'http://data.altamira.com.br/manufacturing/process/' + $scope.processId + '/operation/' + $scope.operationId + '/produce/' + $scope.produceId,
                headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
            }).success(function(data, status, headers, config) {
                $scope.loading = false;
                $scope.produceData.code = data.code;
                $scope.produceData.version = data.version;
                $scope.produceData.description = data.description;
                $scope.produceData.quantity = data.quantity;
                $scope.produceData.unit = data.unit;

            }).error(function(data, status, headers, config) {
                $scope.loading = false;
                alert('Please try again');
            });
        }
        else
        {
            $scope.produceData.code = '';
            $scope.produceData.version = '';
            $scope.produceData.description = '';
            $scope.produceData.quantity = 1;
            $scope.produceData.unit = 'unid';
        }

        $scope.submitProduceForm = function(isValid) {
            if (isValid) {
                $scope.loading = true;
                $scope.postdata = {};
                var method = 'POST';
                var url = 'http://data.altamira.com.br/manufacturing/process/' + $scope.processId + '/operation/' + $scope.operationId + '/produce';
                if ($scope.produceId != '' && $scope.produceId != undefined)
                {
                    $scope.postdata.id = $scope.produceId
                    $scope.postdata.version = $scope.produceData.version;
                    method = 'PUT';
                    url = 'http://data.altamira.com.br/manufacturing/process/' + $scope.processId + '/operation/' + $scope.operationId + '/produce/' + $scope.produceId;
                }
                $scope.postdata.code = $scope.produceData.code;
                $scope.postdata.description = $scope.produceData.description;
                $scope.postdata.quantity = parseInt($scope.produceData.quantity);
                $scope.postdata.unit = $scope.produceData.unit;
                $http({
                    method: method,
                    url: url,
                    data: $scope.postdata, // pass in data as strings
                    headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
                }).success(function(data, status, headers, config) {
                    $scope.loading = false;
                    /*if ($scope.action == 'create')
                    {
                        $location.path('/manufacturing/process/operation/produce/update/' + $scope.processId + '/' + $scope.operationId + '/' + data.id);
                    }
                    else
                    {*/
                        $location.path('/manufacturing/process/operation/update/' + $scope.processId + '/' + $scope.operationId);
                    //}

                }).error(function(data, status, headers, config) {
                    $scope.loading = false;
                    alert('Please try again');
                });
            }
        };
        $scope.removeProduce = function() {
            $scope.loading = true;
            $http({
                method: 'DELETE',
                url: 'http://data.altamira.com.br/manufacturing/process/' + $scope.processId + '/operation/' + $scope.operationId + '/produce/' + $scope.produceId,
            }).success(function(data) {
                $scope.loading = false;
                $location.path('/manufacturing/process/operation/update/' + $scope.processId + '/' + $scope.operationId);
            }).error(function(data, status, headers, config) {
                $scope.loading = false;
                alert('Please try again');
            });
        };
        $scope.goBack = function() {
            $location.path('/manufacturing/process/operation/update/' + $scope.processId + '/' + $scope.operationId);
        };
    }]);

altamiraAppControllers.controller('ManufacturingProcessOperationUsoCtrl', ['$scope', '$http', '$location', '$routeParams', '$upload',
    function($scope, $http, $location, $routeParams, $upload) {
        $scope.processId = $routeParams.processId;
        $scope.operationId = $routeParams.operationId;
        $scope.useId = $routeParams.useId;
        $scope.action = 'create';
        $scope.useData = {};
        if ($scope.useId != '' && $scope.useId != undefined)
        {
            $scope.action = 'update';
            $scope.loading = true;
            $http({
                method: 'GET',
                url: 'http://data.altamira.com.br/manufacturing/process/' + $scope.processId + '/operation/' + $scope.operationId + '/use/' + $scope.useId,
                headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
            }).success(function(data, status, headers, config) {
                $scope.loading = false;
                $scope.useData.code = data.code;
                $scope.useData.version = data.version;
                $scope.useData.description = data.description;
                $scope.useData.quantity = data.quantity;
                $scope.useData.unit = data.unit;

            }).error(function(data, status, headers, config) {
                $scope.loading = false;
                alert('Please try again');
            });
        }
        else
        {
            $scope.useData.code = '';
            $scope.useData.version = '';
            $scope.useData.description = '';
            $scope.useData.quantity = 1;
            $scope.useData.unit = 'unid';
        }

        $scope.submitUseForm = function(isValid) {
            if (isValid) {
                $scope.loading = true;
                $scope.postdata = {};
                var method = 'POST';
                var url = 'http://data.altamira.com.br/manufacturing/process/' + $scope.processId + '/operation/' + $scope.operationId + '/use';
                if ($scope.useId != '' && $scope.useId != undefined)
                {
                    $scope.postdata.id = $scope.useId;
                    $scope.postdata.version = $scope.useData.version;
                    method = 'PUT';
                    url = 'http://data.altamira.com.br/manufacturing/process/' + $scope.processId + '/operation/' + $scope.operationId + '/use/' + $scope.useId;
                }
                $scope.postdata.code = $scope.useData.code;
                $scope.postdata.description = $scope.useData.description;
                $scope.postdata.quantity = parseInt($scope.useData.quantity);
                $scope.postdata.unit = $scope.useData.unit;
                $http({
                    method: method,
                    url: url,
                    data: $scope.postdata, // pass in data as strings
                    headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
                }).success(function(data, status, headers, config) {
                    $scope.loading = false;
                    /*if ($scope.action == 'create')
                    {
                        $location.path('/manufacturing/process/operation/use/update/' + $scope.processId + '/' + $scope.operationId + '/' + data.id);
                    }
                    else
                    {*/
                        $location.path('/manufacturing/process/operation/update/' + $scope.processId + '/' + $scope.operationId);
                    //}

                }).error(function(data, status, headers, config) {
                    $scope.loading = false;
                    alert('Please try again');
                });
            }
        };

        $scope.removeUse = function() {
            $scope.loading = true;
            $http({
                method: 'DELETE',
                url: 'http://data.altamira.com.br/manufacturing/process/' + $scope.processId + '/operation/' + $scope.operationId + '/use/' + $scope.useId,
            }).success(function(data) {
                $scope.loading = false;
                $location.path('/manufacturing/process/operation/update/' + $scope.processId + '/' + $scope.operationId);
            }).error(function(data, status, headers, config) {
                $scope.loading = false;
                alert('Please try again');
            });
        };

        $scope.goBack = function() {
            $location.path('/manufacturing/process/operation/update/' + $scope.processId + '/' + $scope.operationId);
        };
    }]);