altamiraAppControllers.controller('DeliveryPlanningListCtrl',
        function($scope, $location, $routeParams, Restangular, services, $filter) {
            var tmpList = [];
            var tmpDate = [];
            for (var j = 1; j <= 30; j++) {
                tmpDate.push({
                    value: j
                });
            }
            for (var i = 1; i <= 6; i++) {
                tmpList.push({
                    text: 'Item ' + i,
                    value: i
                });
            }

            $scope.date = tmpDate;
            $scope.list = tmpList;


            $scope.sortingLog = [];

            $scope.sortableOptions = {
                connectWith: ".connectedSortable",
                update: function(e, ui) {
                    var logEntry = tmpList.map(function(i) {
                        return i.value;
                    }).join(', ');
                    $scope.sortingLog.push('Update: ' + logEntry);
                    console.log(JSON.stringify('Update: ' + logEntry));
                },
                stop: function(e, ui) {
                    // this callback has the changed model
                    var logEntry = tmpList.map(function(i) {
                        return i.value;
                    }).join(', ');
                    $scope.sortingLog.push('Stop: ' + logEntry);
                    console.log(JSON.stringify('Stop: ' + logEntry));
                }
            };
        });