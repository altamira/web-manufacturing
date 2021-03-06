altamiraAppControllers.controller('ManufactureExecutionPackingCtrl',
        function($scope, $location, $route, Restangular, services, $ionicModal, CommonFun, $ionicSideMenuDelegate, $routeParams) {
            $scope.loading = true;
            $scope.executionId = $routeParams.executionId;
            $scope.getOrderData = function(orderId) {
                $scope.loading = true;
                $scope.itemId = [];
                $scope.itemPartIdArr = [];
                $scope.itemPartDeliveryArr = [];
                Restangular.one('manufacture/execution', orderId).get().then(function(response) {
                    $scope.loading = false;
                    $scope.orderData = response.data;
                    $scope.finalList = [];
                    for (var j = 0; j < $scope.orderData.item.length; j++)
                    {
                        $scope.tempList = {};
                        $scope.tempList.id = $scope.orderData.item[j].id;
                        $scope.tempList.version = $scope.orderData.item[j].version;
                        $scope.tempList.type = $scope.orderData.item[j].type;
                        $scope.tempList.item = $scope.orderData.item[j].item;
                        $scope.tempList.description = $scope.orderData.item[j].description;
                        $scope.tempList.delivery = [];
                        for (var k = 0; k < $scope.orderData.item[j].component.length; k++)
                        {
                            for (var l = 0; l < $scope.orderData.item[j].component[k].delivery.length; l++)
                            {
                                $scope.tempListComponent = {};
                                $scope.tempListComponent.componentId = $scope.orderData.item[j].component[k].id;
                                $scope.tempListComponent.materialId = $scope.orderData.item[j].component[k].material.id;
                                $scope.tempListComponent.description = $scope.orderData.item[j].component[k].description;
                                $scope.tempListComponent.color = $scope.orderData.item[j].component[k].color.code;
                                $scope.tempListComponent.weight = $scope.orderData.item[j].component[k].weight.value;
                                $scope.tempListComponent.weightType = $scope.orderData.item[j].component[k].weight.unit.symbol;
                                $scope.tempListComponent.quantity = $scope.orderData.item[j].component[k].quantity.value;
                                $scope.tempListComponent.delivery = $scope.orderData.item[j].component[k].delivery[l];
                                $scope.tempListComponent.remainingQuantity = $scope.orderData.item[j].component[k].remaining.value;
                                $scope.tempList.delivery.push($scope.tempListComponent);
                            }
                        }
                        $scope.finalList.push($scope.tempList);
                    }

                    $scope.finalList.sort(function(a, b) {
                        return a.item - b.item;
                    });
                }, function() {
                    $scope.loading = false;
                    services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
                });
            };
            $scope.getOrderData($scope.executionId);
            $scope.goBack = function() {
                $location.path('/manufacture/execution/list');
            }
            $scope.remainingQtnArr = [];
            $scope.changeRemainingQun = function() {
                services.showConfirmBox('Confirmação', 'Confirma a operação ?').then(function(res) {
                    if (res)
                    {
                        var i = 0;
                        $scope.updateRemainingQtn = function() {
                            Restangular.all('manufacture').one('execution', $scope.executionId).one('item', $("[datadelivery='" + $scope.remainingQtnArr[i] + "']").attr('dataitem')).one('component', $("[datadelivery='" + $scope.remainingQtnArr[i] + "']").attr('datapart')).get().then(function(response) {
                                $scope.postData = {};
                                $scope.postData.id = 0;
                                $scope.postData.version = 0;
                                $scope.postData.type = 'br.com.altamira.data.model.shipping.execution.Delivered';
                                $scope.postData.operation = {};
                                $scope.postData.operation.id = localStorage.getItem('operationId');
                                $scope.postData.operation.type = localStorage.getItem('operationType');
                                $scope.postData.operation.description = localStorage.getItem('operationDesc');
                                $scope.postData.quantity = {};
                                $scope.postData.quantity.value = $('#remaining_' + $scope.remainingQtnArr[i]).val();
                                $scope.postData.quantity.unit = response.data.quantity.unit;
                                $scope.postData.delivery = CommonFun.toDayTimeStamp();
                                Restangular.all('manufacture/execution').one('component', $("[datadelivery='" + $scope.remainingQtnArr[i] + "']").attr('datapart')).all('delivered').post($scope.postData).then(function(response) {
                                    i++
                                    if (i < $scope.remainingQtnArr.length) {
                                        $scope.updateRemainingQtn();
                                    } else
                                    {
                                        $scope.loading = false;
                                        services.showAlert('Successo', 'Valores alterados com sucesso.').then(function(res) {
                                            $scope.remainingQtnArr = [];
                                            $scope.getOrderData($scope.executionId);
                                        });
                                    }
                                }, function(response) {
                                    $scope.loading = false;
                                    services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
                                });
                            }, function(response) {
                                $scope.loading = false;
                                services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
                            });
                        }
                        if ($scope.remainingQtnArr.length > 0)
                        {
                            $scope.loading = true;
                            $scope.updateRemainingQtn();
                        } else
                        {
                            services.showAlert('Falhou', 'Selecione ao menos uma data de entrega.');
                        }
                    }
                });
            }

            $scope.checkAllDelivery = function()
            {
                $scope.remainingQtnArr = [];
                $('.delivery-table > tbody > tr > td:last-child').each(function() {
                    if ($(this).children().hasClass('fa-ban') == false)
                    {
                        $scope.remainingQtnArr.push(parseFloat($(this).children().attr('datadelivery')));
                    }
                    if ($(this).children().hasClass('fa-check-square-o') == false && $(this).children().hasClass('fa-ban') == false)
                    {
                        $(this).children().toggleClass('fa-check-square-o');
                    }
                });
                calculateManExecutionWeight();
            }

            $scope.uncheckAllDelivery = function()
            {
                $scope.remainingQtnArr = [];
                $('.delivery-table > tbody > tr > td:last-child').each(function() {
                    if ($(this).children().hasClass('fa-check-square-o') == true && $(this).children().hasClass('fa-ban') == false)
                    {
                        $(this).children().toggleClass('fa-check-square-o');
                    }
                });
                calculateManExecutionWeight();
            }

            $scope.printReport = function() {
                window.open(localStorage.getItem('reportBaseUrl') + "/report/shipping/execution/packinglist/" + $scope.executionId + '?token=' + localStorage.getItem('token'), '_blank');
            }
        });