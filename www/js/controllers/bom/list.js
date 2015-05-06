altamiraAppControllers.controller('BomListCtrl',
        function($scope, $http, $location, $route, $routeParams, $ionicPopup, $ionicLoading, $timeout, $state, Restangular, IntegrationRestangular, $ionicSideMenuDelegate, services, $window) {
            console.log(JSON.stringify("Start=>"+localStorage.getItem('token')));
            if ($routeParams.token != null && $routeParams.token != '' && $routeParams.token != undefined && localStorage.getItem('token') == '' && localStorage.getItem('token') == null)
            {
                localStorage.setItem('token', $routeParams.token);
                $window.location.reload();
            }
            console.log(JSON.stringify("after=>"+localStorage.getItem('token')));
            $scope.checked = {
                items: []
            };
            $scope.makeChecked = function(itemId, itemNumber) {
                services.showConfirmBox('Confirmation', 'A Lista de Material foi conferida ?').then(function(res) {
                    if (res) {
                        $scope.loading = true;
                        Restangular.one('manufacture/bom', itemId).all('checked').customPUT().then(function(response) {
                            $scope.loading = false;
                            $scope.tempBomArr = [];
                            $scope.tempBomArr = $scope.bomArray;
                            $scope.bomArray = [];
                            for (var i = 0; i < $scope.tempBomArr.length; i++)
                            {
                                if (parseInt($scope.tempBomArr[i].id) != parseInt(itemId))
                                {
                                    $scope.bomArray.push($scope.tempBomArr[i]);
                                }
                            }
                            services.showAlert('Success', 'A Lista de Material do Pedido ' + itemNumber + ' foi marcada como conferida.').then(function(res) {
                                $('[dataitemid="' + itemId + '"]').parent().remove();
                                $scope.pageBOM();
                            });
                        }, function(response) {
                            $scope.loading = false;
                            services.showAlert('Falhou', 'Tente novamente ou entre em contato com o suporte técnico.');
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
                        Restangular.one('manufacture/bom', itemId).all('unchecked').customPUT().then(function(response) {
                            $scope.loading = false;
                            $scope.tempBomArr = [];
                            $scope.tempBomArr = $scope.bomArray;
                            $scope.bomArray = [];
                            for (var i = 0; i < $scope.tempBomArr.length; i++)
                            {
                                if (parseInt($scope.tempBomArr[i].id) == parseInt(itemId))
                                {
                                    $scope.bomArray.push({"id": $scope.tempBomArr[i].id, "type": $scope.tempBomArr[i].type, "number": $scope.tempBomArr[i].number, "customer": $scope.tempBomArr[i].customer, "created": $scope.tempBomArr[i].created, "delivery": $scope.tempBomArr[i].delivery, "checked": false, "$$hashKey": $scope.tempBomArr[i].$$hashKey});
                                }
                                else
                                {
                                    $scope.bomArray.push($scope.tempBomArr[i]);
                                }
                            }
                            services.showAlert('Success', 'A Lista de Material do Pedido ' + itemNumber + ' foi marcada como conferida.').then(function(res) {
                            });
                        }, function(response) {
                            $scope.loading = false;
                            services.showAlert('Falhou', 'Tente novamente ou entre em contato com o suporte técnico.');
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
            $scope.searchText = localStorage.getItem('searchBOM');
            $scope.isDataSearch = '';
            $scope.resetBOM();
            $scope.loadBOM = function() {
                $scope.loading = true;
                if (localStorage.getItem('searchBOM') == null || localStorage.getItem('searchBOM') == "")
                {
                    var request = Restangular.one('manufacture').one('bom').get({checked: 'false', start: $scope.startPage, max: $scope.maxRecord});
                } else
                {
                    var request = Restangular.one('manufacture').one('bom').get({search: localStorage.getItem('searchBOM'), start: $scope.startPage, max: $scope.maxRecord});
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
                            services.showAlert('Notice', 'Não ha nenhum Pedido de Venda aguardando a conferência da Lista de Material.').then(function(res) {
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
                    services.showAlert('Falhou', 'Tente novamente ou entre em contato com o suporte técnico.');
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
                    localStorage.setItem('searchBOM', text);
                } else
                {
                    localStorage.setItem('searchBOM', '');
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
                                IntegrationRestangular.one('v0.9.0/manufacture/bom/index.aspx?number=' + $scope.orderData.ordernumber).get().then(function(response) {
                                    Restangular.all('manufacture/bom').post(response.data).then(function(res) {
                                        $scope.loading = false;
                                        if (res.status == 201) {
                                            services.showAlert('Pedido ' + $scope.orderData.ordernumber, 'Pedido ' + $scope.orderData.ordernumber + ' foi importado com sucesso !').then(function(res) {
                                                $route.reload();
                                            });
                                        }
                                    }, function() {
                                        $scope.loading = false;
                                        services.showAlert('Falhou', 'Tente novamente ou entre em contato com o suporte técnico.');
                                    });
                                }, function(response) {
                                    $scope.loading = false;
                                    services.showAlert('Falhou', 'Tente novamente ou entre em contato com o suporte técnico.');
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
            $scope.checkBtn = 0;
        });