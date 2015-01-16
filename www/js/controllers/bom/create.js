altamiraAppControllers.controller('BomCreateCtrl',
        function($scope, $http, $location, $route, $routeParams, $ionicPopup, $ionicLoading, $timeout, $state, Restangular, IntegrationRestangular, $ionicSideMenuDelegate, services, $window) {
            $scope.loading = false;
            $scope.bomData = {};
            $scope.submitBomForm = function(isValid) {
                if (isValid) {
                    $scope.loading = true;
                    $scope.postdata = {};
                    $scope.postdata.version = 0;
                    $scope.postdata.number = $scope.bomData.number;
                    $scope.postdata.customer = $scope.bomData.customer;
                    $scope.postdata.representative = $scope.bomData.representative;
                    $scope.postdata.finish = $scope.bomData.finish;
                    $scope.postdata.comment = $scope.bomData.observacao;
                    $scope.postdata.quotation = $scope.bomData.quotation;
                    $scope.postdata.project = $scope.bomData.project;
                    $scope.postdata.item = [];
                    $scope.postdata.created = moment($scope.bomData.created, 'DD-MM-YYYY').unix();
                    $scope.postdata.delivery = moment($scope.bomData.delivery, 'DD-MM-YYYY').unix();

                    Restangular.all('manufacturing/bom').post($scope.postdata).then(function(response) {
                        $scope.loading = false;
                        if (response.status == 201) {
                            services.showAlert('Success', 'com sucesso BOM criado!').then(function(res) {
                                $location.path('/bom/edit/'+response.data.id);
                            });
                        }
                    }, function(response1) {
                        $scope.loading = false;
                        services.showAlert('Falhou', 'Please try again');
                    });
                }
            };
            $scope.goBack = function() {
                $location.path('manufacturing/bom');
            };
        });