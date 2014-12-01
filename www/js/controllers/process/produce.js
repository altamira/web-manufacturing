altamiraAppControllers.controller('ManufacturingProcessOperationProduceCtrl',
        function($scope, $http, $location, $routeParams, $upload, $ionicPopup, $ionicModal, Restangular, services) {
            $scope.processId = $routeParams.processId;
            $scope.operationId = $routeParams.operationId;
            $scope.produceId = $routeParams.produceId;
            $scope.action = 'create';
            $scope.produceData = {};
            $scope.produceData.unitBox = [];
            Restangular.one('measurement/unit').get().then(function(response) {
                for (var i in response.data)
                {
                    if (response.data[i] != null && response.data[i] != undefined)
                    {
                        if (response.data[i].id != '' && response.data[i].id != undefined)
                        {
                            $scope.produceData.unitBox.push(response.data[i]);
                        }
                    }
                }
            }, function(response) {
                services.showAlert('Falhou', 'Please try again');
            });
            if ($scope.produceId != '' && $scope.produceId != undefined)
            {
                $scope.action = 'update';
                $scope.loading = true;
                Restangular.one('manufacturing/process', $scope.processId).one('operation', $scope.operationId).one('produce', $scope.produceId).get().then(function(response) {
                    $scope.loading = false;
                    $scope.produceData.code = response.data.material.code;
                    $scope.produceData.version = response.data.version;
                    $scope.produceData.description = response.data.material.description;
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
                $scope.produceData.unit = 110;
            }

            $scope.submitProduceForm = function(isValid) {
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
                                    if ($scope.produceData.code == materials.data[i].code)
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
                                if ($scope.produceId != '' && $scope.produceId != undefined)
                                {
                                    $scope.postdata.id = $scope.produceId
                                    $scope.postdata.version = $scope.produceData.version;
                                    method = 'PUT';
                                }
                                $scope.postdata.material = {};
                                $scope.postdata.material.version = materiralData.version;
                                $scope.postdata.material.id = materiralData.id;
                                $scope.postdata.material.code = materiralData.code;
                                $scope.postdata.material.description = materiralData.description;
                                $scope.postdata.material.component = materiralData.component;

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