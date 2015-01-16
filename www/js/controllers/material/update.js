altamiraAppControllers.controller('MaterialUpdateCtrl',
        function($scope, $http, $location, $ionicPopup, $routeParams, Restangular, services) {
            $scope.materialId = $routeParams.materialId;
            $scope.material = {};
            $scope.loading = true;
            $scope.materialTypeText = '';
            Restangular.all('common').one('material', $scope.materialId).get().then(function(response) {
                $scope.loading = false;
                $scope.materialTypeText = response.data.type.substring(response.data.type.lastIndexOf('.') + 1, response.data.type.length);
                console.log(JSON.stringify(response.data));
                Restangular.one('measurement/unit').get({magnitude: 'dimencional'}).then(function(response) {
                    $scope.unitLengthBox = response.data;
                }, function(response) {
                    services.showAlert('Falhou', 'Please try again');
                });
                Restangular.one('measurement/unit').get({magnitude: 'peso'}).then(function(response) {
                    $scope.unitWeightBox = response.data;
                }, function(response) {
                    services.showAlert('Falhou', 'Please try again');
                });

                $scope.materialBaseUrl = '';
                $scope.material.version = response.data.version;
                $scope.material.code = response.data.code;
                $scope.material.description = response.data.description;
                switch ($scope.materialTypeText) {
                    case 'Product':
                        $scope.materialBaseUrl = Restangular.all('sales').one('product', $scope.materialId);
                        $scope.material.width = response.data.width.value;
                        $scope.material.widthType = response.data.width.unit.id;
                        $scope.material.height = response.data.height.value;
                        $scope.material.heightType = response.data.height.unit.id;
                        $scope.material.length = response.data.length.value;
                        $scope.material.lengthType = response.data.length.unit.id;
                        $scope.material.weight = response.data.weight.value;
                        $scope.material.weightType = response.data.weight.unit.id;
                        $scope.material.depth = response.data.depth.value;
                        $scope.material.depthType = response.data.depth.unit.id;
                        break;
                    case 'Component':
                        $scope.materialBaseUrl = Restangular.all('sales').one('component', $scope.materialId);
                        $scope.material.width = response.data.width.value;
                        $scope.material.widthType = response.data.width.unit.id;
                        $scope.material.height = response.data.height.value;
                        $scope.material.heightType = response.data.height.unit.id;
                        $scope.material.length = response.data.length.value;
                        $scope.material.lengthType = response.data.length.unit.id;
                        $scope.material.weight = response.data.weight.value;
                        $scope.material.weightType = response.data.weight.unit.id;
                        $scope.material.depth = response.data.depth.value;
                        $scope.material.depthType = response.data.depth.unit.id;
                        break;
                    case 'Material':
                        $scope.materialBaseUrl = Restangular.all('purchase').one('material', $scope.materialId);
                        $scope.material.lamination = response.data.lamination;
                        $scope.material.treatment = response.data.treatment;
                        $scope.material.thickness = response.data.thickness.value;
                        $scope.material.thicknessType = response.data.thickness.unit.id;
                        $scope.material.width = response.data.width.value;
                        $scope.material.widthType = response.data.width.unit.id;
                        $scope.material.length = response.data.length.value;
                        $scope.material.lengthType = response.data.length.unit.id;
                        break;
                    case 'Inputs':
                        $scope.materialBaseUrl = Restangular.all('purchase').one('inputs', $scope.materialId);
                        break;
                    case 'Ink':
                        $scope.materialBaseUrl = Restangular.all('purchase').one('ink', $scope.materialId);
                        break;
                    case 'Machine':
                        $scope.materialBaseUrl = Restangular.all('manufacture').one('machine', $scope.materialId);
                        break;
                    case 'Tooling':
                        $scope.materialBaseUrl = Restangular.all('manufacture').one('tooling', $scope.materialId);
                        break;
                }
            }, function(response) {
                $scope.loading = false;
                services.showAlert('Falhou', 'Please try again');
            });
            $scope.submitUpdateMaterial = function(isValid) {
                if (isValid) {
                    $scope.loading = true;

                    $scope.postData = {};
                    $scope.postData.id = parseInt($scope.materialId);
                    $scope.postData.version = $scope.material.version;
                    $scope.postData.code = $scope.material.code;
                    $scope.postData.description = $scope.material.description;
                    $scope.postData.component = [];
                    switch ($scope.materialTypeText) {
                        case 'Product':
                            console.log(JSON.stringify($scope.material));
                            $scope.postData.type = "br.com.altamira.data.model.sales.Product";
                            $scope.postData.width = {};
                            $scope.postData.width.value = $scope.material.width;
                            $scope.postData.width.unit = {};
                            $scope.postData.width.unit.id = $scope.material.widthType;

                            $scope.postData.height = {};
                            $scope.postData.height.value = $scope.material.height;
                            $scope.postData.height.unit = {};
                            $scope.postData.height.unit.id = $scope.material.heightType;

                            $scope.postData.length = {};
                            $scope.postData.length.value = $scope.material.length;
                            $scope.postData.length.unit = {};
                            $scope.postData.length.unit.id = $scope.material.lengthType;

                            $scope.postData.weight = {};
                            $scope.postData.weight.value = $scope.material.weight;
                            $scope.postData.weight.unit = {};
                            $scope.postData.weight.unit.id = $scope.material.weightType;

                            $scope.postData.depth = {};
                            $scope.postData.depth.value = $scope.material.depth;
                            $scope.postData.depth.unit = {};
                            $scope.postData.depth.unit.id = $scope.material.depthType;
                            break;
                        case 'Component':
                            $scope.postData.type = "br.com.altamira.data.model.sales.Component";
                            $scope.postData.width = {};
                            $scope.postData.width.value = $scope.material.width;
                            $scope.postData.width.unit = {};
                            $scope.postData.width.unit.id = $scope.material.widthType;

                            $scope.postData.height = {};
                            $scope.postData.height.value = $scope.material.height;
                            $scope.postData.height.unit = {};
                            $scope.postData.height.unit.id = $scope.material.heightType;

                            $scope.postData.length = {};
                            $scope.postData.length.value = $scope.material.length;
                            $scope.postData.length.unit = {};
                            $scope.postData.length.unit.id = $scope.material.lengthType;

                            $scope.postData.weight = {};
                            $scope.postData.weight.value = $scope.material.weight;
                            $scope.postData.weight.unit = {};
                            $scope.postData.weight.unit.id = $scope.material.weightType;

                            $scope.postData.depth = {};
                            $scope.postData.depth.value = $scope.material.depth;
                            $scope.postData.depth.unit = {};
                            $scope.postData.depth.unit.id = $scope.material.depthType;
                            break;
                        case 'Material':
                            $scope.postData.type = "br.com.altamira.data.model.sales.Material";
                            $scope.postData.lamination = $scope.material.lamination;
                            $scope.postData.treatment = $scope.material.treatment;

                            $scope.postData.thickness = {};
                            $scope.postData.thickness.value = $scope.material.thickness;
                            $scope.postData.thickness.unit = {};
                            $scope.postData.thickness.unit.id = $scope.material.widthType;

                            $scope.postData.width = {};
                            $scope.postData.width.value = $scope.material.width;
                            $scope.postData.width.unit = {};
                            $scope.postData.width.unit.id = $scope.material.widthType;

                            $scope.postData.length = {};
                            $scope.postData.length.value = $scope.material.length;
                            $scope.postData.length.unit = {};
                            $scope.postData.length.unit.id = $scope.material.lengthType;
                            break;
                        case 'Inputs':

                            break;
                        case 'Ink':

                            break;
                        case 'Machine':

                            break;
                        case 'Tooling':

                            break;
                    }
                    console.log(JSON.stringify($scope.postData));
//                    Restangular.all('common').all('material').customPUT($scope.postData).then(function(response) {
                    $scope.materialBaseUrl.customPUT($scope.postData).then(function(response) {
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