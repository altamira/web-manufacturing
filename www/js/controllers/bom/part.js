altamiraAppControllers.controller('BomPartCreateCtrl',
        function($scope, $http, $location, $routeParams, $ionicPopup, Restangular, services) {
            $scope.bomId = $routeParams.bomId;
            $scope.itemId = $routeParams.itemId;
            $scope.partData = {}
            $scope.partData.version = '';
            $scope.partData.code = '';
            $scope.partData.description = '';
            $scope.partData.color = 'CZ-PAD';

            $scope.partData.length = '';
            $scope.partData.height = '';
            $scope.partData.width = '';
            $scope.partData.quantity = '';
            $scope.partData.weight = '';

            $scope.partData.lengthType = 4;
            $scope.partData.heightType = 4;
            $scope.partData.widthType = 4;
            $scope.partData.weightType = 6;
            $scope.partData.quantityType = 8;

            Restangular.one('common/color').get({max: 0}).then(function(response) {
                $scope.partData.colorBox = response.data;
            }, function(response) {
                services.showAlert('Falhou', 'Please try again');
            });
            Restangular.one('measurement/unit').get({magnitude: 'dimencional'}).then(function(response) {
                $scope.partData.unitLengthBox = response.data;
            }, function(response) {
                services.showAlert('Falhou', 'Please try again');
            });
            Restangular.one('measurement/unit').get({magnitude: 'peso'}).then(function(response) {
                $scope.partData.unitWeightBox = response.data;
            }, function(response) {
                services.showAlert('Falhou', 'Please try again');
            });
            Restangular.one('measurement/unit').get({magnitude: 'unidade'}).then(function(response) {
                $scope.partData.unitQuantityBox = response.data;
            }, function(response) {
                services.showAlert('Falhou', 'Please try again');
            });

            $scope.submitPartForm = function(isValid) {
                if (isValid) {
                    $scope.loading = true;
                    $scope.postData = {};
                    $scope.postData.version = 0;
                    $scope.postData.code = $scope.partData.code;
                    $scope.postData.description = $scope.partData.description;
                    $scope.postData.color = $scope.partData.color;

                    $scope.postData.quantity = {};
                    $scope.postData.quantity.value = parseFloat($scope.partData.quantity);
                    $scope.postData.quantity.unit = {};
                    $scope.postData.quantity.unit.id = $scope.partData.quantityType;

                    $scope.postData.width = {};
                    $scope.postData.width.value = parseFloat($scope.partData.width);
                    $scope.postData.width.unit = {};
                    $scope.postData.width.unit.id = $scope.partData.widthType;

                    $scope.postData.height = {};
                    $scope.postData.height.value = parseFloat($scope.partData.height);
                    $scope.postData.height.unit = {};
                    $scope.postData.height.unit.id = $scope.partData.heightType;

                    $scope.postData.length = {};
                    $scope.postData.length.value = parseFloat($scope.partData.length);
                    $scope.postData.length.unit = {};
                    $scope.postData.length.unit.id = $scope.partData.lengthType;

                    $scope.postData.weight = {};
                    $scope.postData.weight.value = parseFloat($scope.partData.weight);
                    $scope.postData.weight.unit = {};
                    $scope.postData.weight.unit.id = $scope.partData.weightType;
                    console.log(JSON.stringify($scope.postData));
                    Restangular.one('manufacturing/bom', $scope.bomId).one('item', $scope.itemId).all('part').post($scope.postData).then(function(response) {
                        $scope.loading = false;
                        $location.path('/bom/part/update/' + $scope.bomId + '/' + $scope.itemId + '/' + response.data.id);
                    }, function() {
                        $scope.loading = false;
                        services.showAlert('Falhou', 'Please try again');
                    });
                }
            }
            $scope.goBack = function() {
                $location.path('bom/item/update/' + $scope.bomId + '/' + $scope.itemId);
            };
        });

altamiraAppControllers.controller('BomPartUpdateCtrl',
        function($scope, $http, $location, $routeParams, $route, $ionicPopup, Restangular, services) {
            $scope.bomId = $routeParams.bomId;
            $scope.itemId = $routeParams.itemId;
            $scope.partId = $routeParams.partId;
            $scope.partData = {}
            $scope.partData.version = '';
            $scope.partData.code = 'CZ-PAD';
            $scope.partData.description = '';
            $scope.partData.color = '';
            $scope.partData.quantity = '';
            $scope.partData.width = '';
            $scope.partData.height = '';
            $scope.partData.length = '';
            $scope.partData.weight = '';

            $scope.partData.lengthType = 4;
            $scope.partData.heightType = 4;
            $scope.partData.widthType = 4;
            $scope.partData.weightType = 6;
            $scope.partData.quantityType = 8;

            Restangular.one('common/color').get({max: 0}).then(function(response) {
                $scope.partData.colorBox = response.data;
            }, function(response) {
                services.showAlert('Falhou', 'Please try again');
            });
            Restangular.one('measurement/unit').get({magnitude: 'dimencional'}).then(function(response) {
                $scope.partData.unitLengthBox = response.data;
            }, function(response) {
                services.showAlert('Falhou', 'Please try again');
            });
            Restangular.one('measurement/unit').get({magnitude: 'peso'}).then(function(response) {
                $scope.partData.unitWeightBox = response.data;
            }, function(response) {
                services.showAlert('Falhou', 'Please try again');
            });
            Restangular.one('measurement/unit').get({magnitude: 'unidade'}).then(function(response) {
                $scope.partData.unitQuantityBox = response.data;
            }, function(response) {
                services.showAlert('Falhou', 'Please try again');
            });

            $scope.loadPart = function() {
                $scope.loading = true;
                Restangular.one('manufacturing/bom', $scope.bomId).one('item', $scope.itemId).one('part', $scope.partId).get().then(function(response) {
                    $scope.loading = false;
                    var data = response.data;
                    $scope.partData.version = data.version;
                    $scope.partData.code = data.code;
                    $scope.partData.description = data.description;
                    $scope.partData.color = data.color;
                    $scope.partData.quantity = data.quantity.value;
                    $scope.partData.quantityType = data.quantity.unit.id;
                    $scope.partData.width = data.width.value;
                    $scope.partData.widthType = data.width.unit.id;
                    $scope.partData.height = data.height.value;
                    $scope.partData.heightType = data.height.unit.id;
                    $scope.partData.length = data.length.value;
                    $scope.partData.lengthType = data.length.unit.id;
                    $scope.partData.weight = data.weight.value;
                    $scope.partData.weightType = data.weight.unit.id;
                }, function(response) {
                    services.showAlert('Falhou', 'Please try again');
                });
            };
            $scope.loadPart();
            $scope.submitPartForm = function(isValid) {
                if (isValid) {
                    $scope.loading = true;
                    $scope.postData = {};
                    $scope.postData.id = $scope.partId;
                    $scope.postData.code = $scope.partData.code;
                    $scope.postData.description = $scope.partData.description;
                    $scope.postData.color = $scope.partData.color;

                    $scope.postData.quantity = {};
                    $scope.postData.quantity.value = parseFloat($scope.partData.quantity);
                    $scope.postData.quantity.unit = {};
                    $scope.postData.quantity.unit.id = $scope.partData.quantityType;

                    $scope.postData.width = {};
                    $scope.postData.width.value = parseFloat($scope.partData.width);
                    $scope.postData.width.unit = {};
                    $scope.postData.width.unit.id = $scope.partData.widthType;

                    $scope.postData.height = {};
                    $scope.postData.height.value = parseFloat($scope.partData.height);
                    $scope.postData.height.unit = {};
                    $scope.postData.height.unit.id = $scope.partData.heightType;

                    $scope.postData.length = {};
                    $scope.postData.length.value = parseFloat($scope.partData.length);
                    $scope.postData.length.unit = {};
                    $scope.postData.length.unit.id = $scope.partData.lengthType;

                    $scope.postData.weight = {};
                    $scope.postData.weight.value = parseFloat($scope.partData.weight);
                    $scope.postData.weight.unit = {};
                    $scope.postData.weight.unit.id = $scope.partData.weightType;

                    Restangular.one('manufacturing/bom', $scope.bomId).one('item', $scope.itemId).one('part', $scope.partId).get().then(function(response1) {
                        $scope.postData.version = response1.data.version;
                        Restangular.one('manufacturing/bom', $scope.bomId).one('item', $scope.itemId).one('part', $scope.partId).customPUT($scope.postData).then(function(response) {
                            $scope.loading = false;
                            $location.path('/bom/item/update/' + $scope.bomId + '/' + $scope.itemId);
                        }, function(response) {
                            $scope.loading = false;
                            services.showAlert('Falhou', 'Please try again');
                        });
                    }, function(response1) {
                        $scope.loading = false;
                        services.showAlert('Falhou', 'Please try again');
                    });
                }
            }

            $scope.removePart = function() {
                services.showConfirmBox('Confirmation', 'Are you sure to remove this Part?').then(function(res) {
                    if (res) {
                        $scope.loading = true;
                        Restangular.one('manufacturing/bom', $scope.bomId).one('item', $scope.itemId).one('part', $scope.partId).remove().then(function() {
                            $scope.loading = false;
                            services.showAlert('A Part - ' + $scope.partId + ' removed successfully.').then(function(res) {
                                if (res) {
                                    $location.path('bom/item/update/' + $scope.bomId + '/' + $scope.itemId);
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
                $location.path('bom/item/update/' + $scope.bomId + '/' + $scope.itemId);
            };

        });