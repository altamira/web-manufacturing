altamiraAppControllers.controller('ShippingPlanningCtrl',
        function($scope, $location, $route, Restangular, services, $ionicModal, CommonFun, $ionicSideMenuDelegate, $routeParams) {
            if ($routeParams.token != null && $routeParams.token != '' && $routeParams.token != undefined && localStorage.getItem('token') == '' && localStorage.getItem('token') == null)
            {
                localStorage.setItem('token', $routeParams.token);
                $window.location.reload();
            }
            $scope.today = CommonFun.toDay();
            var month = CommonFun.months();
            moment.locale('en');
            $scope.tempUnixTS = [];
            $scope.viewWeekly = false;
            $scope.setToday = 'yes';
            $scope.currentYear = CommonFun.currentYear();
            $scope.selectDate = CommonFun.selectDate();
            $scope.validYears = CommonFun.validYears();
            localStorage.setItem('selectDate', $scope.selectDate);
            $scope.viewtype = 'form';
            $scope.formView = function() {
                $scope.viewtype = 'form';
                $scope.setToday = 'yes'
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
                $scope.orderResponse = [];
                $scope.nextButton = true;
            };
            $scope.searchText = localStorage.getItem('searchOrderList');
            $scope.tempSearch = '';
            $scope.isDataSearch = '';
            $scope.resetOrderList();
            $scope.loadOrderList = function() {
                $scope.loading = true;
                Restangular.one('shipping/planning').get({search: localStorage.getItem('searchOrderList'), start: $scope.startPage, max: $scope.maxRecord}).then(function(response) {
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
                        $scope.loading = false;
                        angular.forEach(response.data, function(value, key) {
                            $scope.orderResponse.push(value);
                        });
                        $scope.pageOrderListes();
                        if ($scope.searchText != '')
                        {
                            $scope.isDataSearch = 'yes';
                        }
                        else
                        {
                            $scope.isDataSearch = '';
                        }
                        $scope.range();
                    }
                }, function(response) {
                    services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
                });
            };
            $scope.loadOrderList();
            $scope.pageOrderListes = function() {
                $scope.orderData = [];
                $scope.start = $scope.startPage * $scope.maxRecord;
                $scope.end = $scope.start + $scope.maxRecord;
                $scope.tarray = [];
                for (var i = $scope.start; i < $scope.end; i++)
                {
                    if ($scope.orderResponse[i] != undefined)
                    {
                        if ($scope.tarray.indexOf(parseInt($scope.orderResponse[i].delivery)) < 0)
                        {
                            $scope.tarray.push(parseInt($scope.orderResponse[i].delivery));
                            $scope.tempArray = {};
                            $scope.tempArray.delivery = parseInt($scope.orderResponse[i].delivery);
                            $scope.tempArray.planningData = [];
                            for (var j = $scope.start; j < $scope.end; j++)
                            {
                                if ($scope.orderResponse[j] != undefined)
                                {
                                    if (parseInt($scope.orderResponse[j].delivery) == parseInt($scope.orderResponse[i].delivery))
                                    {
                                        $scope.tempArray.planningData.push($scope.orderResponse[j]);
                                    }
                                }
                            }
                            $scope.orderData.push($scope.tempArray);
                        }
                    }
                }
            };

            $scope.searchOrderList = function(text) {
                if (text != '')
                {
                    $scope.resetOrderList();
                    localStorage.setItem('searchOrderList', text);
                } else
                {
                    localStorage.setItem('searchOrderList', '');
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
                if ($scope.orderResponse.length > 0)
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
            $scope.getCellColor = CommonFun.getCellColor();
            $scope.checkDay = function(st) {
                return CommonFun.checkDay(st);
            }
            $scope.checkMonth = function(st) {
                return CommonFun.checkMonth(st);
            }
            $scope.checkYear = function(st) {
                return CommonFun.checkYear(st);
            }
            $scope.getWeekDay = function(date) {
                return CommonFun.getWeekDay(date);
            }
            $scope.getWeekDayShort = function(date) {
                return CommonFun.getWeekDayShort(date);
            }
            $scope.getDay = function(date) {
                return CommonFun.getDay(date);
            }
            $scope.getMonth = function(date) {
                return CommonFun.getMonth(date);
            }
            $scope.getMonthName = function(date) {
                return CommonFun.getMonthName(date);
            }
            $scope.getYear = function(date) {
                return CommonFun.getYear(date);
            }
            $scope.makeCalender = function() {
                $scope.days = [];
                $scope.monthDays = [];
                var startMonth = CommonFun.startMonth($scope.tempUnixTS);
                var startYear = CommonFun.startYear($scope.tempUnixTS);
                var endMonth = CommonFun.endMonth($scope.tempUnixTS);
                var endYear = CommonFun.endYear($scope.tempUnixTS);
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
                                arrTemp.days = CommonFun.range(1, CommonFun.daysInMonth(i, year));
                                $scope.createDaysArray(arrTemp.days, i, year);
                                $scope.monthDays.push(arrTemp);
                            }
                        } else
                        {
                            var arrTemp = {};
                            arrTemp.name = month[i - 1] + ',' + year;
                            arrTemp.days = CommonFun.range(1, CommonFun.daysInMonth(i, year));
                            $scope.createDaysArray(arrTemp.days, i, year);
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

            $scope.createDaysArray = function(daysArray, m, y) {
                for (var j = 0; j < daysArray.length; j++) {
                    $scope.days.push(daysArray[j] + '_' + m + '_' + y);
                }
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
                $(".mainRow").mCustomScrollbar({
                    axis: "x",
                    theme: "inset-3",
                    scrollButtons: {enable: true},
                    scrollbarPosition: "outside"
                });
                if ($scope.setToday == 'yes')
                {
                    $(".mainRow").mCustomScrollbar("scrollTo", $('.' + CommonFun.gridToday()));
                    setTimeout(function() {
                        var w = ($(window).width() / 2) - 100;
                        $(".mainRow").mCustomScrollbar("scrollTo", '+=' + w);
                        $scope.setToday = 'no';
                    }, 1000);
                }
                $('.prev-btn').on('click', function(e) {
                    var oldDate = localStorage.getItem('selectDate');
                    console.log(JSON.stringify(localStorage.getItem('selectDate')));
                    var newDate = $('.' + CommonFun.formatDate(oldDate, 'DD/MM/YYYY', 'D_M_YYYY')).prev().data('day');
                    if (newDate != undefined && newDate != '')
                    {
                        $scope.$apply(function() {
                            $scope.selectDate = CommonFun.formatDate(newDate, 'D_M_YYYY', 'DD/MM/YYYY');
                            $('#select_date').val($scope.selectDate);
                            localStorage.setItem('selectDate', CommonFun.formatDate(newDate, 'D_M_YYYY', 'DD/MM/YYYY'));
                        });
                        var val = 150;
                        $('.mainRow').mCustomScrollbar("scrollTo", "+=" + val);
                    } else
                    {
                        services.showAlert('Notice', "Grid reached to it's minimum limit");
                    }

                });
                $('.next-btn').on('click', function(e) {
                    var oldDate = localStorage.getItem('selectDate');
                    var newDate = $('.' + CommonFun.formatDate(oldDate, 'DD/MM/YYYY', 'D_M_YYYY')).next().data('day');
                    if (newDate != undefined && newDate != '')
                    {
                        $scope.$apply(function() {
                            $scope.selectDate = CommonFun.formatDate(newDate, 'D_M_YYYY', 'DD/MM/YYYY');
                            $('#select_date').val($scope.selectDate);
                            localStorage.setItem('selectDate', CommonFun.formatDate(newDate, 'D_M_YYYY', 'DD/MM/YYYY'));
                        });
                        var val = 150;
                        $('.mainRow').mCustomScrollbar("scrollTo", "-=" + val);
                    } else
                    {
                        services.showAlert('Notice', "Grid reached to it's maximum limit");
                    }
                });
                $('.dragDiv').on('dblclick', function(e) {
                    $location.path('shipping/planning/' + $(this).data('orderid'));
                    $scope.$apply();
                });
                setTimeout(function() {
                    $('.date-head').on('click', function(e) {
                        var newDate = $(this).data('day');
                        $scope.$apply(function() {
                            $scope.selectDate = CommonFun.formatDate(newDate, 'D_M_YYYY', 'DD/MM/YYYY');
                            $('#select_date').val($scope.selectDate);
                            localStorage.setItem('selectDate', CommonFun.formatDate(newDate, 'D_M_YYYY', 'DD/MM/YYYY'));
                        });
                    });
                    $('.makeDroppable').on('click', function(e) {
                        var newDate = $(this).data('day');
                        $scope.$apply(function() {
                            $scope.selectDate = CommonFun.formatDate(newDate, 'D_M_YYYY', 'DD/MM/YYYY');
                            $('#select_date').val($scope.selectDate);
                            localStorage.setItem('selectDate', CommonFun.formatDate(newDate, 'D_M_YYYY', 'DD/MM/YYYY'));
                        });
                    });
                    $(".dragDiv").draggable({
                        revert: 'invalid'
                    });
                    $(".makeDroppable").droppable({
//                        accept: function(item) {
//                            return $(this).closest("tr").is(item.closest("tr")) && $(this).find("*").length == 0;
//                        },
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
            $scope.setGridDate = function(date)
            {
                CommonFun.setGridDate(date);
            }
            $scope.loadGrid = function() {
                $scope.loading = true;

//                $('.gridTable').empty();
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
                    services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
                });
            };
            $scope.changeDelDateByDrag = function(orderId, oldDate, newDate) {
                $scope.loading = true;
                $scope.postdata = [];
                $scope.postdata = [oldDate, CommonFun.getFullTimestamp(CommonFun.setDefaultDateFormat(newDate, 'D_M_YYYY'))];
                Restangular.all('shipping').one('planning', orderId).all('delivery').customPUT($scope.postdata).then(function(response) {
                    $scope.loading = false;
                    if (response.data.count > 0)
                    {
                        services.showAlert('Success', 'Successfully delivery date changed to ' + CommonFun.setDefaultDateFormat(newDate, 'D_M_YYYY')).then(function(res) {
                            totalWeightCal();
                        });
                    } else
                    {
                        services.showAlert('Error', 'Tente novamente ou entre em contato com o Suporte Técnico.').then(function(res) {
                            $(".gridTable > tbody > tr:nth-child(3) > td." + newDate).each(function() {
                                $(this).children().each(function() {
                                    if (parseInt($(this).data('olddate')) == parseInt(oldDate) && parseInt(orderId) == parseInt($(this).data('orderid')))
                                    {
                                        $(this).remove();
                                    }
                                });
                            });
                            $scope.loadGrid();
                        });
                    }

                }, function(response) {
                    $scope.loading = false;
                    services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
                });
            };
            $scope.goEdit = function(planningId) {
                $location.path('shipping/planning/' + planningId);
            }
        });