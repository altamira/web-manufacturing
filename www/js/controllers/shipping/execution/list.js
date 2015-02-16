altamiraAppControllers.controller('ShippingExecutionCtrl',
        function($scope, $location, $route, Restangular, services, $ionicModal, CommonFun) {
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
            $scope.tempUnixTS = [];
            $scope.activeShipping = '';
            $scope.viewWeekly = false;
            $scope.currentYear = moment().format('YYYY');
            $scope.validYears = [$scope.currentYear - 1, $scope.currentYear, $scope.currentYear + 1];
            $scope.weeklyView = function() {
                $scope.viewWeekly = true;
                $('#weeklyShowBtn').addClass('month');
                $('#monthlyShowBtn').removeClass('month');
            };
            $scope.monthlyView = function() {
                $scope.viewWeekly = false;
                $('#weeklyShowBtn').removeClass('month');
                $('#monthlyShowBtn').addClass('month');
            };
            $scope.viewGrid = false;
            $scope.gridView = function() {
                $scope.viewGrid = true;
                $('#grid-view').show();
                $('#gridShowBtn').addClass('month');
                $('#list-view').hide();
                $('#listShowBtn').removeClass('month');
                if ($scope.activeShipping == '')
                {
                    $scope.getShippingDetail(parseInt($('.dataTable tr:nth-child(3) td:nth-child(2)').attr('id')));
                }
            };
            $scope.listView = function() {
                $scope.viewGrid = false;
                $('#list-view').show();
                $('#listShowBtn').addClass('month');
                $('#grid-view').hide();
                $('#gridShowBtn').removeClass('month');
            };
            $scope.bomData = {};
            $scope.joinData = {};
            $scope.divideData = {};
            $scope.divideData.component = {};

            var pt = moment().locale('pt-br');
            $scope.today = pt.format('dddd, LL');
            moment.locale('pt-br');
            var month = moment.months();
            moment.locale('en');
            $scope.resetViewDeliveryId = function() {
                $scope.viewDeliveryId = [];
            };
            $scope.makeCalender = function() {
                var startMonth = moment($scope.tempUnixTS[$scope.tempUnixTS.length - 1]).format('M');
                var startYear = moment($scope.tempUnixTS[$scope.tempUnixTS.length - 1]).format('YYYY');
                var endMonth = moment($scope.tempUnixTS[0]).format('M');
                var endYear = moment($scope.tempUnixTS[0]).format('YYYY');
                startMonth = parseInt(startMonth) - 1;
                startYear = parseInt(startYear);
                $scope.maxYear = endYear + 1;
                if (startMonth < 0)
                {
                    startMonth = 11;
                    startYear = startYear - 1;
                }
                for (var i = 0; i <= 11; i++)
                {
                    var temp = startMonth + i;
                    if (temp > 11)
                    {
                        if (startYear + 1 == endYear)
                        {
                            var arrTemp = {};
                            temp = temp - 12;
                            arrTemp.name = month[temp] + ',' + (startYear + 1);
                            arrTemp.days = range(1, daysInMonth(temp + 1, startYear + 1));
                            createDaysArray(arrTemp.days, temp + 1, startYear + 1);
                            $scope.monthDays.push(arrTemp);
                        }
                    } else
                    {
                        if (temp < endMonth)
                        {
                            var arrTemp = {};
                            arrTemp.name = month[temp] + ',' + startYear;
                            arrTemp.days = range(1, daysInMonth(temp + 1, startYear));
                            createDaysArray(arrTemp.days, temp + 1, startYear);
                            $scope.monthDays.push(arrTemp);
                        }
                    }
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
            $scope.checkForViewDelivery = function(deliveryId) {
                if ($scope.viewDeliveryId != undefined)
                {
                    return $scope.viewDeliveryId.indexOf(parseInt(deliveryId));
                }
            };

            $scope.loadGrid = function() {
                Restangular.one('shipping/execution').get({max: 999}).then(function(response) {
                    $scope.loading = false;
                    $scope.totalBOM = response.data.length;
                    $scope.dataBOM = response.data;
                    var tempUnixTS = '';
                    $scope.planningArr = [];

                    for (var i = 0; i < $scope.totalBOM; i++)
                    {
                        for (var j = 0; j < $scope.dataBOM[i].item.length; j++)
                        {
                            for (var k = 0; k < $scope.dataBOM[i].item[j].component.length; k++)
                            {
                                for (var l = 0; l < $scope.dataBOM[i].item[j].component[k].delivery.length; l++)
                                {
                                    if ($.inArray($scope.checkYear(parseInt($scope.dataBOM[i].item[j].component[k].delivery[l].delivery)), $scope.validYears) !== -1)
                                    {
                                        $scope.tempUnixTS.push(parseInt($scope.dataBOM[i].item[j].component[k].delivery[l].delivery));
                                    }
                                }
                            }
                        }
                    }
                    $scope.tempUnixTS.sort(function(a, b) {
                        return b - a
                    });
                    $scope.planningArr = [];
                    for (var i = 0; i < $scope.totalBOM; i++)
                    {
                        var temp = {};
                        temp[i] = {};
                        temp[i].id = $scope.dataBOM[i].id;
                        temp[i].component = [];
                        var tempCom = [];
                        var tempCom2 = [];
                        var tempCom3 = [];
                        for (var j = 0; j < $scope.dataBOM[i].item.length; j++)
                        {
                            tempCom.push($scope.dataBOM[i].item[j].component);
                            tempCom3.push($scope.dataBOM[i].item[j].id);
                        }
                        for (var k = 0; k < tempCom.length; k++)
                        {
                            for (var n = 0; n < tempCom[k].length; n++)
                            {
                                tempCom[k][n].itemId = tempCom3[k];
                                tempCom2.push(tempCom[k][n]);
                            }
                        }
                        for (var p = 0; p < tempCom2.length; p++)
                        {
                            temp[i].component.push(tempCom2[p]);
                        }
                        $scope.planningArr.push(temp[i]);
                    }
//                    console.log(JSON.stringify($scope.planningArr));
                    $scope.tempPlanningArr = [];
                    for (var a = 0; a < $scope.planningArr.length; a++)
                    {
                        for (var b = 0; b < $scope.planningArr[a].component.length; b++)
                        {
                            for (var c = 0; c < $scope.planningArr[a].component[b].delivery.length; c++)
                            {
                                if ($.inArray($scope.checkYear(parseInt($scope.planningArr[a].component[b].delivery[c].delivery)), $scope.validYears) !== -1 && $scope.planningArr[a].component[b].delivery[c].remaining.value > 0)
                                {
                                    $scope.tempPlanningArr.push({'bomid': $scope.planningArr[a].id, 'itemid': $scope.planningArr[a].component[b].itemId, 'componentid': $scope.planningArr[a].component[b].id, 'deliveryid': $scope.planningArr[a].component[b].delivery[c].id, 'deliverydate': $scope.planningArr[a].component[b].delivery[c].delivery, 'quantity': $scope.planningArr[a].component[b].delivery[0].remaining.value, 'weight': $scope.planningArr[a].component[b].weight.value});
                                }
                            }
                        }
                    }
                    console.log(JSON.stringify($scope.tempPlanningArr));
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
                                $scope.bomPlanningArr[e].delivery.push({'itemid': $scope.tempPlanningArr[f].itemid, 'componentid': $scope.tempPlanningArr[f].componentid, 'deliveryid': $scope.tempPlanningArr[f].deliveryid, 'date': $scope.tempPlanningArr[f].deliverydate, 'totalweight': ($scope.tempPlanningArr[f].weight * $scope.tempPlanningArr[f].quantity)});
                            }
                        }
                    }
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
                            if ($scope.getObjects(tempBomDelDates[g].components, 'deliverydate', tempDeliveryDate).length < 1)
                            {
                                tempBomDelDates[g].components.push({'itemid': $scope.bomPlanningArr[g].delivery[h].itemid, 'componentid': $scope.bomPlanningArr[g].delivery[h].componentid, 'deliveryid': tempDeliveryId, 'deliverydate': tempDeliveryDate, 'deliveryweight': tempTotalweight});
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
                    console.log(JSON.stringify($scope.finalArr));
                    $scope.makeCalender();
                }, function(response) {
                    services.showAlert('Falhou', 'Please try again');
                });
            };
            $scope.loadGrid();
            $scope.getData = function(newDate, bomid, itemid, componentid) {
                var i = 0;
                $scope.updateDeliveryDate = function() {
                    Restangular.one('shipping/execution', bomid).one('item', itemid).one('component', componentid).one('delivery', $scope.viewDeliveryId[i]).get().then(function(response) {
                        $scope.chgDeliveryData = {};
                        $scope.chgDeliveryData.id = response.data.id;
                        $scope.chgDeliveryData.version = response.data.version;
                        $scope.chgDeliveryData.type = response.data.type;
                        $scope.chgDeliveryData.delivery = CommonFun.getFullTimestamp(newDate);
                        $scope.chgDeliveryData.quantity = response.data.quantity;
                        $scope.chgDeliveryData.delivered = response.data.delivered;
                        $scope.chgDeliveryData.remaining = response.data.remaining;
                        console.log(JSON.stringify($scope.chgDeliveryData));
                        Restangular.all('shipping').one('execution', bomid).one('item', itemid).one('component', componentid).one('delivery', $scope.chgDeliveryData.id).customPUT($scope.chgDeliveryData).then(function(response) {
                            i++;
                            if (i < $scope.viewDeliveryId.length) {
                                $scope.updateDeliveryDate();
                            } else
                            {
                                services.showAlert('Success', 'BOM ' + bomid + ' delivery date changed to ' + CommonFun.setDefaultDateFormat(newDate, 'D_M_YYYY')).then(function(res) {
//                                    changeDateDataTab(newDate, bomid);
                                    totalWeightCal();
                                });
                            }
                        }, function(response) {
                            services.showAlert('Falhou', 'Error in PUT request - ' + (i + 1));
                        });
                    }, function(response) {
                        services.showAlert('Falhou', 'Sorry data not available for ' + $scope.viewDeliveryId[i]);
                    });
                }
                $scope.updateDeliveryDate();
//                for (var i = 0; i < $scope.viewDeliveryId.length; i++)
//                {
//                    Restangular.one('shipping/execution', bomid).one('item', itemid).one('component', componentid).one('delivery', $scope.viewDeliveryId[i]).get().then(function(response) {
//                        $scope.chgDeliveryData = {};
//                        $scope.chgDeliveryData.id = response.data.id;
//                        $scope.chgDeliveryData.version = response.data.version;
//                        $scope.chgDeliveryData.type = response.data.type;
//                        $scope.chgDeliveryData.delivery = CommonFun.getFullTimestamp(newDate);
//                        $scope.chgDeliveryData.quantity = response.data.quantity;
//                        $scope.chgDeliveryData.delivered = response.data.delivered;
//                        $scope.chgDeliveryData.remaining = response.data.remaining;
//                        console.log(JSON.stringify($scope.chgDeliveryData));
//                        Restangular.all('shipping').one('execution', bomid).one('item', itemid).one('component', componentid).one('delivery', $scope.chgDeliveryData.id).customPUT($scope.chgDeliveryData).then(function(response) {
//                            console.log(JSON.stringify(response.data));
//                        }, function(response) {
//                            services.showAlert('Falhou', 'error in put');
//                        });
//                    }, function(response) {
//                        services.showAlert('Falhou', 'Please try again');
//                    });
//                }


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
            $ionicModal.fromTemplateUrl('templates/shipping/execution/popup/view.html', {
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
            $scope.getBomData = function(bomId) {
                Restangular.one('shipping/execution', bomId).get().then(function(response) {
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
                        $scope.bomData.created = data.created;
                        $scope.bomData.delivery = data.delivery;
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
            $scope.updatePart = function(bomId, itemId, partId, deliveryid) {
                $scope.changeDateModalHide();
                $scope.loading = true;
                $scope.BOMId = bomId;
                $scope.ITEMId = itemId;
                $scope.PARTId = partId;
                $scope.DELIVERYId = deliveryid;
                $scope.partData = {};

                Restangular.one('shipping/execution', bomId).one('item', itemId).one('component', partId).get().then(function(response) {

                    var data = response.data;
//                    console.log(JSON.stringify(data));
                    $scope.partData.version = data.version;
                    $scope.partData.materialId = data.material.id;
                    $scope.partData.code = data.material.code;
                    $scope.partData.description = data.material.description;
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
                    Restangular.one('shipping/execution', bomId).one('item', itemId).one('component', partId).one('delivery', deliveryid).get().then(function(response1) {
                        $scope.partData.delivery = CommonFun.getFullDate(response1.data.delivery);
                        $ionicModal.fromTemplateUrl('templates/shipping/execution/popup/part.html', {
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
                        $scope.loading = false;
                        services.showAlert('Falhou', 'Please try again');
                    });

                }, function(response) {
                    $scope.loading = false;
                    services.showAlert('Falhou', 'Please try again');
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
                        services.showAlert('Falhou', 'Please try again');
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
                        services.showAlert('Falhou', 'Please try again');
                    });
                };
            };

            $scope.submitPartForm = function(isValid) {
                if (isValid) {
                    $scope.loading = true;
//                    $scope.postData = {};
//                    $scope.postData.id = $scope.PARTId;
//                    $scope.postData.material = {};
//                    $scope.postData.material.id = $scope.partData.materialId;
//                    $scope.postData.color = $scope.partData.color;
//
//                    $scope.postData.quantity = {};
//                    $scope.postData.quantity.value = parseFloat($scope.partData.quantity);
//                    $scope.postData.quantity.unit = {};
//                    $scope.postData.quantity.unit.id = $scope.partData.quantityType;
//
//                    $scope.postData.width = {};
//                    $scope.postData.width.value = parseFloat($scope.partData.width);
//                    $scope.postData.width.unit = {};
//                    $scope.postData.width.unit.id = $scope.partData.widthTypeId;
//
//                    $scope.postData.height = {};
//                    $scope.postData.height.value = parseFloat($scope.partData.height);
//                    $scope.postData.height.unit = {};
//                    $scope.postData.height.unit.id = $scope.partData.heightTypeId;
//
//                    $scope.postData.length = {};
//                    $scope.postData.length.value = parseFloat($scope.partData.length);
//                    $scope.postData.length.unit = {};
//                    $scope.postData.length.unit.id = $scope.partData.lengthTypeId;
//
//                    $scope.postData.weight = {};
//                    $scope.postData.weight.value = parseFloat($scope.partData.weight);
//                    $scope.postData.weight.unit = {};
//                    $scope.postData.weight.unit.id = $scope.partData.weightTypeId;
//
//                    Restangular.one('manufacturing/bom', $scope.BOMId).one('item', $scope.ITEMId).one('component', $scope.PARTId).get().then(function(response1) {
//                        $scope.postData.version = response1.data.version;
//                        Restangular.one('manufacturing/bom', $scope.BOMId).one('item', $scope.ITEMId).one('component', $scope.PARTId).customPUT($scope.postData).then(function(response) {
//                            $scope.loading = false;
//                            $scope.changePartModal.remove();
//                            if ($scope.viewGrid == true)
//                            {
//                                $scope.getShippingDetail($scope.BOMId);
//                            } else
//                            {
//                                location.reload();
////                                $scope.changeDeliveryDate($scope.BOMId);
//                            }
//                        }, function(response) {
//                            $scope.loading = false;
//                            services.showAlert('Falhou', 'Please try again');
//                        });
//                    }, function(response1) {
//                        $scope.loading = false;
//                        services.showAlert('Falhou', 'Please try again');
//                    });
                    Restangular.all('shipping').one('execution', $scope.BOMId).one('item', $scope.ITEMId).one('component', $scope.PARTId).one('delivery', $scope.DELIVERYId).get().then(function(response) {
                        $scope.chgDeliveryData = {};
                        $scope.chgDeliveryData.id = response.data.id;
                        $scope.chgDeliveryData.version = response.data.version;
                        $scope.chgDeliveryData.type = response.data.type;
                        $scope.chgDeliveryData.delivery = CommonFun.getFullTimestamp($scope.partData.delivery);
                        $scope.chgDeliveryData.quantity = response.data.quantity;
                        $scope.chgDeliveryData.delivered = response.data.delivered;
                        $scope.chgDeliveryData.remaining = response.data.remaining;
                        Restangular.all('shipping').one('execution', $scope.BOMId).one('item', $scope.ITEMId).one('component', $scope.PARTId).one('delivery', $scope.DELIVERYId).customPUT($scope.chgDeliveryData).then(function(response) {

                            services.showAlert('Success', 'Delivery date changed to ' + $scope.partData.delivery).then(function(res) {
                                location.reload();
                            });

                        }, function(response) {
                            services.showAlert('Falhou', 'Error in PUT request - ' + (i + 1));
                        });
                    }, function(response) {
                        services.showAlert('Falhou', 'Error in PUT request - ' + (i + 1));
                    });
                }
            }

            $scope.goBackParent = function() {
                $scope.changePartModal.hide();
                $scope.changeDate.show();
            };

            $ionicModal.fromTemplateUrl('templates/shipping/execution/popup/divide.html', {
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
                    var part;
                    var partDelivery;

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
                    Restangular.one('shipping/execution', $scope.bomData.id)
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
                        Restangular.one('shipping/execution', $scope.bomData.id)
                                .one('item', $scope.itemId)
                                .one('component', $scope.itemPartIdArr[0])
                                .all('delivery').post($scope.postdata2).then(function(response) {
                            Restangular.one('shipping/execution', $scope.bomData.id)
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
            $ionicModal.fromTemplateUrl('templates/shipping/execution/popup/component.html', {
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

            $ionicModal.fromTemplateUrl('templates/shipping/execution/popup/join.html', {
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
                    $scope.postdata.delivery = CommonFun.getFullTimestamp($scope.joinData.delivery);
                    $scope.postdata.quantity = {};
                    $scope.postdata.quantity.value = $scope.joinData.chnDateTotalQuantity;
                    $scope.postdata.quantity.unit = {};
                    $scope.postdata.quantity.unit.id = $scope.joinData.chnDateUnit.id;
                    $scope.postdata.quantity.unit.name = $scope.joinData.chnDateUnit.name;
                    $scope.postdata.quantity.unit.symbol = $scope.joinData.chnDateUnit.symbol;
                    Restangular.one('shipping/execution', $scope.bomData.id)
                            .one('item', $scope.joinData.chnDateItem.id)
                            .one('component', $scope.joinData.chnDateParts[0].id)
                            .all('delivery').post($scope.postdata).then(function(response) {
                        $scope.loading = false;

                        var i;
                        for (i = 0; i < $scope.joinData.chnDateParts.length; i++)
                        {
                            for (var j = 0; j < $scope.joinData.chnDateParts[i].deliveryArr.length; j++)
                            {
                                Restangular.one('shipping/execution', $scope.bomData.id)
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

            $scope.getShippingDetail = function(shippingId) {
                tempMaterialId = '';
                tempItemId = '';
                $scope.itemId = [];
                $scope.itemPartIdArr = [];
                $scope.itemPartDeliveryArr = [];
                if ($scope.viewGrid == true)
                {
                    $scope.loading = true;
                    Restangular.one('shipping/execution', shippingId).get().then(function(response) {
                        $scope.activeShipping = response.data;
                        var data = response.data;
                        $scope.finalList = [];
                        for (var j = 0; j < data.item.length; j++)
                        {
                            $scope.tempList = {};
                            $scope.tempList.id = data.item[j].id;
                            $scope.tempList.version = data.item[j].version;
                            $scope.tempList.type = data.item[j].type;
                            $scope.tempList.item = data.item[j].item;
                            $scope.tempList.description = data.item[j].description;
                            $scope.tempList.delivery = [];
                            for (var k = 0; k < data.item[j].component.length; k++)
                            {
                                for (var l = 0; l < data.item[j].component[k].delivery.length; l++)
                                {
                                    $scope.tempListComponent = {};
                                    $scope.tempListComponent.componentId = data.item[j].component[k].id;
                                    $scope.tempListComponent.materialId = data.item[j].component[k].material.id;
                                    $scope.tempListComponent.description = data.item[j].component[k].material.description;
                                    $scope.tempListComponent.color = data.item[j].component[k].color.code;
                                    $scope.tempListComponent.weight = data.item[j].component[k].weight.value;
                                    $scope.tempListComponent.weightType = data.item[j].component[k].weight.unit.symbol;
                                    $scope.tempListComponent.quantity = data.item[j].component[k].quantity.value;
                                    $scope.tempListComponent.delivery = data.item[j].component[k].delivery[l];
                                    $scope.tempList.delivery.push($scope.tempListComponent);
                                }
                            }
                            $scope.finalList.push($scope.tempList);
                        }
                        console.log(JSON.stringify($scope.finalList));

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
            $scope.openBOM = function(bomId) {
                $location.path('/bom/edit/' + bomId);
            }

            $scope.showWeight = function(weight) {
                if (weight >= 1000)
                {
                    var t = Math.floor(weight / 1000);
                    return t + ' T';
                } else
                {
                    return Math.ceil(weight);
                }
            }

            $scope.changeRemainingQun = function(remainingVal, itemId, componentId, deliveryId) {
                $scope.loading = true;
                Restangular.all('shipping').one('execution', $scope.bomData.id).one('item', itemId).one('component', componentId).get().then(function(response) {
                    $scope.postData = {};
                    $scope.postData.version = 0;
                    $scope.postData.type = 'br.com.altamira.data.model.shipping.execution.Delivered';
                    $scope.postData.delivery = moment().valueOf();
                    $scope.postData.quantity = {};
                    $scope.postData.quantity.value = remainingVal;
                    $scope.postData.quantity.unit = response.data.quantity.unit;
                    Restangular.all('shipping').one('execution', $scope.bomData.id).one('item', itemId).one('component', componentId).all('delivered').post($scope.postData).then(function(response) {
                        $scope.getShippingDetail($scope.bomData.id);
                    }, function(response) {
                        $scope.loading = false;
                        services.showAlert('Falhou', 'Error in getting details of delivery');
                    });
                }, function(response) {
                    $scope.loading = false;
                    services.showAlert('Falhou', 'Error in getting details of delivery');
                });
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