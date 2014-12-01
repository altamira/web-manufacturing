altamiraAppControllers.controller('ManufacturingProcessCreateOperationCtrl',
        function($scope, $http, $location, $routeParams, $upload, $ionicPopup, Restangular, services) {
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
                    $scope.postdata.use = [];
                    $scope.postdata.consume = [];
                    $scope.postdata.produce = [];
                    console.log(JSON.stringify($scope.postdata));
                    Restangular.one('manufacturing/process', $scope.processId).all('operation').post($scope.postdata).then(function(response) {
                        $scope.loading = false;
                        if (response.status == 201) {
                            services.showAlert('Success', 'Processo foi gravado com sucesso !').then(function(res) {
                                services.goToOperationUpdateForm($scope.processId, response.data.id);
                            });
                        }
                    }, function() {
                        $scope.loading = false;
                        services.showAlert('Falhou', 'Please try again');
                    });
                }
            };
            $scope.goBack = function() {
                $location.path('/manufacturing/update/process/' + $scope.processId);
            };

        });

altamiraAppControllers.controller('ManufacturingProcessUpdateOperationCtrl',
        function($scope, $http, $location, $routeParams, $upload, $route, $ionicPopup, Restangular, services) {
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
                Restangular.one('manufacturing/process', $scope.processId).one('operation', $scope.operationId).get().then(function(response) {
                    if (response.data != '')
                    {
                        $scope.loading = false;
                        console.log(JSON.stringify(response.data));
                        $scope.operationData.operationVersion = response.data.version;
                        $scope.operationData.sequence = response.data.sequence;
                        $scope.operationData.name = response.data.name;
                        $scope.operationData.description = response.data.description;
                        $scope.operationData.use = response.data.use;
                        $scope.operationData.consume = response.data.consume;
                        $scope.operationData.produce = response.data.produce;
                        if (response.data.sketch != '' && response.data.sketch != undefined)
                        {
                            Restangular.one('manufacturing/process', $scope.processId).one('operation', $scope.operationId).one('sketch', response.data.sketch.id).get().then(function(response1) {
                                $scope.loading = false;
                                $scope.operationData.sketchVersion = response1.data.version;
                                $scope.operationData.sketchId = response1.data.id;
                                $scope.operationData.sketch = response1.data.image;
                                $scope.operationData.format = response1.data.format;
                                $scope.operationData.filename = response1.data.filename;
                                $scope.operationData.filetype = response1.data.extension;
                            }, function(response) {
                                $scope.loading = false;
                                services.showAlert('Falhou', 'Please try again');
                            });
                        }
                    }
                }, function(response) {
                    $scope.loading = false;
                    services.showAlert('Falhou', 'Please try again');
                });
            };
            $scope.loadOperation();
            $scope.submitOperationForm = function(isValid) {
                if (isValid) {
                    $scope.loading = true;
                    $scope.postdata = {};
                    $scope.postdata.id = parseInt($scope.operationId);
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
                    Restangular.one('manufacturing/process', $scope.processId).one('operation', $scope.operationId).get().then(function(response1) {
                        $scope.postdata.version = response1.data.version;
                        console.log(JSON.stringify($scope.postdata));
                        Restangular.one('manufacturing/process', $scope.processId).one('operation', $scope.operationId).customPUT($scope.postdata).then(function(response) {
                            $scope.loading = false;
                            services.goToProcessUpdateForm($scope.processId);
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
            $scope.removeOperation = function() {
                services.showConfirmBox('Confirmation', 'Are you sure to remove this Operation?').then(function(res) {
                    if (res) {
                        $scope.loading = true;
                        Restangular.one('manufacturing/process', $scope.processId).one('operation', $scope.operationId).remove().then(function() {
                            $scope.loading = false;
                            services.showAlert('Success', 'An Operation - ' + $scope.operationId + ' removed successfully.').then(function(res) {
                                if (res) {
                                    services.goToProcessUpdateForm($scope.processId);
                                }
                            });
                        }, function(response1) {
                            $scope.loading = false;
                            services.showAlert('Falhou', 'Please try again');
                        });
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
                    url = Restangular.one('manufacturing/process', $scope.processId).one('operation', $scope.operationId).one('use', typeId);
                }
                if (type == 'consume')
                {
                    url = Restangular.one('manufacturing/process', $scope.processId).one('operation', $scope.operationId).one('consume', typeId);
                }
                if (type == 'produce')
                {
                    url = Restangular.one('manufacturing/process', $scope.processId).one('operation', $scope.operationId).one('produce', typeId);
                }
                services.showConfirmBox('Confirmation', 'Are you sure to remove this ' + type + ' ?').then(function(res) {
                    if (res) {
                        $scope.loading = true;
                        url.remove().then(function() {
                            $scope.loading = false;
                            services.showAlert('Success', type + ' - ' + typeId + ' removed successfully.').then(function(res) {
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