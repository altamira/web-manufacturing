altamiraAppControllers.controller('MaterialCreateCtrl',
        function($scope, $http, $location, $ionicPopup, $routeParams, Restangular, services) {
            $scope.materialData = {};
            $scope.postdata = {};
            $scope.materialData.code = '';
            $scope.materialData.description = '';
            $scope.submitCreateMaterial = function(isValid) {
                if (isValid) {
                    $scope.loading = true;
                    $scope.postdata.code = $scope.materialData.code;
                    $scope.postdata.description = $scope.materialData.description;
                    console.log(JSON.stringify($scope.postdata));
                    Restangular.one('common/material').post($scope.postdata).then(function(response) {
                        $scope.loading = false;
                        if (response.status == 201) {
                            $location.path('/material/update/' + response.data.id);
                        }
                    }, function() {
                        $scope.loading = false;
                        services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
                    });
                }
            };
            $scope.goBack = function() {
                $location.url('/common/material/' + 0);
            };
        });