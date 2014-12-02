altamiraAppControllers.controller('ManufacturingProcessCreateCtrl',
        function($scope, $location, $routeParams, Restangular, services) {
            $scope.processData = {};
            $scope.postdata = {};
            $scope.processData.code = $routeParams.code;
            $scope.processData.description = $routeParams.desc
            $scope.submitCreateProcess = function(isValid) {
                if (isValid) {
                    $scope.loading = true;
                    $scope.postdata.code = $scope.processData.code;
                    $scope.postdata.description = $scope.processData.description;

                    Restangular.all('manufacturing/process').post($scope.postdata).then(function(response) {
                        $scope.loading = false;
                        if (response.status == 201) {
                            services.showAlert('Success', 'Processo foi gravado com sucesso !').then(function(res) {
                                services.goToProcessUpdateForm(response.data.id);
                            });
                        }
                    }, function() {
                        $scope.loading = false;
                        services.showAlert('Falhou', 'Please try again');
                    });
                }
            };
            $scope.goBack = function() {
                $location.url('/manufacturing/process/' + 0);
            };
        });

altamiraAppControllers.controller('ManufacturingProcessUpdateCtrl',
        function($scope, $http, $location, $routeParams, $route, $ionicPopup, Restangular, services) {
            $scope.processId = $routeParams.processId;
            $scope.processData = {};
            $scope.loadProcess = function() {
                $scope.loading = true;
                Restangular.one('manufacturing/process', $scope.processId).get().then(function(response) {
                    $scope.loading = false;
                    $scope.processData = response.data;
//                    $scope.processData.id = response.data.id;
//                    $scope.processData.version = response.data.version;
//                    $scope.processData.code = response.data.code;
//                    $scope.processData.description = response.data.description;
//                    $scope.processData.revisions = response.data.revision;
                    $scope.processData.operations = response.data.operation;
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
                }, function(response) {
                    $scope.loading = false;
                    services.showAlert('Falhou', 'Please try again');
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
                    Restangular.one('manufacturing/process', $scope.processId).get().then(function(response1) {
                        $scope.postdata.version = response1.data.version;
                        Restangular.one('manufacturing/process', $scope.processId).customPUT($scope.postdata).then(function(response) {
                            $scope.loading = false;
                            $location.path('/manufacturing/process/0');
                        }, function(response) {
                            $scope.loading = false;
                            services.showAlert('Falhou', 'Please try again');
                        });
                    }, function(response1) {
                        $scope.loading = false;
                        services.showAlert('Falhou', 'Please try again');
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
                services.showConfirmBox('Confirmation', 'Are you sure to remove this Process?').then(function(res) {
                    if (res) {
                        $scope.loading = true;
                        Restangular.one('manufacturing/process', $scope.processId).remove().then(function() {
                            $scope.loading = false;
                            services.showAlert('Success', 'A Process - ' + $scope.processId + ' removed successfully.').then(function(res) {
                                if (res) {
                                    $location.path('/manufacturing/process/0');
                                }
                            });
                        }, function(response1) {
                            $scope.loading = false;
                            services.showAlert('Falhou', 'Please try again');
                        });
                    }
                });
            };
            $scope.removeOperation = function(operationId) {
                services.showConfirmBox('Confirmation', 'Are you sure to remove this Operation?').then(function(res) {
                    if (res) {
                        $scope.loading = true;
                        Restangular.one('manufacturing/process', $scope.processId).one('operation', operationId).remove().then(function() {
                            $scope.loading = false;
                            services.showAlert('Success', 'An Operation - ' + operationId + ' removed successfully.').then(function(res) {
                                if (res) {
                                    $route.reload();
                                }
                            });
                        }, function(response1) {
                            $scope.loading = false;
                            services.showAlert('Falhou', 'Please try again');
                        });
                    }
                });
            };
        });