altamiraAppControllers.controller('DeliveryPlanningListCtrl',
        function($scope, $location, $routeParams, Restangular, services, $filter) {
            var tmpList = [];
            var tmpDate = [];
            $scope.days = [];
            var randoms = randomNumbers(200);
            randoms = randoms.sort(function(a, b) {
                return a - b
            });
            $scope.totalDays = function() {
                return new Date(new Date().getYear(), new Date().getMonth() + 1, 0).getDate();
            }
            $scope.checkDate = function(st) {
                return moment.unix(st).format('DD');
            }
            for (var j = 1; j <= $scope.totalDays(); j++) {
                $scope.days.push(j);
            }
            Restangular.one('manufacturing/bom').get({checked: false, search: 'NISARG'}).then(function(response) {
                $scope.loading = false;
                $scope.totalBOM = response.data.length;
                $scope.dataBOM = response.data;
            }, function(response) {
                services.showAlert('Falhou', 'Please try again');
            });
            for (var j = 1; j <= 30; j++) {
                if (j % 2 == 0)
                {
                    tmpDate.push({
                        value: randoms[j]
                    });
                }
                else
                {
                    tmpDate.push({
                        value: 0
                    });
                }
            }
            for (var i = 1; i <= 3; i++) {
                tmpList.push({text: 'Item ' + i, value: i});
            }

            $scope.date = tmpDate;
            $scope.list = tmpList;
            $scope.getData = function(id1, id2) {
                services.showAlert('Success', 'BOM '+id1+' delivery date changed to '+id2).then(function(res) {
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