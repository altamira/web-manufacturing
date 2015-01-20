altamiraAppControllers.controller('ShippingPlanningListCtrl',
        function($scope, $location, $route, Restangular, services, $ionicModal) {
            $scope.loading = true;
            $scope.days = [];
            $scope.monthDays = [];
            $scope.semanal = true;
            $scope.showdate = true;
            $scope.showdate_1 = true;
            $scope.showdate_2 = true;
            $scope.itemId = [];
            $scope.itemPartIdArr = [];
            $scope.itemPartDeliveryArr = [];
            $scope.bomData = {};
            $scope.joinData = {};
            $scope.divideData = {};
            $scope.divideData.component = {};

            var pt = moment().locale('pt-br');
            $scope.today = pt.format('LL');
            moment.locale('pt-br');
            var month = moment.months();
            moment.locale('en');
            $scope.makeCalender = function(currentMonth, currentYear) {
//                var currentMonth = parseInt(moment().format('M')) - 2;
//                var currentYear = parseInt(moment().format('YYYY'));
                currentMonth = parseInt(currentMonth) - 1;
                currentYear = parseInt(currentYear);
                if (currentMonth < 0)
                {
                    currentMonth = 11;
                    currentYear = currentYear - 1;
                }
                for (var i = 0; i <= 11; i++)
                {
                    var temp = currentMonth + i;
                    if (temp > 11)
                    {
                        temp = temp - 12;
                    }
                    var arrTemp = {};

                    if ((currentMonth + i) > 11)
                    {
                        arrTemp.name = month[temp] + ',' + (currentYear + 1);
                        arrTemp.days = range(1, daysInMonth(temp + 1, currentYear + 1));
                        createDaysArray(arrTemp.days, temp + 1, currentYear + 1);
                    }
                    else
                    {
                        arrTemp.name = month[temp] + ',' + currentYear;
                        arrTemp.days = range(1, daysInMonth(temp + 1, currentYear));
                        createDaysArray(arrTemp.days, temp + 1, currentYear);
                    }
                    $scope.monthDays.push(arrTemp);
                }
            };
            $scope.addDate = function() {
                $scope.postdata = {};
                $scope.postdata.id = 0;
                $scope.postdata.delivery = moment('23/03/2015', 'DD/MM/YYYY').unix();
                $scope.postdata.quantity = {};
                $scope.postdata.quantity.value = 50;
                $scope.postdata.quantity.unit = {};
                $scope.postdata.quantity.unit.id = 215;
                $scope.postdata.quantity.unit.name = "quilograma";
                $scope.postdata.quantity.unit.symbol = "kg";
                Restangular.one('shipping/planning', 60051).one('item', 60052).one('component', 60054).all('delivery').post($scope.postdata).then(function(response) {
                }, function() {
                    services.showAlert('Falhou', 'Please try again');
                });
            };
//            $scope.addDate();

            function createDaysArray(daysArray, m, y)
            {
                for (var j = 0; j < daysArray.length; j++) {
                    $scope.days.push(daysArray[j] + '_' + m + '_' + y);
                }
            }
            function daysInMonth(month, year) {
                return moment(month + "-" + year, "MM-YYYY").daysInMonth();
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
            $scope.checkDay = function(st) {
                return moment.unix(st).format('D');
            }
            $scope.checkMonth = function(st) {
                return moment.unix(st).format('M');
            }
            $scope.checkYear = function(st) {
                return moment.unix(st).format('YYYY');
            }
            $scope.getWeekDay = function(date) {

                return moment(date, "D_M_YYYY").format('dddd');
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
            $scope.getFullDate = function(date) {
                return moment.unix(date).format('D/M/YYYY');
            }

            Restangular.one('shipping/planning').get({checked: false, search: ''}).then(function(response) {
                $scope.loading = false;
                $scope.totalBOM = response.data.length;
                $scope.dataBOM = response.data;
                var tempUnixTS = '';

                for (var i = 0; i < $scope.totalBOM; i++)
                {
                    if (i == 0)
                    {
                        tempUnixTS = parseInt($scope.dataBOM[i].delivery);
                    }
                    else
                    {
                        if (tempUnixTS > parseInt($scope.dataBOM[i].delivery))
                        {
                            tempUnixTS = parseInt($scope.dataBOM[i].delivery);
                        }
                    }
                }
                $scope.makeCalender($scope.checkMonth(tempUnixTS), $scope.checkYear(tempUnixTS));

            }, function(response) {
                services.showAlert('Falhou', 'Please try again');
            });
            $scope.getData = function(newDate, bom) {
                services.showAlert('Success', 'BOM ' + bom + ' delivery date changed to ' + moment(newDate, "D_M_YYYY").format('D/M/YYYY')).then(function(res) {
                    changeDateDataTab(newDate, bom);
                });
            }
            $scope.goBack = function() {
                $location.path('manufacturing/bom');
            };
            Restangular.one('common/color').get({max: 0}).then(function(response) {
                $scope.colorBox = response.data;
            }, function(response) {
                services.showAlert('Falhou', 'Please try again');
            });
            Restangular.one('measurement/unit').get({magnitude: 'dimencional'}).then(function(response) {
                $scope.unitLengthBox = response.data;
            }, function(response) {
                services.showAlert('Falhou', 'Please try again');
            });
            Restangular.one('measurement/unit').get({magnitude: 'peso'}).then(function(response) {
                $scope.unitWeightBox = response.data;
            }, function(response) {
                services.showAlert('Falhou', 'Please try again');
            });
            Restangular.one('measurement/unit').get({magnitude: 'unidade'}).then(function(response) {
                $scope.unitQuantityBox = response.data;
            }, function(response) {
                services.showAlert('Falhou', 'Please try again');
            });
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
                $scope.changeDate.hide();
            };
            $scope.getBomData = function(bomId) {
                Restangular.one('shipping/planning', bomId).get().then(function(response) {
                    var data = response.data;
                    if (data != '')
                    {
                        $scope.bomData.id = data.id;
                        $scope.bomData.version = data.version;
                        $scope.bomData.number = data.number;
                        $scope.bomData.project = data.project;
                        $scope.bomData.customer = data.customer;
                        $scope.bomData.representative = data.representative;
                        $scope.bomData.finish = data.finish;
                        $scope.bomData.quotation = data.quotation;
                        $scope.bomData.created = moment.unix(data.created).format('DD/MM/YYYY');
                        $scope.bomData.delivery = moment.unix(data.delivery).format('DD/MM/YYYY');
                        $scope.bomData.items = data.item;
                    }
                }, function(response) {
                    services.showAlert('Falhou', 'Please try again');
                });
            };
            $scope.changeDeliveryDate = function(bomId) {
                tempMaterialId = '';
                tempItemId = '';
                $scope.itemId = [];
                $scope.itemPartIdArr = [];
                $scope.itemPartDeliveryArr = [];
                $scope.getBomData(bomId);
                $scope.changeDateModalShow();
            };

            $ionicModal.fromTemplateUrl('templates/shipping/planning/popup/part.html', {
                scope: $scope,
                animation: 'fade-in'
            }).then(function(modal) {
                $scope.changePartModal = modal;
//                $scope.loading = false;
//                $scope.changePartModal.show();
            });
            $scope.changePartModalHide = function() {
                $scope.changePartModal.hide();
            };
            $scope.changePartModalShow = function() {
                $scope.changePartModal.show();
            };
            $scope.updatePart = function(bomId, itemId, partId) {
                $scope.changeDateModalHide();
                $scope.loading = true;
                $scope.partData = {};

                Restangular.one('shipping/planning', bomId).one('item', itemId).one('component', partId).get().then(function(response) {
                    $scope.changePartModalShow();

                    var data = response.data;
                    $scope.partData.version = data.version;
                    $scope.partData.code = data.material.code;
                    $scope.partData.description = data.material.description;
                    $scope.getColorName(data.color.id);

                    $scope.partData.quantity = data.quantity.value;
                    $scope.partData.quantityType = data.quantity.unit.id;

                    $scope.partData.width = data.width.value;
                    $scope.getUnitSymbol(data.width.unit.id, 'width');

                    $scope.partData.height = data.height.value;
                    $scope.getUnitSymbol(data.height.unit.id, 'height');

                    $scope.partData.length = data.length.value;
                    $scope.getUnitSymbol(data.length.unit.id, 'length');

                    $scope.partData.weight = data.weight.value;
                    $scope.getUnitSymbol(data.weight.unit.id, 'weight');

                }, function(response) {
                    services.showAlert('Falhou', 'Please try again');
                });
                $scope.getUnitSymbol = function(unitId, unitType) {
                    Restangular.one('measurement/unit', unitId).get().then(function(response) {
                        var symbol = response.data.symbol;
                        if (unitType == "width")
                        {
                            $scope.partData.widthType = symbol;
                        } else if (unitType == "height") {
                            $scope.partData.heightType = symbol;
                        } else if (unitType == "length") {
                            $scope.partData.lengthType = symbol;
                        } else if (unitType == "weight") {
                            $scope.partData.weightType = symbol;
                        }
                    }, function(response) {
                        services.showAlert('Falhou', 'Please try again');
                    });
                };
                $scope.getColorName = function(colorId) {
                    Restangular.one('common/color', colorId).get().then(function(response) {
                        $scope.partData.color = response.data.name;
                    }, function(response) {
                        services.showAlert('Falhou', 'Please try again');
                    });
                };
            };
            $scope.goBackParent = function() {
                $scope.changePartModal.hide();
                $scope.changeDate.show();
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

            $scope.divideDate = function() {
                $scope.divideData.delivery1 = '';
                $scope.divideData.delivery2 = '';
                $scope.divideData.quantity1 = '';
                $scope.divideData.quantity2 = '';
                if ($scope.itemPartIdArr.length == 1)
                {
                    var tempVar = $scope.getObjects($scope.bomData.items, 'id', $scope.itemId);
                    var tempParts = [];
                    var part;
                    var partDelivery;
                    var chnDateTotalQuantity = 0;
                    var pesoTotal = 0;
//                    for (var i = 0; i < $scope.itemPartIdArr.length; i++)
//                    {
//                        part = $scope.getObjects(tempVar[0].component, 'id', $scope.itemPartIdArr[i]);
//                        console.log(JSON.stringify(part));
//                        tempParts.push(part[0]);
//                        chnDateTotalQuantity = chnDateTotalQuantity + parseInt(part[0].quantity.value);
//                        pesoTotal = pesoTotal + (parseInt(part[0].quantity.value) * parseInt(part[0].weight.value));
//                    }

                    part = $scope.getObjects(tempVar[0].component, 'id', $scope.itemPartIdArr[0]);
                    $scope.divideData.chnDateCode = part[0].material.code;
                    $scope.divideData.chnDateDesc = part[0].material.description;
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
//                    console.log(JSON.stringify($scope.divideData.chnDateParts));
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
            $scope.addDate = function() {
                $scope.postdata1 = {};
                $scope.postdata1.id = 0;
                $scope.postdata1.delivery = moment('03/06/2015', 'DD/MM/YYYY').unix();
                $scope.postdata1.quantity = {};
                $scope.postdata1.quantity.value = 250;
                $scope.postdata1.quantity.unit = {};
                $scope.postdata1.quantity.unit.id = 215;
                $scope.postdata1.quantity.unit.name = "quilograma";
                $scope.postdata1.quantity.unit.symbol = "kg";
                console.log(JSON.stringify($scope.postdata1));
                Restangular.one('shipping/planning', 60057).one('item', 60058).one('component', 60071).all('delivery').post($scope.postdata1).then(function(response) {
                    services.showAlert('Sucess', 'Component divided sucessfully');
                }, function() {
                    services.showAlert('Falhou', 'Please try again');
                });
            };
//            $scope.addDate();
            $scope.submitDivideComponent = function(isValid) {
                if (isValid) {
                    $scope.divideDateModal.hide();
                    $scope.loading = true;
                    $scope.postdata1 = {};
                    $scope.postdata1.id = 0;
                    $scope.postdata1.delivery = moment($scope.divideData.delivery1, 'DD/MM/YYYY').unix();
                    $scope.postdata1.quantity = {};
                    $scope.postdata1.quantity.value = $scope.divideData.quantity1;
                    $scope.postdata1.quantity.unit = {};
                    $scope.postdata1.quantity.unit.id = $scope.divideData.chnDateParts[0].quantity.unit.id;
                    $scope.postdata1.quantity.unit.name = $scope.divideData.chnDateParts[0].quantity.unit.name;
                    $scope.postdata1.quantity.unit.symbol = $scope.divideData.chnDateParts[0].quantity.unit.symbol;
                    Restangular.one('shipping/planning', $scope.bomData.id)
                            .one('item', $scope.itemId)
                            .one('component', $scope.itemPartIdArr[0])
                            .all('delivery').post($scope.postdata1).then(function(response) {

                        $scope.postdata2 = {};
                        $scope.postdata2.id = 0;
                        $scope.postdata2.delivery = moment($scope.divideData.delivery2, 'DD/MM/YYYY').unix();
                        $scope.postdata2.quantity = {};
                        $scope.postdata2.quantity.value = $scope.divideData.quantity2;
                        $scope.postdata2.quantity.unit = {};
                        $scope.postdata2.quantity.unit.id = $scope.divideData.chnDateParts[0].quantity.unit.id;
                        $scope.postdata2.quantity.unit.name = $scope.divideData.chnDateParts[0].quantity.unit.name;
                        $scope.postdata2.quantity.unit.symbol = $scope.divideData.chnDateParts[0].quantity.unit.symbol;
                        Restangular.one('shipping/planning', $scope.bomData.id)
                                .one('item', $scope.itemId)
                                .one('component', $scope.itemPartIdArr[0])
                                .all('delivery').post($scope.postdata2).then(function(response) {

                            Restangular.one('shipping/planning', $scope.bomData.id)
                                    .one('item', $scope.itemId)
                                    .one('component', $scope.itemPartIdArr[0])
                                    .one('delivery', $scope.itemPartDeliveryArr[0]).remove().then(function(response) {
                                $scope.loading = false;

                                if ($scope.viewGrid == true)
                                {
                                    $scope.getShippingDetail($scope.bomData.id);
                                    $scope.bomData = {};
                                } else
                                {
                                    $scope.changeDeliveryDate($scope.bomData.id);
                                    $scope.bomData = {};
                                }
                            }, function() {
                                $scope.loading = false;
                                services.showAlert('Falhou', 'Please try again').then(function() {
                                    if ($scope.viewGrid != true)
                                    {
                                        $scope.divideDateModal.show();
                                    }
                                });
                            });
                        }, function() {
                            $scope.loading = false;
                            services.showAlert('Falhou', 'Please try again').then(function() {
                                if ($scope.viewGrid != true)
                                {
                                    $scope.divideDateModal.show();
                                }
                            });
                        });
                    }, function() {
                        $scope.loading = false;
                        services.showAlert('Falhou', 'Please try again').then(function() {
                            if ($scope.viewGrid != true)
                            {
                                $scope.divideDateModal.show();
                            }
                        });
                    });


                }
            }
            $ionicModal.fromTemplateUrl('templates/shipping/planning/popup/component.html', {
                scope: $scope,
                animation: 'fade-in'
            }).then(function(modal) {
                $scope.createComponentModal = modal;

            });
            $scope.createComponentModalShow = function() {
                $scope.divideDateModalHide();
                $scope.divideData.component.color = 20;
                $scope.divideData.component.lengthType = 104;
                $scope.divideData.component.heightType = 104;
                $scope.divideData.component.widthType = 104;
                $scope.divideData.component.quantityType = 108;
                $scope.divideData.component.weightType = 106;
                $scope.createComponentModal.show();
            }
            $scope.createComponentModalHide = function() {
                $scope.createComponentModal.hide();
                $scope.divideDateModalShow();
            }
            $scope.createComponent = function() {
                $scope.createComponentModalShow();
            };

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
            $scope.joinDate = function() {
                if ($scope.itemPartIdArr.length > 1)
                {
                    var tempVar = $scope.getObjects($scope.bomData.items, 'id', $scope.itemId);
                    var tempParts = [];
                    var part;
                    var chnDateTotalQuantity = 0;
                    var pesoTotal = 0;
                    var chnDateUnit = '';
                    console.log(JSON.stringify($scope.itemPartIdArr));
                    for (var i = 0; i < $scope.itemPartIdArr.length; i++)
                    {
                        part = $scope.getObjects(tempVar[0].component, 'id', $scope.itemPartIdArr[i]);
                        tempParts.push(part[0]);
                        chnDateTotalQuantity = chnDateTotalQuantity + parseInt(part[0].quantity.value);
                        console.log(JSON.stringify(chnDateTotalQuantity));
                        pesoTotal = pesoTotal + (parseInt(part[0].quantity.value) * parseInt(part[0].weight.value));
                        console.log(JSON.stringify(pesoTotal));
                        chnDateUnit = part[0].weight.unit;
                    }
                    $scope.joinData.chnDateCode = tempParts[0].material.code;
                    $scope.joinData.chnDateDesc = tempParts[0].material.description;
                    $scope.joinData.chnDateTotalQuantity = chnDateTotalQuantity;
                    $scope.joinData.chnDateUnit = chnDateUnit;
                    $scope.joinData.pesoTotal = pesoTotal;
                    $scope.joinData.chnDateItem = {};
                    $scope.joinData.chnDateItem.id = tempVar[0].id;
                    $scope.joinData.chnDateItem.version = tempVar[0].version;
                    $scope.joinData.chnDateItem.item = tempVar[0].item;
                    $scope.joinData.chnDateItem.description = tempVar[0].description;
                    $scope.joinData.chnDateParts = tempParts;
                    console.log(JSON.stringify($scope.joinData.chnDateParts));
                    $scope.joinDateModalShow();
                }
                else {
                    services.showAlert('Falhou', 'Please select atleast 2 components to join delivery date');
                }
            };

            $scope.submitJoinComponent = function(isValid) {
                if (isValid) {
                    $scope.postdata = {};
                    $scope.postdata.id = 0;
                    $scope.postdata.delivery = moment($scope.joinData.delivery, 'DD/MM/YYYY').unix();
                    $scope.postdata.quantity = {};
                    $scope.postdata.quantity.value = $scope.joinData.chnDateTotalQuantity;
                    $scope.postdata.quantity.unit = {};
                    $scope.postdata.quantity.unit.id = $scope.joinData.chnDateUnit.id;
                    $scope.postdata.quantity.unit.name = $scope.joinData.chnDateUnit.name;
                    $scope.postdata.quantity.unit.symbol = $scope.joinData.chnDateUnit.symbol;
                    Restangular.one('shipping/planning', $scope.bomData.id)
                            .one('item', $scope.joinData.chnDateItem.id)
                            .one('component', $scope.joinData.chnDateParts[0].id)
                            .all('delivery').post($scope.postdata).then(function(response) {
                        $scope.loading = false;
                        services.showAlert('Sucess', 'Component joined sucessfully');
                    }, function() {
                        $scope.loading = false;
                        services.showAlert('Falhou', 'Please try again');
                    });
                    var counter = 1;
                    for (var i = 0; i < $scope.joinData.chnDateParts[0].delivery.length; i++)
                    {
                        Restangular.one('shipping/planning', $scope.bomData.id)
                                .one('item', $scope.joinData.chnDateItem.id)
                                .one('component', $scope.joinData.chnDateParts[0].id)
                                .one('delivery', $scope.joinData.chnDateParts[0].delivery[i].id).remove().then(function(response) {
                            console.log(JSON.stringify(counter))
                            if (counter == $scope.joinData.chnDateParts[0].delivery.length)
                            {
                                services.showAlert('success', 'Component joined successfully').then(function(res) {
                                    $scope.joinDateModal.remove();
                                    $scope.changeDate.remove();
                                    location.reload();
                                });
                            }
                            counter++;
                        }, function() {
                            $scope.loading = false;
                            services.showAlert('Falhou', 'Please try again');
                        });
                    }
                }
            };
            $scope.viewGrid = false;
            $scope.gridView = function() {
                $scope.viewGrid = true;
                $('#grid-view').show();
                $('#gridShowBtn').addClass('month');
                $('#list-view').hide();
                $('#listShowBtn').removeClass('month');
            };
            $scope.listView = function() {
                $scope.viewGrid = false;
                $('#list-view').show();
                $('#listShowBtn').addClass('month');
                $('#grid-view').hide();
                $('#gridShowBtn').removeClass('month');
            };
            $scope.getShippingDetail = function(shippingId) {
                $scope.activeShipping = {};
                tempMaterialId = '';
                tempItemId = '';
                $scope.itemId = [];
                $scope.itemPartIdArr = [];
                $scope.itemPartDeliveryArr = [];
                if ($scope.viewGrid == true)
                {
                    $scope.loading = true;
                    Restangular.one('shipping/planning', shippingId).get().then(function(response) {
                        console.log(JSON.stringify(response.data));
                        $scope.activeShipping = response.data;
                        var data = response.data;
                        if (data != '')
                        {
                            $scope.bomData.id = data.id;
                            $scope.bomData.version = data.version;
                            $scope.bomData.number = data.number;
                            $scope.bomData.project = data.project;
                            $scope.bomData.customer = data.customer;
                            $scope.bomData.representative = data.representative;
                            $scope.bomData.finish = data.finish;
                            $scope.bomData.quotation = data.quotation;
                            $scope.bomData.created = moment.unix(data.created).format('DD/MM/YYYY');
                            $scope.bomData.delivery = moment.unix(data.delivery).format('DD/MM/YYYY');
                            $scope.bomData.items = data.item;
                        }
                        $scope.loading = false;
                    }, function() {
                        $scope.loading = false;
                        services.showAlert('Falhou', 'Please try again');
                    });
                }
            };

            $scope.change = function() {
                $scope.divideData.quantity2 = parseInt($scope.divideData.chnDateTotalQuantity) - parseInt($scope.divideData.quantity1);
            }
        });
function randomNumbers(total)
{
    var arr = []
    while (arr.length < total) {
        var randomnumber = Math.ceil(Math.random() * 1000)
        var found = false;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == randomnumber) {
                found = true;
                break
            }
        }
        if (!found)
            arr[arr.length] = randomnumber;
    }
    return arr;
}
function changeDateDataTab(newDate, bom)
{
    $('#' + bom + ' td:last').html(moment(newDate, "D_M_YYYY").format('D/M/YYYY'));
}