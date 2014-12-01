altamiraAppControllers.controller('ManufacturingProcessOperationUseCtrl',
        function($scope, $http, $location, $routeParams, $ionicPopup, $ionicModal, Restangular, services) {
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

            $scope.searchMaterial = function(text) {
                Restangular.one('common/material').get({search: text, start: 0, max: 5}).then(function(response) {
                    $scope.items = response.data;
                    $scope.currentPage = 1;
                    $scope.pageSize = 10;
                }, function(response) {
                    services.showAlert('Falhou', 'Please try again');
                });
            };
            $scope.searchText = '';
            $scope.searchMaterial($scope.searchText);

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