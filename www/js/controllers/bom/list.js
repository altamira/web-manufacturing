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
                                if (res) {
                                    $route.reload();
                                }
                            });

                        }, function(response) {
                            $scope.loading = false;
                            services.showAlert('Falhou', 'Please try again');
                        });
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
                                if (res) {
                                    $route.reload();
                                }
                            });

                        }, function(response) {
                            $scope.loading = false;
                            services.showAlert('Falhou', 'Please try again');
                        });
                    }
                });
            };
            $scope.toggleLeft = function() {
                $ionicSideMenuDelegate.toggleLeft();
            };



            $scope.search = {
                criteria: '', // search criteria
                page: 0, // current page
                last: undefined, // last results
                pages: [], // page cache
                size: 10, // page size
                forward: true, // enable next button

                // clean page cache for a new search results
                reset: function() {
                    this.forward = true;
                    this.pages = [];
                },
                // get next page from remote
                next: function() {
                    this.get($scope.search.pages.length);
                },
                // go to page number stored in the cache
                go: function(page) {
                    this.page = page;
                },
                // get page from remote api
                get: function(page) {
                    page = page === undefined ? 0 : page;

                    if (this.criteria.trim().length > 0) {
                        $scope.loading = true;
                        Restangular.one('manufacturing/bom?checked=true').get({checked: true, search: this.criteria, start: page, max: this.size}).then(function(response) {
                            $scope.loading = false;
                            $scope.search.last = response.data;
                        }, function(response) {
                            services.showAlert('Falhou', 'Please try again');
                        });
                    } else {
                        $scope.loading = true;
                        Restangular.one('manufacturing/bom').get({checked: false, start: page, max: this.size}).then(function(response) {
                            $scope.loading = false;
                            $scope.search.last = response.data;
                        }, function(response) {
                            services.showAlert('Falhou', 'Please try again');
                        });
                    }
                },
                // run the search
                run: function() {
                    this.reset();
                    this.get(0);
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
                                $scope.showLoading();
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
            // first load
            $scope.search.run();
            $scope.checkBtn = 0;
            // add page to the cache
            $scope.$watch('search.last',
                    function() {
                        if ($scope.search.last != undefined) {
                            if ($scope.search.last.length === 0) {
                                alert('Nenhum registro encontrado');
                                $scope.search.forward = false;
                            } else {
                                $scope.search.pages.push($scope.search.last);
                                $scope.search.page = $scope.search.pages.length - 1;
                            }
                        }
                    }
            );

        });