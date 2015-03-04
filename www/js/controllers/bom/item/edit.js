altamiraAppControllers.controller('BomItemUpdateCtrl',
        function($scope, $http, $location, $routeParams, $route, $ionicPopup, Restangular, services) {
            $scope.bomId = $routeParams.bomId;
            $scope.itemId = $routeParams.itemId;

            $scope.loadItem = function() {
                $scope.loading = true;
                Restangular.one('manufacturing/bom', $routeParams.bomId).one('item', $routeParams.itemId).get().then(function(response) {
                    $scope.loading = false;
                    $scope.item = response.data;
                    /*$scope.itemData.version = data.version;
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
                    }*/
                }, function(response) {
                    services.showAlert('Falhou', 'Please try again');
                });
            };
            $scope.loadItem();
            $scope.submitUpdateItem = function(isValid) {
                if (isValid) {
                    $scope.loading = true;
                    Restangular.one('manufacturing/bom', $scope.bomId).one('item', $scope.itemId).customPUT($scope.item).then(function(response) {
                        $scope.loading = false;
                        $location.path('bom/edit/' + $scope.bomId);
                    }, function(response) {
                        $scope.loading = false;
                        services.showAlert('Falhou', 'Please try again');
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
                            services.showAlert('Falhou', 'Please try again');
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
                            services.showAlert('Falhou', 'Please try again');
                        });
                    }
                });
            };
            $scope.goBack = function() {
                $location.path('bom/edit/' + $scope.bomId);
            };

        });