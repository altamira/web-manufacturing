altamiraAppControllers.controller('ManufacturingProcessOperationConsumeCtrl',
        function($scope, $location, $routeParams, $ionicPopup, $ionicModal, Restangular, IntegrationRestangular, services, $ionicLoading, $timeout) {
            $scope.processId = $routeParams.processId;
            $scope.operationId = $routeParams.operationId;
            $scope.consumeId = $routeParams.consumeId;
            $scope.action = 'create';
            $scope.consumeData = {};
            $scope.consumeData.unitBox = [];
            $scope.operationType = 'consume';
            Restangular.one('measurement/unit').get().then(function(response) {
                for (var i in response.data)
                {
                    if (response.data[i] != null && response.data[i] != undefined)
                    {
                        if (response.data[i].id != '' && response.data[i].id != undefined)
                        {
                            $scope.consumeData.unitBox.push(response.data[i]);
                        }
                    }
                }

            }, function(response) {
                services.showAlert('Falhou', 'Please try again');
            });
            if ($scope.consumeId != '' && $scope.consumeId != undefined)
            {
                $scope.action = 'update';
                $scope.loading = true;
                Restangular.one('manufacturing/process', $scope.processId).one('operation', $scope.operationId).one('consume', $scope.consumeId).get().then(function(response) {
                    $scope.loading = false;
                    $scope.consumeData.code = response.data.material.code;
                    $scope.consumeData.version = response.data.version;
                    $scope.consumeData.description = response.data.material.description;
                    $scope.consumeData.quantity = response.data.quantity.formula;
                    $scope.consumeData.unit = response.data.quantity.unit.id;
                    console.log(JSON.stringify($scope.consumeData));
                }, function(response) {
                    services.showAlert('Falhou', 'Please try again');
                });
            }
            else
            {
                $scope.consumeData.version = '';
                $scope.consumeData.code = '';
                $scope.consumeData.description = '';
                $scope.consumeData.quantity = 1;
                $scope.consumeData.unit = 110;
            }

            $scope.submitConsumeForm = function(isValid) {
                if (isValid) {
                    $scope.loading = true;
                    Restangular.one('common/material').get({code: $scope.consumeData.code}).then(function(response) {
                        $scope.loading = false;
                        if (response.data != '')
                        {
                            var materiralData = response.data;
                            $scope.postdata = {};
                            var method = 'POST';
                            $scope.postdata.version = 0;
                            if ($scope.consumeId != '' && $scope.consumeId != undefined)
                            {
                                $scope.postdata.id = $scope.consumeId;
                                $scope.postdata.version = $scope.consumeData.version;
                                method = 'PUT';
                            }
                            $scope.postdata.material = {};
                            $scope.postdata.material.version = 0;
                            $scope.postdata.material.id = materiralData.id;
                            $scope.postdata.material.code = materiralData.code;
                            $scope.postdata.material.description = materiralData.description;
                            $scope.postdata.material.component = [];

                            $scope.postdata.quantity = {};
//                            $scope.postdata.quantity.value = parseFloat($scope.consumeData.quantity);
                            $scope.postdata.quantity.formula = $scope.consumeData.quantity;
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
                                    console.log(JSON.stringify($scope.postdata));
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
                        else
                        {
                            services.showAlert('Error', 'Material not found for written code.Please check it').then(function(res) {
                                return false;
                            });
                        }
                    }, function(response) {
                        $scope.loading = false;
                        services.showAlert('Falhou', 'Please try again');
                    });
                }
            };
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
                        }, function() {
                            $scope.loading = false;
                            services.showAlert('Falhou', 'Please try again');
                        });
                    }
                });
            };
            $scope.goBack = function() {
                $location.path('/manufacturing/process/operation/update/' + $scope.processId + '/' + $scope.operationId);
            };

            $ionicModal.fromTemplateUrl('templates/popup/material_list.html', {
                scope: $scope,
                animation: 'fade-in'
            }).then(function(modal) {
                $scope.materialList = modal;
            });
            $scope.materialListModalShow = function() {
                $scope.searchText = '';
                $scope.isDataSearch = '';
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

            $scope.selectMaterial = function(code, description) {
                $scope.material.code = code;
                $scope.material.description = description;
                $scope.materialImportListModalClose();
            };

            $scope.resetImportMaterial = function() {
                $scope.startImportMaterialPage = 0;
                $scope.maxImportMaterialRecord = 5;
                $scope.itemsImportMaterial = '';
                $scope.itemImportMaterialArray = '';
                $scope.nextImportMaterialButton = true;
            }
            $scope.searchImportMaterialText = '';
            $scope.tempImportMaterialSearch = '';
            $scope.isImportMaterialDataSearch = '';
            $scope.resetImportMaterial();
            $scope.openImportMaterialList = function() {
                $scope.resetImportMaterial();
                $scope.searchImportMaterialText = '';
                $scope.tempImportMaterialSearch = '';
                $scope.isImportMaterialDataSearch = '';
                $scope.loadImportMaterial();
            };
            $scope.loadImportMaterial = function() {
                Restangular.one('common/material').get({search: $scope.searchImportMaterialText, start: $scope.startImportMaterialPage, max: $scope.maxImportMaterialRecord}).then(function(response) {
                    if (response.data == '') {
                        if ((parseInt($scope.startImportMaterialPage) != 0))
                        {
                            $scope.nextImportMaterialButton = false;
                            $scope.startImportMaterialPage = (parseInt($scope.startImportMaterialPage) - 1);
                            $scope.loadImportMaterial();
                        } else
                        {
                            $scope.materialType.hide();
                            services.showAlert('Notice', 'Material list is empty').then(function(res) {
                            });
                        }
                    } else
                    {
                        if ($scope.itemsImportMaterial.length <= 0)
                        {
                            $scope.itemsImportMaterial = response.data;

                            $scope.itemImportMaterialArray = response.data;
                            if ($scope.searchImportMaterialText != '')
                            {
                                $scope.isImportMaterialDataSearch = 'yes';
                            }
                            else
                            {
                                $scope.isImportMaterialDataSearch = '';
                            }
                            if ($scope.materialImportList != undefined)
                            {
                                $scope.materialImportList.hide();
                            }
                            $ionicModal.fromTemplateUrl('templates/popup/material_import_list.html', {
                                scope: $scope,
                                animation: 'fade-in'
                            }).then(function(modal) {
                                $scope.materialImportList = modal;
                                $scope.materialImportListModalShow();
                            });
                        }
                        else
                        {
                            if ($scope.nextImportMaterialButton != false)
                            {
                                $scope.temp = response.data;
                                angular.forEach($scope.temp, function(value, key) {
                                    $scope.itemImportMaterialArray.push(value);
                                });
                                $scope.pageImportMaterial();
                            }
                        }
                        $scope.loading = false;
                        $scope.rangeImportMaterial();
                    }
                }, function(response) {
                    services.showAlert('Falhou', 'Please try again');
                });
            };

            $scope.backToCreatePage = function() {
                $scope.materialImportList.hide();
                $scope.materialImportList.hide();
            };

            $scope.pageImportMaterial = function() {
                $scope.itemsImportMaterial = [];
                $scope.start = $scope.startImportMaterialPage * $scope.maxImportMaterialRecord;
                $scope.end = ($scope.startImportMaterialPage * $scope.maxImportMaterialRecord) + $scope.maxImportMaterialRecord;
                for (var i = $scope.start; i < $scope.end; i++)
                {
                    if ($scope.itemImportMaterialArray[i])
                    {
                        $scope.itemsImportMaterial.push($scope.itemImportMaterialArray[i]);
                    }
                }
                if ($scope.itemsImportMaterial.length != $scope.maxImportMaterialRecord)
                {
                    $scope.nextImportMaterialButton = false;
                }
            };
            $scope.searchImportMaterial = function(text) {
                $scope.searchImportMaterialText = text;
                if ($scope.isImportMaterialDataSearch == '')
                {
                    $scope.resetImportMaterial();
                }
                if ($scope.searchImportMaterialText == '' && $scope.isImportMaterialDataSearch != '')
                {
                    $scope.resetImportMaterial();
                    $scope.isImportMaterialDataSearch = '';
                }
                if ($scope.searchImportMaterialText != '' && ($scope.tempImportMaterialSearch == $scope.searchImportMaterialText))
                {
                    $scope.tempImportMaterialSearch = $scope.searchImportMaterialText;
                }
                else
                {
                    $scope.resetImportMaterial();
                    $scope.isImportMaterialDataSearch = '';
                    $scope.tempImportMaterialSearch = $scope.searchImportMaterialText;
                }
                $scope.loadImportMaterial();
            };
            $scope.rangeImportMaterial = function() {
                $scope.pageStackImportMaterial = [];
                var start = parseInt($scope.startImportMaterialPage) + 1;
                for (var i = 1; i <= start; i++) {
                    $scope.pageStackImportMaterial.push(i);
                }
            };
            $scope.nextPageImportMaterial = function(len) {
                var nextPage = parseInt(len);
                $scope.startImportMaterialPage = nextPage;
                $scope.loadImportMaterial();

            }
            $scope.prevPageImportMaterial = function(nextPage) {
                $scope.startImportMaterialPage = nextPage;
                $scope.loadImportMaterial();
            }
            $scope.goPageImportMaterial = function(pageNumber) {
                var nextPage = parseInt(pageNumber) - 1;
                $scope.startImportMaterialPage = nextPage;
                if ($scope.itemImportMaterialArray.length > 0)
                {
                    if ($scope.searchImportMaterialText == '' || ($scope.searchImportMaterialText != '' && $scope.isImportMaterialDataSearch != ''))
                    {
                        $scope.pageImportMaterial();
                    }
                }
                else
                {
                    $scope.loadImportMaterial();
                }
            }
            $scope.materialImportListModalShow = function() {
                $scope.materialCreate.hide();
                $scope.materialImportList.show();
            };
            $scope.materialImportListModalClose = function() {
                $scope.materialImportList.hide();
                $scope.materialCreate.show();
            };
        });