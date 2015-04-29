altamiraAppControllers.controller('ManufacturingOperationEditCtrl',
        function($scope, $http, $location, $route, $routeParams, $ionicPopup, Restangular, services, CommonFun, $ionicModal) {
            $scope.operationId = $routeParams.operationId;
            $scope.operationData = {};
            $scope.operationData.name = '';
            $scope.operationData.description = '';
            $scope.loading = true;
            Restangular.one('manufacture/operation', $scope.operationId).get().then(function(response) {
                $scope.loading = false;
                var data = response.data;
                if (data != '')
                {
                    $scope.operationData.version = data.version;
                    $scope.operationData.name = data.name;
                    $scope.operationData.description = data.description;
                }
            }, function(response) {
                services.showAlert('Falhou', 'Tente novamente ou entre em contato com o suporte técnico.');
            });
            $scope.submitOperationForm = function(isValid) {
                if (isValid) {
                    $scope.loading = true;
                    $scope.postdata = {};
                    $scope.postdata.id = $scope.operationId;
                    $scope.postdata.name = $scope.operationData.name;
                    $scope.postdata.description = $scope.operationData.description;

                    Restangular.one('manufacture/operation', $scope.operationId).get().then(function(response1) {
                        $scope.postdata.version = response1.data.version;
                        Restangular.one('manufacture/operation', $scope.operationId).customPUT($scope.postdata).then(function(response) {
                            $scope.loading = false;
                            $location.path('/manufacture/operation');
                        }, function(response) {
                            $scope.loading = false;
                            services.showAlert('Falhou', 'Tente novamente ou entre em contato com o suporte técnico.');
                        });
                    }, function(response1) {
                        $scope.loading = false;
                        services.showAlert('Falhou', 'Tente novamente ou entre em contato com o suporte técnico.');
                    });
                }
            };

            $scope.removeOperation = function() {
                services.showConfirmBox('Confirmation', 'Confirma a exclusão desta Lista de Operation ?').then(function(res) {
                    if (res) {
                        $scope.loading = true;
                        Restangular.one('manufacture/operation', $scope.operationId).remove().then(function() {
                            $scope.loading = false;
                            services.showAlert(' A Lista de Operation - ' + $scope.operationId + ' foi excluida.').then(function(res) {
                                if (res) {
                                    $location.path('/manufacture/operation');
                                }
                            });
                        }, function() {
                            $scope.loading = false;
                            services.showAlert('Falhou', 'Tente novamente ou entre em contato com o suporte técnico.');
                        });
                    }
                });
            };
            
            $scope.goBack = function() {
                $location.path('manufacture/operation');
            };
        });