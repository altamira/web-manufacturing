altamiraAppControllers.controller('ManufacturingProcessOperationUseCtrl',
        function($scope, $http, $location, $routeParams, $ionicPopup, $ionicModal, Restangular, services, $ionicLoading, $timeout) {
            $scope.processId = $routeParams.processId;
            $scope.operationId = $routeParams.operationId;
            $scope.useId = $routeParams.useId;
            $scope.action = 'create';
            $scope.useData = {};
            $scope.useData.unitBox = [];
            Restangular.one('measurement/unit').get().then(function(response) {
                for (var i in response.data)
                {
                    if (response.data[i] != null && response.data[i] != undefined)
                    {
                        if (response.data[i].id != '' && response.data[i].id != undefined)
                        {
                            $scope.useData.unitBox.push(response.data[i]);
                        }
                    }
                }
            }, function(response) {
                services.showAlert('Falhou', 'Please try again');
            });
            if ($scope.useId != '' && $scope.useId != undefined)
            {
                $scope.action = 'update';
                $scope.loading = true;
                Restangular.one('manufacturing/process', $scope.processId).one('operation', $scope.operationId).one('use', $scope.useId).get().then(function(response) {
                    $scope.loading = false;
                    $scope.useData.code = response.data.material.code;
                    $scope.useData.version = response.data.version;
                    $scope.useData.description = response.data.material.description;
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
                $scope.useData.unit = 110;
            }

            $scope.submitUseForm = function(isValid) {
                if (isValid) {
                    $scope.loading = true;
                    var codeStatus = 'false';
                    var materialId = '';
                    Restangular.one('common/material').get().then(function(response) {
                        var materials = response;
                        for (var i in materials.data)
                        {
                            if (materials.data[i] != '' && materials.data[i] != null)
                            {
                                if (materials.data[i].id != '' && materials.data[i].id != undefined)
                                {
                                    console.log(JSON.stringify(materials.data[i].code));
                                    if ($scope.useData.code == materials.data[i].code)
                                    {
                                        codeStatus = 'true';
                                        materialId = materials.data[i].id;
                                    }
                                }
                            }
                        }
                        if (codeStatus == 'true')
                        {
                            Restangular.one('common/material', materialId).get().then(function(response) {
                                var materiralData = response.data;
                                $scope.postdata = {};
                                var method = 'POST';
                                if ($scope.useId != '' && $scope.useId != undefined)
                                {
                                    $scope.postdata.id = $scope.useId;
                                    $scope.postdata.version = $scope.useData.version;
                                    method = 'PUT';
                                }
                                $scope.postdata.version = $scope.useData.version;
                                $scope.postdata.material = {};
                                $scope.postdata.material.version = materiralData.version;
                                $scope.postdata.material.id = materiralData.id;
                                $scope.postdata.material.code = materiralData.code;
                                $scope.postdata.material.description = materiralData.description;
                                $scope.postdata.material.component = materiralData.component;

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
                                        console.log(JSON.stringify($scope.postdata));
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
                            });
                        } else {
                            $scope.loading = false;
                            services.showAlert('Error', 'Material not found for written code.Please check it').then(function(res) {
                                return false;
                            });
                        }
                        console.log(JSON.stringify(codeStatus));
                    }, function(response) {
                        $scope.loading = false;
                        services.showAlert('Falhou', 'Please try again');
                    });

                }
            };
            $scope.startPage = 0;
            $scope.maxRecord = 10;
            $scope.searchText = '';
            $scope.loadMaterial = function() {
                Restangular.one('common/material').get({search: $scope.searchText, start: $scope.startPage, max: $scope.maxRecord}).then(function(response) {
                    $scope.items = response.data;
                    console.log(JSON.stringify(response.data))
                    $scope.range();
                    if (response.data == '') {
                        if ((parseInt($scope.startPage) != 0))
                        {
                            $scope.startPage = (parseInt($scope.startPage) - 1);
                            $scope.loadMaterial();
                        } else
                        {
                            services.showAlert('Notice', 'Material list is empty').then(function(res) {
                            });
                        }
                    }
                }, function(response) {
                    services.showAlert('Falhou', 'Please try again');
                });
            };
            $scope.searchMaterial = function(text) {
                $scope.startPage = 0;
                $scope.maxRecord = 10;
                $scope.searchText = text;
                $scope.loadMaterial();
            };
            $scope.range = function() {
                $scope.pageStack = [];
                var start = parseInt($scope.startPage) + 1;
                var input = [];
                for (var i = 1; i <= start; i++) {
                    $scope.pageStack.push(i);
                }
                console.log(JSON.stringify($scope.pageStack));
            };
            $scope.nextPage = function(len) {
                var nextPage = parseInt(len);
                $scope.startPage = nextPage;
                $scope.loadMaterial();
            }
            $scope.prevPage = function(nextPage) {
                $scope.startPage = nextPage;
                $scope.loadMaterial();
            }
            $scope.goPage = function(pageNumber) {
                var nextPage = parseInt(pageNumber) - 1;
                $scope.startPage = nextPage;
                $scope.loadMaterial();
            }
            $scope.goUpdate = function(code, desc) {
                $scope.useData.code = code;
                $scope.useData.description = desc;
                $scope.materialList.hide();
            };

            $ionicModal.fromTemplateUrl('templates/popup/material_list.html', {
                scope: $scope,
                animation: 'fade-in'
            }).then(function(modal) {
                $scope.materialList = modal;
            });
            $scope.materialListModalShow = function() {
                $scope.searchText = '';
                $scope.loadMaterial($scope.searchText);
                $scope.materialList.show();
            };
            $scope.materialListModalClose = function() {
                $scope.materialList.hide();
            };

            $ionicModal.fromTemplateUrl('templates/popup/material_type.html', {
                scope: $scope,
                animation: 'fade-in'
            }).then(function(modal) {
                $scope.materialType = modal;
            });

            $scope.materialTypeModalShow = function() {
                $scope.materialListModalClose();
                $scope.materialType.show();
            };

            $scope.materialTypeModalClose = function() {
                $scope.materialType.hide();
                $scope.materialListModalShow();
            };

            $scope.selectMaterialType = function(type) {
                $scope.material = {};
                $scope.materialTypeText = type;
                $scope.material.version = 0;
                $scope.material.code = '';
                $scope.material.description = '';
                console.log(JSON.stringify($scope.materialTypeText));
                $scope.materialCreateModalShow();
            };

            $ionicModal.fromTemplateUrl('templates/popup/material_create.html', {
                scope: $scope,
                animation: 'fade-in'
            }).then(function(modal) {
                $scope.materialCreate = modal;
            });

            $scope.materialCreateModalShow = function() {
                $scope.materialType.hide();
                $scope.materialCreate.show();
            };

            $scope.materialCreateModalClose = function() {
                $scope.materialCreate.hide();
                $scope.materialTypeModalShow();
            };
            $scope.submitCreateMaterial = function(isValid) {
                if (isValid) {
                    var materialBaseUrl = '';
                    switch ($scope.materialTypeText) {
                        case 'product':
                            materialBaseUrl = Restangular.all('sales').all('product');
                            break;
                        case 'material':
                            materialBaseUrl = Restangular.all('purchase').all('material');
                            break;
                        case 'inputs':
                            materialBaseUrl = Restangular.all('purchase').all('inputs');
                            break;
                        case 'ink':
                            materialBaseUrl = Restangular.all('purchase').all('ink');
                            break;
                        case 'machine':
                            materialBaseUrl = Restangular.all('manufacture').all('machine');
                            break;
                        case 'tooling':
                            materialBaseUrl = Restangular.all('manufacture').all('tooling');
                            break;
                    }
                    console.log(JSON.stringify($scope.material));
                    materialBaseUrl.post($scope.material).then(function(response) {
                        $scope.loading = false;
                        console.log(JSON.stringify(response.data));
                        if (response.status == 201) {
                            $scope.items.push({"id": response.data.id, "code": $scope.material.code, "description": $scope.material.description});
                            services.showAlert('Success', 'Processo foi gravado com sucesso !').then(function(res) {
                                $scope.useData.code = $scope.material.code;
                                $scope.useData.description = $scope.material.description;

                                $scope.materialCreate.hide();
                            });
                        }
                    }, function() {
                        $scope.loading = false;
                        services.showAlert('Falhou', 'Please try again');
                    });
                }

            };


            $scope.importOrder = function() {
                $scope.importData = {};
                // An elaborate, custom popup
                var importPopup = $ionicPopup.show({
                    templateUrl: 'templates/popup/material_import.html',
                    title: 'Numero do Pedido',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar',
                            onTap: function(res) {
                                importPopup.close();
                            }
                        },
                        {text: '<b>Importar</b>',
                            type: 'button-positive',
                            onTap: function(res) {
                                $scope.showLoading();
                                //get data from api
                                Restangular.one('common/material?search=', $scope.importData.materialSearchText).get().then(function(response) {
                                    $scope.importedMaterial = response.data;
                                    $ionicModal.fromTemplateUrl('templates/popup/material_import_list.html', {
                                        scope: $scope,
                                        animation: 'fade-in'
                                    }).then(function(modal) {
                                        $scope.materialImportList = modal;
                                        $scope.materialImportListModalShow();
                                    });
                                    $scope.materialImportListModalShow = function() {
                                        $scope.materialCreate.hide();
                                        $scope.materialImportList.show();
                                    };
                                    $scope.materialImportListModalClose = function() {
                                        $scope.materialImportList.hide();
                                        $scope.materialCreate.show();
                                    };

                                }, function(response) {
                                    services.showAlert('Falhou', 'Please try again');
                                });
                                $scope.hideLoading();
                            }
                        },
                    ]
                });
                importPopup.then(function(res) {

                });
                $timeout(function() {
                    importPopup.close();
                }, 10000);
            };

            $scope.showLoading = function() {
                $ionicLoading.show({
                    template: 'Enviando, aguarde...'
                });
            };

            $scope.hideLoading = function() {
                $ionicLoading.hide();
            };
            $scope.selectMaterial = function(code, description) {
                $scope.material.code = code;
                $scope.material.description = description;
                $scope.materialImportListModalClose();
            };

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