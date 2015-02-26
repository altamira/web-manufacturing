altamiraAppControllers.controller('BomItemCreateCtrl',
        function($scope, $http, $location, $route, Restangular, services, item) {
            Restangular.setFullResponse(true);
            item.get(0).then(function(response) {
                $scope.item = response.data;
            })
            $scope.save = function(isValid) {
                if (isValid) {
                    $scope.loading = true;
                    item.post($scope.item).then(function(response) {
                        $scope.loading = false;
                        if (response.status == 201) {
                            var location = response.headers('location');
                            console.log(response.data.headers);
                            $location.path(response.headers('location'));
                        }
                    }, function() {
                        $scope.loading = false;
                        services.showAlert('Falhou', 'Please try again');
                    });
                }
            };
            $scope.goBack = function() {
                $location.path('bom/edit/' + $scope.bomId);
            };

        });