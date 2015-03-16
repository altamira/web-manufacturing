altamiraAppControllers.controller('ShippingPlanningCtrl',
        function($scope, $location, $route, Restangular, services, $ionicModal, CommonFun, $ionicSideMenuDelegate, $routeParams) {
            if ($routeParams.token != null && $routeParams.token != '' && $routeParams.token != undefined && sessionStorage.getItem('token') == '')
            {
                sessionStorage.setItem('token', $routeParams.token);
                $window.location.reload();
            }
            var pt = moment().locale('pt-br');
            $scope.today = pt.format('dddd, LL');
            moment.locale('pt-br');
            var month = moment.months();
            moment.locale('en');
            $scope.tempUnixTS = [];
            $scope.viewWeekly = false;
            $scope.currentYear = moment().format('YYYY');
            $scope.validYears = [parseInt($scope.currentYear) - 1, parseInt($scope.currentYear), parseInt($scope.currentYear) + 1];
            $scope.formView = function() {
                $scope.viewtype = 'form';
                $('#form_view').show();
                $('#formShowBtn').removeClass('month');
                $('#grid_view').hide();
                $('#gridShowBtn').addClass('month');
                $scope.loadOrderList();
            }
            $scope.gridView = function() {
                $scope.viewtype = 'grid';
                $('#form_view').hide();
                $('#formShowBtn').addClass('month');
                $('#grid_view').show();
                $('#gridShowBtn').removeClass('month');
                $scope.loadGrid();
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
            $scope.resetOrderList = function() {
                $scope.startPage = 0;
                $scope.maxRecord = 10;
                $scope.orderData = '';
                $scope.orderDataArray = [];
                $scope.nextButton = true;
            };
            $scope.searchText = sessionStorage.getItem('searchOrderList');
            $scope.tempSearch = '';
            $scope.isDataSearch = '';
            $scope.resetOrderList();
            $scope.loadOrderList = function() {
                $scope.loading = true;
                Restangular.one('shipping/planning').get({search: sessionStorage.getItem('searchOrderList'), start: $scope.startPage, max: $scope.maxRecord}).then(function(response) {
                    if (response.data == '') {
                        $scope.loading = false;
                        if ((parseInt($scope.startPage) != 0))
                        {
                            $scope.nextButton = false;
                            $scope.startPage = (parseInt($scope.startPage) - 1);
                            $scope.loadOrderList();
                        } else
                        {
                            $scope.pageStack = [];
                            services.showAlert('Aviso', 'A lista de Romaneios esta vazia.').then(function(res) {
                            });
                        }
                    } else
                    {
                        if ($scope.orderData.length <= 0 && $scope.isDataSearch == '')
                        {
                            $scope.orderResponse = response.data;
                            $scope.tarray = [];
                            for (var i = 0; i < $scope.orderResponse.length; i++)
                            {
                                if ($scope.tarray.indexOf(parseInt($scope.orderResponse[i].delivery)) < 0)
                                {
                                    $scope.tarray.push(parseInt($scope.orderResponse[i].delivery));
                                }

                            }
                            $scope.orderData = [];
                            $scope.orderDataArray = [];
                            for (var i = 0; i < $scope.tarray.length; i++)
                            {
                                $scope.tempArray = {};
                                $scope.tempArray.delivery = $scope.tarray[i];
                                $scope.tempArray.planningData = $scope.getObjects($scope.orderResponse, 'delivery', $scope.tarray[i]);
                                $scope.orderDataArray.push($scope.tempArray);
                            }
                            $scope.orderData = $scope.orderDataArray;
                            if ($scope.searchText != '')
                            {
                                $scope.isDataSearch = 'yes';
                            }
                            else
                            {
                                $scope.isDataSearch = '';
                            }
                        }
                        else
                        {
                            if ($scope.nextButton != false)
                            {
                                $scope.orderResponse = response.data;
                                $scope.tarray = [];
                                for (var i = 0; i < $scope.orderResponse.length; i++)
                                {
                                    if ($scope.tarray.indexOf(parseInt($scope.orderResponse[i].delivery)) < 0)
                                    {
                                        $scope.tarray.push(parseInt($scope.orderResponse[i].delivery));
                                    }

                                }
                                for (var i = 0; i < $scope.tarray.length; i++)
                                {
                                    $scope.tempArray = {};
                                    $scope.tempArray.delivery = $scope.tarray[i];
                                    $scope.tempArray.planningData = $scope.getObjects($scope.orderResponse, 'delivery', $scope.tarray[i]);
                                    $scope.orderDataArray.push($scope.tempArray);
                                }
                                $scope.pageOrderListes();
                            }
                        }

                        $scope.loading = false;
                        $scope.range();
                    }
                }, function(response) {
                    services.showAlert('Falhou', 'Tente novamente.');
                });
            };
            $scope.loadOrderList();
            $scope.pageOrderListes = function() {
                $scope.orderData = [];
                $scope.start = $scope.startPage * $scope.maxRecord;
                $scope.end = ($scope.startPage * $scope.maxRecord) + $scope.maxRecord;
                for (var i = $scope.start; i < $scope.end; i++)
                {
                    if ($scope.orderDataArray[i])
                    {
                        $scope.orderData.push($scope.orderDataArray[i]);
                    }
                }
                if ($scope.orderData.length != $scope.maxRecord)
                {
                    $scope.nextButton = false;
                }
            };

            $scope.searchOrderList = function(text) {
                if (text != '')
                {
                    $scope.resetOrderList();
                    sessionStorage.setItem('searchOrderList', text);
                } else
                {
                    sessionStorage.setItem('searchOrderList', '');
                    $scope.resetOrderList();
                }
                $scope.loadOrderList();
            };
            $scope.range = function() {
                $scope.pageStack = [];
                var start = parseInt($scope.startPage) + 1;
                for (var i = 1; i <= start; i++) {
                    $scope.pageStack.push(i);
                }
            };
            $scope.nextPage = function(len) {
                var nextPage = parseInt(len);
                $scope.startPage = nextPage;
                $scope.loadOrderList();

            }
            $scope.prevPage = function(nextPage) {
                $scope.startPage = nextPage;
                $scope.loadOrderList();
            }
            $scope.goPage = function(pageNumber) {
                var nextPage = parseInt(pageNumber) - 1;
                $scope.startPage = nextPage;
                if ($scope.orderDataArray.length > 0)
                {
                    if ($scope.searchText == '' || ($scope.searchText != '' && $scope.isDataSearch != ''))
                    {
                        $scope.pageOrderListes();
                    }
                }
                else
                {
                    $scope.loadOrderList();
                }
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
            $scope.getMonthName = function(date) {
                moment.locale('pt-br');
                var month = moment(date, "D_M_YYYY").format('MMMM')
                moment.locale('en');
                return month

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
                    $location.path('shipping/planning/'+$(this).data('orderid'));
                    $scope.$apply();
                });
                setTimeout(function() {

                    $(".dragDiv").draggable({
                        revert: 'invalid'
                    });
                    $(".makeDroppable").droppable({
                        accept: function(item) {
                            return $(this).closest("tr").is(item.closest("tr")) && $(this).find("*").length == 0;
                        },
                        drop: function(event, ui) {
                            $scope.changeDelDateByDrag(ui.draggable.data('orderid'), ui.draggable.data('olddate'), $(this).data('day'));

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
            $scope.loadGrid = function() {
                $scope.loading = true;
                $scope.itemId = [];
                $scope.itemPartIdArr = [];
                $scope.itemPartDeliveryArr = [];
                $scope.finalArr = '';
                Restangular.one('shipping/planning').get({max: 999}).then(function(response) {
                    $scope.loading = false;
                    $scope.finalArr = response.data;
                    var main = [];
                    for (var i = 0; i < $scope.finalArr.length; i++)
                    {
                        $scope.tempUnixTS.push($scope.finalArr[i].delivery);
                    }
                    $scope.tempUnixTS.sort(function(a, b) {
                        return b - a
                    });
                    $scope.makeCalender();
                    setTimeout(function() {
                        $scope.decorateTable();
                    }, 100);
                }, function(response) {
                    services.showAlert('Falhou', 'Tente Novamente UO Entre em Contato com o Suporte Técnico.');
                });
            };
            $scope.changeDelDateByDrag = function(orderId, oldDate, newDate) {
                $scope.loading = true;
                $scope.postdata = [];
                $scope.postdata = [oldDate, CommonFun.getFullTimestamp(CommonFun.setDefaultDateFormat(newDate, 'D_M_YYYY'))];
                console.log(JSON.stringify($scope.postdata));
                Restangular.all('shipping').one('planning', orderId).all('delivery').customPUT($scope.postdata).then(function(response) {
                    $scope.loading = false;
                    console.log(JSON.stringify(response.data));
                    if (response.data.count > 0)
                    {
                        services.showAlert('Success', 'Successfully delivery date changed to ' + CommonFun.setDefaultDateFormat(newDate, 'D_M_YYYY')).then(function(res) {
                            totalWeightCal();
                        });
                    } else
                    {
                        services.showAlert('Error', 'Tente Novamente UO Entre em Contato com o Suporte Técnico.').then(function(res) {
                            $scope.loadGrid();
                        });
                    }

                }, function(response) {
                    $scope.loading = false;
                    services.showAlert('Falhou', 'Error in PUT request');
                });
            };
            $scope.goEdit = function (planningId) {
                $location.path('shipping/planning/'+planningId);
            }
        });
function unique_arr(array) {
    return array.filter(function(el, index, arr) {
        return index == arr.indexOf(el);
    });
}