altamiraAppControllers.controller('DeliveryPlanningListCtrl',
        function($scope, $location, Restangular, services, $ionicModal) {
            $scope.loading = true;
            $scope.days = [];
            $scope.monthDays = [];
            $scope.semanal = true;
            $scope.showdate = true;
            $scope.itemPartIdArr = [];
            $scope.itemId = [];
            $scope.bomData = {};
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
            Restangular.one('manufacturing/bom').get({checked: false, search: ''}).then(function(response) {
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

            $ionicModal.fromTemplateUrl('templates/delivery/planning/popup/view.html', {
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

            $scope.changeDeliveryDate = function(bomId) {
                Restangular.one('manufacturing/bom', bomId).get().then(function(response) {
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
                        $scope.bomData.items = data.items;
                        $scope.changeDateModalShow();
                    }
                }, function(response) {
                    services.showAlert('Falhou', 'Please try again');
                });
            };
            $ionicModal.fromTemplateUrl('templates/delivery/planning/popup/part.html', {
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
//                Restangular.one('common/color').get({max: 0}).then(function(response) {
//                    $scope.partData.colorBox = response.data;
//                }, function(response) {
//                    services.showAlert('Falhou', 'Please try again');
//                });
//                Restangular.one('measurement/unit').get({magnitude: 'dimencional'}).then(function(response) {
//                    $scope.partData.unitLengthBox = response.data;
//                }, function(response) {
//                    services.showAlert('Falhou', 'Please try again');
//                });
//                Restangular.one('measurement/unit').get({magnitude: 'peso'}).then(function(response) {
//                    $scope.partData.unitWeightBox = response.data;
//                }, function(response) {
//                    services.showAlert('Falhou', 'Please try again');
//                });
                Restangular.one('measurement/unit').get({magnitude: 'unidade'}).then(function(response) {
                    $scope.partData.unitQuantityBox = response.data;
                }, function(response) {
                    services.showAlert('Falhou', 'Please try again');
                });
                Restangular.one('manufacturing/bom', bomId).one('item', itemId).one('part', partId).get().then(function(response) {
//                    $ionicModal.fromTemplateUrl('templates/delivery/planning/popup/part.html', {
//                        scope: $scope,
//                        animation: 'fade-in'
//                    }).then(function(modal) {
//                        $scope.changePartModal = modal;
//                        $scope.loading = false;
//                        $scope.changePartModal.show();
//                    });
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
            $ionicModal.fromTemplateUrl('templates/delivery/planning/popup/divide.html', {
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
                if ($scope.itemPartIdArr.length > 0)
                {
                    var tempVar = $scope.getObjects($scope.bomData.items, 'id', $scope.itemId);
                    var tempParts = [];
                    var part;
                    var chnDateTotalQuantity = 0;
                    var pesoTotal = 0;
                    for (var i = 0; i < $scope.itemPartIdArr.length; i++)
                    {
                        part = $scope.getObjects(tempVar[0].parts, 'id', $scope.itemPartIdArr[i]);
                        tempParts.push(part[0]);
                        chnDateTotalQuantity = chnDateTotalQuantity + parseInt(part[0].quantity.value);
                        pesoTotal = pesoTotal + (parseInt(part[0].quantity.value) * parseInt(part[0].weight.value));
                    }
                    console.log(JSON.stringify(tempVar));
                    $scope.chnDateCode = tempParts[0].material.code;
                    $scope.chnDateDesc = tempParts[0].material.description;
                    $scope.chnDateTotalQuantity = chnDateTotalQuantity;
                    $scope.pesoTotal = pesoTotal;
                    $scope.chnDateItem = {};
                    $scope.chnDateItem.id = tempVar[0].id;
                    $scope.chnDateItem.version = tempVar[0].version;
                    $scope.chnDateItem.item = tempVar[0].item;
                    $scope.chnDateItem.description = tempVar[0].description;
                    $scope.chnDateParts = tempParts;
                    $scope.divideDateModalShow();
                }
                else {
                    services.showAlert('Falhou', 'Please select components to divide delivery date');
                }
            };
            $ionicModal.fromTemplateUrl('templates/delivery/planning/popup/join.html', {
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
            $scope.mergeDate = function() {
                if ($scope.itemPartIdArr.length > 1)
                {
                    var tempVar = $scope.getObjects($scope.bomData.items, 'id', $scope.itemId);
                    var tempParts = [];
                    var part;
                    var chnDateTotalQuantity = 0;
                    var pesoTotal = 0;
                    for (var i = 0; i < $scope.itemPartIdArr.length; i++)
                    {
                        part = $scope.getObjects(tempVar[0].parts, 'id', $scope.itemPartIdArr[i]);
                        tempParts.push(part[0]);
                        chnDateTotalQuantity = chnDateTotalQuantity + parseInt(part[0].quantity.value);
                        pesoTotal = pesoTotal + (parseInt(part[0].quantity.value) * parseInt(part[0].weight.value));
                    }
                    $scope.chnDateCode = tempParts[0].material.code;
                    $scope.chnDateDesc = tempParts[0].material.description;
                    $scope.chnDateTotalQuantity = chnDateTotalQuantity;
                    $scope.pesoTotal = pesoTotal;
                    $scope.chnDateItem = {};
                    $scope.chnDateItem.id = tempVar[0].id;
                    $scope.chnDateItem.version = tempVar[0].version;
                    $scope.chnDateItem.item = tempVar[0].item;
                    $scope.chnDateItem.description = tempVar[0].description;
                    $scope.chnDateParts = tempParts;
                    $scope.joinDateModalShow();
                }
                else {
                    services.showAlert('Falhou', 'Please select atleast 2 components to join delivery date');
                }
            };



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