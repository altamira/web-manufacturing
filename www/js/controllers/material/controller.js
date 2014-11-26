altamiraAppControllers.controller('MaterialListCtrl',
        function($scope, $http, $location, $route, $routeParams, $ionicPopup, $ionicLoading, $timeout, $state, Restangular) {

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
                        $http({
                            method: 'GET',
                            url: 'http://data.altamira.com.br/data-rest-0.7.0-SNAPSHOT/data-rest-0.7.0-SNAPSHOT/common/material',
                            params: {"search": this.criteria, "start": page, "max": this.size},
                            headers: {'Content-Type': 'application/json'}
                        }).then(function(response) {
                            console.log(response);
                            $scope.loading = false;
                            $scope.search.last = response.data;
                        });
                    } else {
                        $scope.loading = false;
                        $http({
                            method: 'GET',
                            url: 'http://data.altamira.com.br/data-rest-0.7.0-SNAPSHOT/data-rest-0.7.0-SNAPSHOT/common/material',
                            params: {"start": page, "max": this.size},
                            headers: {'Content-Type': 'application/json'}
                        }).then(function(response) {

                            $scope.loading = false;
                            $scope.search.last = response.data;
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
altamiraAppControllers.controller('MaterialCreateCtrl', ['$scope', '$http', '$location', '$ionicPopup', '$routeParams',
    function($scope, $http, $location, $ionicPopup, $routeParams) {
        $scope.materialData = {};
        $scope.postdata = {};
        $scope.materialData.code = '';
        $scope.materialData.description = '';
        $scope.submitCreateMaterial = function(isValid) {
            if (isValid) {
                $scope.loading = true;
                $scope.postdata.code = $scope.materialData.code;
                $scope.postdata.description = $scope.materialData.description;
                console.log(JSON.stringify($scope.postdata));
                $http({
                    method: 'POST',
                    url: 'http://data.altamira.com.br/data-rest-0.7.0-SNAPSHOT/data-rest-0.7.0-SNAPSHOT/common/material',
                    data: $scope.postdata,
                    headers: {'Content-Type': 'application/json'}
                }).success(function(data, status, headers, config) {
                    $scope.loading = false;
                    $location.path('/material/update/' + data.id);
                }).error(function(data, status, headers, config) {
                    $scope.loading = false;
                    $ionicPopup.alert({
                        title: 'Failer',
                        content: 'Please try again'
                    }).then(function(res) {

                    });
                });
            }
        };
        $scope.goBack = function() {
            $location.url('/common/material/' + 0);
        };
    }]);
altamiraAppControllers.controller('MaterialUpdateCtrl', ['$scope', '$http', '$location', '$ionicPopup', '$routeParams',
    function($scope, $http, $location, $ionicPopup, $routeParams) {
        $scope.materialId = $routeParams.materialId;
        $scope.materialData = {};
        $scope.postdata = {};
        $scope.loadProcess = function() {
            $scope.loading = true;
            $http({
                method: 'GET',
                url: 'http://data.altamira.com.br/data-rest-0.7.0-SNAPSHOT/data-rest-0.7.0-SNAPSHOT/common/material/' + $scope.materialId,
                headers: {'Content-Type': 'application/json'}
            }).success(function(data) {
                $scope.loading = false;
                $scope.materialData.id = data.id;
                $scope.materialData.version = data.version;
                $scope.materialData.code = data.code;
                $scope.materialData.description = data.description;
            }).error(function(data, status, headers, config) {
                $scope.loading = false;
                $ionicPopup.alert({
                    title: 'Failer',
                    content: 'Please try again'
                }).then(function(res) {

                });
            });
        };
        $scope.loadProcess();
        $scope.submitUpdateMaterial = function(isValid) {
            if (isValid) {
                $scope.loading = true;
                $scope.postdata.id = $scope.materialId;
                $scope.postdata.version = $scope.materialData.version;
                $scope.postdata.code = $scope.materialData.code;
                $scope.postdata.description = $scope.materialData.description;
                console.log(JSON.stringify($scope.postdata));
                $http({
                    method: 'PUT',
                    url: 'http://data.altamira.com.br/data-rest-0.7.0-SNAPSHOT/data-rest-0.7.0-SNAPSHOT/common/material/' + $scope.materialId,
                    data: $scope.postdata,
                    headers: {'Content-Type': 'application/json'}
                }).success(function(data, status, headers, config) {
                    $scope.loading = false;
                    $location.path('/manufacturing/update/process/' + data.id);
                }).error(function(data, status, headers, config) {
                    $scope.loading = false;
                    $ionicPopup.alert({
                        title: 'Failer',
                        content: 'Please try again'
                    }).then(function(res) {

                    });
                });
            }
        };
        $scope.goBack = function() {
            $location.url('/common/material/' + 0);
        };
    }]);
altamiraAppControllers.controller('MaterialComponentCtrl', ['$scope', '$http', '$location', '$routeParams', '$upload', '$ionicPopup', '$ionicModal',
    function($scope, $http, $location, $routeParams, $upload, $ionicPopup, $ionicModal) {
        $scope.materialId = $routeParams.materialId;
        $scope.componentId = $routeParams.componentId;
        $scope.action = 'create';
        $scope.componentData = {};
        $scope.componentData.unitBox = {};
        $http({
            method: 'GET',
            url: 'http://data.altamira.com.br/data-rest-0.7.0-SNAPSHOT/data-rest-0.7.0-SNAPSHOT/measurement/unit',
            headers: {'Content-Type': 'application/json'}
        }).success(function(data, status, headers, config) {
            $scope.componentData.unitBox = data;

        }).error(function(data, status, headers, config) {
            $ionicPopup.alert({
                title: 'Failer',
                content: 'Please try again'
            }).then(function(res) {

            });
        });
        if ($scope.componentId != '' && $scope.componentId != undefined)
        {
            $scope.action = 'update';
            $scope.loading = true;
            $http({
                method: 'GET',
                url: 'http://data.altamira.com.br/data-rest-0.7.0-SNAPSHOT/data-rest-0.7.0-SNAPSHOT/common/material/' + $scope.materialId + '/component/' + $scope.componentId,
                headers: {'Content-Type': 'application/json'}
            }).success(function(data, status, headers, config) {
                $scope.loading = false;
                $scope.componentData.code = data.code;
                $scope.componentData.version = data.version;
                $scope.componentData.description = data.description;
                $scope.componentData.quantity = data.quantity.value;
                $scope.componentData.unit = data.quantity.unit.id;

            }).error(function(data, status, headers, config) {
                $scope.loading = false;
                $ionicPopup.alert({
                    title: 'Failer',
                    content: 'Please try again'
                }).then(function(res) {

                });
            });
        }
        else
        {
            $scope.componentData.code = '';
            $scope.componentData.version = 0;
            $scope.componentData.description = '';
            $scope.componentData.quantity = 1;
            $scope.componentData.unit = 6;
        }

        $scope.submiComponentForm = function(isValid) {
            if (isValid) {
                $scope.loading = true;
                $scope.postdata = {};
                var method = 'POST';
                var url = 'http://data.altamira.com.br/data-rest-0.7.0-SNAPSHOT/data-rest-0.7.0-SNAPSHOT/common/material/' + $scope.materialId + '/component/';
                if ($scope.componentId != '' && $scope.componentId != undefined)
                {
                    $scope.postdata.id = $scope.componentId;
                    $scope.postdata.version = $scope.componentData.version;
                    method = 'PUT';
                    url = 'http://data.altamira.com.br/data-rest-0.7.0-SNAPSHOT/data-rest-0.7.0-SNAPSHOT/common/material/' + $scope.materialId + '/component/' + $scope.componentId;
                }
                $scope.postdata.code = $scope.componentData.code;
                $scope.postdata.version = $scope.componentData.version;
                $scope.postdata.description = $scope.componentData.description;
                $scope.postdata.quantity = {};
                $scope.postdata.quantity.value = parseFloat($scope.componentData.quantity);
                $scope.postdata.quantity.unit = {};
                var httpRequest = $http({
                    method: 'GET',
                    url: 'http://data.altamira.com.br/data-rest-0.7.0-SNAPSHOT/data-rest-0.7.0-SNAPSHOT/measurement/unit/' + $scope.componentData.unit,
                    headers: {'Content-Type': 'application/json'}
                }).success(function(data) {
                    $scope.postdata.quantity.unit = data;
                    $http({
                        method: method,
                        url: url,
                        data: $scope.postdata,
                        headers: {'Content-Type': 'application/json'}
                    }).success(function(data, status, headers, config) {
                        $scope.loading = false;
                        $location.path('/material/update/' + $scope.materialId);
                    }).error(function(data, status, headers, config) {
                        $scope.loading = false;
                        $ionicPopup.alert({
                            title: 'Failer',
                            content: 'Please try again'
                        }).then(function(res) {

                        });
                    });
                });
            }
        };

        var httpRequest = $http({
            method: 'GET',
            url: 'http://data.altamira.com.br/data-rest-0.7.0-SNAPSHOT/data-rest-0.7.0-SNAPSHOT/manufacturing/process?start=0&max=5',
            headers: {'Content-Type': 'application/json'}
        }).success(function(data) {
            $scope.items = data;
            $scope.currentPage = 1;
            $scope.pageSize = 1;
        });
        $scope.searchProcess = function(text) {
            var httpRequest = $http({
                method: 'GET',
                url: 'http://data.altamira.com.br/data-rest-0.7.0-SNAPSHOT/data-rest-0.7.0-SNAPSHOT/manufacturing/process?search=' + text + '&start=0&max=4',
                headers: {'Content-Type': 'application/json'}
            }).success(function(data) {
                $scope.items = data;
            });
        };

        $scope.goUpdate = function(code, desc) {
            $scope.componentData.code = code;
            $scope.componentData.description = desc;
            $scope.closeModal();
        };

        $ionicModal.fromTemplateUrl('find_product.html', {
            scope: $scope,
            animation: 'slide-in-left'
        }).then(function(modal) {
            $scope.modal = modal;
        });
        $scope.openModal = function() {
            $scope.modal.show();
        };
        $scope.closeModal = function() {
            $scope.modal.hide();
        };
        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });
        // Execute action on hide modal
        $scope.$on('modal.hidden', function() {
            // Execute action
        });
        // Execute action on remove modal
        $scope.$on('modal.removed', function() {
            // Execute action
        });

        $scope.removeUse = function() {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Confirmation',
                template: 'Are you sure to remove this Component ?'
            });
            confirmPopup.then(function(res) {
                if (res) {
                    $http({
                        method: 'DELETE',
                        url: 'http://data.altamira.com.br/data-rest-0.7.0-SNAPSHOT/data-rest-0.7.0-SNAPSHOT/common/material/' + $scope.materialId + '/component/' + $scope.componentId,
                        headers: {'Content-Type': 'application/json'}
                    }).success(function(response) {
                        $ionicPopup.alert({
                            title: 'Success',
                            content: ' A Component - ' + $scope.componentId + ' removed successfully.'
                        }).then(function(res) {
                            $location.path('/material/update/' + $scope.materialId);
                        });
                    }).error(function(data, status, headers, config) {
                        $ionicPopup.alert({
                            title: 'Failer',
                            content: 'Please try again'
                        }).then(function(res) {

                        });
                    });
                } else {
                    console.log("NO");
                }
            });
        };
        $scope.goBack = function() {
            $location.path('/material/update/' + $scope.materialId);
        };
    }]);