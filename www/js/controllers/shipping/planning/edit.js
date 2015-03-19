altamiraAppControllers.controller('ShippingPlanningEditCtrl',
        function($scope, $location, $route, Restangular, services, $ionicModal, CommonFun, $ionicSideMenuDelegate, $routeParams) {
            $scope.planningId = $routeParams.planningId;
            $scope.divideData = {};
            $scope.joinData = {};
            $scope.showdate = true;
            $scope.showdate_1 = true;
            $scope.showdate_2 = true;
            $scope.validDelivery = '';
            $scope.PersonalData = {};
            $scope.historyData = {};
            $scope.getOrderData = function(orderId) {
                $scope.loading = true;
                $scope.itemId = [];
                $scope.itemPartIdArr = [];
                $scope.itemMaterialArr = [];
                $scope.itemPartDeliveryArr = [];
                Restangular.one('shipping/planning', orderId).get().then(function(response) {
                    $scope.loading = false;
                    $scope.orderData = response.data;
                    $scope.finalList = [];
                    $scope.PersonalData.id = $scope.orderData.id;
                    $scope.PersonalData.version = $scope.orderData.version;
                    $scope.PersonalData.type = $scope.orderData.type;
                    $scope.PersonalData.invoice = $scope.orderData.invoice;
                    $scope.PersonalData.transport = $scope.orderData.transport;
                    $scope.PersonalData.name = $scope.orderData.name;
                    $scope.PersonalData.phone = $scope.orderData.phone;
                    $scope.PersonalData.email = $scope.orderData.email;
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
            $scope.getOrderData($scope.planningId);
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
                    $scope.divideData.chnDateTotalQuantityUnit = partDelivery[0].quantity.unit.symbol;
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
                $scope.checkComponents();
                if ($scope.validDelivery > 1)
                {
                    if ($scope.validDelivery == 2)
                    {
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
                            $scope.joinData.chnDateDesc = $scope.joinData.chnDateParts[0].quantity.unit.symbol;
                            $scope.joinData.chnDateTotalQuantity = chnDateTotalQuantity;
                            $scope.joinData.chnDateTotalQuantityUnit = $scope.joinData.chnDateParts[0].quantity.unit.symbol;
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
                    } else
                    {
                        services.showAlert('Error', 'Selecione o mesmo tipo de material.');
                    }

                } else
                {
                    services.showAlert('Error', 'Selecione o mesmo item.');
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
            $scope.checkComponents = function() {
                $scope.itemId = unique_arr($scope.itemId);
                $scope.itemPartIdArr = unique_arr($scope.itemPartIdArr);
                $scope.itemMaterialArr = unique_arr($scope.itemMaterialArr);
                $scope.itemPartDeliveryArr = unique_arr($scope.itemPartDeliveryArr);
                if ($scope.itemId.length == 1) {
                    $scope.validDelivery = 2;
                    if ($scope.itemMaterialArr.length > 1)
                    {
                        $scope.validDelivery = 3; // not a same material
                    }
                } else if ($scope.itemId.length > 1)
                {
                    $scope.validDelivery = 1; // not a same item
                }
            }
            $scope.submitPersonalDataForm = function(isValid) {
                if (isValid) {
                    $scope.loading = true;
                    Restangular.one('shipping/planning/transport', $scope.PersonalData.id).customPUT($scope.PersonalData).then(function(response) {
                        $scope.loading = false;
                        services.showAlert('Success', 'dados pessoais atualizados succefully').then(function(res) {
                            $scope.getOrderData($scope.planningId);
                        });
                    }, function(response1) {
                        $scope.loading = false;
                        services.showAlert('Falhou', 'Tente Novamente UO Entre em Contato com o Suporte Técnico.');
                    });
                }
            };
            $ionicModal.fromTemplateUrl('templates/shipping/planning/popup/history.html', {
                scope: $scope,
                animation: 'fade-in'
            }).then(function(modal) {
                $scope.historyModal = modal;
            });
            $scope.historyModalShow = function() {
                $scope.historyModal.show();
            }
            $scope.historyModalHide = function() {
                $scope.historyModal.hide();
            }
            $scope.openHistoryModal = function() {
                $scope.historyData.date = moment().format('DD/MM/YYYY');
                $scope.historyData.comment = '';
                $scope.historyData.statusDescription = '';
                $scope.historyModalShow();
            }
            $ionicModal.fromTemplateUrl('templates/shipping/planning/popup/status_list.html', {
                scope: $scope,
                animation: 'fade-in'
            }).then(function(modal) {
                $scope.statusListModal = modal;
            });
            $scope.statusListModalShow = function() {
                $scope.historyModalHide();
                $scope.statusListModal.show();
            }
            $scope.statusListModalHide = function() {
                $scope.statusListModal.hide();
                $scope.historyModalShow();
            }
            $scope.openStatusListModal = function() {
                $scope.statusListModalShow();
                Restangular.one('shipping/planning/status').get().then(function(response) {
                    $scope.loading = false;
                    $scope.statusData = response.data;
                }, function() {
                    $scope.loading = false;
                    services.showAlert('Falhou', 'Tente Novamente UO Entre em Contato com o Suporte Técnico.');
                });
            };

            $scope.selectStatusType = function(status) {
                $scope.historyData.statusId = status.id;
                $scope.historyData.statusType = status.type;
                $scope.historyData.statusDescription = status.description;
                $scope.historyData.statusCode = status.code;
                $scope.statusListModalHide();
            }
            $scope.submitHistoryForm = function(isValid) {
                if (isValid) {
                    $scope.loading = true;
                    $scope.postData = {};
                    $scope.postData.id = 0;
                    $scope.postData.type = "br.com.altamira.data.model.shipping.planning.History",
                            $scope.postData.status = {};
                    $scope.postData.status.id = $scope.historyData.statusId;
                    $scope.postData.status.type = $scope.historyData.statusType;
                    $scope.postData.status.description = $scope.historyData.statusDescription;
                    $scope.postData.status.code = $scope.historyData.statusCode;
                    $scope.postData.date = CommonFun.getFullTimestamp($scope.historyData.date);
                    $scope.postData.comment = $scope.historyData.comment;
                    Restangular.one('shipping/planning', $scope.planningId).all('history').post($scope.postData).then(function(response) {
                        $scope.loading = false;
                        $scope.historyModalHide();
                        $scope.getOrderData($scope.planningId);
                    }, function() {
                        $scope.loading = false;
                        services.showAlert('Falhou', 'Tente Novamente UO Entre em Contato com o Suporte Técnico.');
                    });
                }
            };
            $scope.updatePart = function(bomId, itemId, partId, deliveryid) {
                $scope.loading = true;
                $scope.BOMId = bomId;
                $scope.ITEMId = itemId;
                $scope.PARTId = partId;
                $scope.DELIVERYId = deliveryid;
                $scope.partData = {};
                Restangular.one('shipping/planning', bomId).one('item', itemId).one('component', partId).get().then(function(response) {

                    var data = response.data;
                    $scope.partData.version = data.version;
                    $scope.partData.materialId = data.material.id;
                    $scope.partData.code = data.material.code;
                    $scope.partData.description = data.description;
                    $scope.partData.delivery = data.delivery.delivery;
                    $scope.partData.quantity = data.quantity.value;
                    $scope.partData.quantityType = data.quantity.unit.symbol;
                    $scope.partData.weight = data.weight.value;
                    $scope.getUnitSymbol(data.weight.unit.id, 'weight');
                    Restangular.one('shipping/planning', bomId).one('item', itemId).one('component', partId).one('delivery', deliveryid).get().then(function(response1) {
                        $scope.partData.delivery = CommonFun.getFullDate(response1.data.delivery);
                        $ionicModal.fromTemplateUrl('templates/shipping/planning/popup/part.html', {
                            scope: $scope,
                            animation: 'fade-in'
                        }).then(function(modal) {
                            $scope.changePartModal = modal;
                            $scope.loading = false;
                            $scope.changePartModal.show();
                        });
                        $scope.changePartModalHide = function() {
                            $scope.changePartModal.hide();
                        };
                        $scope.changePartModalShow = function() {
                            $scope.changePartModal.show();
                        };
                    }, function(response1) {
                        services.showAlert('Falhou', 'Tente Novamente UO Entre em Contato com o Suporte Técnico.');
                    });
                }, function(response) {
                    services.showAlert('Falhou', 'Tente Novamente UO Entre em Contato com o Suporte Técnico.');
                });
                $scope.getUnitSymbol = function(unitId, unitType) {
                    Restangular.one('measurement/unit', unitId).get().then(function(response) {
                        var symbol = response.data.symbol;
                        var id = response.data.id;
                        if (unitType == "width")
                        {
                            $scope.partData.widthType = symbol;
                            $scope.partData.widthTypeId = id;
                        } else if (unitType == "height") {
                            $scope.partData.heightType = symbol;
                            $scope.partData.heightTypeId = id;
                        } else if (unitType == "length") {
                            $scope.partData.lengthType = symbol;
                            $scope.partData.lengthTypeId = id;
                        } else if (unitType == "weight") {
                            $scope.partData.weightType = symbol;
                            $scope.partData.weightTypeId = id;
                        }
                    }, function(response) {
                        services.showAlert('Falhou', 'Tente Novamente UO Entre em Contato com o Suporte Técnico.');
                    });
                };
            };
            $scope.submitPartForm = function(isValid) {
                if (isValid) {
                    $scope.loading = true;
                    Restangular.all('shipping').one('planning', $scope.BOMId).one('item', $scope.ITEMId).one('component', $scope.PARTId).one('delivery', $scope.DELIVERYId).get().then(function(response) {
                        $scope.chgDeliveryData = {};
                        $scope.chgDeliveryData.id = response.data.id;
                        $scope.chgDeliveryData.version = response.data.version;
                        $scope.chgDeliveryData.type = response.data.type;
                        $scope.chgDeliveryData.delivery = moment($scope.partData.delivery, 'DD/MM/YYYY').format('YYYY-MM-DD');
                        $scope.chgDeliveryData.quantity = response.data.quantity;
                        $scope.chgDeliveryData.delivered = response.data.delivered;
                        $scope.chgDeliveryData.remaining = response.data.remaining;
                        Restangular.all('shipping').one('planning', $scope.BOMId).one('item', $scope.ITEMId).one('component', $scope.PARTId).one('delivery', $scope.DELIVERYId).customPUT($scope.chgDeliveryData).then(function(response) {
                            $scope.loading = false;
                            $scope.changePartModalHide();
                            services.showAlert('Success', 'Delivery date changed to ' + $scope.partData.delivery).then(function(res) {
                                if ($scope.viewtype == 'grid')
                                {
                                    $scope.loadGrid();
                                } else
                                {
                                    $scope.getOrderData($scope.BOMId);
                                }
                            });
                        }, function(response) {
                            $scope.loading = false;
                            services.showAlert('Falhou', 'Tente Novamente UO Entre em Contato com o Suporte Técnico.');
                        });
                    }, function(response) {
                        $scope.loading = false;
                        services.showAlert('Falhou', 'Tente Novamente UO Entre em Contato com o Suporte Técnico.');
                    });
                }
            };
            $scope.updateMultiplePart = function() {
                $ionicModal.fromTemplateUrl('templates/shipping/planning/popup/multiplepart.html', {
                    scope: $scope,
                    animation: 'fade-in'
                }).then(function(modal) {
                    $scope.changePartModal = modal;
                    $scope.loading = false;
                    $scope.changePartModal.show();
                });
                $scope.changePartModalHide = function() {
                    $scope.changePartModal.hide();
                };
                $scope.changePartModalShow = function() {
                    $scope.changePartModal.show();
                };
                $scope.partData = {};

            };

            $scope.submitMultipleDeliveryDate = function(isValid)
            {
                if (isValid)
                {
                    var i = 0;
                    $scope.changePartModalHide();
                    $scope.changeDeliveryDate = function()
                    {
                        $scope.loading = true;
                        Restangular.all('shipping').one('planning', $scope.planningId).one('item', $scope.itemId[i]).one('component', $scope.itemPartIdArr[i]).one('delivery', $scope.itemPartDeliveryArr[i]).get().then(function(response) {
                            $scope.chgDeliveryData = {};
                            $scope.chgDeliveryData.id = response.data.id;
                            $scope.chgDeliveryData.version = response.data.version;
                            $scope.chgDeliveryData.type = response.data.type;
                            $scope.chgDeliveryData.delivery = moment($scope.partData.delivery, 'DD/MM/YYYY').format('YYYY-MM-DD');
                            $scope.chgDeliveryData.quantity = response.data.quantity;
                            $scope.chgDeliveryData.delivered = response.data.delivered;
                            $scope.chgDeliveryData.remaining = response.data.remaining;
                            console.log(JSON.stringify($scope.chgDeliveryData));
                            Restangular.all('shipping').one('planning', $scope.planningId).one('item', $scope.itemId[i]).one('component', $scope.itemPartIdArr[i]).one('delivery', $scope.itemPartDeliveryArr[i]).customPUT($scope.chgDeliveryData).then(function(response) {
                                i++;
                                if (i < $scope.itemId.length)
                                {
                                    $scope.changeDeliveryDate();
                                }
                                else
                                {
                                    $scope.loading = false;
                                    services.showAlert('Success', 'Delivery date changed to ' + $scope.partData.delivery).then(function(res) {
                                        $scope.getOrderData($scope.planningId);
                                    });
                                }
                            }, function(response) {
                                $scope.loading = false;
                                $scope.changePartModalShow();
                                services.showAlert('Falhou', 'Tente Novamente UO Entre em Contato com o Suporte Técnico.');
                            });
                        }, function(response) {
                            $scope.loading = false;
                            $scope.changePartModalShow();
                            services.showAlert('Falhou', 'Tente Novamente UO Entre em Contato com o Suporte Técnico.');
                        });
                    }
                    $scope.changeDeliveryDate();
                }
            }
        });