altamiraAppControllers.controller('MaterialComponentCtrl',
        function($scope, $http, $location, $routeParams, $ionicPopup, $ionicModal, Restangular, services) {
            $scope.materialId = $routeParams.materialId;
            $scope.componentId = $routeParams.componentId;
            $scope.action = 'create';
            $scope.componentData = {};
            $scope.componentData.unitBox = {};
            Restangular.one('measurement/unit').get().then(function(response) {
                $scope.componentData.unitBox = response.data;
            }, function(response) {
                services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
            });
            if ($scope.componentId != '' && $scope.componentId != undefined)
            {
                $scope.action = 'update';
                $scope.loading = true;
                Restangular.one('common/material', $scope.materialId).one('component', $scope.componentId).get().then(function(response) {
                    $scope.componentData.unitBox = response.data;
                }, function(response) {
                    services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
                });
            }
            else
            {
                $scope.componentData.code = '';
                $scope.componentData.version = 0;
                $scope.componentData.description = '';
                $scope.componentData.quantity = 1;
                $scope.componentData.unit = 6;
            }

            $scope.submiComponentForm = function(isValid) {
                if (isValid) {
                    $scope.loading = true;
                    $scope.postdata = {};
                    var method = 'POST';
                    var url = 'http://data.altamira.com.br/data-rest-0.7.0-SNAPSHOT/data-rest-0.7.0-SNAPSHOT/common/material/' + $scope.materialId + '/component/';
                    if ($scope.componentId != '' && $scope.componentId != undefined)
                    {
                        $scope.postdata.id = $scope.componentId;
                        $scope.postdata.version = $scope.componentData.version;
                        method = 'PUT';
                        url = 'http://data.altamira.com.br/data-rest-0.7.0-SNAPSHOT/data-rest-0.7.0-SNAPSHOT/common/material/' + $scope.materialId + '/component/' + $scope.componentId;
                    }
                    $scope.postdata.code = $scope.componentData.code;
                    $scope.postdata.version = $scope.componentData.version;
                    $scope.postdata.description = $scope.componentData.description;
                    $scope.postdata.quantity = {};
                    $scope.postdata.quantity.value = parseFloat($scope.componentData.quantity);
                    $scope.postdata.quantity.unit = {};
                    Restangular.one('measurement/unit', $scope.componentData.unit).get().then(function(response) {
                        $scope.postdata.quantity.unit.id = response.data.id;
                        $scope.postdata.quantity.unit.version = parseInt(response.data.version);
                        $scope.postdata.quantity.unit.name = response.data.name;
                        $scope.postdata.quantity.unit.symbol = response.data.symbol;
                        $scope.postdata.quantity.unit.magnitude = {};
                        $scope.postdata.quantity.unit.magnitude = response.data.magnitude;

                        if (method == 'POST')
                        {
                            Restangular.one('common/material', $scope.materialId).all('component').post($scope.postdata).then(function(response) {
                                $scope.loading = false;
                                if (response.status == 201) {
                                    $location.path('/material/update/' + $scope.materialId);
                                }
                            }, function() {
                                $scope.loading = false;
                                services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
                            });
                        }

                        if (method == 'PUT')
                        {
                            Restangular.one('common/material', $scope.materialId).one('component', $scope.componentId).customPUT($scope.postdata).then(function(response) {
                                $scope.loading = false;
                                $location.path('/material/update/' + $scope.materialId);
                            }, function(response) {
                                $scope.loading = false;
                                services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
                            });
                        }
                    }, function(response) {
                        services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
                    });
                }
            };
            Restangular.one('manufacturing/bom', $scope.bomId).get().then(function(response1) {
                $scope.postdata.version = response1.data.version;
                Restangular.one('manufacturing/bom', $scope.bomId).customPUT($scope.postdata).then(function(response) {
                    $scope.loading = false;
                    $location.path('/manufacturing/bom');
                }, function(response) {
                    $scope.loading = false;
                    services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
                });
            }, function(response1) {
                $scope.loading = false;
                services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
            });
            Restangular.one('manufacturing/process').get({start: 0, max: 5}).then(function(response) {
                $scope.items = response.data;
                $scope.currentPage = 1;
                $scope.pageSize = 10;
            }, function(response) {
                services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
            });
            $scope.searchProcess = function(text) {
                Restangular.one('manufacturing/process').get({search: text, start: 0, max: 5}).then(function(response) {
                    $scope.items = response.data;
                }, function(response) {
                    services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
                });
            };

            $scope.goUpdate = function(code, desc) {
                $scope.componentData.code = code;
                $scope.componentData.description = desc;
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
            $scope.$on('$destroy', function() {
                $scope.modal.remove();
            });
            $scope.$on('modal.hidden', function() {
            });
            $scope.$on('modal.removed', function() {
            });

            $scope.removeUse = function() {
                services.showConfirmBox('Confirmação', 'Tem certeza de remover este componente ?').then(function(res) {
                    if (res) {
                        $scope.loading = true;
                        Restangular.one('common/material', $scope.materialId).one('component', $scope.componentId).remove().then(function() {
                            $scope.loading = false;
                            $location.path('/material/update/' + $scope.materialId);
                        }, function() {
                            $scope.loading = false;
                            services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
                        });
                    }
                });
            };
            $scope.goBack = function() {
                $location.path('/material/update/' + $scope.materialId);
            };
        });