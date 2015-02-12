altamiraAppControllers.controller('ManufacturingMainCtrl',
        function($scope, $location) {
            $scope.goAltamira = function(url) {
                $location.url(url);
            }
        });