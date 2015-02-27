altamiraAppControllers.controller('BomListCtrl',
        function($scope, $http, $location, $route, $routeParams, $ionicPopup, $ionicLoading, $timeout, $state, Restangular, IntegrationRestangular, $ionicSideMenuDelegate, services, $window) {
            if ($routeParams.token != null && $routeParams.token != '' && $routeParams.token != undefined && sessionStorage.getItem('token') == '')
            {
                sessionStorage.setItem('token', $routeParams.token);
                $window.location.reload();
            }
            $scope.checked = {
                items: []
            };
            $scope.makeChecked = function(itemId, itemNumber) {
                services.showConfirmBox('Confirmation', 'A Lista de Material foi conferida ?').then(function(res) {
                    if (res) {
                        $scope.loading = true;
                        Restangular.one('manufacturing/bom', itemId).all('checked').customPUT().then(function(response) {
                            $scope.loading = false;
                            services.showAlert('Success', 'A Lista de Material do Pedido ' + itemNumber + ' foi marcada como conferida.').then(function(res) {
                            });
                        }, function(response) {
                            $scope.loading = false;
                            services.showAlert('Falhou', 'Please try again');
                        });
                    }
                    else
                    {
                        $('.' + itemId).toggleClass('fa-check-square-o');
                    }
                });
            };
            $scope.makeUnchecked = function(itemId, itemNumber) {
                services.showConfirmBox('Confirmation', 'A Lista de Material foi conferida ?').then(function(res) {
                    if (res) {
                        $scope.loading = true;
                        Restangular.one('manufacturing/bom', itemId).all('unchecked').customPUT().then(function(response) {
                            $scope.loading = false;
                            services.showAlert('Success', 'A Lista de Material do Pedido ' + itemNumber + ' foi marcada como conferida.').then(function(res) {
                            });
                        }, function(response) {
                            $scope.loading = false;
                            services.showAlert('Falhou', 'Please try again');
                        });
                    } else
                    {
                        $('.' + itemId).toggleClass('fa-check-square-o');
                    }
                });
            };
            $scope.toggleLeft = function() {
                $ionicSideMenuDelegate.toggleLeft();
            };

            $scope.resetBOM = function() {
                $scope.startPage = 0;
                $scope.maxRecord = 10;
                $scope.bom = '';
                $scope.bomArray = [];
                $scope.nextButton = true;
            };
            $scope.searchText = sessionStorage.getItem('searchBOM');
            $scope.isDataSearch = '';
            $scope.resetBOM();
            $scope.loadBOM = function() {
                $scope.loading = true;
                if (sessionStorage.getItem('searchBOM') == null || sessionStorage.getItem('searchBOM') == "")
                {
                    var request = Restangular.one('manufacturing').one('bom').get({checked: 'false', start: $scope.startPage, max: $scope.maxRecord});
                } else
                {
                    var request = Restangular.one('manufacturing').one('bom').get({search: sessionStorage.getItem('searchBOM'), start: $scope.startPage, max: $scope.maxRecord});
                }
                request.then(function(response) {
                    if (response.data == '') {
                        $scope.loading = false;
                        if ((parseInt($scope.startPage) != 0))
                        {
                            $scope.nextButton = false;
                            $scope.startPage = (parseInt($scope.startPage) - 1);
                            $scope.loadBOM();
                        } else
                        {
                            $scope.pageStack = [];
                            services.showAlert('Notice', 'BOM list is empty').then(function(res) {
                            });
                        }
                    } else
                    {
                        if ($scope.bom.length <= 0 && $scope.isDataSearch == '')
                        {
                            $scope.bom = response.data;
                            $scope.bomArray = response.data;
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
                                    $scope.bomArray.push(value);
                                });
                                $scope.pageBOM();
                            }
                        }
                        $scope.loading = false;
                        $scope.range();
                    }
                }, function(response) {
                    $scope.loading = false;
                    services.showAlert('Falhou', 'Please try again');
                });
            };
            $scope.loadBOM();
            $scope.pageBOM = function() {
                $scope.bom = [];
                $scope.start = $scope.startPage * $scope.maxRecord;
                $scope.end = ($scope.startPage * $scope.maxRecord) + $scope.maxRecord;
                for (var i = $scope.start; i < $scope.end; i++)
                {
                    if ($scope.bomArray[i])
                    {
                        $scope.bom.push($scope.bomArray[i]);
                    }
                }
                if ($scope.bom.length != $scope.maxRecord)
                {
                    $scope.nextButton = false;
                }
            };

            $scope.searchBOM = function(text) {
                if (text != '')
                {
                    $scope.resetBOM();
                    sessionStorage.setItem('searchBOM', text);
                } else
                {
                    sessionStorage.setItem('searchBOM', '');
                    $scope.resetBOM();
                }
                $scope.loadBOM();
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
                $scope.loadBOM();

            }
            $scope.prevPage = function(nextPage) {
                $scope.startPage = nextPage;
                $scope.loadBOM();
            }
            $scope.goPage = function(pageNumber) {
                var nextPage = parseInt(pageNumber) - 1;
                $scope.startPage = nextPage;
                if ($scope.bomArray.length > 0)
                {
                    if ($scope.searchText == '' || ($scope.searchText != '' && $scope.isDataSearch != ''))
                    {
                        $scope.pageBOM();
                    }
                }
                else
                {
                    $scope.loadBOM();
                }
            }

            $scope.importOrder = function() {
                $scope.orderData = {};
                // An elaborate, custom popup
                var importPopup = $ionicPopup.show({
                    templateUrl: 'templates/bom/import-order.html',
                    title: 'Numero do Pedido',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar',
                            onTap: function(res) {
                                importPopup.close();
                            }
                        },
                        {text: '<b>Importar</b>',
                            type: 'button-positive',
                            onTap: function(res) {
                                $scope.loading = true;
                                //get data from api
                                IntegrationRestangular.one('manufacturing/bom?' + $scope.orderData.ordernumber).get().then(function(response) {
                                    Restangular.all('manufacturing/bom').post(response.data).then(function(res) {
                                        $scope.loading = false;
                                        if (res.status == 201) {
                                            services.showAlert('Pedido ' + $scope.orderData.ordernumber, 'Pedido ' + $scope.orderData.ordernumber + ' foi importado com sucesso !').then(function(res) {
                                                $route.reload();
                                            });
                                        }
                                    }, function() {
                                        $scope.loading = false;
                                        services.showAlert('Falhou', 'Please try again');
                                    });
                                }, function(response) {
                                    $scope.loading = false;
                                    services.showAlert('Falhou', 'Please try again');
                                });
                                $scope.hideLoading();
                            }
                        },
                    ]
                });
                importPopup.then(function(res) {

                });
                $timeout(function() {
                    importPopup.close();
                }, 30000);
            };
            $scope.showLoading = function() {
                $ionicLoading.show({
                    template: 'Enviando, aguarde...'
                });
            };

            $scope.hideLoading = function() {
                $ionicLoading.hide();
            };
            $scope.view = function(bomId) {
                $location.path('/bom/view/' + bomId);
            };
            $scope.newBOM = function() {
                $location.path('/bom/create');
            };
            // first load
//            $scope.search.run();
            $scope.checkBtn = 0;
            // add page to the cache
//            $scope.$watch('search.last',
//                    function() {
//                        if ($scope.search.last != undefined) {
//                            if ($scope.search.last.length === 0) {
//                                alert('Nenhum registro encontrado');
//                                $scope.search.forward = false;
//                            } else {
//                                $scope.search.pages.push($scope.search.last);
//                                $scope.search.page = $scope.search.pages.length - 1;
//                            }
//                        }
//                    }
//            );

        });