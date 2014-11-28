altamiraAppControllers.controller('MaterialListCtrl',
        function($scope, $http, $location, $route, $routeParams, $ionicPopup, $ionicLoading, $timeout, $state, Restangular, services) {

            $scope.search = {
                criteria: '', // search criteria
                page: 0, // current page
                last: undefined, // last results
                pages: [], // page cache
                size: 10, // page size
                forward: true, // enable next button

                // clean page cache for a new search results
                reset: function() {
                    this.forward = true;
                    this.pages = [];
                },
                // get next page from remote
                next: function() {
                    this.get($scope.search.pages.length);
                },
                // go to page number stored in the cache
                go: function(page) {
                    this.page = page;
                },
                // get page from remote api
                get: function(page) {
                    page = page === undefined ? 0 : page;

                    if (this.criteria.trim().length > 0) {
                        $scope.loading = false;
                        Restangular.one('common/material').get({search: this.criteria, start: page, max: this.size}).then(function(response) {
                            $scope.loading = false;
                            $scope.search.last = response.data;
                        }, function(response) {
                            services.showAlert('Falhou', 'Please try again');
                        });
                    } else {
                        $scope.loading = false;
                        Restangular.one('common/material').get({start: page, max: this.size}).then(function(response) {
                            $scope.loading = false;
                            $scope.search.last = response.data;
                        }, function(response) {
                            services.showAlert('Falhou', 'Please try again');
                        });
                    }
                },
                // run the search
                run: function() {
                    this.reset();
                    this.get(0);
                }
            }
            // first load
            $scope.search.run();
            $scope.newProcess = function() {
                $location.path('/material/create');
            }
            $scope.checkBtn = 0;
            // add page to the cache
            $scope.$watch('search.last',
                    function() {
                        if ($scope.search.last != undefined) {
                            if ($scope.search.last.length === 0) {
                                alert('Nenhum registro encontrado');
                                $scope.search.forward = false;
                            } else {
                                $scope.search.pages.push($scope.search.last);
                                $scope.search.page = $scope.search.pages.length - 1;
                            }
                        }
                    }
            );

        });