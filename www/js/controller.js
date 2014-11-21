var altamiraAppControllers = angular.module('altamiraAppControllers', []);

altamiraAppControllers.controller('ManufacturingProcsSearchCtrl',
        function($scope, $http, $location, $routeParams, $localStorage, $ionicPopup) {
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
                    url = 'http://data.altamira.com.br/manufacturing/process?search=' + $scope.$storage.x + '&start=' + $scope.startPage + '&max=' + $scope.maxRecord;
                }

                var httpRequest = $http({
                    method: 'GET',
                    url: url,
                    headers: {'Content-Type': 'application/json'}
                }).success(function(data) {
                    $scope.loading = false;
                    console.log(JSON.stringify(data));
                    if (data != '')
                    {
                        $scope.processes = data;
                        $scope.processes.push({"id": 0, "code": "TESTINGFORNULLID", "description": "This process has no ID"});
                        $scope.range();
                    } else
                    {
                        if ((parseInt($scope.startPage) != 0))
                        {
                            $location.path('/manufacturing/process/' + (parseInt($scope.startPage) - 1));
                        } else
                        {
                            $ionicPopup.alert({
                                title: 'Notice',
                                content: 'Process list is empty'
                            }).then(function(res) {

                            });
                        }

                    }
                }).error(function(data, status, headers, config) {
                    $scope.loading = false;
                    $ionicPopup.alert({
                        title: 'Failer',
                        content: 'Please try again'
                    }).then(function(res) {

                    });
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
            $scope.createProcess = function(code, desc) {
                $location.url('/manufacturing/create/process?code=' + code + '&desc=' + desc);
            }

            $scope.range = function() {
                var start = parseInt($scope.startPage) + 1;
                var input = [];
                for (var i = 1; i <= start; i++)
                    $scope.pageStack.push(i);
            };
        });

altamiraAppControllers.controller('ManufacturingProcessCreateCtrl', ['$scope', '$http', '$location', '$ionicPopup', '$routeParams',
    function($scope, $http, $location, $ionicPopup, $routeParams) {
        $scope.processData = {};
        $scope.postdata = {};
        $scope.processData.code = $routeParams.code;
        $scope.processData.description = $routeParams.desc
        $scope.submitCreateProcess = function(isValid) {
            if (isValid) {
                $scope.loading = true;
                $scope.postdata.code = $scope.processData.code;
                $scope.postdata.description = $scope.processData.description;
                console.log(JSON.stringify($scope.postdata));
                $http({
                    method: 'POST',
                    url: 'http://data.altamira.com.br/manufacturing/process/',
                    data: $scope.postdata,
                    headers: {'Content-Type': 'application/json'}
                }).success(function(data, status, headers, config) {
                    $scope.loading = false;
                    $location.path('/manufacturing/update/process/' + data.id);
                }).error(function(data, status, headers, config) {
                    $scope.loading = false;
                    $ionicPopup.alert({
                        title: 'Failer',
                        content: 'Please try again'
                    }).then(function(res) {

                    });
                });
            }
        };
        $scope.goBack = function() {
            $location.url('/manufacturing/process/' + 0);
        };
    }]);

altamiraAppControllers.controller('ManufacturingProcessUpdateCtrl', ['$scope', '$http', '$location', '$routeParams', '$route', '$ionicPopup',
    function($scope, $http, $location, $routeParams, $route, $ionicPopup) {
        $scope.processId = $routeParams.processId;
        $scope.processData = {};
        $scope.loadProcess = function() {
            $scope.loading = true;
            $http({
                method: 'GET',
                url: 'http://data.altamira.com.br/manufacturing/process/' + $scope.processId,
                headers: {'Content-Type': 'application/json'}
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
                                $scope.temp['alias'] = 'U';
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
            if (isValid) {
                $scope.loading = true;
                $scope.postdata = {};
                $scope.postdata.id = $scope.processData.id;
                $scope.postdata.version = $scope.processData.version;
                $scope.postdata.code = $scope.processData.code;
                $scope.postdata.description = $scope.processData.description;
                $http({
                    method: 'GET',
                    url: 'http://data.altamira.com.br/manufacturing/process/' + $scope.processId,
                    headers: {'Content-Type': 'application/json'}
                }).success(function(data1) {
                    $scope.postdata.version = data1.version;
                    $http({
                        method: 'PUT',
                        url: 'http://data.altamira.com.br/manufacturing/process/' + $scope.postdata.id,
                        data: $scope.postdata,
                        headers: {'Content-Type': 'application/json'}
                    }).success(function(data, status, headers, config) {
                        $scope.loading = false;
                        $location.path('/manufacturing/process/0');
                    }).error(function(data, status, headers, config) {
                        $scope.loading = false;
                        $ionicPopup.alert({
                            title: 'Failer',
                            content: 'Please try again'
                        }).then(function(res) {

                        });
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
            var confirmPopup = $ionicPopup.confirm({
                title: 'Confirmation',
                template: 'Are you sure to remove this Process?'
            });
            confirmPopup.then(function(res) {
                if (res) {
                    $http({
                        method: 'DELETE',
                        url: 'http://data.altamira.com.br/manufacturing/process/' + $scope.processId,
                        headers: {'Content-Type': 'application/json'}
                    }).success(function(response) {
                        $ionicPopup.alert({
                            title: 'Success',
                            content: 'A Process - ' + $scope.processId + ' removed successfully.'
                        }).then(function(res) {
                            $location.path('/manufacturing/process/0');
                        });
                    }).error(function(data, status, headers, config) {
                        $ionicPopup.alert({
                            title: 'Failer',
                            content: 'Please try again'
                        }).then(function(res) {

                        });
                    });
                } else {
                    console.log("NO");
                }
            });
        };
        $scope.removeOperation = function(operationId) {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Confirmation',
                template: 'Are you sure to remove this Operation?'
            });
            confirmPopup.then(function(res) {
                if (res) {
                    $http({
                        method: 'DELETE',
                        url: 'http://data.altamira.com.br/manufacturing/process/' + $scope.processId + '/operation/' + operationId,
                        headers: {'Content-Type': 'application/json'}
                    }).success(function(response) {
                        $ionicPopup.alert({
                            title: 'Success',
                            content: 'An Operation - ' + operationId + ' removed successfully.'
                        }).then(function(res) {
                            $route.reload();
                        });
                    }).error(function(data, status, headers, config) {
                        $ionicPopup.alert({
                            title: 'Failer',
                            content: 'Please try again'
                        }).then(function(res) {

                        });
                    });
                } else {
                    console.log("NO");
                }
            });
        };
    }]);

altamiraAppControllers.controller('ManufacturingProcessCreateOperationCtrl', ['$scope', '$http', '$location', '$routeParams', '$upload', '$ionicPopup',
    function($scope, $http, $location, $routeParams, $upload, $ionicPopup) {
        $scope.processId = $routeParams.processId;
        $scope.operationData = {};
        $scope.operationData.sequence = '';
        $scope.operationData.name = 'DOBRA';
        $scope.operationData.description = '';
        $scope.operationData.sketch = '';
        $scope.operationData.format = '';
        $scope.operationData.filename = '';
        $scope.operationData.filetype = '';
        $scope.submitOperationForm = function(isValid) {

            if (isValid) {
                $scope.loading = true;
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
                    data: $scope.postdata,
                    headers: {'Content-Type': 'application/json'}
                }).success(function(data, status, headers, config) {
                    $scope.loading = false;
                    $location.path('/manufacturing/process/operation/update/' + $scope.processId + '/' + data.id);

                }).error(function(data, status, headers, config) {
                    $scope.loading = false;
                    $ionicPopup.alert({
                        title: 'Failer',
                        content: 'Please try again'
                    }).then(function(res) {

                    });
                });
            }
        };
        $scope.goBack = function() {
            $location.path('/manufacturing/update/process/' + $scope.processId);
        };

    }]);

altamiraAppControllers.controller('ManufacturingProcessUpdateOperationCtrl', ['$scope', '$http', '$location', '$routeParams', '$upload', '$route', '$ionicPopup',
    function($scope, $http, $location, $routeParams, $upload, $route, $ionicPopup) {
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
                headers: {'Content-Type': 'application/json'}
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
                            headers: {'Content-Type': 'application/json'}
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
                $ionicPopup.alert({
                    title: 'Failer',
                    content: 'Please try again'
                }).then(function(res) {

                });
            });
        };
        $scope.loadOperation();
        $scope.submitOperationForm = function(isValid) {
            if (isValid) {
                $scope.loading = true;
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
                    $ionicPopup.alert({
                        title: 'Failer',
                        content: 'Please try again'
                    }).then(function(res) {

                    });
                });
            }
        };
        $scope.removeOperation = function() {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Confirmation',
                template: 'Are you sure to remove this Operation?'
            });
            confirmPopup.then(function(res) {
                if (res) {
                    $http({
                        method: 'DELETE',
                        url: 'http://data.altamira.com.br/manufacturing/process/' + $scope.processId + '/operation/' + $scope.operationId,
                        headers: {'Content-Type': 'application/json'}
                    }).success(function(response) {
                        $ionicPopup.alert({
                            title: 'Success',
                            content: 'An Operation - ' + $scope.operationId + ' removed successfully.'
                        }).then(function(res) {
                            $route.reload();
                        });
                    }).error(function(data, status, headers, config) {
                        $ionicPopup.alert({
                            title: 'Failer',
                            content: 'Please try again'
                        }).then(function(res) {

                        });
                    });
                } else {
                    console.log("NO");
                }
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
            var url = ''
            if (type == 'use')
            {
                url = 'http://data.altamira.com.br/manufacturing/process/' + $scope.processId + '/operation/' + $scope.operationId + '/use/' + typeId;
            }
            if (type == 'consume')
            {
                url = 'http://data.altamira.com.br/manufacturing/process/' + $scope.processId + '/operation/' + $scope.operationId + '/consume/' + typeId;
            }
            if (type == 'produce')
            {
                url = 'http://data.altamira.com.br/manufacturing/process/' + $scope.processId + '/operation/' + $scope.operationId + '/produce/' + typeId;
            }
            var confirmPopup = $ionicPopup.confirm({
                title: 'Confirmation',
                template: 'Are you sure to remove this ' + type + ' ?'
            });
            confirmPopup.then(function(res) {
                if (res) {
                    $http({
                        method: 'DELETE',
                        url: url,
                        headers: {'Content-Type': 'application/json'}
                    }).success(function(response) {
                        $ionicPopup.alert({
                            title: 'Success',
                            content: type + ' - ' + typeId + ' removed successfully.'
                        }).then(function(res) {
                            $route.reload();
                        });
                    }).error(function(data, status, headers, config) {
                        $ionicPopup.alert({
                            title: 'Failer',
                            content: 'Please try again'
                        }).then(function(res) {

                        });
                    });
                } else {
                    console.log("NO");
                }
            });
        };
    }]);

altamiraAppControllers.controller('ManufacturingProcessOperationConsumeCtrl', ['$scope', '$http', '$location', '$routeParams', '$upload', '$ionicPopup', '$ionicModal',
    function($scope, $http, $location, $routeParams, $upload, $ionicPopup, $ionicModal) {
        $scope.processId = $routeParams.processId;
        $scope.operationId = $routeParams.operationId;
        $scope.consumeId = $routeParams.consumeId;
        $scope.action = 'create';
        $scope.consumeData = {};
        $scope.consumeData.unitBox = {};
        $http({
            method: 'GET',
            url: 'http://data.altamira.com.br/measurement/unit',
            headers: {'Content-Type': 'application/json'}
        }).success(function(data, status, headers, config) {
            $scope.consumeData.unitBox = data;

        }).error(function(data, status, headers, config) {
            $ionicPopup.alert({
                title: 'Failer',
                content: 'Please try again'
            }).then(function(res) {

            });
        });
        if ($scope.consumeId != '' && $scope.consumeId != undefined)
        {
            $scope.action = 'update';
            $scope.loading = true;
            $http({
                method: 'GET',
                url: 'http://data.altamira.com.br/manufacturing/process/' + $scope.processId + '/operation/' + $scope.operationId + '/consume/' + $scope.consumeId,
                headers: {'Content-Type': 'application/json'}
            }).success(function(data, status, headers, config) {
                $scope.loading = false;
                $scope.consumeData.code = data.code;
                $scope.consumeData.version = data.version;
                $scope.consumeData.description = data.description;
                $scope.consumeData.quantity = data.quantity.value;
                $scope.consumeData.unit = data.quantity.unit.id;

            }).error(function(data, status, headers, config) {
                $scope.loading = false;
                $ionicPopup.alert({
                    title: 'Failer',
                    content: 'Please try again'
                }).then(function(res) {

                });
            });
        }
        else
        {
            $scope.consumeData.code = '';
            $scope.consumeData.version = '';
            $scope.consumeData.description = '';
            $scope.consumeData.quantity = 1;
            $scope.consumeData.unit = 6;
        }

        $scope.submitConsumeForm = function(isValid) {
            if (isValid) {
                $scope.loading = true;
                $scope.postdata = {};
                var method = 'POST';
                var url = 'http://data.altamira.com.br/manufacturing/process/' + $scope.processId + '/operation/' + $scope.operationId + '/consume';
                $scope.postdata.version = 0;
                if ($scope.consumeId != '' && $scope.consumeId != undefined)
                {
                    $scope.postdata.id = $scope.consumeId;
                    $scope.postdata.version = $scope.consumeData.version;
                    method = 'PUT';
                    url = 'http://data.altamira.com.br/manufacturing/process/' + $scope.processId + '/operation/' + $scope.operationId + '/consume/' + $scope.consumeId;
                }
                $scope.postdata.code = $scope.consumeData.code;
                $scope.postdata.description = $scope.consumeData.description;
                $scope.postdata.quantity = {};
                $scope.postdata.quantity.value = parseFloat($scope.consumeData.quantity);
                $scope.postdata.quantity.unit = {};
                var httpRequest = $http({
                    method: 'GET',
                    url: 'http://data.altamira.com.br/measurement/unit/' + $scope.consumeData.unit,
                    headers: {'Content-Type': 'application/json'}
                }).success(function(data) {
                    $scope.postdata.quantity.unit = data;
                    $http({
                        method: method,
                        url: url,
                        data: $scope.postdata,
                        headers: {'Content-Type': 'application/json'}
                    }).success(function(data, status, headers, config) {
                        $scope.loading = false;
                        $location.path('/manufacturing/process/operation/update/' + $scope.processId + '/' + $scope.operationId);
                    }).error(function(data, status, headers, config) {
                        $scope.loading = false;
                        $ionicPopup.alert({
                            title: 'Failer',
                            content: 'Please try again'
                        }).then(function(res) {

                        });
                    });

                });
            }
        };
        var httpRequest = $http({
            method: 'GET',
            url: 'http://data.altamira.com.br/manufacturing/process?start=0&max=5',
            headers: {'Content-Type': 'application/json'}
        }).success(function(data) {
            $scope.items = data;
            $scope.currentPage = 1;
            $scope.pageSize = 1;
        });
        $scope.searchProcess = function(text) {
            var httpRequest = $http({
                method: 'GET',
                url: 'http://data.altamira.com.br/manufacturing/process?search=' + text + '&start=0&max=4',
                headers: {'Content-Type': 'application/json'}
            }).success(function(data) {
                $scope.items = data;
            });
        };

        $scope.goUpdate = function(code, desc) {
            $scope.consumeData.code = code;
            $scope.consumeData.description = desc;
            $scope.closeModal();
        };

        $ionicModal.fromTemplateUrl('find_product.html', {
            scope: $scope,
            animation: 'slide-in-left'
        }).then(function(modal) {
            $scope.modal = modal;
        });
        $scope.openModal = function() {
            $scope.modal.show();
        };
        $scope.closeModal = function() {
            $scope.modal.hide();
        };
        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });
        // Execute action on hide modal
        $scope.$on('modal.hidden', function() {
            // Execute action
        });
        // Execute action on remove modal
        $scope.$on('modal.removed', function() {
            // Execute action
        });

        $scope.removeConsume = function() {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Confirmation',
                template: 'Are you sure to remove this consume ?'
            });
            confirmPopup.then(function(res) {
                if (res) {
                    $http({
                        method: 'DELETE',
                        url: 'http://data.altamira.com.br/manufacturing/process/' + $scope.processId + '/operation/' + $scope.operationId + '/consume/' + $scope.consumeId,
                        headers: {'Content-Type': 'application/json'}
                    }).success(function(response) {
                        $ionicPopup.alert({
                            title: 'Success',
                            content: ' A consume - ' + $scope.consumeId + ' removed successfully.'
                        }).then(function(res) {
                            $location.path('/manufacturing/process/operation/update/' + $scope.processId + '/' + $scope.operationId);
                        });
                    }).error(function(data, status, headers, config) {
                        $ionicPopup.alert({
                            title: 'Failer',
                            content: 'Please try again'
                        }).then(function(res) {

                        });
                    });
                } else {
                    console.log("NO");
                }
            });
        };
        $scope.goBack = function() {
            $location.path('/manufacturing/process/operation/update/' + $scope.processId + '/' + $scope.operationId);
        };
    }]);

altamiraAppControllers.controller('ManufacturingProcessOperationProduceCtrl', ['$scope', '$http', '$location', '$routeParams', '$upload', '$ionicPopup', '$ionicModal',
    function($scope, $http, $location, $routeParams, $upload, $ionicPopup, $ionicModal) {
        $scope.processId = $routeParams.processId;
        $scope.operationId = $routeParams.operationId;
        $scope.produceId = $routeParams.produceId;
        $scope.action = 'create';
        $scope.produceData = {};
        $scope.produceData.unitBox = {};
        $http({
            method: 'GET',
            url: 'http://data.altamira.com.br/measurement/unit',
            headers: {'Content-Type': 'application/json'}
        }).success(function(data, status, headers, config) {
            $scope.produceData.unitBox = data;

        }).error(function(data, status, headers, config) {
            $ionicPopup.alert({
                title: 'Failer',
                content: 'Please try again'
            }).then(function(res) {

            });
        });
        if ($scope.produceId != '' && $scope.produceId != undefined)
        {
            $scope.action = 'update';
            $scope.loading = true;
            $http({
                method: 'GET',
                url: 'http://data.altamira.com.br/manufacturing/process/' + $scope.processId + '/operation/' + $scope.operationId + '/produce/' + $scope.produceId,
                headers: {'Content-Type': 'application/json'}
            }).success(function(data, status, headers, config) {
                $scope.loading = false;
                console.log(JSON.stringify(data));
                $scope.produceData.code = data.code;
                $scope.produceData.version = data.version;
                $scope.produceData.description = data.description;
                $scope.produceData.quantity = data.quantity.value;
                $scope.produceData.unit = data.quantity.unit.id;

            }).error(function(data, status, headers, config) {
                $scope.loading = false;
                $ionicPopup.alert({
                    title: 'Failer',
                    content: 'Please try again'
                }).then(function(res) {

                });
            });
        }
        else
        {
            $scope.produceData.code = '';
            $scope.produceData.version = '';
            $scope.produceData.description = '';
            $scope.produceData.quantity = 1;
            $scope.produceData.unit = 6;
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
                $scope.postdata.quantity = {};
                $scope.postdata.quantity.value = parseFloat($scope.produceData.quantity);
                $scope.postdata.quantity.unit = {};
                var httpRequest = $http({
                    method: 'GET',
                    url: 'http://data.altamira.com.br/measurement/unit/' + $scope.produceData.unit,
                    headers: {'Content-Type': 'application/json'}
                }).success(function(data) {
                    $scope.postdata.quantity.unit = data;
                    $http({
                        method: method,
                        url: url,
                        data: $scope.postdata,
                        headers: {'Content-Type': 'application/json'}
                    }).success(function(data, status, headers, config) {
                        $scope.loading = false;
                        $location.path('/manufacturing/process/operation/update/' + $scope.processId + '/' + $scope.operationId);
                    }).error(function(data, status, headers, config) {
                        $scope.loading = false;
                        $ionicPopup.alert({
                            title: 'Failer',
                            content: 'Please try again'
                        }).then(function(res) {

                        });
                    });

                });
            }
        };

        var httpRequest = $http({
            method: 'GET',
            url: 'http://data.altamira.com.br/manufacturing/process?start=0&max=5',
            headers: {'Content-Type': 'application/json'}
        }).success(function(data) {
            $scope.items = data;
            $scope.currentPage = 1;
            $scope.pageSize = 1;
        });
        $scope.searchProcess = function(text) {
            var httpRequest = $http({
                method: 'GET',
                url: 'http://data.altamira.com.br/manufacturing/process?search=' + text + '&start=0&max=4',
                headers: {'Content-Type': 'application/json'}
            }).success(function(data) {
                $scope.items = data;
            });
        };

        $scope.goUpdate = function(code, desc) {
            $scope.produceData.code = code;
            $scope.produceData.description = desc;
            $scope.closeModal();
        };

        $ionicModal.fromTemplateUrl('find_product.html', {
            scope: $scope,
            animation: 'slide-in-left'
        }).then(function(modal) {
            $scope.modal = modal;
        });
        $scope.openModal = function() {
            $scope.modal.show();
        };
        $scope.closeModal = function() {
            $scope.modal.hide();
        };
        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });
        // Execute action on hide modal
        $scope.$on('modal.hidden', function() {
            // Execute action
        });
        // Execute action on remove modal
        $scope.$on('modal.removed', function() {
            // Execute action
        });

        $scope.removeProduce = function() {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Confirmation',
                template: 'Are you sure to remove this Produce ?'
            });
            confirmPopup.then(function(res) {
                if (res) {
                    $http({
                        method: 'DELETE',
                        url: 'http://data.altamira.com.br/manufacturing/process/' + $scope.processId + '/operation/' + $scope.operationId + '/produce/' + $scope.produceId,
                        headers: {'Content-Type': 'application/json'}
                    }).success(function(response) {
                        $ionicPopup.alert({
                            title: 'Success',
                            content: ' A Produce - ' + $scope.produceId + ' removed successfully.'
                        }).then(function(res) {
                            $location.path('/manufacturing/process/operation/update/' + $scope.processId + '/' + $scope.operationId);
                        });
                    }).error(function(data, status, headers, config) {
                        $ionicPopup.alert({
                            title: 'Failer',
                            content: 'Please try again'
                        }).then(function(res) {

                        });
                    });
                } else {
                    console.log("NO");
                }
            });
        };
        $scope.goBack = function() {
            $location.path('/manufacturing/process/operation/update/' + $scope.processId + '/' + $scope.operationId);
        };
    }]);

altamiraAppControllers.controller('ManufacturingProcessOperationUsoCtrl', ['$scope', '$http', '$location', '$routeParams', '$upload', '$ionicPopup','$ionicModal',
    function($scope, $http, $location, $routeParams, $upload, $ionicPopup, $ionicModal) {
        $scope.processId = $routeParams.processId;
        $scope.operationId = $routeParams.operationId;
        $scope.useId = $routeParams.useId;
        $scope.action = 'create';
        $scope.useData = {};
        $scope.useData.unitBox = {};
        $http({
            method: 'GET',
            url: 'http://data.altamira.com.br/measurement/unit',
            headers: {'Content-Type': 'application/json'}
        }).success(function(data, status, headers, config) {
            $scope.useData.unitBox = data;

        }).error(function(data, status, headers, config) {
            $ionicPopup.alert({
                title: 'Failer',
                content: 'Please try again'
            }).then(function(res) {

            });
        });
        if ($scope.useId != '' && $scope.useId != undefined)
        {
            $scope.action = 'update';
            $scope.loading = true;
            $http({
                method: 'GET',
                url: 'http://data.altamira.com.br/manufacturing/process/' + $scope.processId + '/operation/' + $scope.operationId + '/use/' + $scope.useId,
                headers: {'Content-Type': 'application/json'}
            }).success(function(data, status, headers, config) {
                $scope.loading = false;
                $scope.useData.code = data.code;
                $scope.useData.version = data.version;
                $scope.useData.description = data.description;
                $scope.useData.quantity = data.quantity.value;
                $scope.useData.unit = data.quantity.unit.id;

            }).error(function(data, status, headers, config) {
                $scope.loading = false;
                $ionicPopup.alert({
                    title: 'Failer',
                    content: 'Please try again'
                }).then(function(res) {

                });
            });
        }
        else
        {
            $scope.useData.code = '';
            $scope.useData.version = 0;
            $scope.useData.description = '';
            $scope.useData.quantity = 1;
            $scope.useData.unit = 6;
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
                $scope.postdata.version = $scope.useData.version;
                $scope.postdata.description = $scope.useData.description;
                $scope.postdata.quantity = {};
                $scope.postdata.quantity.value = parseFloat($scope.useData.quantity);
                $scope.postdata.quantity.unit = {};
                var httpRequest = $http({
                    method: 'GET',
                    url: 'http://data.altamira.com.br/measurement/unit/' + $scope.useData.unit,
                    headers: {'Content-Type': 'application/json'}
                }).success(function(data) {
                    $scope.postdata.quantity.unit = data;
                    $http({
                        method: method,
                        url: url,
                        data: $scope.postdata,
                        headers: {'Content-Type': 'application/json'}
                    }).success(function(data, status, headers, config) {
                        $scope.loading = false;
                        $location.path('/manufacturing/process/operation/update/' + $scope.processId + '/' + $scope.operationId);
                    }).error(function(data, status, headers, config) {
                        $scope.loading = false;
                        $ionicPopup.alert({
                            title: 'Failer',
                            content: 'Please try again'
                        }).then(function(res) {

                        });
                    });
                });
            }
        };

        var httpRequest = $http({
            method: 'GET',
            url: 'http://data.altamira.com.br/manufacturing/process?start=0&max=5',
            headers: {'Content-Type': 'application/json'}
        }).success(function(data) {
            $scope.items = data;
            $scope.currentPage = 1;
            $scope.pageSize = 1;
        });
        $scope.searchProcess = function(text) {
            var httpRequest = $http({
                method: 'GET',
                url: 'http://data.altamira.com.br/manufacturing/process?search=' + text + '&start=0&max=4',
                headers: {'Content-Type': 'application/json'}
            }).success(function(data) {
                $scope.items = data;
            });
        };

        $scope.goUpdate = function(code, desc) {
            $scope.useData.code = code;
            $scope.useData.description = desc;
            $scope.closeModal();
        };

        $ionicModal.fromTemplateUrl('find_product.html', {
            scope: $scope,
            animation: 'slide-in-left'
        }).then(function(modal) {
            $scope.modal = modal;
        });
        $scope.openModal = function() {
            $scope.modal.show();
        };
        $scope.closeModal = function() {
            $scope.modal.hide();
        };
        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });
        // Execute action on hide modal
        $scope.$on('modal.hidden', function() {
            // Execute action
        });
        // Execute action on remove modal
        $scope.$on('modal.removed', function() {
            // Execute action
        });

        $scope.removeUse = function() {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Confirmation',
                template: 'Are you sure to remove this Use ?'
            });
            confirmPopup.then(function(res) {
                if (res) {
                    $http({
                        method: 'DELETE',
                        url: 'http://data.altamira.com.br/manufacturing/process/' + $scope.processId + '/operation/' + $scope.operationId + '/use/' + $scope.useId,
                        headers: {'Content-Type': 'application/json'}
                    }).success(function(response) {
                        $ionicPopup.alert({
                            title: 'Success',
                            content: ' A Use - ' + $scope.useId + ' removed successfully.'
                        }).then(function(res) {
                            $location.path('/manufacturing/process/operation/update/' + $scope.processId + '/' + $scope.operationId);
                        });
                    }).error(function(data, status, headers, config) {
                        $ionicPopup.alert({
                            title: 'Failer',
                            content: 'Please try again'
                        }).then(function(res) {

                        });
                    });
                } else {
                    console.log("NO");
                }
            });
        };

        $scope.goBack = function() {
            $location.path('/manufacturing/process/operation/update/' + $scope.processId + '/' + $scope.operationId);
        };
    }]);