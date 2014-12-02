altamiraAppControllers.controller('ManufacturingProcessOperationConsumeCtrl',
        function($scope, $http, $location, $routeParams, $upload, $ionicPopup, $ionicModal, Restangular, services) {
            $scope.processId = $routeParams.processId;
            $scope.operationId = $routeParams.operationId;
            $scope.consumeId = $routeParams.consumeId;
            $scope.action = 'create';
            $scope.consumeData = {};
            $scope.consumeData.unitBox = [];
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
                $scope.consumeData.unit = 110;
            }

            $scope.submitConsumeForm = function(isValid) {
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
                                    if ($scope.consumeData.code == materials.data[i].code)
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
                                $scope.postdata.version = 0;
                                if ($scope.consumeId != '' && $scope.consumeId != undefined)
                                {
                                    $scope.postdata.id = $scope.consumeId;
                                    $scope.postdata.version = $scope.consumeData.version;
                                    method = 'PUT';
                                }
                                $scope.postdata.material = {};
                                $scope.postdata.material.version = materiralData.version;
                                $scope.postdata.material.id = materiralData.id;
                                $scope.postdata.material.code = materiralData.code;
                                $scope.postdata.material.description = materiralData.description;
                                $scope.postdata.material.component = materiralData.component;

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
                $scope.consumeData.code = code;
                $scope.consumeData.description = desc;
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
                    console.log(JSON.stringify($scope.material));
                    Restangular.all('manufacture').all('tooling').post($scope.material).then(function(response) {
                        $scope.loading = false;
                        console.log(JSON.stringify(response.data));
                        if (response.status == 201) {
                            $scope.items.push({"id": response.data.id, "code": $scope.material.code, "description": $scope.material.description});
                            services.showAlert('Success', 'Processo foi gravado com sucesso !').then(function(res) {
                                $scope.consumeData.code = $scope.material.code;
                                $scope.consumeData.description = $scope.material.description;

                                $scope.materialCreate.hide();
                            });
                        }
                    }, function() {
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
        });