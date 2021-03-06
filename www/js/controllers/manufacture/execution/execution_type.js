altamiraAppControllers.controller('ManufactureExecutionCtrl',
        function($scope, $location, $route, Restangular, services, $ionicModal, CommonFun, $ionicSideMenuDelegate, $routeParams) {
            Restangular.one('manufacture/operation').get().then(function(response) {
                $scope.operationTypeData = response.data;
            }, function(response) {
                services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
            });
            $scope.selectOperationType = function(operationId) {
                var temp = $scope.getObjects($scope.operationTypeData,'id',operationId);
                localStorage.setItem('operationId', temp[0].id);
                localStorage.setItem('operationType', temp[0].type);
                localStorage.setItem('operationDesc', temp[0].name);
                $location.path('/manufacture/execution/list');
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
        });