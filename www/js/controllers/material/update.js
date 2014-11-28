altamiraAppControllers.controller('MaterialUpdateCtrl',
        function($scope, $http, $location, $ionicPopup, $routeParams, Restangular, services) {
            $scope.materialId = $routeParams.materialId;
            $scope.materialData = {};
            $scope.postdata = {};
            $scope.loadProcess = function() {
                $scope.loading = true;
                Restangular.one('common/material', $scope.materialId).get().then(function(response) {
                    $scope.loading = false;
                    var data = response.data;
                    $scope.materialData.id = data.id;
                    $scope.materialData.version = data.version;
                    $scope.materialData.code = data.code;
                    $scope.materialData.description = data.description;
                }, function(response) {
                    services.showAlert('Falhou', 'Please try again');
                });
            };
            $scope.loadProcess();
            $scope.submitUpdateMaterial = function(isValid) {
                if (isValid) {
                    $scope.loading = true;
                    $scope.postdata.id = $scope.materialId;
                    $scope.postdata.version = $scope.materialData.version;
                    $scope.postdata.code = $scope.materialData.code;
                    $scope.postdata.description = $scope.materialData.description;
                    console.log(JSON.stringify($scope.postdata));
                    Restangular.one('common/material', $scope.materialId).customPUT($scope.postdata).then(function(response) {
                        $scope.loading = false;
                        $location.path('/manufacturing/update/process/' + response.data.id);
                    }, function(response) {
                        services.showAlert('Falhou', 'Please try again');
                    });
                }
            };
            $scope.goBack = function() {
                $location.url('/common/material/' + 0);
            };
        });