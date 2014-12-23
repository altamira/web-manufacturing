altamiraAppControllers.controller('DeliveryPlanningListCtrl',
        function($scope, $location, $routeParams, Restangular, services, $filter) {
            var tmpList = [];
            var tmpDate = [];
            for (var j = 1; j <= 30; j++) {
                tmpDate.push({
                    value: randomString()
                });
            }
            for (var i = 1; i <= 6; i++) {
                tmpList.push({text: 'Item ' + i, value: i});
            }

            $scope.date = tmpDate;
            $scope.list = tmpList;
            $scope.getData = function(id1, id2) {
                console.log(JSON.stringify(id1));
                console.log(JSON.stringify(id2));
            }
//            $scope.getRandomstring = function() {
//                return Math.floor((Math.random() * 6) + 1);
//            }
        });
function randomString()
{
    return Math.floor((Math.random() + 1));
}