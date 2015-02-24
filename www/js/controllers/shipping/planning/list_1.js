altamiraAppControllers.controller('ShippingPlanningCtrl',
        function($scope, $location, $route, Restangular, services, $ionicModal, CommonFun) {
            $scope.loading = true;
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
            $scope.viewGrid = true;
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
                $scope.loadGrid();


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
                $scope.days = [];
                $scope.monthDays = [];
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
            $scope.getCellColor = function(st, value) {
                if (st < moment().valueOf() || (parseInt(value) > 100))
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
                $scope.loading = true;
                Restangular.one('shipping/planning').get({max: 10}).then(function(response) {
                    $scope.loading = false;
//                    $scope.test = [];
//                    $scope.test.push(response.data);
//                    $scope.totalBOM = $scope.test.length;
//                    $scope.dataBOM = $scope.test;
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
                                    if ($.inArray($scope.checkYear(CommonFun.getFullTimestamp(CommonFun.setDefaultDateFormat($scope.dataBOM[i].item[j].component[k].delivery[l].delivery, 'YYYY-MM-DD'))), $scope.validYears) !== -1)
                                    {
                                        $scope.tempUnixTS.push(CommonFun.getFullTimestamp(CommonFun.setDefaultDateFormat($scope.dataBOM[i].item[j].component[k].delivery[l].delivery, 'YYYY-MM-DD')));
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
                                if ($.inArray($scope.checkYear(CommonFun.getFullTimestamp(CommonFun.setDefaultDateFormat($scope.planningArr[a].component[b].delivery[c].delivery))), $scope.validYears) !== -1 && $scope.planningArr[a].component[b].delivery[c].remaining.value > 0)
                                {
                                    $scope.tempPlanningArr.push({'bomid': $scope.planningArr[a].id, 'itemid': $scope.planningArr[a].component[b].itemId, 'componentid': $scope.planningArr[a].component[b].id, 'deliveryid': $scope.planningArr[a].component[b].delivery[c].id, 'deliverydate': CommonFun.getFullTimestamp(CommonFun.setDefaultDateFormat($scope.planningArr[a].component[b].delivery[c].delivery)), 'quantity': $scope.planningArr[a].component[b].delivery[0].remaining.value, 'weight': $scope.planningArr[a].component[b].weight.value});
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
                    var totalDataLen = $scope.finalArr.length;
                    if ($scope.viewGrid == true)
                    {
                        $scope.getShippingDetail($scope.finalArr[0].id);
                    }
                    $scope.makeCalender();
                    var loadGridData = function() {

                        $(document).ready(function() {
                            $(".dragDiv").draggable({
                                revert: 'invalid'
                            });
                            $(".makeDroppable").droppable({
                                accept: function(item) {
                                    return $(this).closest("tr").is(item.closest("tr")) && $(this).find("*").length == 0;
                                },
                                drop: function(event, ui) {
                                    $scope.resetViewCompDelArr();
                                    var tempCompDelivery = ui.draggable.data('comdel').split(',');
                                    for (var z = 0; z < tempCompDelivery.length; z++)
                                    {
                                        var tempSeprate = tempCompDelivery[z].split('-');
                                        $scope.viewComponentidArr.push(parseInt(tempSeprate[0]));
                                        $scope.viewDeliveryidArr.push(parseInt(tempSeprate[1]));
                                    }
                                    $scope.getData($(this).data('day'), $(this).attr('id'), ui.draggable.data('itemid'));

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

                            $(".shipping_data").mCustomScrollbar({
                                axis: "y",
                                theme: "inset-3",
                                scrollButtons: {enable: true},
//                    scrollbarPosition: "outside"
                            });
                            $(".mainRow").mCustomScrollbar({
                                axis: "x",
                                theme: "inset-3",
                                scrollButtons: {enable: true},
                                scrollbarPosition: "outside",
                                callbacks: {
                                    whileScrolling: function() {
//                            $(".dataRow").mCustomScrollbar("scrollTo",[this.mcs.topPct,0]);
                                    }
                                },
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
                                $scope.viewDeliveryDate = $(this).data('day');
                                $scope.changeDeliveryDate($(this).parent().attr('id'));
                            });
                            $('.undragDiv').on('dblclick', function(e) {
                                $scope.remainingQtnArr = [];
                                $scope.resetViewCompDelArr();
                                var tempCompDelivery = $(this).data('comdel').split(',');
                                for (var z = 0; z < tempCompDelivery.length; z++)
                                {
                                    var tempSeprate = tempCompDelivery[z].split('-');
                                    $scope.viewComponentidArr.push(parseInt(tempSeprate[0]));
                                    $scope.viewDeliveryidArr.push(parseInt(tempSeprate[1]));
                                }
                                $scope.changeDeliveryDate($(this).parent().attr('id'));
                            });

                            var allCells = $(".mainTable td");

                            allCells.on("mouseover", function() {
                                var el = $(this),
                                        pos = el.index();
                                el.parent().find("th, td").addClass("hover");
                                allCells.filter(":nth-child(" + (pos + 1) + ")").addClass("hover");
                            })
                                    .on("mouseout", function() {
                                allCells.removeClass("hover");
                            });
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
                        });
                    };
                    setTimeout(function() {
                        makeDummyRowLeft();
                        makeDummyRowRight();
                        totalWeightCal();
                        loadGridData();
                    }, 100);
                }, function(response) {
                    services.showAlert('Falhou', 'Please try again');
                });
            };
            $scope.loadGrid();
            $scope.getData = function(newDate, bomid, itemid) {
                $scope.loading = true;
                var i = 0;
                $scope.updateDeliveryDate = function() {
                    Restangular.one('shipping/planning', bomid).one('item', itemid).one('component', $scope.viewComponentidArr[i]).one('delivery', $scope.viewDeliveryidArr[i]).get().then(function(response) {
                        $scope.chgDeliveryData = {};
                        $scope.chgDeliveryData.id = response.data.id;
                        $scope.chgDeliveryData.version = response.data.version;
                        $scope.chgDeliveryData.type = response.data.type;
                        $scope.chgDeliveryData.delivery = CommonFun.getFullTimestamp(newDate);
                        $scope.chgDeliveryData.quantity = response.data.quantity;
                        $scope.chgDeliveryData.delivered = response.data.delivered;
                        $scope.chgDeliveryData.remaining = response.data.remaining;

                        Restangular.all('shipping').one('planning', bomid).one('item', itemid).one('component', $scope.viewComponentidArr[i]).one('delivery', $scope.viewDeliveryidArr[i]).customPUT($scope.chgDeliveryData).then(function(response) {
                            i++;
                            if (i < $scope.viewComponentidArr.length) {
                                $scope.updateDeliveryDate();
                            } else
                            {
                                $scope.loading = false;
                                services.showAlert('Success', 'Successfully delivery date changed to ' + CommonFun.setDefaultDateFormat(newDate, 'D_M_YYYY')).then(function(res) {
                                    totalWeightCal();
                                });
                            }
                        }, function(response) {
                            $scope.loading = false;
                            services.showAlert('Falhou', 'Error in PUT request - ' + (i + 1));
                        });
                    }, function(response) {
                        $scope.loading = false;
                        services.showAlert('Falhou', 'Sorry data not available for ' + $scope.viewDeliveryidArr[i]);
                    });
                }
                $scope.updateDeliveryDate();
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
                $scope.loading = false;
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
                Restangular.one('shipping/planning', bomId).one('item', itemId).one('component', partId).get().then(function(response) {

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
                        services.showAlert('Falhou', 'Please try again');
                    });
                }, function(response) {
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
                    Restangular.all('shipping').one('planning', $scope.BOMId).one('item', $scope.ITEMId).one('component', $scope.PARTId).one('delivery', $scope.DELIVERYId).get().then(function(response) {
                        $scope.chgDeliveryData = {};
                        $scope.chgDeliveryData.id = response.data.id;
                        $scope.chgDeliveryData.version = response.data.version;
                        $scope.chgDeliveryData.type = response.data.type;
                        $scope.chgDeliveryData.delivery = CommonFun.getFullTimestamp($scope.partData.delivery);
                        $scope.chgDeliveryData.quantity = response.data.quantity;
                        $scope.chgDeliveryData.delivered = response.data.delivered;
                        $scope.chgDeliveryData.remaining = response.data.remaining;
                        Restangular.all('shipping').one('planning', $scope.BOMId).one('item', $scope.ITEMId).one('component', $scope.PARTId).one('delivery', $scope.DELIVERYId).customPUT($scope.chgDeliveryData).then(function(response) {
                            $scope.loading = false;
                            services.showAlert('Success', 'Delivery date changed to ' + $scope.partData.delivery).then(function(res) {
                                $scope.loadGrid();
                            });
                        }, function(response) {
                            $scope.loading = false;
                            services.showAlert('Falhou', 'Error in PUT request');
                        });
                    }, function(response) {
                        $scope.loading = false;
                        services.showAlert('Falhou', 'Error in GET request');
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
                    Restangular.one('shipping/planning', $scope.bomData.id)
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
                                    $scope.loadGrid();
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
                    Restangular.one('shipping/planning', $scope.bomData.id)
                            .one('item', $scope.joinData.chnDateItem.id)
                            .one('component', $scope.joinData.chnDateParts[0].id)
                            .all('delivery').post($scope.postdata).then(function(response) {
                        $scope.loading = false;
                        var i = 0;

                        $scope.outerRemovePart = function() {
                            var j = 0;
                            $scope.innerRemovePart = function() {
                                Restangular.one('shipping/planning', $scope.bomData.id)
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
                                                if ($scope.viewGrid == true)
                                                {
                                                    $scope.getShippingDetail($scope.bomData.id);
                                                    $scope.bomData = {};
                                                } else
                                                {
                                                    location.reload();
                                                    $scope.bomData = {};
                                                }
                                            });
                                        }
                                    }
                                }, function() {
                                    $scope.loading = false;
                                    services.showAlert('Falhou', 'Please try again').then(function(response) {
                                        $scope.joinDateModal.show();
                                    });
                                });
                            }
                            $scope.innerRemovePart();
                        }
                        $scope.outerRemovePart();
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
                    Restangular.one('shipping/planning', shippingId).get().then(function(response) {
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
                            $scope.bomData.created = moment.unix(data.created).format('DD/MM/YYYY');
                            $scope.bomData.delivery = moment.unix(data.delivery).format('DD/MM/YYYY');
                            $scope.bomData.items = data.item;
                            makeDummyRowLeft();
//                            $('.shipping_data').css('height', $('.scroll-div').height() - 37);
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