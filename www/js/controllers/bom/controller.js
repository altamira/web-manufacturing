'use strict';

altamiraAppControllers.controller('BomListCtrl', function($scope, $http, $location, $route, $routeParams) {
    $scope.checked = {
        items: []
    };
    $scope.status = function(itemId) {
        if (itemId != '' && itemId != undefined)
        {
            $http({
                method: 'PUT',
                url: 'http://data.altamira.com.br/manufacturing/bom/' + itemId + '/checked',
                headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
            }).success(function(response) {
                $route.reload();
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
                $http({
                    method: 'GET',
                    url: 'http://data.altamira.com.br/manufacturing/bom/search/',
                    params: {"search": this.criteria, "start": page, "max": this.size},
                    headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
                }).then(function(response) {
                    $scope.search.last = response.data;
                });
            } else {
                $http({
                    method: 'GET',
                    url: 'http://data.altamira.com.br/manufacturing/bom/',
                    params: {"start": page, "max": this.size},
                    headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
                }).then(function(response) {
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

altamiraAppControllers.controller('BomEditCtrl', function($scope, $http, $location, $route, $routeParams) {
    $scope.bomId = $routeParams.bomId;
    $scope.project = '';
    $scope.bomData = {};
    $scope.bomData.number = '';
    $scope.bomData.project = '';
    $scope.bomData.customer = '';
    $scope.bomData.representative = '';
    $scope.bomData.finish = '';
    $scope.bomData.quotation = '';
    $scope.bomData.created = '';
    $scope.bomData.delivery = '';
    var httpRequest = $http({
        method: 'GET',
        url: 'http://data.altamira.com.br/manufacturing/bom/' + $scope.bomId,
        headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
    }).success(function(data) {
        console.log(JSON.stringify(data));
        if (data != '')
        {
            $scope.bomData.number = data.number;
            $scope.bomData.project = data.project;
            $scope.bomData.customer = data.customer;
            $scope.bomData.representative = data.representative;
            $scope.bomData.finish = data.finish;
            $scope.bomData.quotation = data.quotation;
            var createdDate = new Date(data.created);
            var deliveryDate = new Date(data.delivery);

            $scope.bomData.created = createdDate.getDate() + '/' + createdDate.getMonth() + '/' + createdDate.getFullYear();
            $scope.bomData.delivery = deliveryDate.getDate() + '/' + deliveryDate.getMonth() + '/' + deliveryDate.getFullYear();
            $scope.bomData.items = data.items;
        }
    });
    $scope.createItem = function() {
        $location.path('/bom/item/create/' + $scope.bomId);
    };
    $scope.updateItem = function(itemId) {
        $location.path('/bom/item/update/' + $scope.bomId + '/' + itemId);
    };
    $scope.removeItem = function(itemId) {
        $http({
            method: 'DELETE',
            url: 'http://data.altamira.com.br/manufacturing/bom/' + $scope.bomId + '/item/' + itemId,
        }).then(function() {
            $route.reload();
        });
    };
    $scope.goBack = function() {
        $location.path('bom/list');
    };
});

altamiraAppControllers.controller('BomItemCreateCtrl', ['$scope', '$http', '$location', '$routeParams',
    function($scope, $http, $location, $routeParams) {
        $scope.bomId = $routeParams.bomId;
        $scope.itemData = {};
        $scope.itemData.version = '';
        $scope.itemData.item = '';
        $scope.itemData.description = '';
        $scope.submitCreateItem = function(isValid) {
            $scope.postdata = {};
            $scope.postdata.item = $scope.itemData.item;
            $scope.postdata.description = $scope.itemData.description;
            $http({
                method: 'POST',
                url: 'http://data.altamira.com.br/manufacturing/bom/' + $scope.bomId + '/item',
                data: $scope.postdata, // pass in data as strings
                headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
            }).success(function(data, status, headers, config) {
                console.log(data);
                $location.path('/bom/item/update/' + $scope.bomId + '/' + data.id);
            });
        };
        $scope.goBack = function() {
            $location.path('bom/edit/' + $scope.bomId);
        };

    }]);
altamiraAppControllers.controller('BomItemUpdateCtrl', ['$scope', '$http', '$location', '$routeParams',
    function($scope, $http, $location, $routeParams) {
        $scope.bomId = $routeParams.bomId;
        $scope.itemId = $routeParams.itemId;
        $scope.itemData = {};
        $scope.itemData.version = '';
        $scope.itemData.item = '';
        $scope.itemData.description = '';
        $scope.loadItem = function() {
            $http({
                method: 'GET',
                url: 'http://data.altamira.com.br/manufacturing/bom/' + $scope.bomId + '/item/' + $scope.itemId,
                headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
            }).success(function(data, status, headers, config) {
                $scope.itemData.version = data.version;
                $scope.itemData.item = data.item;
                $scope.itemData.description = data.description;
                $scope.itemData.parts = {};
                var counter = 0;
                for (var i in data.parts)
                {
                    $scope.itemData.parts[counter] = {};
                    $scope.itemData.parts[counter]["id"] = data.parts[i].id;
                    $scope.itemData.parts[counter]["version"] = data.parts[i].version;
                    $scope.itemData.parts[counter]["code"] = data.parts[i].code;
                    $scope.itemData.parts[counter]["description"] = data.parts[i].description;
                    $scope.itemData.parts[counter]["color"] = data.parts[i].color;
                    $scope.itemData.parts[counter]["quantity"] = data.parts[i].quantity;
                    $scope.itemData.parts[counter]["width"] = data.parts[i].width;
                    $scope.itemData.parts[counter]["height"] = data.parts[i].height;
                    $scope.itemData.parts[counter]["length"] = data.parts[i].length;
                    $scope.itemData.parts[counter]["weight"] = data.parts[i].weight;
                    if (counter % 2 == 0)
                    {
                        $scope.itemData.parts[counter].class = '';
                    } else
                    {
                        $scope.itemData.parts[counter].class = 'last';
                    }
                    counter++;
                }
                console.log(JSON.stringify($scope.itemData.parts));
            });
        };
        $scope.loadItem();
        $scope.goBack = function() {
            $location.path('bom/edit/' + $scope.bomId);
        };
        $scope.createComponent = function() {
            $location.path('/bom/part/create/' + $scope.bomId + '/' + $scope.itemId);
        };
    }]);
altamiraAppControllers.controller('BomPartCreateCtrl', ['$scope', '$http', '$location', '$routeParams', '$upload',
    function($scope, $http, $location, $routeParams, $upload) {
        $scope.bomId = $routeParams.bomId;
        $scope.itemId = $routeParams.itemId;
        $scope.partData = {}
        $scope.partData.version = '';
        $scope.partData.code = '';
        $scope.partData.description = '';
        $scope.partData.color = '';
        $scope.partData.quantity = '';
        $scope.partData.width = '';
        $scope.partData.height = '';
        $scope.partData.length = '';
        $scope.partData.weight = '';

        $scope.submitPartForm = function(isValid) {
            $scope.postData = {};
            $scope.postData.version = 0;
            $scope.postData.code = $scope.partData.code;
            $scope.postData.description = $scope.partData.description;
            $scope.postData.color = $scope.partData.color;
            $scope.postData.quantity = parseInt($scope.partData.quantity);
            $scope.postData.width = parseInt($scope.partData.width);
            $scope.postData.height = parseInt($scope.partData.height);
            $scope.postData.length = parseInt($scope.partData.length);
            $scope.postData.weight = parseInt($scope.partData.weight);
            console.log(JSON.stringify($scope.postData));
            $http({
                method: 'POST',
                url: 'http://data.altamira.com.br/manufacturing/bom/' + $scope.bomId + '/item/' + $scope.itemId + '/part',
                data: $scope.postData, // pass in data as strings
                headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
            }).success(function(data, status, headers, config) {
                $location.path('/bom/item/update/' + $scope.bomId + '/' + data.id);
            });
        }
        $scope.goBack = function() {
            $location.path('bom/item/update/' + $scope.bomId + '/' + $scope.itemId);
        };
    }]);

altamiraAppControllers.filter('setDecimal', function($filter) {
    return function(input, places) {
        if (isNaN(input))
            return input;
        // If we want 1 decimal place, we want to mult/div by 10
        // If we want 2 decimal places, we want to mult/div by 100, etc
        // So use the following to create that factor
        var factor = "1" + Array(+(places > 0 && places + 1)).join("0");
        return Math.round(input * factor) / factor;
    };
});