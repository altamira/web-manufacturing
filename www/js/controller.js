var altamiraAppControllers = angular.module('altamiraAppControllers', []);

altamiraAppControllers.controller('ManufacturingProcsSearchCtrl',
        function($scope, $location, $routeParams, $localStorage, $ionicPopup, Restangular, services) {
            $scope.startPage = $routeParams.start;
            $scope.maxRecord = 10;
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
                    Restangular.one('manufacturing/process').get({start: $scope.startPage, max: $scope.maxRecord}).then(function(response) {
                        $scope.loading = false;
                        $scope.processes = response.data;
                        $scope.range();
                        if (response.data == '') {
                            if ((parseInt($scope.startPage) != 0))
                            {
                                $location.path('/manufacturing/process/' + (parseInt($scope.startPage) - 1));
                            } else
                            {
                                services.showAlert('Notice', 'Process list is empty').then(function(res) {
                                });
                            }
                        }
                    }, function(response) {
                        $scope.loading = false;
                        services.showAlert('Falhou', 'Please try again');
                    });
                }
                else
                {
                    Restangular.one('manufacturing/process').get({search: $scope.$storage.x, start: $scope.startPage, max: $scope.maxRecord}).then(function(response) {
                        $scope.loading = false;
                        $scope.processes = response.data;
                        $scope.range();
                        if (response.data == '') {
                            if ((parseInt($scope.startPage) != 0))
                            {
                                $location.path('/manufacturing/process/' + (parseInt($scope.startPage) - 1));
                            } else
                            {
                                services.showAlert('Notice', 'Process list is empty').then(function(res) {
                                });
                            }
                        }
                    }, function(response) {
                        $scope.loading = false;
                        services.showAlert('Falhou', 'Please try again');
                    });
                }
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
                    $scope.processData.id = response.data.id;
                    $scope.processData.version = response.data.version;
                    $scope.processData.code = response.data.code;
                    $scope.processData.description = response.data.description;
                    $scope.processData.revisions = response.data.revision;
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
                    $scope.postdata.consume = [];
                    $scope.postdata.produce = [];
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

altamiraAppControllers.controller('ManufacturingProcessOperationConsumeCtrl',
        function($scope, $http, $location, $routeParams, $upload, $ionicPopup, $ionicModal, Restangular, services) {
            $scope.processId = $routeParams.processId;
            $scope.operationId = $routeParams.operationId;
            $scope.consumeId = $routeParams.consumeId;
            $scope.action = 'create';
            $scope.consumeData = {};
            $scope.consumeData.unitBox = {};
            Restangular.one('measurement/unit').get().then(function(response) {
                $scope.consumeData.unitBox = response.data;
            }, function(response) {
                services.showAlert('Falhou', 'Please try again');
            });
            if ($scope.consumeId != '' && $scope.consumeId != undefined)
            {
                $scope.action = 'update';
                $scope.loading = true;
                Restangular.one('manufacturing/process', $scope.processId).one('operation', $scope.operationId).one('consume', $scope.consumeId).get().then(function(response) {
                    $scope.loading = false;
                    $scope.consumeData.code = response.data.code;
                    $scope.consumeData.version = response.data.version;
                    $scope.consumeData.description = response.data.description;
                    $scope.consumeData.quantity = response.data.quantity.value;
                    $scope.consumeData.unit = response.data.quantity.unit.id;
                }, function(response) {
                    services.showAlert('Falhou', 'Please try again');
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
                    $scope.postdata.version = 0;
                    if ($scope.consumeId != '' && $scope.consumeId != undefined)
                    {
                        $scope.postdata.id = $scope.consumeId;
                        $scope.postdata.version = $scope.consumeData.version;
                        method = 'PUT';
                    }
                    $scope.postdata.code = $scope.consumeData.code;
                    $scope.postdata.description = $scope.consumeData.description;
                    $scope.postdata.quantity = {};
                    $scope.postdata.quantity.value = parseFloat($scope.consumeData.quantity);
                    $scope.postdata.quantity.unit = {};
                    Restangular.one('measurement/unit', $scope.consumeData.unit).get().then(function(response) {
                        $scope.postdata.quantity.unit.id = response.data.id;
                        $scope.postdata.quantity.unit.version = parseInt(response.data.version);
                        $scope.postdata.quantity.unit.name = response.data.name;
                        $scope.postdata.quantity.unit.symbol = response.data.symbol;
                        $scope.postdata.quantity.unit.magnitude = {};
                        $scope.postdata.quantity.unit.magnitude = response.data.magnitude;

                        if (method == 'POST')
                        {
                            Restangular.one('manufacturing/process', $scope.processId).one('operation', $scope.operationId).all('consume').post($scope.postdata).then(function(response) {
                                $scope.loading = false;
                                if (response.status == 201) {
                                    services.showAlert('Success', 'Processo foi gravado com sucesso !').then(function(res) {
                                        services.goToOperationUpdateForm($scope.processId, $scope.operationId);
                                    });
                                }
                            }, function() {
                                $scope.loading = false;
                                services.showAlert('Falhou', 'Please try again');
                            });
                        }

                        if (method == 'PUT')
                        {
                            Restangular.one('manufacturing/process', $scope.processId).one('operation', $scope.operationId).one('consume', $scope.consumeId).customPUT($scope.postdata).then(function(response) {
                                $scope.loading = false;
                                services.showAlert('Success', 'Processo foi gravado com sucesso !').then(function(res) {
                                    services.goToOperationUpdateForm($scope.processId, $scope.operationId);
                                });
                            }, function(response) {
                                $scope.loading = false;
                                services.showAlert('Falhou', 'Please try again');
                            });
                        }
                    }, function(response) {
                        services.showAlert('Falhou', 'Please try again');
                    });
                }
            };
            Restangular.one('manufacturing/process').get({start: 0, max: 5}).then(function(response) {
                $scope.items = response.data;
                $scope.currentPage = 1;
                $scope.pageSize = 10;
            }, function(response) {
                services.showAlert('Falhou', 'Please try again');
            });
            $scope.searchProcess = function(text) {
                Restangular.one('manufacturing/process').get({search: text, start: 0, max: 5}).then(function(response) {
                    $scope.items = response.data;
                }, function(response) {
                    services.showAlert('Falhou', 'Please try again');
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
                services.showConfirmBox('Confirmation', 'Are you sure to remove this consume ?').then(function(res) {
                    if (res) {
                        $scope.loading = true;
                        Restangular.one('manufacturing/process', $scope.processId).one('operation', $scope.operationId).one('consume', $scope.consumeId).remove().then(function() {
                            $scope.loading = false;
                            services.showAlert(' A consume - ' + $scope.consumeId + ' removed successfully.').then(function(res) {
                                if (res) {
                                    services.goToOperationUpdateForm($scope.processId, $scope.operationId);
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
                $location.path('/manufacturing/process/operation/update/' + $scope.processId + '/' + $scope.operationId);
            };
        });

altamiraAppControllers.controller('ManufacturingProcessOperationProduceCtrl',
        function($scope, $http, $location, $routeParams, $upload, $ionicPopup, $ionicModal, Restangular, services) {
            $scope.processId = $routeParams.processId;
            $scope.operationId = $routeParams.operationId;
            $scope.produceId = $routeParams.produceId;
            $scope.action = 'create';
            $scope.produceData = {};
            $scope.produceData.unitBox = {};
            Restangular.one('measurement/unit').get().then(function(response) {
                $scope.produceData.unitBox = response.data;
            }, function(response) {
                services.showAlert('Falhou', 'Please try again');
            });
            if ($scope.produceId != '' && $scope.produceId != undefined)
            {
                $scope.action = 'update';
                $scope.loading = true;
                Restangular.one('manufacturing/process', $scope.processId).one('operation', $scope.operationId).one('produce', $scope.produceId).get().then(function(response) {
                    $scope.loading = false;
                    $scope.produceData.code = response.data.code;
                    $scope.produceData.version = response.data.version;
                    $scope.produceData.description = response.data.description;
                    $scope.produceData.quantity = response.data.quantity.value;
                    $scope.produceData.unit = response.data.quantity.unit.id;
                }, function(response) {
                    services.showAlert('Falhou', 'Please try again');
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
                    if ($scope.produceId != '' && $scope.produceId != undefined)
                    {
                        $scope.postdata.id = $scope.produceId
                        $scope.postdata.version = $scope.produceData.version;
                        method = 'PUT';
                    }
                    $scope.postdata.code = $scope.produceData.code;
                    $scope.postdata.description = $scope.produceData.description;
                    $scope.postdata.quantity = {};
                    $scope.postdata.quantity.value = parseFloat($scope.produceData.quantity);
                    $scope.postdata.quantity.unit = {};
                    Restangular.one('measurement/unit', $scope.produceData.unit).get().then(function(response) {
                        $scope.postdata.quantity.unit.id = response.data.id;
                        $scope.postdata.quantity.unit.version = parseInt(response.data.version);
                        $scope.postdata.quantity.unit.name = response.data.name;
                        $scope.postdata.quantity.unit.symbol = response.data.symbol;
                        $scope.postdata.quantity.unit.magnitude = {};
                        $scope.postdata.quantity.unit.magnitude = response.data.magnitude;

                        if (method == 'POST')
                        {
                            Restangular.one('manufacturing/process', $scope.processId).one('operation', $scope.operationId).all('produce').post($scope.postdata).then(function(response) {
                                $scope.loading = false;
                                if (response.status == 201) {
                                    services.showAlert('Success', 'Processo foi gravado com sucesso !').then(function(res) {
                                        services.goToOperationUpdateForm($scope.processId, $scope.operationId);
                                    });
                                }
                            }, function() {
                                $scope.loading = false;
                                services.showAlert('Falhou', 'Please try again');
                            });
                        }

                        if (method == 'PUT')
                        {
                            Restangular.one('manufacturing/process', $scope.processId).one('operation', $scope.operationId).one('produce', $scope.produceId).customPUT($scope.postdata).then(function(response) {
                                $scope.loading = false;
                                services.showAlert('Success', 'Processo foi gravado com sucesso !').then(function(res) {
                                    services.goToOperationUpdateForm($scope.processId, $scope.operationId);
                                });
                            }, function(response) {
                                $scope.loading = false;
                                services.showAlert('Falhou', 'Please try again');
                            });
                        }
                    }, function(response) {
                        services.showAlert('Falhou', 'Please try again');
                    });
                }
            };

            Restangular.one('manufacturing/process').get({start: 0, max: 5}).then(function(response) {
                $scope.items = response.data;
                $scope.currentPage = 1;
                $scope.pageSize = 10;
            }, function(response) {
                services.showAlert('Falhou', 'Please try again');
            });
            $scope.searchProcess = function(text) {
                Restangular.one('manufacturing/process').get({search: text, start: 0, max: 5}).then(function(response) {
                    $scope.items = response.data;
                }, function(response) {
                    services.showAlert('Falhou', 'Please try again');
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
                services.showConfirmBox('Confirmation', 'Are you sure to remove this produce ?').then(function(res) {
                    if (res) {
                        $scope.loading = true;
                        Restangular.one('manufacturing/process', $scope.processId).one('operation', $scope.operationId).one('produce', $scope.produceId).remove().then(function() {
                            $scope.loading = false;
                            services.showAlert(' A produce - ' + $scope.produceId + ' removed successfully.').then(function(res) {
                                if (res) {
                                    services.goToOperationUpdateForm($scope.processId, $scope.operationId);
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
                $location.path('/manufacturing/process/operation/update/' + $scope.processId + '/' + $scope.operationId);
            };
        });

altamiraAppControllers.controller('ManufacturingProcessOperationUsoCtrl',
        function($scope, $http, $location, $routeParams, $ionicPopup, $ionicModal, Restangular, services) {
            $scope.processId = $routeParams.processId;
            $scope.operationId = $routeParams.operationId;
            $scope.useId = $routeParams.useId;
            $scope.action = 'create';
            $scope.useData = {};
            $scope.useData.unitBox = {};
            Restangular.one('measurement/unit').get().then(function(response) {
                $scope.useData.unitBox = response.data;
            }, function(response) {
                services.showAlert('Falhou', 'Please try again');
            });
            if ($scope.useId != '' && $scope.useId != undefined)
            {
                $scope.action = 'update';
                $scope.loading = true;
                Restangular.one('manufacturing/process', $scope.processId).one('operation', $scope.operationId).one('use', $scope.useId).get().then(function(response) {
                    $scope.loading = false;
                    $scope.useData.code = response.data.code;
                    $scope.useData.version = response.data.version;
                    $scope.useData.description = response.data.description;
                    $scope.useData.quantity = response.data.quantity.value;
                    $scope.useData.unit = response.data.quantity.unit.id;
                }, function(response) {
                    services.showAlert('Falhou', 'Please try again');
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
                    if ($scope.useId != '' && $scope.useId != undefined)
                    {
                        $scope.postdata.id = $scope.useId;
                        $scope.postdata.version = $scope.useData.version;
                        method = 'PUT';
                    }
                    $scope.postdata.code = $scope.useData.code;
                    $scope.postdata.version = $scope.useData.version;
                    $scope.postdata.description = $scope.useData.description;
                    $scope.postdata.quantity = {};
                    $scope.postdata.quantity.value = parseFloat($scope.useData.quantity);
                    $scope.postdata.quantity.unit = {};
                    Restangular.one('measurement/unit', $scope.useData.unit).get().then(function(response) {
                        $scope.postdata.quantity.unit.id = response.data.id;
                        $scope.postdata.quantity.unit.version = parseInt(response.data.version);
                        $scope.postdata.quantity.unit.name = response.data.name;
                        $scope.postdata.quantity.unit.symbol = response.data.symbol;
                        $scope.postdata.quantity.unit.magnitude = {};
                        $scope.postdata.quantity.unit.magnitude = response.data.magnitude;

                        if (method == 'POST')
                        {
                            Restangular.one('manufacturing/process', $scope.processId).one('operation', $scope.operationId).all('use').post($scope.postdata).then(function(response) {
                                $scope.loading = false;
                                if (response.status == 201) {
                                    services.showAlert('Success', 'Processo foi gravado com sucesso !').then(function(res) {
                                        services.goToOperationUpdateForm($scope.processId, $scope.operationId);
                                    });
                                }
                            }, function() {
                                $scope.loading = false;
                                services.showAlert('Falhou', 'Please try again');
                            });
                        }

                        if (method == 'PUT')
                        {
                            Restangular.one('manufacturing/process', $scope.processId).one('operation', $scope.operationId).one('use', $scope.useId).customPUT($scope.postdata).then(function(response) {
                                $scope.loading = false;
                                services.showAlert('Success', 'Processo foi gravado com sucesso !').then(function(res) {
                                    services.goToOperationUpdateForm($scope.processId, $scope.operationId);
                                });
                            }, function(response) {
                                $scope.loading = false;
                                services.showAlert('Falhou', 'Please try again');
                            });
                        }
                    }, function(response) {
                        services.showAlert('Falhou', 'Please try again');
                    });
                }
            };

            Restangular.one('manufacturing/process').get({start: 0, max: 5}).then(function(response) {
                $scope.items = response.data;
                $scope.currentPage = 1;
                $scope.pageSize = 10;
            }, function(response) {
                services.showAlert('Falhou', 'Please try again');
            });
            $scope.searchProcess = function(text) {
                Restangular.one('manufacturing/process').get({search: text, start: 0, max: 5}).then(function(response) {
                    $scope.items = response.data;
                }, function(response) {
                    services.showAlert('Falhou', 'Please try again');
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
                services.showConfirmBox('Confirmation', 'Are you sure to remove this use ?').then(function(res) {
                    if (res) {
                        $scope.loading = true;
                        Restangular.one('manufacturing/process', $scope.processId).one('operation', $scope.operationId).one('use', $scope.useId).remove().then(function() {
                            $scope.loading = false;
                            services.showAlert(' A use - ' + $scope.useId + ' removed successfully.').then(function(res) {
                                if (res) {
                                    services.goToOperationUpdateForm($scope.processId, $scope.operationId);
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
                $location.path('/manufacturing/process/operation/update/' + $scope.processId + '/' + $scope.operationId);
            };
        });