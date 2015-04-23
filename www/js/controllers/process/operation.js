altamiraAppControllers.controller('ManufacturingProcessCreateOperationCtrl',
        function($scope, $http, $location, $routeParams, $upload, $ionicPopup, Restangular, services, $ionicModal) {
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
                    $scope.postdata.id = 0;
                    $scope.postdata.sequence = parseInt($scope.operationData.sequence);
                    $scope.postdata.operation = {};
                    $scope.postdata.operation.id = $scope.operationData.operationId;
                    $scope.postdata.operation.type = 'br.com.altamira.data.model.manufacture.Operation';
                    $scope.postdata.operation.name = $scope.operationData.operation;
                    $scope.postdata.operation.description = $scope.operationData.operationDesc;
                    $scope.postdata.description = $scope.operationData.description;
                    Restangular.one('manufacture/process', $scope.processId).all('operation').post($scope.postdata).then(function(response) {
                        $scope.loading = false;
                        if (response.status == 201) {
                            services.showAlert('Success', 'Processo foi gravado com sucesso !').then(function(res) {
                                services.goToOperationUpdateForm($scope.processId, response.data.id);
                            });
                        }
                    }, function() {
                        $scope.loading = false;
                        services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
                    });
                }
            };

            $scope.resetOperation = function() {
                $scope.startPage = 0;
                $scope.maxRecord = 10;
                $scope.items = '';
                $scope.itemArray = [];
                $scope.nextButton = true;
            };
            $scope.searchText = sessionStorage.getItem('searchOperation');
            $scope.tempSearch = '';
            $scope.isDataSearch = '';
            $scope.resetOperation();
            $scope.loadOperation = function() {
                $scope.loading = true;
                Restangular.one('manufacture/operation').get({search: sessionStorage.getItem('searchOperation'), start: $scope.startPage, max: $scope.maxRecord}).then(function(response) {
                    if (response.data == '') {
                        $scope.loading = false;
                        if ((parseInt($scope.startPage) != 0))
                        {
                            $scope.nextButton = false;
                            $scope.startPage = (parseInt($scope.startPage) - 1);
                            $scope.loadOperation();
                        } else
                        {
                            $scope.pageStack = [];
                            services.showAlert('Notice', 'A Lista de Operation esta vazia.').then(function(res) {
                            });
                        }
                    } else
                    {
                        if ($scope.items.length <= 0 && $scope.isDataSearch == '')
                        {
                            $scope.items = response.data;
                            $scope.itemArray = response.data;
                            if ($scope.searchText != '')
                            {
                                $scope.isDataSearch = 'yes';
                            }
                            else
                            {
                                $scope.isDataSearch = '';
                            }
                        }
                        else
                        {
                            if ($scope.nextButton != false)
                            {
                                $scope.temp = response.data;
                                angular.forEach($scope.temp, function(value, key) {
                                    $scope.itemArray.push(value);
                                });
                                $scope.pageItems();
                            }
                        }
                        $scope.loading = false;
                        $scope.range();
                    }
                }, function(response) {
                    services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
                });
            };
            $scope.pageItems = function() {
                $scope.items = [];
                $scope.start = $scope.startPage * $scope.maxRecord;
                $scope.end = ($scope.startPage * $scope.maxRecord) + $scope.maxRecord;
                for (var i = $scope.start; i < $scope.end; i++)
                {
                    if ($scope.itemArray[i])
                    {
                        $scope.items.push($scope.itemArray[i]);
                    }
                }
                if ($scope.items.length != $scope.maxRecord)
                {
                    $scope.nextButton = false;
                }
            };
            $scope.searchOperation = function(text) {
                if (text != '')
                {
                    $scope.resetOperation();
                    sessionStorage.setItem('searchOperation', text);
                } else
                {
                    sessionStorage.setItem('searchOperation', '');
                    $scope.resetOperation();
                }
                $scope.loadOperation();
            };
            $scope.range = function() {
                $scope.pageStack = [];
                var start = parseInt($scope.startPage) + 1;
                for (var i = 1; i <= start; i++) {
                    $scope.pageStack.push(i);
                }
            };
            $scope.nextPage = function(len) {
                var nextPage = parseInt(len);
                $scope.startPage = nextPage;
                $scope.loadOperation();

            }
            $scope.prevPage = function(nextPage) {
                $scope.startPage = nextPage;
                $scope.loadOperation();
            }
            $scope.goPage = function(pageNumber) {
                var nextPage = parseInt(pageNumber) - 1;
                $scope.startPage = nextPage;
                if ($scope.itemArray.length > 0)
                {
                    if ($scope.searchText == '' || ($scope.searchText != '' && $scope.isDataSearch != ''))
                    {
                        $scope.pageItems();
                    }
                }
                else
                {
                    $scope.loadOperation();
                }
            }

            $ionicModal.fromTemplateUrl('templates/popup/operation_list.html', {
                scope: $scope,
                animation: 'fade-in'
            }).then(function(modal) {
                $scope.operationList = modal;
            });
            $scope.operationListModalShow = function() {
                $scope.searchText = '';
                $scope.loadOperation($scope.searchText);
                $scope.operationList.show();
            };
            $scope.operationListModalClose = function() {
                $scope.operationList.hide();
            };
            $scope.selectOperation = function(id, name, desc) {
                $scope.operationData.operationId = id;
                $scope.operationData.operation = name;
                $scope.operationData.operationDesc = desc;
                $scope.operationListModalClose();
            }
            $scope.goBack = function() {
                $location.path('manufacture/update/process/' + $scope.processId);
            };

        });

altamiraAppControllers.controller('ManufacturingProcessUpdateOperationCtrl',
        function($scope, $http, $location, $routeParams, $upload, $route, $ionicPopup, Restangular, services, $ionicModal) {
            $scope.processId = $routeParams.processId;
            $scope.operationId = $routeParams.operationId;
            $scope.operationData = {};
            $scope.operationData.sequence = '';
            $scope.operationData.operationId = '';
            $scope.operationData.operation = '';
            $scope.operationData.operationDesc = '';
            $scope.operationData.description = '';
            $scope.operationData.sketch = '';
            $scope.operationData.sketchVersion = 0;
            $scope.operationData.sketchId = ''
            $scope.operationData.format = '';
            $scope.operationData.filename = '';
            $scope.operationData.filetype = '';
            $scope.loadOperation = function() {
                $scope.loading = true;
                Restangular.one('manufacture/process', $scope.processId).one('operation', $scope.operationId).get().then(function(response) {
                    if (response.data != '')
                    {
                        $scope.loading = false;
                        $scope.operationData.operationVersion = response.data.version;
                        $scope.operationData.sequence = response.data.sequence;
                        $scope.operationData.operationId = response.data.operation.id;
                        $scope.operationData.operation = response.data.operation.name;
                        $scope.operationData.operationDesc = response.data.operation.description;
                        $scope.operationData.description = response.data.description;
                        $scope.operationData.use = response.data.use;
                        $scope.operationData.consume = response.data.consume;
                        $scope.operationData.produce = response.data.produce;
                        if (response.data.sketch != '' && response.data.sketch != undefined)
                        {
                            Restangular.one('manufacture/process', $scope.processId).one('operation', $scope.operationId).one('sketch', response.data.sketch.id).get().then(function(response1) {
                                $scope.loading = false;
                                $scope.operationData.sketchVersion = response1.data.version;
                                $scope.operationData.sketchId = response1.data.id;
                                $scope.operationData.sketch = response1.data.image;
                                $scope.operationData.format = response1.data.format;
                                $scope.operationData.filename = response1.data.filename;
                                $scope.operationData.filetype = response1.data.extension;
                            }, function(response) {
                                $scope.loading = false;
                                services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
                            });
                        }
                    }
                }, function(response) {
                    $scope.loading = false;
                    services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
                });
            };
            $scope.loadOperation();
            $scope.submitOperationForm = function(isValid) {
                if (isValid) {
                    $scope.loading = true;
                    $scope.postdata = {};

                    $scope.postdata.id = parseInt($scope.operationId);
                    $scope.postdata.sequence = parseInt($scope.operationData.sequence);
                    $scope.postdata.operation = {};
                    $scope.postdata.operation.id = $scope.operationData.operationId;
                    $scope.postdata.operation.type = 'br.com.altamira.data.model.manufacture.Operation';
                    $scope.postdata.operation.name = $scope.operationData.operation;
                    $scope.postdata.operation.description = $scope.operationData.operationDesc;
                    $scope.postdata.description = $scope.operationData.description;
//                    $scope.postdata.sketch = {};
//                    $scope.postdata.sketch = {
//                        "version": parseInt($scope.operationData.sketchVersion),
//                        "format": $scope.operationData.format,
//                        "filename": $scope.operationData.filename,
//                        "extension": $scope.operationData.filetype,
//                        "image": $scope.operationData.sketch
//                    };
//
//                    if ($scope.operationData.sketchId != '' && $scope.operationData.sketch != "")
//                    {
//                        $scope.postdata.sketch.id = parseInt($scope.operationData.sketchId);
//                    }

                    Restangular.one('manufacture/process', $scope.processId).one('operation', $scope.operationId).get().then(function(response1) {
                        $scope.postdata.version = response1.data.version;
                        Restangular.one('manufacture/process', $scope.processId).one('operation', $scope.operationId).customPUT($scope.postdata).then(function(response) {
                            $scope.loading = false;
                        }, function(response) {
                            $scope.loading = false;
                            services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
                        });
                    }, function(response1) {
                        $scope.loading = false;
                        services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
                    });

                }
            };
            $scope.resetOperation = function() {
                $scope.startPage = 0;
                $scope.maxRecord = 10;
                $scope.items = '';
                $scope.itemArray = [];
                $scope.nextButton = true;
            };
            $scope.searchText = sessionStorage.getItem('searchOperation');
            $scope.tempSearch = '';
            $scope.isDataSearch = '';
            $scope.resetOperation();
            $scope.loadOperation = function() {
                $scope.loading = true;
                Restangular.one('manufacture/operation').get({search: sessionStorage.getItem('searchOperation'), start: $scope.startPage, max: $scope.maxRecord}).then(function(response) {
                    if (response.data == '') {
                        $scope.loading = false;
                        if ((parseInt($scope.startPage) != 0))
                        {
                            $scope.nextButton = false;
                            $scope.startPage = (parseInt($scope.startPage) - 1);
                            $scope.loadOperation();
                        } else
                        {
                            $scope.pageStack = [];
                            services.showAlert('Notice', 'A Lista de Operation esta vazia.').then(function(res) {
                            });
                        }
                    } else
                    {
                        if ($scope.items.length <= 0 && $scope.isDataSearch == '')
                        {
                            $scope.items = response.data;
                            $scope.itemArray = response.data;
                            if ($scope.searchText != '')
                            {
                                $scope.isDataSearch = 'yes';
                            }
                            else
                            {
                                $scope.isDataSearch = '';
                            }
                        }
                        else
                        {
                            if ($scope.nextButton != false)
                            {
                                $scope.temp = response.data;
                                angular.forEach($scope.temp, function(value, key) {
                                    $scope.itemArray.push(value);
                                });
                                $scope.pageItems();
                            }
                        }
                        $scope.loading = false;
                        $scope.range();
                    }
                }, function(response) {
                    services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
                });
            };
            $scope.pageItems = function() {
                $scope.items = [];
                $scope.start = $scope.startPage * $scope.maxRecord;
                $scope.end = ($scope.startPage * $scope.maxRecord) + $scope.maxRecord;
                for (var i = $scope.start; i < $scope.end; i++)
                {
                    if ($scope.itemArray[i])
                    {
                        $scope.items.push($scope.itemArray[i]);
                    }
                }
                if ($scope.items.length != $scope.maxRecord)
                {
                    $scope.nextButton = false;
                }
            };
            $scope.searchOperation = function(text) {
                if (text != '')
                {
                    $scope.resetOperation();
                    sessionStorage.setItem('searchOperation', text);
                } else
                {
                    sessionStorage.setItem('searchOperation', '');
                    $scope.resetOperation();
                }
                $scope.loadOperation();
            };
            $scope.range = function() {
                $scope.pageStack = [];
                var start = parseInt($scope.startPage) + 1;
                for (var i = 1; i <= start; i++) {
                    $scope.pageStack.push(i);
                }
            };
            $scope.nextPage = function(len) {
                var nextPage = parseInt(len);
                $scope.startPage = nextPage;
                $scope.loadOperation();

            }
            $scope.prevPage = function(nextPage) {
                $scope.startPage = nextPage;
                $scope.loadOperation();
            }
            $scope.goPage = function(pageNumber) {
                var nextPage = parseInt(pageNumber) - 1;
                $scope.startPage = nextPage;
                if ($scope.itemArray.length > 0)
                {
                    if ($scope.searchText == '' || ($scope.searchText != '' && $scope.isDataSearch != ''))
                    {
                        $scope.pageItems();
                    }
                }
                else
                {
                    $scope.loadOperation();
                }
            }

            $ionicModal.fromTemplateUrl('templates/popup/operation_list.html', {
                scope: $scope,
                animation: 'fade-in'
            }).then(function(modal) {
                $scope.operationList = modal;
            });
            $scope.operationListModalShow = function() {
                $scope.searchText = '';
                $scope.loadOperation($scope.searchText);
                $scope.operationList.show();
            };
            $scope.operationListModalClose = function() {
                $scope.operationList.hide();
            };
            $scope.selectOperation = function(id, name, desc) {
                $scope.operationData.operationId = id;
                $scope.operationData.operation = name;
                $scope.operationData.operationDesc = desc;
                $scope.operationListModalClose();
            }
            $scope.uploadSketch = function() {
                $scope.postdataSketch = {};
                $scope.postdataSketch = {
                    "version": parseInt($scope.operationData.sketchVersion),
                    "format": $scope.operationData.format,
                    "filename": $scope.operationData.filename,
                    "extension": $scope.operationData.filetype,
                    "image": $scope.operationData.sketch
                };
                if ($scope.operationData.sketchId != '')
                {
                    $scope.loading = true;
                    $scope.postdataSketch.id = parseInt($scope.operationData.sketchId);
                    Restangular.one('manufacture/process', $scope.processId).one('operation', $scope.operationId).one('sketch', $scope.operationData.sketchId).customPUT($scope.postdataSketch).then(function(response) {
                        $scope.loading = false;

                    }, function(response) {
                        $scope.loading = false;
                        services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
                    });
                }
                else
                {
                    $scope.loading = true;
                    Restangular.one('manufacture/process', $scope.processId).one('operation', $scope.operationId).all('sketch').post($scope.postdataSketch).then(function(response) {
                        $scope.loading = false;
                        $scope.operationData.sketchId = response.data.id;
                    }, function(response) {
                        $scope.loading = false;
                        services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
                    });
                }

            };

            $scope.removeSketch = function() {
                $scope.loading = true;
                Restangular.one('manufacture/process', $scope.processId).one('operation', $scope.operationId).one('sketch', $scope.operationData.sketchId).remove().then(function(response) {
                    $scope.loading = false;
                    $scope.operationData.sketchId = '';
                }, function(response) {
                    $scope.loading = false;
                    services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
                });
            };
            $scope.removeOperation = function() {
                services.showConfirmBox('Confirmation', 'Tem certeza de remover esta operação ?').then(function(res) {
                    if (res) {
                        $scope.loading = true;
                        Restangular.one('manufacture/process', $scope.processId).one('operation', $scope.operationId).remove().then(function() {
                            $scope.loading = false;
                            services.showAlert('Successo', 'A operação foi removida com sucesso.').then(function(res) {
                                if (res) {
                                    services.goToProcessUpdateForm($scope.processId);
                                }
                            });
                        }, function(response1) {
                            $scope.loading = false;
                            services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
                        });
                    }
                });
            };
            $scope.goBack = function() {
                $location.path('manufacture/update/process/' + $scope.processId);
            };
            $scope.createUse = function() {
                $location.path('/manufacture/process/operation/use/' + $scope.processId + '/' + $scope.operationId);
            };
            $scope.updateUse = function(useId) {
                $location.path('/manufacture/process/operation/use/update/' + $scope.processId + '/' + $scope.operationId + '/' + useId);
            };
            $scope.createConsume = function() {
                $location.path('/manufacture/process/operation/consume/' + $scope.processId + '/' + $scope.operationId);
            };
            $scope.updateConsume = function(consumeId) {
                $location.path('/manufacture/process/operation/consume/update/' + $scope.processId + '/' + $scope.operationId + '/' + consumeId);
            };
            $scope.createProduce = function() {
                $location.path('/manufacture/process/operation/produce/' + $scope.processId + '/' + $scope.operationId);
            };
            $scope.updateProduce = function(produceId) {
                $location.path('/manufacture/process/operation/produce/update/' + $scope.processId + '/' + $scope.operationId + '/' + produceId);
            };
            $scope.removeOperationType = function(type, typeId) {
                var url = ''
                if (type == 'use')
                {
                    url = Restangular.one('manufacture/process', $scope.processId).one('operation', $scope.operationId).one('use', typeId);
                }
                if (type == 'consume')
                {
                    url = Restangular.one('manufacture/process', $scope.processId).one('operation', $scope.operationId).one('consume', typeId);
                }
                if (type == 'produce')
                {
                    url = Restangular.one('manufacture/process', $scope.processId).one('operation', $scope.operationId).one('produce', typeId);
                }
                services.showConfirmBox('Confirmação', 'Tem certeza de remover este item ?').then(function(res) {
                    if (res) {
                        $scope.loading = true;
                        url.remove().then(function() {
                            $scope.loading = false;
                            services.showAlert('Successo', 'Removido com sucesso.').then(function(res) {
                                if (res) {
                                    $route.reload();
                                }
                            });
                        }, function(response1) {
                            $scope.loading = false;
                            services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
                        });
                    }
                });
            };
        });