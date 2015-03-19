altamiraAppControllers.controller('ShippingPlanningCtrl',
        function($scope, $location, $route, Restangular, services, $ionicModal, CommonFun, $ionicSideMenuDelegate) {
            var pt = moment().locale('pt-br');
            $scope.today = pt.format('dddd, LL');
            moment.locale('pt-br');
            var month = moment.months();
            moment.locale('en');
            $scope.showdate = true;
            $scope.showdate_1 = true;
            $scope.showdate_2 = true;
            $scope.tempUnixTS = [];
            $scope.viewWeekly = false;
            $scope.currentYear = moment().format('YYYY');
            $scope.validYears = [parseInt($scope.currentYear) - 1, parseInt($scope.currentYear), parseInt($scope.currentYear) + 1];
            $scope.viewtype = 'form';
            $scope.divideData = {};
            $scope.joinData = {};
            $scope.formView = function() {
                $scope.viewtype = 'form';
                $('#form_view').show();
                $('#formShowBtn').removeClass('month');
                $('#grid_view').hide();
                $('#gridShowBtn').addClass('month');
                $scope.getOrderData(parseInt($('.dataTable tr:nth-child(3) td:nth-child(2)').attr('id')));

            }
            $scope.gridView = function() {
                $scope.viewtype = 'grid';
                $('#form_view').hide();
                $('#formShowBtn').addClass('month');
                $('#grid_view').show();
                $('#gridShowBtn').removeClass('month');
                $scope.loadGrid();
            }
            $scope.loadOrderList = function() {
                $scope.loading = true;
                Restangular.one('shipping/planning').get({max: 999}).then(function(response) {
                    $scope.loading = false;
                    $scope.orderList = response.data;
                    $scope.orderListLength = response.data.length;
                    $scope.getOrderData($scope.orderList[0].id);
                    setTimeout(function() {
                        $scope.decorateTable();
                    }, 100);
                }, function(response) {
                    services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
                });
            };
            $scope.loadOrderList();
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
                    $scope.decorateTable();
                }, function() {
                    $scope.loading = false;
                    services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
                });
            };
            $scope.decorateTable = function() {
                var dragging = false;
                $('#dragbar').mousedown(function(e) {
                    e.preventDefault();

                    dragging = true;
                    var main = $('.planning-detail');
                    var ghostbar = $('<div>',
                            {id: 'ghostbar',
                                css: {
                                    height: main.outerHeight(),
                                    top: main.offset().top,
                                    left: main.offset().left
                                }
                            }).appendTo('body');

                    $(document).mousemove(function(e) {
                        ghostbar.css("left", e.pageX + 2);
                    });
                });

                $(document).mouseup(function(e) {
                    if (dragging)
                    {
                        var width = $(window).width();
                        var parentWidth = e.pageX;
                        var percent = 100 * parentWidth / width;
                        $('#sidebar').css("width", percent + "%");
                        $('.planning-detail').css("left", e.pageX + 32);
                        $('.planning-detail').css("width", (100 - percent) + '%');
                        $('#ghostbar').remove();
                        $(document).unbind('mousemove');
                        dragging = false;
                    }
                });
                $(".shipping_data").mCustomScrollbar({
                    axis: "y",
                    theme: "inset-3",
                    scrollButtons: {enable: true},
                });
                $(".mainRow").mCustomScrollbar({
                    axis: "x",
                    theme: "inset-3",
                    scrollButtons: {enable: true},
                    scrollbarPosition: "outside"
                });
                $(".dataRow").mCustomScrollbar({
                    axis: "yx",
                    theme: "inset-3",
                    scrollButtons: {enable: true},
                    scrollbarPosition: "outside",
                    autoHideScrollbar: false
                });
                $(".dataRow  .mCSB_scrollTools_vertical").css('left', '-10px');
                $(".dataRowGrid").mCustomScrollbar({
                    axis: "x",
                    theme: "inset-3",
                    scrollButtons: {enable: true},
                    scrollbarPosition: "outside"
                });

                $('.dataTable tr').hover(function() {
                    var hoverClass = $(this).attr('id');
                    $(this).css('background-color', '#95bcf2');
                    $('.' + hoverClass).css('background-color', '#95bcf2');
                });
                $('.dataTable tr').mouseleave(function() {
                    var hoverClass = $(this).attr('id');
                    $(this).css('background-color', '#ffffff');
                    $('.' + hoverClass).css('background-color', '#ffffff');
                });
                $('.mainTable tr').hover(function() {
                    var hoverClass = $(this).attr('class');
                    $('#' + hoverClass).css('background-color', '#95bcf2 !important');
                });
                $('.mainTable tr').mouseleave(function() {
                    var hoverClass = $(this).attr('class');
                    $('#' + hoverClass).css('background-color', '#ffffff');
                });
                $('.dragDiv').on('dblclick', function(e) {
                    $scope.viewDeliveryDate = CommonFun.getFullTimestamp(CommonFun.setDefaultDateFormat($(this).parent().data('day'), 'DD_M_YYYY'));
                    $scope.changeDeliveryDate($(this).parent().parent().attr('class'));
                });
                setTimeout(function() {

                    makeDummyRowLeft();
                    makeDummyRowRight();
                    totalWeightCal();
                    $(".dragDiv").draggable({
                        revert: 'invalid'
                    });
                    $(".makeDroppable").droppable({
                        accept: function(item) {
                            return $(this).closest("tr").is(item.closest("tr")) && $(this).find("*").length == 0;
                        },
                        drop: function(event, ui) {
                            $scope.changeDelDateByDrag($(this).parent().attr('class'), ui.draggable.attr('id'), $(this).data('day'));

                            var $this = $(this);
                            $this.append(ui.draggable.css({
                                top: 0,
                                left: '0px !important'
                            }));
                            ui.draggable.position({
                                my: "center",
                                at: "center",
                                of: $this,
                                using: function(pos) {
                                    $(this).animate(pos, 500, "linear", function() {
                                        $(this).css('top', '0px');
                                        $(this).css('left', '0px');
                                    });
                                }
                            });
                        }
                    });
                }, 100);
            }
            $scope.openBOM = function(bomId) {
                $location.path('/bom/edit/' + bomId);
            }
            $ionicModal.fromTemplateUrl('templates/shipping/planning/popup/view.html', {
                scope: $scope,
                animation: 'fade-in'
            }).then(function(modal) {
                $scope.changeDate = modal;
            });
            $scope.changeDateModalShow = function() {
                $scope.changeDate.show();
            };
            $scope.changeDateModalHide = function() {
                $scope.changeDate.hide();
            };
            $scope.goToCalender = function() {
                $scope.loading = false;
                $scope.changeDate.hide();
            };
            $ionicModal.fromTemplateUrl('templates/shipping/planning/popup/divide.html', {
                scope: $scope,
                animation: 'fade-in'
            }).then(function(modal) {
                $scope.divideDateModal = modal;
            });
            $scope.divideDateModalShow = function() {
                $scope.changeDateModalHide();
                $scope.divideDateModal.show();
            }
            $scope.divideDateModalHide = function() {
                $scope.divideDateModal.hide();
                $scope.changeDateModalShow();
            }
            $ionicModal.fromTemplateUrl('templates/shipping/planning/popup/join.html', {
                scope: $scope,
                animation: 'fade-in'
            }).then(function(modal) {
                $scope.joinDateModal = modal;
            });
            $scope.joinDateModalShow = function() {
                $scope.changeDateModalHide();
                $scope.joinDateModal.show();
            }
            $scope.joinDateModalHide = function() {
                $scope.joinDateModal.hide();
                $scope.changeDateModalShow();
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
                        services.showAlert('Falhou', 'Selecione os componentes para dividir a data de entrega.');
                    }
                    if ($scope.itemPartIdArr.length > 1)
                    {
                        services.showAlert('Falhou', 'Selecione apenas 1 componente para dividir a data de entrega.');
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
                                if ($scope.viewtype == 'form')
                                {
                                    $scope.getOrderData($scope.orderData.id);
                                    $scope.orderData = {};
                                } else
                                {
                                    $scope.loadGrid();
                                    $scope.orderData = {};
                                }
                            }, function() {
                                $scope.loading = false;
                                services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.').then(function() {
                                    if ($scope.viewGrid != true)
                                    {
                                        $scope.divideDateModal.show();
                                    }
                                });
                            });
                        }, function() {
                            $scope.loading = false;
                            services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.').then(function() {
                                if ($scope.viewGrid != true)
                                {
                                    $scope.divideDateModal.show();
                                }
                            });
                        });
                    }, function() {
                        $scope.loading = false;
                        services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.').then(function() {
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
                    services.showAlert('Falhou', 'Selecione pelo menos 2 componentes para unir as datas de entrega.');
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
                        $scope.loading = false;
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
                                            services.showAlert('successo', 'Data da entrega unidas com sucesso.').then(function(response) {
                                                if ($scope.viewtype == 'form')
                                                {
                                                    $scope.getOrderData($scope.orderData.id);
                                                    $scope.orderData = {};
                                                } else
                                                {
                                                    $scope.loadGrid();
                                                    $scope.orderData = {};
                                                }
                                            });
                                        }
                                    }
                                }, function() {
                                    $scope.loading = false;
                                    services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.').then(function(response) {
                                        $scope.joinDateModal.show();
                                    });
                                });
                            }
                            $scope.innerRemovePart();
                        }
                        $scope.outerRemovePart();
                    }, function() {
                        $scope.loading = false;
                        services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.').then(function(response) {
                            $scope.joinDateModal.show();
                        });
                    });
                }
            }

            $scope.updatePart = function(bomId, itemId, partId, deliveryid) {
                $scope.changeDateModalHide();
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
                    $scope.getColorName(data.color.id);
                    $scope.partData.quantity = data.quantity.value;
                    $scope.partData.quantityType = data.quantity.unit.symbol;
                    $scope.partData.width = data.width.value;
                    $scope.getUnitSymbol(data.width.unit.id, 'width');
                    $scope.partData.height = data.height.value;
                    $scope.getUnitSymbol(data.height.unit.id, 'height');
                    $scope.partData.length = data.length.value;
                    $scope.getUnitSymbol(data.length.unit.id, 'length');
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
                        services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
                    });
                }, function(response) {
                    services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
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
                        services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
                    });
                };
                $scope.getColorName = function(colorId) {
                    Restangular.one('common/color', colorId).get().then(function(response) {
                        $scope.partData.color = {};
                        $scope.partData.color.version = response.data.version;
                        $scope.partData.color.code = response.data.code;
                        $scope.partData.color.id = response.data.id;
                        $scope.partData.color.name = response.data.name;
                    }, function(response) {
                        services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
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
                            services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
                        });
                    }, function(response) {
                        $scope.loading = false;
                        services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
                    });
                }
            }

            $scope.goBackParent = function() {
                $scope.changePartModal.hide();
                if ($scope.viewGrid != true)
                {
                    $scope.changeDate.show();
                }
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
            };
            $scope.getCellColor = function(st, weight) {
                if (st < moment().valueOf() || (parseInt(weight) / 1000 > 20))
                {
                    return 'red';
                } else
                {
                    return 'green';
                }
            }
            $scope.checkDay = function(st) {
                return moment(st).format('D');
            }
            $scope.checkMonth = function(st) {
                return moment(st).format('M');
            }
            $scope.checkYear = function(st) {
                return moment(st).format('YYYY');
            }
            $scope.getWeekDay = function(date) {
                return moment(date, "D_M_YYYY").format('dddd');
            }
            $scope.getWeekDayShort = function(date) {
                return moment(date, "D_M_YYYY").locale('pt-br').format('ddd');
            }
            $scope.getDay = function(date) {
                return parseInt(moment(date, "D_M_YYYY").format('D'));
            }
            $scope.getMonth = function(date) {
                return parseInt(moment(date, "D_M_YYYY").format('M'));
            }
            $scope.getYear = function(date) {
                return moment(date, "D_M_YYYY").format('YYYY')
            }
            $scope.makeCalender = function() {
                $scope.days = [];
                $scope.monthDays = [];
                var startMonth = parseInt(moment($scope.tempUnixTS[$scope.tempUnixTS.length - 1]).format('M'));
                var startYear = parseInt(moment($scope.tempUnixTS[$scope.tempUnixTS.length - 1]).format('YYYY'));
                var endMonth = parseInt(moment($scope.tempUnixTS[0]).format('M'));
                var endYear = parseInt(moment($scope.tempUnixTS[0]).format('YYYY'));
                $scope.maxYear = endYear;
                $scope.subCalander = function(stMonth, year) {
                    for (var i = stMonth; i <= 12; i++)
                    {
                        if (year == endYear)
                        {
                            if (i <= endMonth)
                            {
                                var arrTemp = {};
                                arrTemp.name = month[i - 1] + ',' + year;
                                arrTemp.days = range(1, daysInMonth(i, year));
                                createDaysArray(arrTemp.days, i, year);
                                $scope.monthDays.push(arrTemp);
                            }
                        } else
                        {
                            var arrTemp = {};
                            arrTemp.name = month[i - 1] + ',' + year;
                            arrTemp.days = range(1, daysInMonth(i, year));
                            createDaysArray(arrTemp.days, i, year);
                            $scope.monthDays.push(arrTemp);
                        }
                        if (i == 12)
                        {
                            if (year < endYear)
                            {
                                $scope.subCalander(1, year + 1);
                            }
                        }
                    }
                }
                $scope.subCalander(startMonth, startYear);
            };

            function createDaysArray(daysArray, m, y)
            {
                for (var j = 0; j < daysArray.length; j++) {
                    $scope.days.push(daysArray[j] + '_' + m + '_' + y);
                }
            }
            function daysInMonth(month, year) {
                return moment(month + "-" + year, "M-YYYY").daysInMonth();
            }
            function range(a, b, step) {
                var A = [];
                A[0] = a;
                step = step || 1;
                while (a + step <= b) {
                    A[A.length] = a += step;
                }
                return A;
            }
            $scope.loadGrid = function() {
                $scope.loading = true;
                $scope.itemId = [];
                $scope.itemPartIdArr = [];
                $scope.itemPartDeliveryArr = [];
                Restangular.one('shipping/planning/remaining').get({max: 999}).then(function(response) {
                    $scope.loading = false;
                    $scope.orderGridData = response.data;
                    var main = [];
                    for (var i = 0; i < $scope.orderGridData.length; i++)
                    {
                        if ($.inArray(parseInt($scope.checkYear(CommonFun.getFullTimestamp(CommonFun.setDefaultDateFormat($scope.orderGridData[i].delivery, 'YYYY-MM-DD')))), $scope.validYears) !== -1)
                        {
                            $scope.tempUnixTS.push(CommonFun.getFullTimestamp(CommonFun.setDefaultDateFormat($scope.orderGridData[i].delivery, 'YYYY-MM-DD')));
                        }
                        if ($scope.getObjects(main, 'id', $scope.orderGridData[i].id) == '')
                        {
                            tempCom = {};
                            tempCom.id = $scope.orderGridData[i].id;
                            var tempComponetArr = [];
                            tempComponetArr = $scope.getObjects($scope.orderGridData, 'id', $scope.orderGridData[i].id);
                            tempCom.component = [];
                            for (var j = 0; j < tempComponetArr.length; j++)
                            {
                                tempCom.component[j] = {};
                                tempCom.component[j].delivery = CommonFun.getFullTimestamp(CommonFun.setDefaultDateFormat(tempComponetArr[j].delivery, 'YYYY-MM-DD'));
                                tempCom.component[j].remaining = tempComponetArr[j].remaining;
                            }
                            main.push(tempCom);
                        }
                    }
                    $scope.tempUnixTS.sort(function(a, b) {
                        return b - a
                    });
                    $scope.finalArr = [];
                    for (var n = 0; n < $scope.orderList.length; n++)
                    {
                        var tempFinal = {};
                        tempFinal.id = $scope.orderList[n].id;
                        tempFinal.components = [];
                        var tempFetchData = $scope.getObjects(main, 'id', $scope.orderList[n].id);
                        if (tempFetchData != '')
                        {
                            tempFinal.components = tempFetchData[0].component;
                        }
                        $scope.finalArr.push(tempFinal);
                    }
                    $scope.makeCalender();
                    setTimeout(function() {
                        $scope.decorateTable();
                    }, 100);
                }, function(response) {
                    services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
                });
            };
            $scope.changeDeliveryDate = function(bomId) {
                $scope.getOrderData(bomId);
                $scope.changeDateModalShow();
            };
            $scope.getBomData = function(bomId) {
                Restangular.one('shipping/planning', bomId).get().then(function(response) {
                    $scope.orderData = response.data;
                }, function(response) {
                    services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
                });
            };
            $ionicModal.fromTemplateUrl('templates/shipping/planning/popup/view.html', {
                scope: $scope,
                animation: 'fade-in'
            }).then(function(modal) {
                $scope.changeDate = modal;
            });
            $scope.changeDateModalShow = function() {
                $scope.changeDate.show();
            };
            $scope.changeDateModalHide = function() {
                $scope.changeDate.hide();
            };
            $scope.checkForViewDelivery = function(deliveryDate) {
                if ($scope.viewDeliveryDate == CommonFun.getFullTimestamp(CommonFun.setDefaultDateFormat(deliveryDate)))
                {
                    return true;
                } else
                {
                    return false;
                }
            };
            $scope.toggleLeft = function() {
                $ionicSideMenuDelegate.toggleLeft();
            };
            $scope.changeDelDateByDrag = function(orderId, oldDate, newDate) {
                $scope.loading = true;
                $scope.postdata = [];
                $scope.postdata = [CommonFun.getFullTimestamp(CommonFun.setDefaultDateFormat(oldDate, 'D_M_YYYY')), CommonFun.getFullTimestamp(CommonFun.setDefaultDateFormat(newDate, 'D_M_YYYY'))];
                Restangular.all('shipping').one('planning', orderId).all('delivery').customPUT($scope.postdata).then(function(response) {
                    $scope.loading = false;
                    if (response.data.count > 0)
                    {
                        services.showAlert('Successo', 'Data de entrega alterada com sucesso para ' + CommonFun.setDefaultDateFormat(newDate, 'D_M_YYYY')).then(function(res) {
                            totalWeightCal();
                        });
                    } else
                    {
                        services.showAlert('Successo', 'Tente novamente ou entre em contato com o Suporte Técnico.').then(function(res) {
                            $scope.loadGrid();
                        });
                    }

                }, function(response) {
                    $scope.loading = false;
                    services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
                });
            }
        });
function unique_arr(array) {
    return array.filter(function(el, index, arr) {
        return index == arr.indexOf(el);
    });
}