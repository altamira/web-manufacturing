altamiraAppControllers.controller('MaterialUpdateCtrl',
        function($scope, $http, $location, $ionicPopup, $routeParams, Restangular, services) {
            $scope.materialId = $routeParams.materialId;
            $scope.material = {};
            $scope.loading = true;
            Restangular.all('common').one('material', $scope.materialId).get().then(function(response) {
                $scope.loading = false;
                $scope.materialBaseUrl = '';
                if (response.data.weight)
                {
                    $scope.materialTypeText = 'product';
                }
                else if (response.data.lamination)
                {
                    $scope.materialTypeText = 'material';
                }
                else
                {
                    $scope.materialTypeText = 'inputs';
                }
                console.log(JSON.stringify($scope.materialTypeText));
                $scope.material.code = response.data.code;
                $scope.material.description = response.data.description;
                switch ($scope.materialTypeText) {
                    case 'product':
                        $scope.materialBaseUrl = Restangular.all('sales').all('product');
                        $scope.material.width = response.data.width;
                        $scope.material.height = response.data.height;
                        $scope.material.length = response.data.length;
                        $scope.material.weight = response.data.weight;
                        break;
                    case 'material':
                        $scope.materialBaseUrl = Restangular.all('purchase').all('material');
                        $scope.material.lamination = response.data.lamination;
                        $scope.material.treatment = response.data.treatment;
                        $scope.material.thickness = response.data.thickness;
                        $scope.material.width = response.data.width;
                        $scope.material.length = response.data.length;
                        $scope.material.tax = response.data.tax;
                        break;
                    case 'inputs':
                        $scope.materialBaseUrl = Restangular.all('purchase').all('inputs');
                        break;
                    case 'ink':
                        $scope.materialBaseUrl = Restangular.all('purchase').all('ink');
                        break;
                    case 'machine':
                        $scope.materialBaseUrl = Restangular.all('manufacture').all('machine');
                        break;
                    case 'tooling':
                        $scope.materialBaseUrl = Restangular.all('manufacture').all('tooling');
                        break;
                }

                console.log(JSON.stringify(response));
            }, function(response) {
                $scope.loading = false;
                services.showAlert('Falhou', 'Please try again');
            });
            $scope.submitUpdateMaterial = function(isValid) {
                if (isValid) {
                    $scope.loading = true;
                    console.log(JSON.stringify($scope.material));
                    Restangular.all('common').one('material', $scope.materialId).customPUT($scope.material).then(function(response) {
                        $scope.loading = false;
                        services.showAlert('Success', 'Processo foi gravado com sucesso !').then(function(res) {
                            $location.path('/material/list');
                        });
                    }, function() {
                        $scope.loading = false;
                        services.showAlert('Falhou', 'Please try again');
                    });
                }
            };
            $scope.goBack = function() {
                $location.path('/material/list');
            };
        });