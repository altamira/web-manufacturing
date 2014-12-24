altamiraAppControllers.controller('DeliveryPlanningListCtrl',
        function($scope, $location, $routeParams, Restangular, services, $filter) {
            $scope.loading = true;
            $scope.days = [];
            $scope.monthDays = [];
            var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            var currentMonth = new Date().getMonth();
            var currentYear = new Date().getFullYear();
            for (var i = 0; i <= 5; i++)
            {
                var temp = currentMonth + i;
                if (temp > 11)
                {
                    temp = temp - 12;
                }
                var arrTemp = {};
                arrTemp.name = month[temp];
                if ((currentMonth + i) > 11)
                {
                    arrTemp.days = range(1, daysInMonth(temp + 1, currentYear + 1));
                    createDaysArray(arrTemp.days, temp + 1, currentYear + 1);
                }
                else
                {
                    arrTemp.days = range(1, daysInMonth(temp + 1, currentYear));
                    createDaysArray(arrTemp.days, temp + 1, currentYear);
                }
                $scope.monthDays.push(arrTemp);
            }
            function createDaysArray(daysArray, m, y)
            {
                for (var j = 0; j < daysArray.length; j++) {
                    $scope.days.push(daysArray[j] + '_' + m + '_' + y);
                }
            }
            function daysInMonth(month, year) {
                return new Date(year, month, 0).getDate();
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
            $scope.totalDays = function() {
                return new Date(new Date().getYear(), new Date().getMonth() + 1, 0).getDate();
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
            Restangular.one('manufacturing/bom').get({checked: false, search: 'NISARG'}).then(function(response) {
                $scope.loading = false;
                $scope.totalBOM = response.data.length;
                $scope.dataBOM = response.data;
            }, function(response) {
                services.showAlert('Falhou', 'Please try again');
            });
            $scope.getData = function(id1, id2) {
                services.showAlert('Success', 'BOM ' + id1 + ' delivery date changed to ' + id2).then(function(res) {
                });
            }
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