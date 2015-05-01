altamiraAppControllers.controller('ShippingExecutionPackingCreateCtrl',
        function($scope, $location, $route, Restangular, services, $ionicModal, CommonFun, $ionicSideMenuDelegate, $routeParams) {

            $scope.openOrderList = function() {
                $ionicModal.fromTemplateUrl('templates/shipping/execution/popup/order_list.html', {
                    scope: $scope,
                    animation: 'fade-in'
                }).then(function(modal) {
                    $scope.OrderList = modal;
                    $scope.resetPackingList();
                    $scope.loadPackingList();
                });
                $scope.OrderListModalShow = function() {
                    $scope.OrderList.show();
                };
                $scope.OrderListModalHide = function() {
                    $scope.OrderList.hide();
                };

            }
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

            $scope.loadPackingList = function() {
                $scope.loading = true;
                Restangular.one('shipping/execution').get({search: localStorage.getItem('searchPackingList'), start: $scope.startPage, max: $scope.maxRecord}).then(function(response) {
                    $scope.OrderListModalShow();
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
                            services.showAlert('Notice', 'A lista de Romaneios esta vazia.').then(function(res) {
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
                    services.showAlert('Falhou', 'Tente novamente ou entre em contato com o suporte técnico.');
                });
            };

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
            $scope.getDetailByOrder = function(orderId) {
                $scope.OrderListModalHide();
                $scope.loading = true;
                Restangular.one('shipping/execution', orderId).get().then(function(response) {
                    $scope.loading = false;
                    $scope.orderData = response.data;
                }, function(response) {
                })
            }
            $scope.newPackingList = function(executionId, deliveryDate) {
                $scope.loading = true;
                $scope.postData = {};
                $scope.postData.id = 0;
                $scope.postData.delivery = deliveryDate;
                Restangular.one('shipping/execution', executionId).all('packinglist').post($scope.postData).then(function(response) {
                    $location.path('/shipping/execution/' + executionId + '/packinglist/' + response.data.id);
                }, function(response) {
                    services.showAlert('Falhou', 'Tente novamente ou entre em contato com o suporte técnico.');
                });
            }
            $scope.getObjects = function(obj, key, val) {
                var objects = [];
                for (var i in obj) {
                    if (!obj.hasOwnProperty(i))
                        continue;
                    if (typeof obj[i] == 'object') {
                        objects = objects.concat($scope.getObjects(obj[i], key, val));
                    } else if (i == key && obj[key] == val) {
                        objects.push(obj);
                    }
                }
                return objects;
            };
            $scope.goBack = function() {
                $location.path('/shipping/execution');
            }
        });