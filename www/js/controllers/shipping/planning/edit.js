altamiraAppControllers.controller('ShippingPlanningEditCtrl',
        function($scope, $location, $route, Restangular, services, $ionicModal, CommonFun, $ionicSideMenuDelegate, $routeParams) {
            $scope.planningId = $routeParams.planningId;
            $scope.divideData = {};
            $scope.joinData = {};
            $scope.showdate = true;
            $scope.showdate_1 = true;
            $scope.showdate_2 = true;
            $scope.getOrderData = function(orderId) {
                $scope.loading = true;
                $scope.itemId = [];
                $scope.itemPartIdArr = [];
                $scope.itemPartDeliveryArr = [];
                Restangular.one('shipping/planning', orderId).get().then(function(response) {
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
                    services.showAlert('Falhou', 'Tente Novamente UO Entre em Contato com o Suporte Técnico.');
                });
            };
            $scope.goBack = function() {
                $location.path('shipping/planning');
            };
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
            }
            $ionicModal.fromTemplateUrl('templates/shipping/planning/popup/divide.html', {
                scope: $scope,
                animation: 'fade-in'
            }).then(function(modal) {
                $scope.divideDateModal = modal;
            });
            $scope.divideDateModalShow = function() {
                $scope.divideDateModal.show();
            }
            $scope.divideDateModalHide = function() {
                $scope.divideDateModal.hide();
            }
            $ionicModal.fromTemplateUrl('templates/shipping/planning/popup/join.html', {
                scope: $scope,
                animation: 'fade-in'
            }).then(function(modal) {
                $scope.joinDateModal = modal;
            });
            $scope.joinDateModalShow = function() {
                $scope.joinDateModal.show();
            }
            $scope.joinDateModalHide = function() {
                $scope.joinDateModal.hide();
            }
            $scope.divideDate = function() {
                $scope.divideData.delivery1 = '';
                $scope.divideData.delivery2 = '';
                $scope.divideData.quantity1 = '';
                $scope.divideData.quantity2 = '';
                if ($scope.itemPartIdArr.length == 1)
                {
                    var tempVar = $scope.getObjects($scope.orderData.item, 'id', $scope.itemId);
                    var part;
                    var partDelivery;
                    part = $scope.getObjects(tempVar[0].component, 'id', $scope.itemPartIdArr[0]);
                    $scope.divideData.chnDateCode = part[0].material.code;
                    $scope.divideData.chnDateDesc = part[0].description;
                    partDelivery = $scope.getObjects(part[0].delivery, 'id', $scope.itemPartDeliveryArr[0]);
                    $scope.partDelivery = partDelivery[0];
                    $scope.divideData.chnDateTotalQuantity = partDelivery[0].quantity.value;
                    $scope.divideData.pesoTotal = partDelivery[0].quantity.value * part[0].weight.value;
                    $scope.divideData.chnDateItem = {};
                    $scope.divideData.chnDateItem.id = tempVar[0].id;
                    $scope.divideData.chnDateItem.version = tempVar[0].version;
                    $scope.divideData.chnDateItem.item = tempVar[0].item;
                    $scope.divideData.chnDateItem.description = tempVar[0].description;
                    $scope.divideData.chnDateParts = part;
                    $scope.divideDateModalShow();
                }
                else {
                    if ($scope.itemPartIdArr.length < 1)
                    {
                        services.showAlert('Falhou', 'Please select components to divide delivery date');
                    }
                    if ($scope.itemPartIdArr.length > 1)
                    {
                        services.showAlert('Falhou', 'Please select only one component to divide delivery date');
                    }

                }
            };
            $scope.submitDivideComponent = function(isValid) {
                if (isValid) {
                    $scope.divideDateModal.hide();
                    $scope.loading = true;
                    $scope.postdata1 = {};
                    $scope.postdata1.id = 0;
                    $scope.postdata1.delivery = CommonFun.getFullTimestamp($scope.divideData.delivery1);
                    $scope.postdata1.quantity = {};
                    $scope.postdata1.quantity.value = $scope.divideData.quantity1;
                    $scope.postdata1.quantity.unit = {};
                    $scope.postdata1.quantity.unit.id = $scope.divideData.chnDateParts[0].quantity.unit.id;
                    $scope.postdata1.quantity.unit.name = $scope.divideData.chnDateParts[0].quantity.unit.name;
                    $scope.postdata1.quantity.unit.symbol = $scope.divideData.chnDateParts[0].quantity.unit.symbol;
                    Restangular.one('shipping/planning', $scope.orderData.id)
                            .one('item', $scope.itemId)
                            .one('component', $scope.itemPartIdArr[0])
                            .all('delivery').post($scope.postdata1).then(function(response) {
                        $scope.postdata2 = {};
                        $scope.postdata2.id = 0;
                        $scope.postdata2.delivery = CommonFun.getFullTimestamp($scope.divideData.delivery2);
                        $scope.postdata2.quantity = {};
                        $scope.postdata2.quantity.value = $scope.divideData.quantity2;
                        $scope.postdata2.quantity.unit = {};
                        $scope.postdata2.quantity.unit.id = $scope.divideData.chnDateParts[0].quantity.unit.id;
                        $scope.postdata2.quantity.unit.name = $scope.divideData.chnDateParts[0].quantity.unit.name;
                        $scope.postdata2.quantity.unit.symbol = $scope.divideData.chnDateParts[0].quantity.unit.symbol;
                        Restangular.one('shipping/planning', $scope.orderData.id)
                                .one('item', $scope.itemId)
                                .one('component', $scope.itemPartIdArr[0])
                                .all('delivery').post($scope.postdata2).then(function(response) {
                            Restangular.one('shipping/planning', $scope.orderData.id)
                                    .one('item', $scope.itemId)
                                    .one('component', $scope.itemPartIdArr[0])
                                    .one('delivery', $scope.itemPartDeliveryArr[0]).remove().then(function(response) {
                                $scope.loading = false;
                                $scope.getOrderData($scope.orderData.id);
                            }, function() {
                                $scope.loading = false;
                                services.showAlert('Falhou', 'Tente Novamente UO Entre em Contato com o Suporte Técnico.').then(function() {
                                    if ($scope.viewGrid != true)
                                    {
                                        $scope.divideDateModal.show();
                                    }
                                });
                            });
                        }, function() {
                            $scope.loading = false;
                            services.showAlert('Falhou', 'Tente Novamente UO Entre em Contato com o Suporte Técnico.').then(function() {
                                if ($scope.viewGrid != true)
                                {
                                    $scope.divideDateModal.show();
                                }
                            });
                        });
                    }, function() {
                        $scope.loading = false;
                        services.showAlert('Falhou', 'Tente Novamente UO Entre em Contato com o Suporte Técnico.').then(function() {
                            if ($scope.viewGrid != true)
                            {
                                $scope.divideDateModal.show();
                            }
                        });
                    });
                }
            }
            $scope.desideQun2 = function() {
                $scope.divideData.quantity2 = parseInt($scope.divideData.chnDateTotalQuantity) - parseInt($scope.divideData.quantity1);
            }
            $scope.joinDate = function() {
                $scope.itemId = unique_arr($scope.itemId);
                $scope.itemPartIdArr = unique_arr($scope.itemPartIdArr);
                $scope.itemPartDeliveryArr = unique_arr($scope.itemPartDeliveryArr);
                if ($scope.itemPartDeliveryArr.length > 1)
                {
                    var tempVar = $scope.getObjects($scope.orderData.item, 'id', $scope.itemId);
                    $scope.joinData.chnDateParts = [];
                    var part;
                    var delivery;
                    var chnDateTotalQuantity = 0;
                    var pesoTotal = 0;
                    var chnDateUnit = '';
                    for (var i = 0; i < $scope.itemPartIdArr.length; i++)
                    {
                        part = $scope.getObjects(tempVar[0].component, 'id', $scope.itemPartIdArr[i]);
                        $scope.joinData.chnDateParts.push(part[0]);
                        $scope.joinData.chnDateParts[i].deliveryArr = [];
                        for (var j = 0; j < $scope.itemPartDeliveryArr.length; j++)
                        {
                            delivery = $scope.getObjects(part[0].delivery, 'id', $scope.itemPartDeliveryArr[j]);
                            if (delivery != '')
                            {
                                $scope.joinData.chnDateParts[i].deliveryArr.push(delivery[0]);
                                chnDateTotalQuantity = chnDateTotalQuantity + parseInt(delivery[0].quantity.value);
                                pesoTotal = pesoTotal + (parseInt(delivery[0].quantity.value) * parseInt(part[0].weight.value));
                            }
                            chnDateUnit = part[0].weight.unit;
                        }
                    }
                    $scope.joinData.chnDateCode = $scope.joinData.chnDateParts[0].material.code;
                    $scope.joinData.chnDateDesc = $scope.joinData.chnDateParts[0].description;
                    $scope.joinData.chnDateTotalQuantity = chnDateTotalQuantity;
                    $scope.joinData.chnDateUnit = chnDateUnit;
                    $scope.joinData.pesoTotal = pesoTotal;
                    $scope.joinData.chnDateItem = {};
                    $scope.joinData.chnDateItem.id = tempVar[0].id;
                    $scope.joinData.chnDateItem.version = tempVar[0].version;
                    $scope.joinData.chnDateItem.item = tempVar[0].item;
                    $scope.joinData.chnDateItem.description = tempVar[0].description;
                    $scope.joinDateModalShow();
                }
                else {
                    services.showAlert('Falhou', 'Please select atleast 2 components to join delivery date');
                }
            }
            $scope.submitJoinComponent = function(isValid) {
                if (isValid) {
                    $scope.joinDateModal.hide();
                    $scope.loading = true;
                    $scope.postdata = {};
                    $scope.postdata.id = 0;
                    $scope.postdata.delivery = CommonFun.getFullTimestamp($scope.joinData.delivery);
                    $scope.postdata.quantity = {};
                    $scope.postdata.quantity.value = $scope.joinData.chnDateTotalQuantity;
                    $scope.postdata.quantity.unit = {};
                    $scope.postdata.quantity.unit.id = $scope.joinData.chnDateUnit.id;
                    $scope.postdata.quantity.unit.name = $scope.joinData.chnDateUnit.name;
                    $scope.postdata.quantity.unit.symbol = $scope.joinData.chnDateUnit.symbol;
                    Restangular.one('shipping/planning', $scope.orderData.id)
                            .one('item', $scope.joinData.chnDateItem.id)
                            .one('component', $scope.joinData.chnDateParts[0].id)
                            .all('delivery').post($scope.postdata).then(function(response) {
                        var i = 0;
                        $scope.outerRemovePart = function() {
                            var j = 0;
                            $scope.innerRemovePart = function() {
                                Restangular.one('shipping/planning', $scope.orderData.id)
                                        .one('item', $scope.joinData.chnDateItem.id)
                                        .one('component', $scope.joinData.chnDateParts[i].id)
                                        .one('delivery', $scope.joinData.chnDateParts[i].delivery[j].id).remove().then(function(response) {
                                    j++;
                                    if (j < $scope.joinData.chnDateParts[i].deliveryArr.length)
                                    {
                                        $scope.innerRemovePart();
                                    }
                                    else
                                    {
                                        i++;
                                        if (i < $scope.joinData.chnDateParts.length)
                                        {
                                            $scope.outerRemovePart();
                                        } else
                                        {
                                            $scope.loading = false;
                                            services.showAlert('success', 'Successfully joined delivery dates').then(function(response) {
                                                $scope.getOrderData($scope.orderData.id);
                                            });
                                        }
                                    }
                                }, function() {
                                    $scope.loading = false;
                                    services.showAlert('Falhou', 'Tente Novamente UO Entre em Contato com o Suporte Técnico.').then(function(response) {
                                        $scope.joinDateModal.show();
                                    });
                                });
                            }
                            $scope.innerRemovePart();
                        }
                        $scope.outerRemovePart();
                    }, function() {
                        $scope.loading = false;
                        services.showAlert('Falhou', 'Tente Novamente UO Entre em Contato com o Suporte Técnico.').then(function(response) {
                            $scope.joinDateModal.show();
                        });
                    });
                }
            };
            $scope.getOrderData($scope.planningId);
        });