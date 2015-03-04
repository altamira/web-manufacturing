altamiraAppControllers.controller('BomItemCreateCtrl',
        function($scope, $http, $location, $routeParams, Restangular, services) {
            $scope.bomId = $routeParams.bomId;
            $scope.itemData = {};
            $scope.itemData.version = '';
            $scope.itemData.item = '';
            $scope.itemData.description = '';
            $scope.submitCreateItem = function(isValid) {
                if (isValid) {
                    $scope.loading = true;
                    $scope.postdata = {};
                    $scope.postdata.item = $scope.itemData.item;
                    $scope.postdata.description = $scope.itemData.description;
                    Restangular.one('manufacturing/bom', $scope.bomId).all('item').post($scope.postdata).then(function(res) {
                        $scope.loading = false;
                        if (res.status == 201) {
                            $location.path('/bom/item/update/' + $scope.bomId + '/' + res.data.id);
                        }
                    }, function() {
                        $scope.loading = false;
                        services.showAlert('Falhou', 'Tente Novamente UO Entre em Contato com o Suporte Técnico.');
                    });
                }
            };
            $scope.goBack = function() {
                $location.path('bom/edit/' + $scope.bomId);
            };

        });

altamiraAppControllers.controller('BomItemUpdateCtrl',
        function($scope, $http, $location, $routeParams, $route, $ionicPopup, Restangular, services) {
            $scope.bomId = $routeParams.bomId;
            $scope.itemId = $routeParams.itemId;
            $scope.itemData = {};
            $scope.itemData.version = '';
            $scope.itemData.item = '';
            $scope.itemData.description = '';
            $scope.loadItem = function() {
                $scope.loading = true;
                Restangular.one('manufacturing/bom', $scope.bomId).one('item', $scope.itemId).get().then(function(response) {
                    $scope.loading = false;
                    var data = response.data;
                    $scope.itemData.version = data.version;
                    $scope.itemData.item = data.item;
                    $scope.itemData.description = data.description;
                    $scope.itemData.components = [];
                    var counter = 0;
                    for (var i in data.component)
                    {
                        var temp = {};
                        temp.id = data.component[i].id;
                        temp.version = data.component[i].version;
                        temp.code = data.component[i].material.code;
                        temp.description = data.component[i].material.description;
                        temp.color = data.component[i].color;
                        temp.quantity = data.component[i].quantity;
                        temp.width = data.component[i].width;
                        temp.height = data.component[i].height;
                        temp.length = data.component[i].length;
                        temp.weight = data.component[i].weight;
                        if (counter % 2 == 0)
                        {
                            temp.class = '';
                        } else
                        {
                            temp.class = 'last';
                        }
                        $scope.itemData.components.push(temp);
                        counter++;
                    }
                }, function(response) {
                    services.showAlert('Falhou', 'Tente Novamente UO Entre em Contato com o Suporte Técnico.');
                });
            };
            $scope.loadItem();
            $scope.submitUpdateItem = function(isValid) {
                if (isValid) {
                    $scope.loading = true;
                    $scope.postdata = {};
                    $scope.postdata.id = $scope.itemId;
                    $scope.postdata.version = $scope.itemData.version;
                    $scope.postdata.item = $scope.itemData.item;
                    $scope.postdata.description = $scope.itemData.description;

                    Restangular.one('manufacturing/bom', $scope.bomId).one('item', $scope.itemId).get().then(function(response1) {
                        $scope.postdata.version = response1.data.version;
                        Restangular.one('manufacturing/bom', $scope.bomId).one('item', $scope.itemId).customPUT($scope.postdata).then(function(response) {
                            $scope.loading = false;
                            $location.path('bom/edit/' + $scope.bomId);
                        }, function(response) {
                            $scope.loading = false;
                            services.showAlert('Falhou', 'Tente Novamente UO Entre em Contato com o Suporte Técnico.');
                        });
                    }, function(response1) {
                        $scope.loading = false;
                        services.showAlert('Falhou', 'Tente Novamente UO Entre em Contato com o Suporte Técnico.');
                    });
                }

            };

            $scope.removeItem = function() {
                services.showConfirmBox('Confirmation', 'Are you sure to remove this Item?').then(function(res) {
                    if (res) {
                        $scope.loading = true;
                        Restangular.one('manufacturing/bom', $scope.bomId).one('item', $scope.itemId).remove().then(function() {
                            $scope.loading = false;
                            services.showAlert('An Item - ' + $scope.itemId + ' removed successfully.').then(function(res) {
                                if (res) {
                                    $location.path('bom/edit/' + $scope.bomId);
                                }
                            });
                        }, function() {
                            $scope.loading = false;
                            services.showAlert('Falhou', 'Tente Novamente UO Entre em Contato com o Suporte Técnico.');
                        });
                    }
                });
            };

            $scope.createPart = function() {
                $location.path('/bom/component/create/' + $scope.bomId + '/' + $scope.itemId);
            };

            $scope.updatePart = function(partId) {
                $location.path('bom/component/update/' + $scope.bomId + '/' + $scope.itemId + '/' + partId);
            };

            $scope.removePart = function(PartId) {
                services.showConfirmBox('Confirmation', 'Are you sure to remove this Part?').then(function(res) {
                    if (res) {
                        $scope.loading = true;
                        Restangular.one('manufacturing/bom', $scope.bomId).one('item', $scope.itemId).one('part', PartId).remove().then(function() {
                            $scope.loading = false;
                            services.showAlert('A Part - ' + PartId + ' removed successfully.').then(function(res) {
                                if (res) {
                                    $route.reload();
                                }
                            });
                        }, function() {
                            $scope.loading = false;
                            services.showAlert('Falhou', 'Tente Novamente UO Entre em Contato com o Suporte Técnico.');
                        });
                    }
                });
            };
            $scope.goBack = function() {
                $location.path('bom/edit/' + $scope.bomId);
            };

        });