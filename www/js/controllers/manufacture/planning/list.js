altamiraAppControllers.controller('ManufacturePlanningCtrl',
        function($scope, $location, $route, Restangular, services, $ionicModal, CommonFun, $ionicSideMenuDelegate, $routeParams) {
            if ($routeParams.token != null && $routeParams.token != undefined && localStorage.getItem('token') == null)
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
            $scope.inicialDate = true;
            $scope.finalDate = true;
            $scope.currentYear = CommonFun.currentYear();
            $scope.selectDate = CommonFun.selectDate();
            localStorage.setItem('selectDate', $scope.selectDate);
            $scope.validYears = CommonFun.validYears();
            $scope.viewtype = 'form';
            $scope.formView = function() {
                $scope.plannings = [];
                $scope.planningsArray = [];
                $scope.viewtype = 'form';
                $scope.setToday = 'yes'
                $('#form_view').show();
                $('#formShowBtn').removeClass('month');
                $('#grid_view').hide();
                $('#gridShowBtn').addClass('month');
                $scope.loadPlanning();
            }
            $scope.gridView = function() {
                $scope.viewtype = 'grid';
                $('#form_view').hide();
                $('#formShowBtn').addClass('month');
                $('#grid_view').show();
                $('#gridShowBtn').removeClass('month');
                $scope.loadGrid();
            }
            $scope.resetPlanning = function() {
                $scope.startPage = 0;
                $scope.maxRecord = 10;
                $scope.plannings = [];
                $scope.planningsArray = [];
                $scope.nextButton = true;
            };
            $scope.searchText = localStorage.getItem('searchText');
            $scope.tempSearch = '';
            $scope.isDataSearch = '';
            $scope.resetPlanning();
            $scope.loadPlanning = function() {
                $scope.loading = true;
                Restangular.one('manufacture').one('planning').get({search: localStorage.getItem('searchText'), start: $scope.startPage, max: $scope.maxRecord}).then(function(response) {
                    if (response.data == '') {
                        $scope.loading = false;
                        if ((parseInt($scope.startPage) != 0))
                        {
                            $scope.nextButton = false;
                            $scope.startPage = (parseInt($scope.startPage) - 1);
                            $scope.loadPlanning();
                        } else
                        {
                            $scope.pageStack = [];
                            services.showAlert('Aviso', 'Lista de Planning de Fabricação esta vazia.').then(function(res) {
                            });
                        }
                    } else
                    {
                        if ($scope.plannings.length <= 0 && $scope.isDataSearch == '')
                        {
                            for (var i = 0; i < response.data.length; i++)
                            {
                                $scope.tempPlan = {};
                                $scope.tempPlan.id = response.data[i].id;
                                $scope.tempPlan.type = response.data[i].type;
                                $scope.tempPlan.createdDate = CommonFun.setDefaultDateFormat(response.data[i].createdDate, 'YYYY-MM-DD');
                                $scope.tempPlan.startDate = CommonFun.setDefaultDateFormat(response.data[i].startDate, 'YYYY-MM-DD');
                                $scope.tempPlan.endDate = CommonFun.setDefaultDateFormat(response.data[i].endDate, 'YYYY-MM-DD');
                                $scope.tempPlan.bom = [];
                                $scope.plannings.push($scope.tempPlan);
                            }
                            $scope.planningsArray = $scope.plannings;
                            if ($scope.searchText != null)
                            {
                                $scope.isDataSearch = 'yes';
                            }
                            else
                            {
                                $scope.isDataSearch = '';
                            }
                            setTimeout(function() {
                                $scope.manageSection();
                            }, 500);
                        }
                        else
                        {
                            if ($scope.nextButton != false)
                            {
                                for (var i = 0; i < response.data.length; i++)
                                {
                                    $scope.tempPlan = {};
                                    $scope.tempPlan.id = response.data[i].id;
                                    $scope.tempPlan.type = response.data[i].type;
                                    $scope.tempPlan.createdDate = response.data[i].createdDate;
                                    $scope.tempPlan.startDate = response.data[i].startDate;
                                    $scope.tempPlan.endDate = response.data[i].endDate;
                                    $scope.tempPlan.bom = [];
                                    $scope.planningsArray.push($scope.tempPlan);
                                }
                                $scope.pagePlanning();
                            }
                        }
                        $scope.loading = false;
                        $scope.range();
                    }
                }, function(response) {
                    $scope.loading = false;
                    services.showAlert('Falhou', 'Tente Novamente UO Entre em Contato com o Suporte Técnico.');
                });
            };
            $scope.loadPlanning();
            $scope.pagePlanning = function() {
                $scope.plannings = [];
                $scope.start = $scope.startPage * $scope.maxRecord;
                $scope.end = ($scope.startPage * $scope.maxRecord) + $scope.maxRecord;
                for (var i = $scope.start; i < $scope.end; i++)
                {
                    if ($scope.planningsArray[i])
                    {
                        $scope.plannings.push($scope.planningsArray[i]);
                    }
                }
                if ($scope.plannings.length != $scope.maxRecord)
                {
                    $scope.nextButton = false;
                }
            };

            $scope.searchTextFind = function(text) {
                if (text != '')
                {
                    $scope.resetPlanning();
                    localStorage.setItem('searchText', text);
                } else
                {
                    localStorage.setItem('searchText', '');
                    $scope.resetPlanning();
                }
                $scope.loadPlanning();
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
                $scope.loadPlanning();

            }
            $scope.prevPage = function(nextPage) {
                $scope.startPage = nextPage;
                $scope.loadPlanning();
            }
            $scope.goPage = function(pageNumber) {
                var nextPage = parseInt(pageNumber) - 1;
                $scope.startPage = nextPage;
                if ($scope.planningsArray.length > 0)
                {
                    if ($scope.searchText == '' || ($scope.searchText != '' && $scope.isDataSearch != ''))
                    {
                        $scope.pagePlanning();
                    }
                }
                else
                {
                    $scope.loadPlanning();
                }
            }
            $scope.getOrders = function(planingId) {
                $scope.loading = true;
                Restangular.one('manufacture').one('planning', planingId).one('bom').get().then(function(response) {
                    for (var i = 0; i < $scope.planningsArray.length; i++)
                    {
                        if (parseInt($scope.planningsArray[i].id) == parseInt(planingId))
                        {
                            $scope.planningsArray[i].bom = response.data;
                            $('.bom_' + planingId).show('slow');
                            $scope.loading = false;
                        }
                    }
                }, function(response) {
                    $scope.loading = false;
                    services.showAlert('Falhou', 'Tente Novamente UO Entre em Contato com o Suporte Técnico.');
                });
            }
            $scope.manageSection = function()
            {
                $('.list_manage_button').click(function() {
                    var planningid = $(this).data('planningid');
                    if ($('.bom_' + planningid).html() == undefined)
                    {
                        $scope.getOrders(planningid);
                        $(this).addClass('fa-minus-square-o');
                    } else if ($('.bom_' + planningid).html() != undefined && $(this).hasClass('fa-minus-square-o') == false)
                    {
                        $('.bom_' + planningid).show('slow');
                        $(this).addClass('fa-minus-square-o');
                    }
                    else
                    {
                        $('.bom_' + planningid).hide('slow');
                        $(this).removeClass('fa-minus-square-o');
                    }
                });
            }
            $scope.createPlanning = function() {
                $scope.planning = {};
                $ionicModal.fromTemplateUrl('templates/manufacture/planning/popup/create.html', {
                    scope: $scope,
                    animation: 'fade-in'
                }).then(function(modal) {
                    $scope.createManPlanningModal = modal;
                    $scope.createManPlanningModalShow = function() {
                        $scope.createManPlanningModal.show();
                    }
                    $scope.createManPlanningModalHide = function() {
                        $scope.createManPlanningModal.hide();
                    }
                    $scope.createManPlanningModalShow();
                });
            };
            $scope.submitCreateManufacturePlanning = function(isValid) {
                if (isValid) {
                    localStorage.setItem('createOrderFormInicial', $scope.planning.inicial);
                    localStorage.setItem('createOrderFormFinal', $scope.planning.final);
                    $scope.createManPlanningModalHide();
                    $location.path('manufacture/planning/create');
                }
                else
                {
                    services.showAlert('Falhou', 'Você perdeu alguma coisa. Por favor, verifique as mensagens de erro.');
                }
            };
            $scope.goEdit = function(planningId) {
                $location.path('manufacture/planning/edit/' + planningId);
            }
            $scope.getCellColor = function(st, weight) {
                if (st < CommonFun.toDayTimeStamp() || (parseInt(weight) > 30))
                {
                    return 'red';
                }
            }
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
                        var w = ($(window).width() / 2) - 350;
                        $(".mainRow").mCustomScrollbar("scrollTo", '+=' + w);
                        $scope.setToday = 'no';
                    }, 1000);
                }

                $('.prev-btn').on('click', function(e) {
                    var oldDate = localStorage.getItem('selectDate');
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
                    totalWeightCal();
                }, 100);
            }
            $scope.setGridDate = function(date)
            {
                $(".mainRow").mCustomScrollbar("scrollTo", $('.' + date));
                setTimeout(function() {
                    var w = ($(window).width() / 2) - 350;
                    $(".mainRow").mCustomScrollbar("scrollTo", '+=' + w);
                }, 1000);
            }

            $scope.loadGrid = function() {
                $scope.loading = true;
                $scope.itemId = [];
                $scope.itemPartIdArr = [];
                $scope.itemPartDeliveryArr = [];
                $scope.finalArr = '';
                Restangular.one('manufacture').one('planning').one('process').one('summary').get({max: 99999}).then(function(response) {
                    $scope.loading = false;
                    $scope.finalArr = response.data;
                    $scope.gridArr = [];
                    for (var i = 0; i < response.data.length; i++)
                    {
                        $scope.tempArr = {};
                        $scope.tempArr.id = response.data[i].id;
                        $scope.tempArr.type = response.data[i].type;
                        $scope.tempArr.name = response.data[i].name;
                        $scope.tempArr.produce = [];
                        for (var j = 0; j < $scope.finalArr.length; j++)
                        {
                            if (parseInt($scope.tempArr.id) == parseInt($scope.finalArr[j].id))
                            {
                                $scope.tempArr.produce.push($scope.finalArr[j].produce)
                            }
                        }
                        if ($scope.getObjects($scope.gridArr, 'id', $scope.tempArr.id).length == 0)
                        {
                            $scope.gridArr.push($scope.tempArr);
                        }
                    }
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
//                        $scope.makeDummyRowL();
//                        $scope.makeDummyRowR();
                    }, 100);
                }, function(response) {
                    services.showAlert('Falhou', 'Tente Novamente UO Entre em Contato com o Suporte Técnico.');
                });
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
            $scope.makeDummyRowL = function()
            {
                var totalrow = 18; // total 23
                var usedrow = $scope.gridArr.length;
                var dataTableRowLen = $('.dataTable tr').length;

                if (dataTableRowLen < totalrow)
                {
                    for (usedrow; usedrow <= totalrow; usedrow++)
                    {
                        if (($('.dataTable tr').length % 2) == 0)
                        {
                            $('.dataTable tr:last').before('<tr class="even" style="height: 36px;"><td></td></tr>');
                        }
                        else
                        {
                            $('.dataTable tr:last').before('<tr class="odd" style="height: 36px;"><td></td></tr>');
                        }
                    }
                }
            }
            $scope.makeDummyRowR = function()
            {
                var totalrow = 19;
                var usedrow = $scope.gridArr.length;
                var mainTableRowLen = $('.manufactureTable tr').length;
                if (mainTableRowLen < totalrow)
                {
                    var mainTableTR = '';
                    $('.manufactureTable tr:nth-last-child(2) td').each(function() {
                        var strClass = $(this).attr("class");
                        var dataDay = $(this).data("day");
                        if (strClass.indexOf('holiday') > -1) {
                            mainTableTR += '<td class="' + dataDay + ' holiday">&nbsp;</td>';
                        } else {
                            mainTableTR += '<td class="' + dataDay + '">&nbsp;</td>';
                        }
                    });
                    for (usedrow; usedrow < totalrow; usedrow++)
                    {
                        if (($('.manufactureTable tr').length % 2) == 0)
                        {
                            $('.manufactureTable tr:last').before('<tr class="even" style="height: 36px;">' + mainTableTR + '</tr>');
                        }
                        else
                        {
                            $('.manufactureTable tr:last').before('<tr class="odd" style="height: 36px;">' + mainTableTR + '</tr>');
                        }

                    }
                }
//                var allCells = $(".mainTable td");
//                allCells.on("mouseover", function() {
//                    var el = $(this),
//                            pos = el.index();
//                    el.parent().find("th, td").addClass("hover");
//                    allCells.filter(":nth-child(" + (pos + 1) + ")").addClass("hover");
//                })
//                        .on("mouseout", function() {
//                    allCells.removeClass("hover");
//                });
            }
        });
function unique_arr(array) {
    return array.filter(function(el, index, arr) {
        return index == arr.indexOf(el);
    });
}