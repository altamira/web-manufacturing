altamiraAppControllers.controller('ManufacturingOperationCtrl',
        function($scope, $http, $location, $route, $routeParams, $ionicPopup, $ionicLoading, $timeout, $state, Restangular, IntegrationRestangular, $ionicSideMenuDelegate, services, $window) {
            $scope.toggleLeft = function() {
                $ionicSideMenuDelegate.toggleLeft();
            };

            $scope.resetOperation = function() {
                $scope.startPage = 0;
                $scope.maxRecord = 10;
                $scope.operation = '';
                $scope.operationArray = [];
                $scope.nextButton = true;
            };
            $scope.searchText = localStorage.getItem('searchOperation');
            $scope.isDataSearch = '';
            $scope.resetOperation();
            $scope.loadOperation = function() {
                $scope.loading = true;
                if (localStorage.getItem('searchOperation') == null || localStorage.getItem('searchOperation') == "")
                {
                    var request = Restangular.one('manufacture').one('operation').get({start: $scope.startPage, max: $scope.maxRecord});
                } else
                {
                    var request = Restangular.one('manufacture').one('operation').get({search: localStorage.getItem('searchOperation'), start: $scope.startPage, max: $scope.maxRecord});
                }
                request.then(function(response) {
                    if (response.data == '') {
                        $scope.loading = false;
                        if ((parseInt($scope.startPage) != 0))
                        {
                            $scope.nextButton = false;
                            $scope.startPage = (parseInt($scope.startPage) - 1);
                            $scope.loadOperation();
                        } else
                        {
                            $scope.pageStack = [];
                            services.showAlert('Notice', 'Não ha nenhum Pedido de Venda aguardando a conferência da Lista de Material.').then(function(res) {
                            });
                        }
                    } else
                    {
                        if ($scope.operation.length <= 0 && $scope.isDataSearch == '')
                        {
                            $scope.operation = response.data;
                            $scope.operationArray = response.data;
                            if ($scope.searchText != '')
                            {
                                $scope.isDataSearch = 'yes';
                            }
                            else
                            {
                                $scope.isDataSearch = '';
                            }
                        }
                        else
                        {
                            if ($scope.nextButton != false)
                            {
                                $scope.temp = response.data;
                                angular.forEach($scope.temp, function(value, key) {
                                    $scope.operationArray.push(value);
                                });
                                $scope.pageOperation();
                            }
                        }
                        $scope.loading = false;
                        $scope.range();
                    }
                }, function(response) {
                    $scope.loading = false;
                    services.showAlert('Falhou', 'Tente novamente ou entre em contato com o suporte técnico.');
                });
            };
            $scope.loadOperation();
            $scope.pageOperation = function() {
                $scope.operation = [];
                $scope.start = $scope.startPage * $scope.maxRecord;
                $scope.end = ($scope.startPage * $scope.maxRecord) + $scope.maxRecord;
                for (var i = $scope.start; i < $scope.end; i++)
                {
                    if ($scope.operationArray[i])
                    {
                        $scope.operation.push($scope.operationArray[i]);
                    }
                }
                if ($scope.operation.length != $scope.maxRecord)
                {
                    $scope.nextButton = false;
                }
            };

            $scope.searchOperation = function(text) {
                if (text != '')
                {
                    $scope.resetOperation();
                    localStorage.setItem('searchOperation', text);
                } else
                {
                    localStorage.setItem('searchOperation', '');
                    $scope.resetOperation();
                }
                $scope.loadOperation();
            };
            $scope.range = function() {
                $scope.pageStack = [];
                var start = parseInt($scope.startPage) + 1;
                for (var i = 1; i <= start; i++) {
                    $scope.pageStack.push(i);
                }
            };
            $scope.nextPage = function(len) {
                var nextPage = parseInt(len);
                $scope.startPage = nextPage;
                $scope.loadOperation();

            }
            $scope.prevPage = function(nextPage) {
                $scope.startPage = nextPage;
                $scope.loadOperation();
            }
            $scope.goPage = function(pageNumber) {
                var nextPage = parseInt(pageNumber) - 1;
                $scope.startPage = nextPage;
                if ($scope.operationArray.length > 0)
                {
                    if ($scope.searchText == '' || ($scope.searchText != '' && $scope.isDataSearch != ''))
                    {
                        $scope.pageOperation();
                    }
                }
                else
                {
                    $scope.loadOperation();
                }
            }

            $scope.newOperation = function() {
                $location.path('/manufacture/operation/create');
            };

            $scope.goUpdate = function(operationId) {
                $location.path('/manufacture/operation/edit/' + operationId);
            };
            $scope.checkBtn = 0;
        });