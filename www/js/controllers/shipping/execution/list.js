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
            $scope.remainingQtnArr = [];
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
            $scope.listView = function() {
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
            $scope.gridView = function() {
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
            $scope.resetViewCompDelArr = function() {
                $scope.viewComponentidArr = [];
                $scope.viewDeliveryidArr = [];
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
                if ($scope.viewDeliveryidArr != undefined)
                {
                    return $scope.viewDeliveryidArr.indexOf(parseInt(deliveryId));
                }
            };

            $scope.loadGrid = function() {
                Restangular.one('shipping/execution').get({max:999}).then(function(response) {
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
                            var tempComponetArr = [];
                            tempComponetArr = $scope.getObjects($scope.bomPlanningArr[g].delivery, 'componentid', $scope.bomPlanningArr[g].delivery[h].componentid);
                            if (tempComponetArr.length > 0) {
                                for (var z = 0; z < tempComponetArr.length; z++)
                                {
                                    var tempDateArr = [];
                                    var tempDeliveryId = '';
                                    var tempDeliveryDate = tempComponetArr[z].date;
                                    var tempTotalweight = 0;
                                    tempDateArr = $scope.getObjects(tempComponetArr[z], 'date', tempComponetArr[z].date);
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
                                    if ($scope.getObjects(tempBomDelDates[g].components, 'componentid', tempComponetArr[z].componentid).length < 1)
                                    {
                                        tempBomDelDates[g].components.push({'itemid': tempComponetArr[z].itemid, 'componentid': tempComponetArr[z].componentid, 'deliveryid': tempDeliveryId, 'deliverydate': tempDeliveryDate, 'deliveryweight': tempTotalweight});
                                    }
                                }
                            }
                        }
                        $scope.bomDatesArr.push(tempBomDelDates[g]);
                    }
                    $scope.finalDateArr = [];
                    for (var a = 0; a < $scope.bomDatesArr.length; a++)
                    {
                        $scope.preFinalArr = [];
                        $scope.preFinalArr[a] = {};
                        $scope.preFinalArr[a].id = $scope.bomDatesArr[a].id;
                        $scope.preFinalArr[a].components = [];
                        for (var b = 0; b < $scope.bomDatesArr[a].components.length; b++)
                        {
                            var tempDateArr = [];
                            var tempDeliveryId = '';
                            var tempDeliveryDate = $scope.bomDatesArr[a].components[b].deliverydate;
                            var tempTotalweight = 0;
                            var tempCompoDeli = '';
                            tempDateArr = $scope.getObjects($scope.bomDatesArr[a].components, 'deliverydate', $scope.bomDatesArr[a].components[b].deliverydate);
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
                                        tempTotalweight = tempDateArr[i].deliveryweight;
                                    }
                                    else
                                    {
                                        tempTotalweight = tempTotalweight + tempDateArr[i].deliveryweight;
                                    }
                                    if (tempCompoDeli == '')
                                    {
                                        tempCompoDeli = tempDateArr[i].componentid + '-' + tempDateArr[i].deliveryid;
                                    }
                                    else
                                    {
                                        tempCompoDeli = tempCompoDeli + ',' + tempDateArr[i].componentid + '-' + tempDateArr[i].deliveryid;
                                    }
                                }
                            }
                            if ($scope.getObjects($scope.preFinalArr[a].components, 'deliverydate', tempDeliveryDate).length < 1)
                            {
                                $scope.preFinalArr[a].components.push({'itemid': $scope.bomDatesArr[a].components[b].itemid, 'comdel': tempCompoDeli, 'deliverydate': tempDeliveryDate, 'deliveryweight': tempTotalweight});
                            }
                        }
                        $scope.finalDateArr.push($scope.preFinalArr[a]);

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
                        for (var l = 0; l < $scope.finalDateArr.length; l++)
                        {
                            if ($scope.dataBOM[k].id == $scope.finalDateArr[l]['id'])
                            {
                                tempFinalArr[k].components = $scope.finalDateArr[l].components;
                            }
                        }
                        $scope.finalArr.push(tempFinalArr[k]);
                    }
                    $scope.makeCalender();
                }, function(response) {
                    services.showAlert('Falhou', 'Please try again');
                });
            };
            $scope.loadGrid();
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
                $scope.itemId = [];
                $scope.itemPartIdArr = [];
                $scope.itemPartDeliveryArr = [];
                getShippingArr(bomId);
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
            $scope.goBackParent = function() {
                $scope.changePartModal.hide();
                $scope.changeDate.show();
            };

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
            function getShippingArr(shippingId) {
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
                        $scope.bomData.created = CommonFun.getFullDate(data.created);
                        $scope.bomData.delivery = CommonFun.getFullDate(data.delivery);
                        $scope.bomData.items = data.item;
                    }
                    $scope.loading = false;
                }, function() {
                    $scope.loading = false;
                    services.showAlert('Falhou', 'Please try again');
                });
            }
            $scope.getShippingDetail = function(shippingId) {
                $scope.itemId = [];
                $scope.itemPartIdArr = [];
                $scope.itemPartDeliveryArr = [];
                if ($scope.viewGrid == true)
                {
                    getShippingArr(shippingId);
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

            $scope.changeRemainingQun = function() {
                var i = 0;
                $scope.updateRemainingQtn = function() {
                    Restangular.all('shipping').one('execution', $scope.bomData.id).one('item', $("[datadelivery='" + $scope.remainingQtnArr[i] + "']").attr('dataitem')).one('component', $("[datadelivery='" + $scope.remainingQtnArr[i] + "']").attr('datapart')).get().then(function(response) {
                        $scope.postData = {};
                        $scope.postData.version = 0;
                        $scope.postData.type = 'br.com.altamira.data.model.shipping.execution.Delivered';
                        $scope.postData.delivery = moment().valueOf();
                        $scope.postData.quantity = {};
                        if ($scope.viewGrid == true)
                        {
                            $scope.postData.quantity.value = $('#remaining_' + $scope.remainingQtnArr[i]).val();
                        }
                        else
                        {
                            $scope.postData.quantity.value = $('#remaining_popup_' + $scope.remainingQtnArr[i]).val();
                        }

                        $scope.postData.quantity.unit = response.data.quantity.unit;
                        Restangular.all('shipping').one('execution', $scope.bomData.id).one('item', $("[datadelivery='" + $scope.remainingQtnArr[i] + "']").attr('dataitem')).one('component', $("[datadelivery='" + $scope.remainingQtnArr[i] + "']").attr('datapart')).all('delivered').post($scope.postData).then(function(response) {
                            i++
                            if (i < $scope.remainingQtnArr.length) {
                                $scope.updateRemainingQtn();
                            } else
                            {
                                $scope.loading = false;
                                services.showAlert('Success', 'Successfully remaining value changed').then(function(res) {
                                    $scope.remainingQtnArr = [];
                                    $scope.getShippingDetail($scope.bomData.id);
                                    if ($scope.viewGrid == false)
                                    {
                                        getShippingArr($scope.bomData.id);
                                    }
                                });
                            }
                        }, function(response) {
                            $scope.loading = false;
                            services.showAlert('Falhou', 'Error in update details of delivery');
                        });
                    }, function(response) {
                        $scope.loading = false;
                        services.showAlert('Falhou', 'Error in getting details of delivery');
                    });
                }
                if ($scope.remainingQtnArr.length > 0)
                {
                    $scope.loading = true;
                    $scope.updateRemainingQtn();
                } else
                {
                    services.showAlert('Falhou', 'Please select atleast one delivery');
                }

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