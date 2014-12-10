altamiraAppControllers.controller('ManufacturingProcsSearchCtrl',
        function($scope, $location, $routeParams, $localStorage, $ionicPopup, Restangular, services, $route, $window) {

            $scope.startPage = 0;
            $scope.maxRecord = 3;
            $scope.searchText = '';
            $scope.processes = '';
            $scope.processesArray = '';
            $scope.isDataSearch = '';
            $scope.nextButton = true;
            if ($routeParams.token != null && $routeParams.token != '' && $routeParams.token != undefined && sessionStorage.getItem('token') == '')
            {
                sessionStorage.setItem('token', $routeParams.token);
                $window.location.reload();
            }
            $scope.loadProcess = function() {
                $scope.loading = true;
                Restangular.one('manufacturing').one('process').get({search: $scope.searchText, start: $scope.startPage, max: $scope.maxRecord}).then(function(response) {
                    if (response.data == '') {
                        if ((parseInt($scope.startPage) != 0))
                        {
                            $scope.nextButton = false;
                            $scope.startPage = (parseInt($scope.startPage) - 1);
                            $scope.loadProcess();
                        } else
                        {
                            services.showAlert('Notice', 'Material list is empty').then(function(res) {
                            });
                        }
                    } else
                    {
                        if ($scope.processes.length <= 0 && $scope.isDataSearch == '')
                        {
                            $scope.processes = response.data;
                            $scope.processesArray = response.data;
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
                                    $scope.processesArray.push(value);
                                });
                                $scope.pageProcesses();
                            }
                        }
                        $scope.loading = false;
                        $scope.range();
                    }
                }, function(response) {
                    services.showAlert('Falhou', 'Please try again');
                });
            };
            $scope.loadProcess();
            $scope.pageProcesses = function() {
                $scope.processes = [];
                $scope.start = $scope.startPage * $scope.maxRecord;
                $scope.end = ($scope.startPage * $scope.maxRecord) + $scope.maxRecord;
                for (var i = $scope.start; i < $scope.end; i++)
                {
                    if ($scope.processesArray[i])
                    {
                        $scope.processes.push($scope.processesArray[i]);
                    }
                }
            };

            $scope.searchProcess = function(text) {
                $scope.searchText = text;
                if ($scope.isDataSearch == '')
                {
                    $scope.startPage = 0;
                    $scope.processes = '';
                    $scope.processesArray = '';
                    $scope.nextButton = true;
                }
                if ($scope.searchText == '' && $scope.isDataSearch != '')
                {
                    $scope.startPage = 0;
                    $scope.processes = '';
                    $scope.processesArray = '';
                    $scope.isDataSearch = '';
                    $scope.nextButton = true;
                }
                $scope.loadProcess();
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
                $scope.loadProcess();

            }
            $scope.prevPage = function(nextPage) {
                $scope.startPage = nextPage;
                $scope.loadProcess();
            }
            $scope.goPage = function(pageNumber) {
                var nextPage = parseInt(pageNumber) - 1;
                $scope.startPage = nextPage;
                if ($scope.processesArray.length > 0)
                {
                    if ($scope.searchText == '' || ($scope.searchText != '' && $scope.isDataSearch != ''))
                    {
                        $scope.pageProcesses();
                    }
                }
                else
                {
                    $scope.loadProcess();
                }
            }
            $scope.newProcess = function() {
                $location.url('/manufacturing/create/process');
            }
            $scope.goUpdate = function(processId) {
                $location.url('/manufacturing/update/process/' + processId);
            }
            $scope.createProcess = function(code, desc) {
                $location.url('/manufacturing/create/process?code=' + code + '&desc=' + desc);
            }


        });