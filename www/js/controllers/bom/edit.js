altamiraAppControllers.controller('BomEditCtrl',
        function($scope, $http, $location, $route, $routeParams, $ionicPopup, Restangular, services, CommonFun) {
            $scope.bomId = $routeParams.bomId;
            $scope.project = '';
            $scope.bomData = {};
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
                    $scope.bomData.version = data.version;
                    $scope.bomData.number = data.number;
                    $scope.bomData.project = data.project;
                    $scope.bomData.customer = data.customer;
                    $scope.bomData.representative = data.representative;
                    $scope.bomData.finish = data.finish;
                    $scope.bomData.quotation = data.quotation;
                    $scope.bomData.created = CommonFun.getFullDate(data.created);
                    $scope.bomData.delivery = CommonFun.getFullDate(data.delivery);
                    $scope.bomData.items = data.item;
                }
            }, function(response) {
                services.showAlert('Falhou', 'Please try again');
            });
            $scope.submitBomForm = function(isValid) {
                if (isValid) {
                    $scope.loading = true;
                    $scope.postdata = {};
                    $scope.postdata.id = $scope.bomId;
                    $scope.postdata.number = $scope.bomData.number;
                    $scope.postdata.project = $scope.bomData.project;
                    $scope.postdata.customer = $scope.bomData.customer;
                    $scope.postdata.representative = $scope.bomData.representative;
                    $scope.postdata.finish = $scope.bomData.finish;
                    $scope.postdata.quotation = $scope.bomData.quotation;
                    $scope.postdata.created = CommonFun.getFullTimestamp($scope.bomData.created);
                    $scope.postdata.delivery = CommonFun.getFullTimestamp($scope.bomData.delivery);

                    Restangular.one('manufacturing/bom', $scope.bomId).get().then(function(response1) {
                        $scope.postdata.version = response1.data.version;
                        Restangular.one('manufacturing/bom', $scope.bomId).customPUT($scope.postdata).then(function(response) {
                            $scope.loading = false;
                            $location.path('/manufacturing/bom');
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
            $scope.createItem = function() {
                $location.path('/bom/item/create/' + $scope.bomId);
            };
            $scope.updateItem = function(itemId) {
                $location.path('/bom/item/update/' + $scope.bomId + '/' + itemId);
            };
            $scope.reportBOM = function() {
                window.open(sessionStorage.getItem('reportBaseUrl')+'/report/manufacturing/bom/'+$scope.bomId+'/checklist', '_blank');
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
            $scope.removeItem = function(itemId) {
                services.showConfirmBox('Confirmation', 'Are you sure to remove this Item?').then(function(res) {
                    if (res) {
                        $scope.loading = true;
                        Restangular.one('manufacturing/bom', $scope.bomId).one('item', itemId).remove().then(function() {
                            $scope.loading = false;
                            services.showAlert('An Item - ' + itemId + ' removed successfully.').then(function(res) {
                                if (res) {
                                    $route.reload();
                                }
                            });
                        }, function() {
                            $scope.loading = false;
                            services.showAlert('Falhou', 'Please try again');
                        });
                    }
                });
            };
            $scope.updatePart = function(itemId, partId) {
                $location.path('bom/component/update/' + $scope.bomId + '/' + itemId + '/' + partId);
            };
            $scope.removePart = function(itemId, partId) {
                services.showConfirmBox('Confirmation', 'Are you sure to remove this Part?').then(function(res) {
                    if (res) {
                        $scope.loading = true;
                        Restangular.one('manufacturing/bom', $scope.bomId).one('item', itemId).one('component', partId).remove().then(function() {
                            $scope.loading = false;
                            services.showAlert('A Part - ' + partId + ' removed successfully.').then(function(res) {
                                if (res) {
                                    $route.reload();
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
                $location.path('manufacturing/bom');
            };
        });