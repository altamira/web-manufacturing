altamiraAppControllers.controller('ManufacturingOperationCreateCtrl',
        function($scope, $location, Restangular, services, CommonFun) {
            $scope.loading = false;
            $scope.operationData = {};
            $scope.submitOperationForm = function(isValid) {
                if (isValid) {
                    $scope.loading = true;
                    $scope.postdata = {};
                    $scope.postdata.version = 0;
                    $scope.postdata.type = "br.com.altamira.data.model.manufacture.Operation";
                    $scope.postdata.name = $scope.operationData.name;
                    $scope.postdata.description = $scope.operationData.description;

                    Restangular.all('manufacture/operation').post($scope.postdata).then(function(response) {
                        $scope.loading = false;
                        if (response.status == 201) {
                            services.showAlert('Successo', 'Lista de Operation criada com sucesso !').then(function(res) {
                                $location.path('manufacture/operation/edit/'+response.data.id);
                            });
                        }
                    }, function(response) {
                        $scope.loading = false;
                        services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
                    });
                }
                else
                {
                    services.showAlert('Falhou', 'Você perdeu alguma coisa. Por favor, verifique as mensagens de erro.');
                }
            };
            $scope.goBack = function() {
                $location.path('manufacture/operation');
            };
        });