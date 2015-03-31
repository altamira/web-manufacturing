altamiraAppControllers.controller('ManufacturePlanningGridCtrl',
        function($scope, $location, $route, Restangular, services, $ionicModal, CommonFun, $ionicSideMenuDelegate, $routeParams) {
            var pt = moment().locale('pt-br');
            $scope.today = pt.format('dddd, LL');
            moment.locale('pt-br');
            var month = moment.months();
            moment.locale('en');
            $scope.tempUnixTS = [];
            $scope.viewWeekly = false;
            $scope.setToday = 'yes';
            $scope.inicialDate = true;
            $scope.finalDate = true;
            $scope.currentYear = moment().format('YYYY');
            $scope.validYears = [parseInt($scope.currentYear) - 1, parseInt($scope.currentYear), parseInt($scope.currentYear) + 1];

            $scope.getCellColor = function(st, weight) {
                if (st < moment().valueOf() || (parseInt(weight) > 30))
                {
                    return 'red';
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
                return month;
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
                $(".mainRow").mCustomScrollbar({
                    axis: "x",
                    theme: "inset-3",
                    scrollButtons: {enable: true},
                    scrollbarPosition: "outside"
                });
                $(".planning-page").mCustomScrollbar({
                    axis: "y",
                    theme: "inset-3",
                    scrollButtons: {enable: true},
                    scrollbarPosition: "outside"
                });
//                if ($scope.setToday == 'yes')
//                {
//                    $(".mainRow").mCustomScrollbar("scrollTo", $('.' + moment().format('D_M_YYYY')));
//                    setTimeout(function() {
//                        var w = ($(window).width() / 2) - 100;
//                        $(".mainRow").mCustomScrollbar("scrollTo", '+=' + w);
//                        $scope.setToday = 'no';
//                    }, 1000);
//                }
                $('.dragDiv').on('dblclick', function(e) {
                    $location.path('shipping/planning/' + $(this).data('orderid'));
                    $scope.$apply();
                });
                setTimeout(function() {

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
                    totalWeightCal();
                }, 100);
            }
            $scope.setTodayGrid = function() {

            }
            $scope.loadGrid = function() {
                $scope.loading = true;
                $scope.itemId = [];
                $scope.itemPartIdArr = [];
                $scope.itemPartDeliveryArr = [];
                $scope.finalArr = '';
                Restangular.one('manufacture/planning/operation/summary').get().then(function(response) {
                    $scope.loading = false;
                    $scope.finalArr = response.data;
                    var main = [];
                    for (var i = 0; i < $scope.finalArr.length; i++)
                    {
                        $scope.tempUnixTS.push(CommonFun.getFullTimestamp(CommonFun.setDefaultDateFormat($scope.finalArr[i].produce.startDate, 'YYYY-MM-DD')));
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
        });
function unique_arr(array) {
    return array.filter(function(el, index, arr) {
        return index == arr.indexOf(el);
    });
}