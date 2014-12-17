altamiraAppControllers.controller('MaterialUpdateCtrl',
        function($scope, $http, $location, $ionicPopup, $routeParams, Restangular, services) {
            $scope.materialId = $routeParams.materialId;
            $scope.material = {};
            $scope.loading = true;
            $scope.materialTypeText = sessionStorage.getItem('materialType');
            Restangular.all('common').one('material', $scope.materialId).get().then(function(response) {
                $scope.loading = false;
                $scope.materialBaseUrl = '';
                console.log(JSON.stringify($scope.materialTypeText));
                console.log(JSON.stringify(response.data));
                $scope.material.version = 0;
                $scope.material.code = response.data.code;
                $scope.material.description = response.data.description;
                switch ($scope.materialTypeText) {
                    case 'Product':
                        $scope.materialBaseUrl = Restangular.all('sales').one('Product', $scope.materialId);
                        $scope.material.width = response.data.width;
                        $scope.material.height = response.data.height;
                        $scope.material.length = response.data.length;
                        $scope.material.weight = response.data.weight;
                        break;
                    case 'Material':
                        $scope.materialBaseUrl = Restangular.all('purchase').one('Material', $scope.materialId);
                        $scope.material.lamination = response.data.lamination;
                        $scope.material.treatment = response.data.treatment;
                        $scope.material.thickness = response.data.thickness;
                        $scope.material.width = response.data.width;
                        $scope.material.length = response.data.length;
                        $scope.material.tax = response.data.tax;
                        break;
                    case 'Inputs':
                        $scope.materialBaseUrl = Restangular.all('purchase').one('Inputs', $scope.materialId);
                        break;
                    case 'Ink':
                        $scope.materialBaseUrl = Restangular.all('purchase').one('Ink', $scope.materialId);
                        break;
                    case 'Machine':
                        $scope.materialBaseUrl = Restangular.all('manufacture').one('Machine', $scope.materialId);
                        break;
                    case 'Tooling':
                        $scope.materialBaseUrl = Restangular.all('manufacture').one('Tooling', $scope.materialId);
                        break;
                }
            }, function(response) {
                $scope.loading = false;
                services.showAlert('Falhou', 'Please try again');
            });
            $scope.submitUpdateMaterial = function(isValid) {
                if (isValid) {
                    $scope.loading = true;
                    console.log(JSON.stringify($scope.material));
                    $scope.materialBaseUrl.customPUT($scope.material).then(function(response) {
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