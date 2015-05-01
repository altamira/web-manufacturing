altamiraAppControllers.controller('ManufactureExecutionListCtrl',
        function($scope, $location, $route, Restangular, services, $ionicModal, CommonFun, $ionicSideMenuDelegate, $routeParams) {

            if ($routeParams.token != null && $routeParams.token != '' && $routeParams.token != undefined && localStorage.getItem('token') == '' && localStorage.getItem('token') == null)
            {
                localStorage.setItem('token', $routeParams.token);
                $window.location.reload();
            }
            $scope.operationType = localStorage.getItem('operationDesc');
            $scope.resetPackingList = function() {
                $scope.startPage = 0;
                $scope.maxRecord = 10;
                $scope.packingData = '';
                $scope.packingDataArray = [];
                $scope.nextButton = true;
            };
            $scope.searchText = localStorage.getItem('searchPackingList');
            $scope.tempSearch = '';
            $scope.isDataSearch = '';
            $scope.resetPackingList();
            $scope.loadPackingList = function() {
                $scope.loading = true;
                Restangular.one('manufacture/execution').get({search: localStorage.getItem('searchPackingList'), start: $scope.startPage, max: $scope.maxRecord}).then(function(response) {
                    if (response.data == '') {
                        $scope.loading = false;
                        if ((parseInt($scope.startPage) != 0))
                        {
                            $scope.nextButton = false;
                            $scope.startPage = (parseInt($scope.startPage) - 1);
                            $scope.loadPackingList();
                        } else
                        {
                            $scope.pageStack = [];
                            services.showAlert('Aviso', 'Lista de Romaneios de entrega esta vazia.').then(function(res) {
                            });
                        }
                    } else
                    {
                        if ($scope.packingData.length <= 0 && $scope.isDataSearch == '')
                        {
                            $scope.packingData = response.data;
                            $scope.packingDataArray = response.data;
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
                                    $scope.packingDataArray.push(value);
                                });
                                $scope.pagePackingListes();
                            }
                        }
                        $scope.loading = false;
                        $scope.range();
                    }
                }, function(response) {
                    services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
                });
            };
            $scope.loadPackingList();
            $scope.pagePackingListes = function() {
                $scope.packingData = [];
                $scope.start = $scope.startPage * $scope.maxRecord;
                $scope.end = ($scope.startPage * $scope.maxRecord) + $scope.maxRecord;
                for (var i = $scope.start; i < $scope.end; i++)
                {
                    if ($scope.packingDataArray[i])
                    {
                        $scope.packingData.push($scope.packingDataArray[i]);
                    }
                }
                if ($scope.packingData.length != $scope.maxRecord)
                {
                    $scope.nextButton = false;
                }
            };

            $scope.searchPackingList = function(text) {
                if (text != '')
                {
                    $scope.resetPackingList();
                    localStorage.setItem('searchPackingList', text);
                } else
                {
                    localStorage.setItem('searchPackingList', '');
                    $scope.resetPackingList();
                }
                $scope.loadPackingList();
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
                $scope.loadPackingList();

            }
            $scope.prevPage = function(nextPage) {
                $scope.startPage = nextPage;
                $scope.loadPackingList();
            }
            $scope.goPage = function(pageNumber) {
                var nextPage = parseInt(pageNumber) - 1;
                $scope.startPage = nextPage;
                if ($scope.packingDataArray.length > 0)
                {
                    if ($scope.searchText == '' || ($scope.searchText != '' && $scope.isDataSearch != ''))
                    {
                        $scope.pagePackingListes();
                    }
                }
                else
                {
                    $scope.loadPackingList();
                }
            }
            $scope.newPackingList = function(executionId) {
                $location.path('/manufacture/execution/' + executionId);
            }
            $scope.toggleLeft = function() {
                $ionicSideMenuDelegate.toggleLeft();
            };
            $scope.createPackingListPage = function() {
                $location.path('/shipping/execution/packinglist/create');
            }
            $scope.goBack = function() {
                $location.path('/manufacture/execution');
            }
        });