altamiraAppControllers.controller('BomViewCtrl',
        function($scope, $location, $route, $routeParams, Restangular, services) {
            $scope.bomId = $routeParams.bomId;
            $scope.project = '';
            $scope.bomData = {};
            $scope.bomData.checked = '';
            $scope.bomData.number = '';
            $scope.bomData.project = '';
            $scope.bomData.customer = '';
            $scope.bomData.representative = '';
            $scope.bomData.finish = '';
            $scope.bomData.quotation = '';
            $scope.bomData.created = '';
            $scope.bomData.delivery = '';
            $scope.loading = true;
            Restangular.one('manufacturing/bom', $scope.bomId).get().then(function(response) {
                $scope.loading = false;
                var data = response.data;
                if (data != '')
                {
                    $scope.bomData.checked = data.checked;
                    $scope.bomData.number = data.number;
                    $scope.bomData.project = data.project;
                    $scope.bomData.customer = data.customer;
                    $scope.bomData.representative = data.representative;
                    $scope.bomData.finish = data.finish;
                    $scope.bomData.quotation = data.quotation;
                    $scope.bomData.created = moment.unix(data.created).format('DD/MM/YYYY');
                    $scope.bomData.delivery = moment.unix(data.delivery).format('DD/MM/YYYY');
                    $scope.bomData.items = data.item;
                }
            }, function(response) {
                services.showAlert('Falhou', 'Please try again');
            });
            $scope.makeChecked = function() {
                services.showConfirmBox('Confirmation', 'A Lista de Material foi conferida ?').then(function(res) {
                    if (res) {
                        $scope.loading = true;
                        Restangular.one('manufacturing/bom', $scope.bomId).all('checked').customPUT().then(function(response) {
                            $scope.loading = false;
                            services.showAlert('Success', 'A Lista de Material do Pedido ' + $scope.bomData.number + ' foi marcada como conferida.').then(function(res) {
                                if (res) {
                                    //$route.reload();
                                    $location.path('/manufacturing/bom');
                                }
                            });

                        }, function(response) {
                            $scope.loading = false;
                            services.showAlert('Falhou', 'Please try again');
                        });
                    }
                });
            };
            $scope.makeUnchecked = function() {
                services.showConfirmBox('Confirmation', 'A Lista de Material foi conferida ?').then(function(res) {
                    if (res) {
                        $scope.loading = true;
                        Restangular.one('manufacturing/bom', $scope.bomId).all('unchecked').customPUT().then(function(response) {
                            $scope.loading = false;
                            services.showAlert('Success', 'A Lista de Material do Pedido ' + $scope.bomData.number + ' foi marcada como conferida.').then(function(res) {
                                if (res) {
                                    $route.reload();
                                }
                            });

                        }, function(response) {
                            $scope.loading = false;
                            services.showAlert('Falhou', 'Please try again');
                        });
                    }
                });
            };
            $scope.edit = function() {
                $location.path('/bom/edit/' + $scope.bomId);
            };
            $scope.createItem = function() {
                $location.path('/bom/item/create/' + $scope.bomId);
            };
            $scope.updateItem = function(itemId) {
                $location.path('/bom/item/update/' + $scope.bomId + '/' + itemId);
            };
            $scope.removeBom = function() {
                services.showConfirmBox('Confirmation', 'Are you sure to remove this BOM?').then(function(res) {
                    if (res) {
                        $scope.loading = true;
                        Restangular.one('manufacturing/bom', $scope.bomId).remove().then(function() {
                            $scope.loading = false;
                            services.showAlert(' A BOM - ' + $scope.bomId + ' removed successfully.').then(function(res) {
                                if (res) {
                                    $location.path('/manufacturing/bom');
                                }
                            });
                        }, function() {
                            $scope.loading = false;
                            services.showAlert('Falhou', 'Please try again');
                        });
                    }
                });
            };
            $scope.reportBOM = function() {
                window.open(sessionStorage.getItem('reportBaseUrl')+'/manufacturing-report-0.4.0-SNAPSHOT/report/manufacturing/bom/'+$scope.bomId+'/checklist', '_blank');
            };
            $scope.updatePart = function(itemId, partId) {
                $location.path('bom/component/update/' + $scope.bomId + '/' + itemId + '/' + partId);
            };
            $scope.goBack = function() {
                $location.path('manufacturing/bom');
            };
        });