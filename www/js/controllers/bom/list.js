'use strict';

angular.module('altamiraAppControllers')
        .controller('BomListCtrl', function($scope, $http, $location, $routeParams) {
    $scope.checked = {
        items: []
    };
    $scope.status = function(itemId) {
        if (itemId != '' && itemId != undefined)
        {
            $http({
                method: 'PUT',
                url: 'http://data.altamira.com.br/data-rest-0.7.0-SNAPSHOT/data-rest-0.7.0-SNAPSHOT/manufacturing/bom/'+ itemId +'/checked',
                headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
            }).success(function(response) {
                $location.path('/bom/list');
            });
        }

    };
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
                $scope.loading = true;
                $http({
                    method: 'GET',
                    url: 'http://data.altamira.com.br/data-rest-0.7.0-SNAPSHOT/data-rest-0.7.0-SNAPSHOT/manufacturing/bom/search/',
                    params: {"search": this.criteria, "start": page, "max": this.size},
                    headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
                }).then(function(response) {
                    $scope.loading = false;
                    $scope.search.last = response.data;
                });
            } else {
                $scope.loading = true;
                $http({
                    method: 'GET',
                    url: 'http://data.altamira.com.br/data-rest-0.7.0-SNAPSHOT/data-rest-0.7.0-SNAPSHOT/manufacturing/bom',
                    params: {"start": page, "max": this.size},
                    headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
                }).then(function(response) {
                    $scope.loading = false;
                    console.log(response);
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

    $scope.edit = function(bomId) {
        $location.path('/bom/edit/' + bomId);
    };
    // first load
    $scope.search.run();
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