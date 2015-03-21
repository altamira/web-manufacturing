altamiraAppControllers.controller('ShippingExecutionCtrl',
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
                $scope.loadPackingList();
            }
            $scope.gridView = function() {
                $scope.viewtype = 'grid';
                $('#form_view').hide();
                $('#formShowBtn').addClass('month');
                $('#grid_view').show();
                $('#gridShowBtn').removeClass('month');
                $scope.loadGrid();
            }
            $scope.operationType = sessionStorage.getItem('operationDesc');
            $scope.resetPackingList = function() {
                $scope.startPage = 0;
                $scope.maxRecord = 10;
                $scope.packingData = '';
                $scope.packingDataArray = [];
                $scope.nextButton = true;
            };
            $scope.searchText = sessionStorage.getItem('searchPackingList');
            $scope.tempSearch = '';
            $scope.isDataSearch = '';
            $scope.resetPackingList();
            $scope.loadPackingList = function() {
                $scope.loading = true;
                Restangular.one('shipping/execution').get({search: sessionStorage.getItem('searchPackingList'), start: $scope.startPage, max: $scope.maxRecord}).then(function(response) {
                    if (response.data == '') {
                        $scope.loading = false;
                        if ((parseInt($scope.startPage) != 0))
                        {
                            $scope.nextButton = false;
                            $scope.startPage = (parseInt($scope.startPage) - 1);
                            $scope.loadPackingList();
                        } else
                        {
                            $scope.pageStack = [];
                            services.showAlert('Aviso', 'A lista de Romaneios esta vazia.').then(function(res) {
                            });
                        }
                    } else
                    {
                        if ($scope.packingData.length <= 0 && $scope.isDataSearch == '')
                        {
                            $scope.packingData = response.data;
                            $scope.packingDataArray = response.data;
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
                                $scope.temp = response.data;
                                angular.forEach($scope.temp, function(value, key) {
                                    $scope.packingDataArray.push(value);
                                });
                                $scope.pagePackingListes();
                            }
                        }
                        $scope.loading = false;
                        $scope.range();
                    }
                }, function(response) {
                    services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
                });
            };
            $scope.loadPackingList();
            $scope.pagePackingListes = function() {
                $scope.packingData = [];
                $scope.start = $scope.startPage * $scope.maxRecord;
                $scope.end = ($scope.startPage * $scope.maxRecord) + $scope.maxRecord;
                for (var i = $scope.start; i < $scope.end; i++)
                {
                    if ($scope.packingDataArray[i])
                    {
                        $scope.packingData.push($scope.packingDataArray[i]);
                    }
                }
                if ($scope.packingData.length != $scope.maxRecord)
                {
                    $scope.nextButton = false;
                }
            };

            $scope.searchPackingList = function(text) {
                if (text != '')
                {
                    $scope.resetPackingList();
                    sessionStorage.setItem('searchPackingList', text);
                } else
                {
                    sessionStorage.setItem('searchPackingList', '');
                    $scope.resetPackingList();
                }
                $scope.loadPackingList();
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
                $scope.loadPackingList();

            }
            $scope.prevPage = function(nextPage) {
                $scope.startPage = nextPage;
                $scope.loadPackingList();
            }
            $scope.goPage = function(pageNumber) {
                var nextPage = parseInt(pageNumber) - 1;
                $scope.startPage = nextPage;
                if ($scope.packingDataArray.length > 0)
                {
                    if ($scope.searchText == '' || ($scope.searchText != '' && $scope.isDataSearch != ''))
                    {
                        $scope.pagePackingListes();
                    }
                }
                else
                {
                    $scope.loadPackingList();
                }
            }
            $scope.newPackingList = function(executionId, deliveryDate) {
                $scope.loading = true;
                $scope.postData = {};
                $scope.postData.id = 0;
                $scope.postData.delivery = deliveryDate;
                Restangular.one('shipping/execution', executionId).all('packinglist').post($scope.postData).then(function(response) {
                    $location.path('/shipping/execution/' + executionId + '/packinglist/' + response.data.id);
                }, function(response) {
                    services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
                });
            }
            $scope.toggleLeft = function() {
                $ionicSideMenuDelegate.toggleLeft();
            };
            $scope.createPackingListPage = function() {
                $location.path('/shipping/execution/packinglist/create');
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
            $scope.decorateTable = function() {

                $(".mainRow").mCustomScrollbar({
                    axis: "x",
                    theme: "inset-3",
                    scrollButtons: {enable: true},
                    scrollbarPosition: "outside"
                });
                $(".mainRow").mCustomScrollbar("scrollTo",$('.'+moment().format('D_M_YYYY')));
                setTimeout(function() {
                    var w = ($( window ).width()/2)-100;
                    $(".mainRow").mCustomScrollbar("scrollTo",'+='+w)
                }, 1000);
//                $(".mainRow").mCustomScrollbar("scrollTo",'-=100');
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
                Restangular.one('shipping/execution').get({max: 999}).then(function(response) {
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
        });