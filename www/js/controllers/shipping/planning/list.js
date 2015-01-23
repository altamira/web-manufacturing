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
            $scope.resetViewDeliveryId = function() {
                $scope.viewDeliveryId = [];
            };
            $scope.makeCalender = function(currentMonth, currentYear) {
//                var currentMonth = parseInt(moment().format('M')) - 2;
//                var currentYear = parseInt(moment().format('YYYY'));
                currentMonth = parseInt(currentMonth) - 1;
                currentYear = parseInt(currentYear);
                $scope.maxYear = currentYear + 1;
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
            var dayCounter = 0;
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
//            console.log('deliveryDate=' + deliveryDate);
//                console.log('$scope.viewDeliveryId=' + $scope.viewDeliveryId);
//                console.log(Object.prototype.toString.call($scope.viewDeliveryId));
//                if (Object.prototype.toString.call($scope.viewDeliveryId) === '[object Array]') {
//                    if (in_array(deliveryDate, $scope.viewDeliveryId))
//                    {
//                        return 1;
//                    }
//                    else
//                    {
//                        return 0;
//                    }
//                }
//                else
//                {
//
//                    if (deliveryDate == $scope.viewDeliveryId)
//                    {
//                        return 1;
//                    }
//                    else
//                    {
//                        return 0;
//                    }
//                }
            $scope.checkForViewDelivery = function(deliveryDate) {
                return $scope.viewDeliveryId.indexOf(parseInt(deliveryDate));
            };

            $scope.loadGrid = function() {
                Restangular.one('shipping/planning').get({checked: false, search: ''}).then(function(response) {
                    $scope.loading = false;
                    $scope.totalBOM = response.data.length;
                    $scope.dataBOM = response.data;
                    var tempUnixTS = '';
                    $scope.planningArr = [];

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
                    $scope.planningArr = [];
                    for (var i = 0; i < $scope.totalBOM; i++)
                    {
                        var temp = {};
                        temp[i] = {};
                        temp[i].id = $scope.dataBOM[i].id;
                        temp[i].component = [];
                        var tempCom = [];
                        var tempCom2 = [];
                        for (var j = 0; j < $scope.dataBOM[i].item.length; j++)
                        {
                            tempCom.push($scope.dataBOM[i].item[j].component);
                        }
                        for (var k = 0; k < tempCom.length; k++)
                        {
                            for (var n = 0; n < tempCom[k].length; n++)
                            {
                                tempCom2.push(tempCom[k][n]);
                            }
                        }
                        for (var p = 0; p < tempCom2.length; p++)
                        {
                            temp[i].component.push(tempCom2[p]);
                        }
                        $scope.planningArr.push(temp[i]);
                    }
                    $scope.tempPlanningArr = [];
                    for (var a = 0; a < $scope.planningArr.length; a++)
                    {
                        for (var b = 0; b < $scope.planningArr[a].component.length; b++)
                        {
                            for (var c = 0; c < $scope.planningArr[a].component[b].delivery.length; c++)
                            {
                                $scope.tempPlanningArr.push({'bomid': $scope.planningArr[a].id, 'weight': $scope.planningArr[a].component[b].weight.value, 'deliveryid': $scope.planningArr[a].component[b].delivery[c].id, 'deliverydate': $scope.planningArr[a].component[b].delivery[c].delivery, 'quantity': $scope.planningArr[a].component[b].delivery[c].quantity.value});
//                                console.log(JSON.stringify($scope.planningArr[a].component[b].delivery[c]));
                            }
                        }
                    }
                    $scope.tempPlanningArrCopy = $scope.tempPlanningArr;
                    $scope.bomPlanningArr = [];
                    $scope.tempbomPlanningArr = [];
                    for (var d = 0; d < $scope.tempPlanningArr.length; d++)
                    {
                        if ($scope.tempbomPlanningArr.indexOf($scope.tempPlanningArr[d].bomid) < 0)
                        {
                            $scope.tempbomPlanningArr.push($scope.tempPlanningArr[d].bomid);
                            var tempBOM = {};
                            tempBOM[d] = {}
                            tempBOM[d].id = $scope.tempPlanningArr[d].bomid;
                            $scope.bomPlanningArr.push(tempBOM[d]);
                        }
                    }
                    for (var e = 0; e < $scope.bomPlanningArr.length; e++)
                    {
                        $scope.bomPlanningArr[e].delivery = [];
                        for (var f = 0; f < $scope.tempPlanningArr.length; f++)
                        {
                            if ($scope.bomPlanningArr[e].id == $scope.tempPlanningArr[f].bomid)
                            {
                                $scope.bomPlanningArr[e].delivery.push({'deliveryid': $scope.tempPlanningArr[f].deliveryid, 'date': $scope.tempPlanningArr[f].deliverydate, 'totalweight': ($scope.tempPlanningArr[f].weight * $scope.tempPlanningArr[f].quantity)});
                            }
                        }
                    }
//                    console.log(JSON.stringify($scope.bomPlanningArr));
                    $scope.bomDatesArr = [];
                    for (var g = 0; g < $scope.bomPlanningArr.length; g++)
                    {
                        var tempBomDelDates = {};
                        tempBomDelDates[g] = {};
                        tempBomDelDates[g].id = $scope.bomPlanningArr[g].id;
                        tempBomDelDates[g].components = [];
                        for (var h = 0; h < $scope.bomPlanningArr[g].delivery.length; h++)
                        {
                            var tempDateArr = [];
                            var tempDeliveryId = '';
                            var tempDeliveryDate = $scope.bomPlanningArr[g].delivery[h].date;
                            var tempTotalweight = 0;
                            tempDateArr = $scope.getObjects($scope.bomPlanningArr[g].delivery, 'date', $scope.bomPlanningArr[g].delivery[h].date);
                            if (tempDateArr.length > 0)
                            {
                                for (var i = 0; i < tempDateArr.length; i++)
                                {
                                    if (tempDeliveryId == '')
                                    {
                                        tempDeliveryId = tempDateArr[i].deliveryid;
                                    }
                                    else
                                    {
                                        tempDeliveryId = tempDeliveryId + ',' + tempDateArr[i].deliveryid;
                                    }
                                    if (tempTotalweight == 0)
                                    {
                                        tempTotalweight = tempDateArr[i].totalweight;
                                    }
                                    else
                                    {
                                        tempTotalweight = tempTotalweight + tempDateArr[i].totalweight;
                                    }

                                }
                            }
//                            console.log(JSON.stringify(tempDateArr));
//                            console.log(JSON.stringify(tempDeliveryId));
//                            console.log(JSON.stringify(tempTotalweight));
//                            tempBomDelDates[g].components[h] = [];
                            if ($scope.getObjects(tempBomDelDates[g].components, 'deliverydate', tempDeliveryDate).length < 1)
                            {
                                tempBomDelDates[g].components.push({'deliveryid': tempDeliveryId, 'deliverydate': tempDeliveryDate, 'deliveryweight': tempTotalweight});
                            }

                        }
                        $scope.bomDatesArr.push(tempBomDelDates[g]);
                    }
                    $scope.finalArr = [];
                    for (var k = 0; k < $scope.dataBOM.length; k++)
                    {
                        var tempFinalArr = {};
                        tempFinalArr[k] = {};
                        tempFinalArr[k].id = $scope.dataBOM[k].id;
                        tempFinalArr[k].type = $scope.dataBOM[k].type;
                        tempFinalArr[k].number = $scope.dataBOM[k].number;
                        tempFinalArr[k].customer = $scope.dataBOM[k].customer;
                        tempFinalArr[k].representative = $scope.dataBOM[k].representative;
                        tempFinalArr[k].created = $scope.dataBOM[k].created;
                        tempFinalArr[k].delivery = $scope.dataBOM[k].delivery;
                        tempFinalArr[k].quotation = $scope.dataBOM[k].quotation;
                        tempFinalArr[k].comment = $scope.dataBOM[k].comment;
                        tempFinalArr[k].finish = $scope.dataBOM[k].finish;
                        tempFinalArr[k].project = $scope.dataBOM[k].project;
                        tempFinalArr[k].checked = $scope.dataBOM[k].checked;
                        tempFinalArr[k].components = [];
                        for (var l = 0; l < $scope.bomDatesArr.length; l++)
                        {
                            if ($scope.dataBOM[k].id == $scope.bomDatesArr[l]['id'])
                            {
                                tempFinalArr[k].components = $scope.bomDatesArr[l].components;
                            }
                        }

                        $scope.finalArr.push(tempFinalArr[k]);
                    }
                    $scope.makeCalender($scope.checkMonth(tempUnixTS), $scope.checkYear(tempUnixTS));
                }, function(response) {
                    services.showAlert('Falhou', 'Please try again');
                });
            };
            $scope.loadGrid();
            $scope.getData = function(newDate, bom) {
                console.log(JSON.stringify($scope.viewDeliveryId));
                services.showAlert('Success', 'BOM ' + bom + ' delivery date changed to ' + moment(newDate, "D_M_YYYY").format('D/M/YYYY')).then(function(res) {
//                    changeDateDataTab(newDate, bom);
                    totalWeightCal();
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
                                    location.reload();
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
                $scope.itemId = unique_arr($scope.itemId);
                $scope.itemPartIdArr = unique_arr($scope.itemPartIdArr);
                $scope.itemPartDeliveryArr = unique_arr($scope.itemPartDeliveryArr);
                if ($scope.itemPartDeliveryArr.length > 1)
                {
                    var tempVar = $scope.getObjects($scope.bomData.items, 'id', $scope.itemId);
                    //                    console.log(JSON.stringify(tempVar));
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
                    $scope.joinData.chnDateDesc = $scope.joinData.chnDateParts[0].material.description;
                    $scope.joinData.chnDateTotalQuantity = chnDateTotalQuantity;
                    $scope.joinData.chnDateUnit = chnDateUnit;
                    $scope.joinData.pesoTotal = pesoTotal;
                    $scope.joinData.chnDateItem = {};
                    $scope.joinData.chnDateItem.id = tempVar[0].id;
                    $scope.joinData.chnDateItem.version = tempVar[0].version;
                    $scope.joinData.chnDateItem.item = tempVar[0].item;
                    $scope.joinData.chnDateItem.description = tempVar[0].description;
                    console.log(JSON.stringify($scope.joinData.chnDateParts));
                    $scope.joinDateModalShow();
                }
                else {
                    services.showAlert('Falhou', 'Please select atleast 2 components to join delivery date');
                }
            };

            $scope.submitJoinComponent = function(isValid) {
                if (isValid) {
                    $scope.joinDateModal.hide();
                    $scope.loading = true;
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
                        //                        services.showAlert('Sucess', 'Component joined sucessfully');
                        var i;
                        for (i = 0; i < $scope.joinData.chnDateParts.length; i++)
                        {
                            for (var j = 0; j < $scope.joinData.chnDateParts[i].deliveryArr.length; j++)
                            {
                                Restangular.one('shipping/planning', $scope.bomData.id)
                                        .one('item', $scope.joinData.chnDateItem.id)
                                        .one('component', $scope.joinData.chnDateParts[i].id)
                                        .one('delivery', $scope.joinData.chnDateParts[i].delivery[j].id).remove().then(function(response) {
                                }, function() {
                                    $scope.loading = false;
                                    services.showAlert('Falhou', 'Please try again').then(function(response) {
                                        $scope.joinDateModal.show();
                                    });
                                });
                            }
                            if (i == ($scope.joinData.chnDateParts.length - 1))
                            {
                                $scope.loading = false;
                                if ($scope.viewGrid == true)
                                {
                                    $scope.getShippingDetail($scope.bomData.id);
                                    $scope.bomData = {};
                                } else
                                {
                                    location.reload();
                                    $scope.bomData = {};
                                }
                            }
                        }
                    }, function() {
                        $scope.loading = false;
                        services.showAlert('Falhou', 'Please try again').then(function(response) {
                            $scope.joinDateModal.show();
                        });
                    });
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
function randomNumbers(total) {
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
function unique_arr(array) {
    return array.filter(function(el, index, arr) {
        return index == arr.indexOf(el);
    });
}
function array_unique(inputArr) {
    //  discuss at: http://phpjs.org/functions/array_unique/
    // original by: Carlos R. L. Rodrigues (http://www.jsfromhell.com)
    //    input by: duncan
    //    input by: Brett Zamir (http://brett-zamir.me)
    // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // bugfixed by: Nate
    // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // bugfixed by: Brett Zamir (http://brett-zamir.me)
    // improved by: Michael Grier
    //        note: The second argument, sort_flags is not implemented;
    //        note: also should be sorted (asort?) first according to docs
    //   example 1: array_unique(['Kevin','Kevin','van','Zonneveld','Kevin']);
    //   returns 1: {0: 'Kevin', 2: 'van', 3: 'Zonneveld'}
    //   example 2: array_unique({'a': 'green', 0: 'red', 'b': 'green', 1: 'blue', 2: 'red'});
    //   returns 2: {a: 'green', 0: 'red', 1: 'blue'}

    var key = '',
            tmp_arr2 = {},
            val = '';

    var __array_search = function(needle, haystack) {
        var fkey = '';
        for (fkey in haystack) {
            if (haystack.hasOwnProperty(fkey)) {
                if ((haystack[fkey] + '') === (needle + '')) {
                    return fkey;
                }
            }
        }
        return false;
    };

    for (key in inputArr) {
        if (inputArr.hasOwnProperty(key)) {
            val = inputArr[key];
            if (false === __array_search(val, tmp_arr2)) {
                tmp_arr2[key] = val;
            }
        }
    }

    return tmp_arr2;
}
function in_array(needle, haystack, argStrict) {
    //  discuss at: http://phpjs.org/functions/in_array/
    // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: vlado houba
    // improved by: Jonas Sciangula Street (Joni2Back)
    //    input by: Billy
    // bugfixed by: Brett Zamir (http://brett-zamir.me)
    //   example 1: in_array('van', ['Kevin', 'van', 'Zonneveld']);
    //   returns 1: true
    //   example 2: in_array('vlado', {0: 'Kevin', vlado: 'van', 1: 'Zonneveld'});
    //   returns 2: false
    //   example 3: in_array(1, ['1', '2', '3']);
    //   example 3: in_array(1, ['1', '2', '3'], false);
    //   returns 3: true
    //   returns 3: true
    //   example 4: in_array(1, ['1', '2', '3'], true);
    //   returns 4: false

    var key = '',
            strict = !!argStrict;

    //we prevent the double check (strict && arr[key] === ndl) || (!strict && arr[key] == ndl)
    //in just one for, in order to improve the performance
    //deciding wich type of comparation will do before walk array
    if (strict) {
        for (key in haystack) {
            if (haystack[key] === needle) {
                return true;
            }
        }
    } else {
        for (key in haystack) {
            if (haystack[key] == needle) {
                return true;
            }
        }
    }

    return false;
}
