altamiraAppControllers.controller('ManufacturingProcsSearchCtrl',
        function($scope, $location, $routeParams, $localStorage, $ionicPopup, Restangular, services) {
            $scope.startPage = $routeParams.start;
            $scope.maxRecord = 10;
            $scope.currentPage = 1;
            $scope.pageSize = 1;
            $scope.pageStack = [];
            $scope.searchText = '';


            $scope.loadBom = function(searchText) {
                $scope.loading = true;
                var url = '';
                $scope.$storage = $localStorage.$default({
                    x: ''
                });
                $scope.deleteX = function() {
                    delete $scope.$storage.x;
                };
                $scope.searchText = $scope.$storage.x;
                if (searchText != '')
                {
                    $scope.deleteX();
                    $scope.$storage = $localStorage.$default({
                        x: searchText
                    });
                } else
                {
                    $scope.deleteX();
                }
                if ($scope.$storage.x == '' || $scope.$storage.x == undefined)
                {
                    Restangular.one('manufacturing/process').get({start: $scope.startPage, max: $scope.maxRecord}).then(function(response) {
                        $scope.loading = false;
                        $scope.processes = response.data;
                        $scope.range();
                        if (response.data == '') {
                            if ((parseInt($scope.startPage) != 0))
                            {
                                $location.path('/manufacturing/process/' + (parseInt($scope.startPage) - 1));
                            } else
                            {
                                services.showAlert('Notice', 'Process list is empty').then(function(res) {
                                });
                            }
                        }
                    }, function(response) {
                        $scope.loading = false;
                        services.showAlert('Falhou', 'Please try again');
                    });
                }
                else
                {
                    Restangular.one('manufacturing/process').get({search: $scope.$storage.x, start: $scope.startPage, max: $scope.maxRecord}).then(function(response) {
                        $scope.loading = false;
                        $scope.processes = response.data;
                        $scope.range();
                        if (response.data == '') {
                            if ((parseInt($scope.startPage) != 0))
                            {
                                $location.path('/manufacturing/process/' + (parseInt($scope.startPage) - 1));
                            } else
                            {
                                services.showAlert('Notice', 'Process list is empty').then(function(res) {
                                });
                            }
                        }
                    }, function(response) {
                        $scope.loading = false;
                        services.showAlert('Falhou', 'Please try again');
                    });
                }
            };
            $scope.searchProcess = function(searchVal) {
                $scope.searchText = searchVal;
                $scope.loadBom($scope.searchText);
            };
            if ($scope.searchText == '')
            {
                $scope.loadBom($scope.searchText);
            }

            $scope.newProcess = function() {
                $location.path('/manufacturing/create/process');
            }
            $scope.goPage = function(pageNumber) {
                var nextPage = parseInt(pageNumber) - 1;
                $location.path('/manufacturing/process/' + nextPage);
            }
            $scope.nextPage = function(len) {
                var nextPage = parseInt(len);
                $location.path('/manufacturing/process/' + nextPage);
            }
            $scope.prevPage = function(nextPage) {
                $location.path('/manufacturing/process/' + nextPage);
            }
            $scope.goUpdate = function(processId) {
                $location.path('/manufacturing/update/process/' + processId);
            }
            $scope.createProcess = function(code, desc) {
                $location.url('/manufacturing/create/process?code=' + code + '&desc=' + desc);
            }

            $scope.range = function() {
                var start = parseInt($scope.startPage) + 1;
                var input = [];
                for (var i = 1; i <= start; i++)
                    $scope.pageStack.push(i);
            };
        });