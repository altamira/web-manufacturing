altamiraAppControllers.controller('BomCreateCtrl',
        function($scope, $location, Restangular, services, CommonFun) {
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
                    $scope.postdata.created = CommonFun.getFullTimestamp($scope.bomData.created);
                    $scope.postdata.delivery = CommonFun.getFullTimestamp($scope.bomData.delivery);

                    Restangular.all('manufacture/bom').post($scope.postdata).then(function(response) {
                        $scope.loading = false;
                        if (response.status == 201) {
                            services.showAlert('Successo', 'Lista de Material criada com sucesso !').then(function(res) {
                                $location.path('/bom/edit/'+response.data.id);
                            });
                        }
                    }, function(response1) {
                        $scope.loading = false;
                        services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
                    });
                }
            };
            $scope.goBack = function() {
                $location.path('manufacture/bom');
            };
        });