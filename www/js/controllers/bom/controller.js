'use strict';
altamiraAppControllers.controller('BomListCtrl',
        function($scope, $http, $location, $route, $routeParams, $ionicPopup, $ionicLoading, $timeout, $state, Restangular, $ionicSideMenuDelegate) {
            $scope.checked = {
                items: []
            };
            $scope.makeChecked = function(itemId, itemNumber) {

                var confirmPopup = $ionicPopup.confirm({
                    title: 'Confirmation',
                    template: 'A Lista de Material foi conferida ?'
                });
                confirmPopup.then(function(res) {
                    if (res) {
                        $http({
                            method: 'PUT',
                            url: 'http://data.altamira.com.br/manufacturing/bom/' + itemId + '/checked',
                            headers: {'Content-Type': 'application/json'}
                        }).success(function(response) {
                            $ionicPopup.alert({
                                title: 'Successo',
                                content: 'A Lista de Material do Pedido ' + itemNumber + ' foi marcada como conferida.'
                            }).then(function(res) {
                                $route.reload();
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
            $scope.makeUnchecked = function(itemId, itemNumber) {

                var confirmPopup = $ionicPopup.confirm({
                    title: 'Confirmation',
                    template: 'A Lista de Material foi conferida ?'
                });
                confirmPopup.then(function(res) {
                    if (res) {
                        $http({
                            method: 'PUT',
                            url: 'http://data.altamira.com.br/manufacturing/bom/' + itemId + '/unchecked',
                            headers: {'Content-Type': 'application/json'}
                        }).success(function(response) {
                            $ionicPopup.alert({
                                title: 'Successo',
                                content: 'A Lista de Material do Pedido ' + itemNumber + ' foi marcada como conferida.'
                            }).then(function(res) {
                                $route.reload();
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
            $scope.toggleLeft = function() {
                $ionicSideMenuDelegate.toggleLeft();
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
                            url: 'http://data.altamira.com.br/manufacturing/bom?checked=true',
                            params: {"search": this.criteria, "start": page, "max": this.size},
                            headers: {'Content-Type': 'application/json'}
                        }).then(function(response) {
                            console.log(response);
                            $scope.loading = false;
                            $scope.search.last = response.data;
                        });
                    } else {
                        $scope.loading = true;
                        $http({
                            method: 'GET',
                            url: 'http://data.altamira.com.br/manufacturing/bom?checked=false',
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
            $scope.importOrder = function() {
                $scope.orderData = {};
                // An elaborate, custom popup
                var importPopup = $ionicPopup.show({
                    templateUrl: 'templates/bom/import-order.html',
                    title: 'Numero do Pedido',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar',
                            onTap: function(res) {
                                importPopup.close();
                            }
                        },
                        {text: '<b>Importar</b>',
                            type: 'button-positive',
                            onTap: function(res) {
                                $scope.showLoading();
                                //get data from api
                                $http({
                                    method: 'GET',
                                    url: 'http://integracao.altamira.com.br/manufacturing/bom?' + $scope.orderData.ordernumber,
                                    headers: {'Content-Type': 'application/json; charset=iso-8859-1',
                                        'Accept': 'application/json',
                                        //'Authorization': 'Basic QWRtaW5pc3RyYXRvcjohYkZDWC45WCpUSg=='
                                    }
                                }).success(function(data) {
                                    //post data to api
                                    console.log(JSON.stringify(data));
                                    $http({
                                        method: 'POST',
                                        url: 'http://data.altamira.com.br/manufacturing/bom',
                                        data: data,
                                        headers: {'Content-Type': 'application/json'}
                                    }).then(function(response) {
                                        if (response.status == 201) {
                                            $ionicPopup.alert({
                                                title: 'Pedido ' + $scope.orderData.ordernumber,
                                                content: 'Pedido ' + $scope.orderData.ordernumber + ' foi importado com sucesso !'
                                            }).then(function(res) {
                                                $state.go($state.current, {}, {reload: true});
                                            });
                                        }
                                    }, function() {

                                        $ionicPopup.alert({
                                            title: 'Falhou',
                                            content: 'Erro ao importar o Pedido ' + $scope.orderData.ordernumber
                                        }).then(function(res) {
                                            importPopup.close();
                                        });
                                    });
                                }).error(function(msg, code) {

                                    $ionicPopup.alert({
                                        title: 'Falhou',
                                        content: 'Erro ao exportar o Pedido: ' + $scope.orderData.ordernumber
                                    }).then(function(res) {
                                        importPopup.close();
                                    });
                                });
                                $scope.hideLoading();

                            }
                        },
                    ]
                });
                importPopup.then(function(res) {

                });
                $timeout(function() {
                    importPopup.close();
                }, 30000);
            };
            $scope.showLoading = function() {
                $ionicLoading.show({
                    template: 'Enviando, aguarde...'
                });
            };

            $scope.hideLoading = function() {
                $ionicLoading.hide();
            };
            $scope.view = function(bomId) {
                $location.path('/bom/view/' + bomId);
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

altamiraAppControllers.controller('BomViewCtrl',
        function($scope, $http, $location, $route, $routeParams, $ionicPopup, Restangular, $state) {
            $scope.bomId = $routeParams.bomId;
            $scope.project = '';
            $scope.bomData = {};
            $scope.bomData.checked = '';
            $scope.bomData.number = '';
            $scope.bomData.project = '';
            $scope.bomData.customer = '';
            $scope.bomData.representative = '';
            $scope.bomData.finish = '';
            $scope.bomData.quotation = '';
            $scope.bomData.created = '';
            $scope.bomData.delivery = '';
            $scope.loading = true;
            var httpRequest = $http({
                method: 'GET',
                url: 'http://data.altamira.com.br/manufacturing/bom/' + $scope.bomId,
                headers: {'Content-Type': 'application/json'}
            }).success(function(data) {
                console.log(data);
                $scope.loading = false;
                if (data != '')
                {
                    $scope.bomData.checked = data.checked;
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
            }).error(function(data, status, headers, config) {
                $scope.loading = false;
                $ionicPopup.alert({
                    title: 'Failer',
                    content: 'Please try again'
                }).then(function(res) {

                });
            });
            $scope.makeChecked = function() {

                var confirmPopup = $ionicPopup.confirm({
                    title: 'Confirmation',
                    template: 'A Lista de Material foi conferida ?'
                });
                confirmPopup.then(function(res) {
                    if (res) {
                        $http({
                            method: 'PUT',
                            url: 'http://data.altamira.com.br/manufacturing/bom/' + $scope.bomId + '/checked',
                            headers: {'Content-Type': 'application/json'}
                        }).success(function(response) {
                            $ionicPopup.alert({
                                title: 'Successo',
                                content: 'A Lista de Material do Pedido ' + $scope.bomData.number + ' foi marcada como conferida.'
                            }).then(function(res) {
                                $route.reload();
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
            $scope.makeUnchecked = function() {

                var confirmPopup = $ionicPopup.confirm({
                    title: 'Confirmation',
                    template: 'A Lista de Material foi conferida ?'
                });
                confirmPopup.then(function(res) {
                    if (res) {
                        $http({
                            method: 'PUT',
                            url: 'http://data.altamira.com.br/manufacturing/bom/' + $scope.bomId + '/unchecked',
                            headers: {'Content-Type': 'application/json'}
                        }).success(function(response) {
                            $ionicPopup.alert({
                                title: 'Successo',
                                content: 'A Lista de Material do Pedido ' + $scope.bomData.number + ' foi marcada como conferida.'
                            }).then(function(res) {
                                $route.reload();
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
            $scope.edit = function() {
                $location.path('/bom/edit/' + $scope.bomId);
            };
            $scope.createItem = function() {
                $location.path('/bom/item/create/' + $scope.bomId);
            };
            $scope.updateItem = function(itemId) {
                $location.path('/bom/item/update/' + $scope.bomId + '/' + itemId);
            };
            $scope.removeBom = function() {
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Confirmation',
                    template: 'Are you sure to remove this BOM?'
                });
                confirmPopup.then(function(res) {
                    if (res) {
                        $http({
                            method: 'DELETE',
                            url: 'http://data.altamira.com.br/manufacturing/bom/' + $scope.bomId,
                            headers: {'Content-Type': 'application/json'}
                        }).success(function(response) {
                            $ionicPopup.alert({
                                title: 'Success',
                                content: 'A BOM - ' + $scope.bomId + ' removed successfully.'
                            }).then(function(res) {
                                $location.path('/bom/list');
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
            $scope.updatePart = function(itemId, partId) {
                $location.path('bom/part/update/' + $scope.bomId + '/' + itemId + '/' + partId);
            };
            $scope.goBack = function() {
                $location.path('bom/list');
            };
        });
altamiraAppControllers.controller('BomEditCtrl',
        function($scope, $http, $location, $route, $routeParams, $ionicPopup) {
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
            $scope.loading = true;
            var httpRequest = $http({
                method: 'GET',
                url: 'http://data.altamira.com.br/manufacturing/bom/' + $scope.bomId,
                headers: {'Content-Type': 'application/json'}
            }).success(function(data) {
                $scope.loading = false;
                if (data != '')
                {
                    $scope.bomData.version = data.version;
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
            }).error(function(data, status, headers, config) {
                $scope.loading = false;
                $ionicPopup.alert({
                    title: 'Failer',
                    content: 'Please try again'
                }).then(function(res) {

                });
            });
            $scope.submitBomForm = function(isValid) {
                if (isValid) {
                    $scope.loading = true;
                    $scope.postdata = {};
                    $scope.postdata.id = $scope.bomId;
                    $scope.postdata.number = $scope.bomData.number;
                    $scope.postdata.project = $scope.bomData.project;
                    $scope.postdata.customer = $scope.bomData.customer;
                    $scope.postdata.representative = $scope.bomData.representative;
                    $scope.postdata.finish = $scope.bomData.finish;
                    $scope.postdata.quotation = $scope.bomData.quotation;

                    var createdDate = $scope.bomData.created;
                    createdDate = createdDate.split("/");
                    var newCreatedDate = (parseInt(createdDate[1]) + 1) + "/" + createdDate[0] + "/" + createdDate[2];
                    $scope.postdata.created = new Date(newCreatedDate).getTime();

                    var deliveryDate = $scope.bomData.delivery;
                    deliveryDate = deliveryDate.split("/");
                    var newDeliveryDate = (parseInt(deliveryDate[1]) + 1) + "/" + deliveryDate[0] + "/" + deliveryDate[2];
                    $scope.postdata.delivery = new Date(newDeliveryDate).getTime();

                    $http({
                        method: 'GET',
                        url: 'http://data.altamira.com.br/manufacturing/bom/' + $scope.bomId,
                        data: $scope.postdata,
                        headers: {'Content-Type': 'application/json'}
                    }).success(function(data1) {
                        $scope.postdata.version = data1.version;
                        $http({
                            method: 'PUT',
                            url: 'http://data.altamira.com.br/manufacturing/bom/' + $scope.bomId,
                            data: $scope.postdata,
                            headers: {'Content-Type': 'application/json'}
                        }).success(function(data, status, headers, config) {
                            $scope.loading = false;
                            $location.path('/bom/list');
                        }).error(function(data, status, headers, config) {
                            $scope.loading = false;
                            $ionicPopup.alert({
                                title: 'Failer',
                                content: 'Please try again'
                            }).then(function(res) {

                            });
                        });

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
            $scope.createItem = function() {
                $location.path('/bom/item/create/' + $scope.bomId);
            };
            $scope.updateItem = function(itemId) {
                $location.path('/bom/item/update/' + $scope.bomId + '/' + itemId);
            };
            $scope.removeBom = function() {
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Confirmation',
                    template: 'Are you sure to remove this BOM?'
                });
                confirmPopup.then(function(res) {
                    if (res) {
                        $http({
                            method: 'DELETE',
                            url: 'http://data.altamira.com.br/manufacturing/bom/' + $scope.bomId,
                            headers: {'Content-Type': 'application/json'}
                        }).success(function(response) {
                            $ionicPopup.alert({
                                title: 'Success',
                                content: 'A BOM - ' + $scope.bomId + ' removed successfully.'
                            }).then(function(res) {
                                $location.path('/bom/list');
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
            $scope.removeItem = function(itemId) {
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Confirmation',
                    template: 'Are you sure to remove this Item?'
                });
                confirmPopup.then(function(res) {
                    if (res) {
                        $http({
                            method: 'DELETE',
                            url: 'http://data.altamira.com.br/manufacturing/bom/' + $scope.bomId + '/item/' + itemId,
                            headers: {'Content-Type': 'application/json'}
                        }).success(function(response) {
                            $ionicPopup.alert({
                                title: 'Success',
                                content: 'An Item - ' + itemId + ' removed successfully.'
                            }).then(function(res) {
                                $route.reload();
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
            $scope.updatePart = function(itemId, partId) {
                $location.path('bom/part/update/' + $scope.bomId + '/' + itemId + '/' + partId);
            };
            $scope.removePart = function(itemId, partId) {
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Confirmation',
                    template: 'Are you sure to remove this Part?'
                });
                confirmPopup.then(function(res) {
                    if (res) {
                        $http({
                            method: 'DELETE',
                            url: 'http://data.altamira.com.br/manufacturing/bom/' + $scope.bomId + '/item/' + itemId + '/part/' + partId,
                            headers: {'Content-Type': 'application/json'}
                        }).success(function(response) {
                            $ionicPopup.alert({
                                title: 'Success',
                                content: 'A Part - ' + partId + ' removed successfully.'
                            }).then(function(res) {
                                $route.reload();
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
            if (isValid) {
                $scope.loading = true;
                $scope.postdata = {};
                $scope.postdata.item = $scope.itemData.item;
                $scope.postdata.description = $scope.itemData.description;
                $http({
                    method: 'POST',
                    url: 'http://data.altamira.com.br/manufacturing/bom/' + $scope.bomId + '/item',
                    data: $scope.postdata,
                    headers: {'Content-Type': 'application/json'}
                }).success(function(data, status, headers, config) {
                    $scope.loading = false;
                    $location.path('/bom/item/update/' + $scope.bomId + '/' + data.id);
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
            $location.path('bom/edit/' + $scope.bomId);
        };

    }]);

altamiraAppControllers.controller('BomItemUpdateCtrl', ['$scope', '$http', '$location', '$routeParams', '$route', '$ionicPopup',
    function($scope, $http, $location, $routeParams, $route, $ionicPopup) {
        $scope.bomId = $routeParams.bomId;
        $scope.itemId = $routeParams.itemId;
        $scope.itemData = {};
        $scope.itemData.version = '';
        $scope.itemData.item = '';
        $scope.itemData.description = '';
        $scope.loadItem = function() {
            $scope.loading = true;
            $http({
                method: 'GET',
                url: 'http://data.altamira.com.br/manufacturing/bom/' + $scope.bomId + '/item/' + $scope.itemId,
                headers: {'Content-Type': 'application/json'}
            }).success(function(data, status, headers, config) {
                $scope.loading = false;
                $scope.itemData.version = data.version;
                $scope.itemData.item = data.item;
                $scope.itemData.description = data.description;
                $scope.itemData.parts = [];
                var counter = 0;
                for (var i in data.parts)
                {
                    var temp = {};
                    temp.id = data.parts[i].id;
                    temp.version = data.parts[i].version;
                    temp.code = data.parts[i].code;
                    temp.description = data.parts[i].description;
                    temp.color = data.parts[i].color;
                    temp.quantity = data.parts[i].quantity;
                    temp.width = data.parts[i].width;
                    temp.height = data.parts[i].height;
                    temp.length = data.parts[i].length;
                    temp.weight = data.parts[i].weight;
                    if (counter % 2 == 0)
                    {
                        temp.class = '';
                    } else
                    {
                        temp.class = 'last';
                    }
                    $scope.itemData.parts.push(temp);
                    counter++;
                }
            }).error(function(data, status, headers, config) {
                $scope.loading = false;
                $ionicPopup.alert({
                    title: 'Failer',
                    content: 'Please try again'
                }).then(function(res) {

                });
            });
        };
        $scope.loadItem();
        $scope.submitUpdateItem = function(isValid) {
            if (isValid) {
                $scope.loading = true;
                $scope.postdata = {};
                $scope.postdata.id = $scope.itemId;
                $scope.postdata.version = $scope.itemData.version;
                $scope.postdata.item = $scope.itemData.item;
                $scope.postdata.description = $scope.itemData.description;

                $http({
                    method: 'GET',
                    url: 'http://data.altamira.com.br/manufacturing/bom/' + $scope.bomId + '/item/' + $scope.itemId,
                    headers: {'Content-Type': 'application/json'}
                }).success(function(data1, status, headers, config) {
                    $scope.postdata.version = data1.version;
                    $http({
                        method: 'PUT',
                        url: 'http://data.altamira.com.br/manufacturing/bom/' + $scope.bomId + '/item/' + $scope.itemId,
                        data: $scope.postdata,
                        headers: {'Content-Type': 'application/json'}
                    }).success(function(data, status, headers, config) {
                        $scope.loading = false;
                        $location.path('bom/edit/' + $scope.bomId);
                    }).error(function(data, status, headers, config) {
                        $scope.loading = false;
                        $ionicPopup.alert({
                            title: 'Failer',
                            content: 'Please try again'
                        }).then(function(res) {

                        });
                    });
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

        $scope.removeItem = function() {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Confirmation',
                template: 'Are you sure to remove this Item?'
            });
            confirmPopup.then(function(res) {
                if (res) {
                    $http({
                        method: 'DELETE',
                        url: 'http://data.altamira.com.br/manufacturing/bom/' + $scope.bomId + '/item/' + $scope.itemId,
                        headers: {'Content-Type': 'application/json'}
                    }).success(function(response) {
                        $ionicPopup.alert({
                            title: 'Success',
                            content: 'An Item - ' + $scope.itemId + ' removed successfully.'
                        }).then(function(res) {
                            $location.path('bom/edit/' + $scope.bomId);
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

        $scope.createPart = function() {
            $location.path('/bom/part/create/' + $scope.bomId + '/' + $scope.itemId);
        };

        $scope.updatePart = function(partId) {
            $location.path('bom/part/update/' + $scope.bomId + '/' + $scope.itemId + '/' + partId);
        };

        $scope.removePart = function(PartId) {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Confirmation',
                template: 'Are you sure to remove this Part?'
            });
            confirmPopup.then(function(res) {
                if (res) {
                    $http({
                        method: 'DELETE',
                        url: 'http://data.altamira.com.br/manufacturing/bom/' + $scope.bomId + '/item/' + $scope.itemId + '/part/' + PartId,
                        headers: {'Content-Type': 'application/json'}
                    }).success(function(response) {
                        $ionicPopup.alert({
                            title: 'Success',
                            content: 'A Part - ' + PartId + ' removed successfully.'
                        }).then(function(res) {
                            $route.reload();
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
            $location.path('bom/edit/' + $scope.bomId);
        };

    }]);

altamiraAppControllers.controller('BomPartCreateCtrl', ['$scope', '$http', '$location', '$routeParams', '$ionicPopup',
    function($scope, $http, $location, $routeParams, $ionicPopup) {
        $scope.bomId = $routeParams.bomId;
        $scope.itemId = $routeParams.itemId;
        $scope.partData = {}
        $scope.partData.version = '';
        $scope.partData.code = '';
        $scope.partData.description = '';
        $scope.partData.color = 'CZ-PAD';

        $scope.partData.length = '';
        $scope.partData.height = '';
        $scope.partData.width = '';
        $scope.partData.quantity = '';
        $scope.partData.weight = '';

        $scope.partData.lengthType = 4;
        $scope.partData.heightType = 4;
        $scope.partData.widthType = 4;
        $scope.partData.weightType = 6;
        $scope.partData.quantityType = 8;

        $http({
            method: 'GET',
            url: 'http://data.altamira.com.br/common/color?max=0',
            headers: {'Content-Type': 'application/json'}
        }).success(function(data, status, headers, config) {
            $scope.partData.colorBox = data;

        }).error(function(data, status, headers, config) {
            $ionicPopup.alert({
                title: 'Failer',
                content: 'Please try again'
            }).then(function(res) {

            });
        });
        $http({
            method: 'GET',
            url: 'http://data.altamira.com.br/measurement/unit?magnitude=dimencional',
            headers: {'Content-Type': 'application/json'}
        }).success(function(data, status, headers, config) {
            $scope.partData.unitLengthBox = data;

        }).error(function(data, status, headers, config) {
            $ionicPopup.alert({
                title: 'Failer',
                content: 'Please try again'
            }).then(function(res) {

            });
        });
        $http({
            method: 'GET',
            url: 'http://data.altamira.com.br/measurement/unit?magnitude=peso',
            headers: {'Content-Type': 'application/json'}
        }).success(function(data, status, headers, config) {
            $scope.partData.unitWeightBox = data;

        }).error(function(data, status, headers, config) {
            $ionicPopup.alert({
                title: 'Failer',
                content: 'Please try again'
            }).then(function(res) {

            });
        });
        $http({
            method: 'GET',
            url: 'http://data.altamira.com.br/measurement/unit?magnitude=unidade',
            headers: {'Content-Type': 'application/json'}
        }).success(function(data, status, headers, config) {
            $scope.partData.unitQuantityBox = data;

        }).error(function(data, status, headers, config) {
            $ionicPopup.alert({
                title: 'Failer',
                content: 'Please try again'
            }).then(function(res) {

            });
        });

        $scope.submitPartForm = function(isValid) {
            if (isValid) {
                $scope.loading = true;
                $scope.postData = {};
                $scope.postData.version = 0;
                $scope.postData.code = $scope.partData.code;
                $scope.postData.description = $scope.partData.description;
                $scope.postData.color = $scope.partData.color;

                $scope.postData.quantity = {};
                $scope.postData.quantity.value = parseFloat($scope.partData.quantity);
                $scope.postData.quantity.unit = {};
                $scope.postData.quantity.unit.id = $scope.partData.quantityType;

                $scope.postData.width = {};
                $scope.postData.width.value = parseFloat($scope.partData.width);
                $scope.postData.width.unit = {};
                $scope.postData.width.unit.id = $scope.partData.widthType;

                $scope.postData.height = {};
                $scope.postData.height.value = parseFloat($scope.partData.height);
                $scope.postData.height.unit = {};
                $scope.postData.height.unit.id = $scope.partData.heightType;

                $scope.postData.length = {};
                $scope.postData.length.value = parseFloat($scope.partData.length);
                $scope.postData.length.unit = {};
                $scope.postData.length.unit.id = $scope.partData.lengthType;

                $scope.postData.weight = {};
                $scope.postData.weight.value = parseFloat($scope.partData.weight);
                $scope.postData.weight.unit = {};
                $scope.postData.weight.unit.id = $scope.partData.weightType;
                console.log(JSON.stringify($scope.postData));
                $http({
                    method: 'POST',
                    url: 'http://data.altamira.com.br/manufacturing/bom/' + $scope.bomId + '/item/' + $scope.itemId + '/part',
                    data: $scope.postData,
                    headers: {'Content-Type': 'application/json'}
                }).success(function(data, status, headers, config) {
                    $scope.loading = false;
                    $location.path('/bom/part/update/' + $scope.bomId + '/' + $scope.itemId + '/' + data.id);
                }).error(function(data, status, headers, config) {
                    $scope.loading = false;
                    $ionicPopup.alert({
                        title: 'Failer',
                        content: 'Please try again'
                    }).then(function(res) {

                    });
                });
            }
        }
        $scope.goBack = function() {
            $location.path('bom/item/update/' + $scope.bomId + '/' + $scope.itemId);
        };
    }]);

altamiraAppControllers.controller('BomPartUpdateCtrl', ['$scope', '$http', '$location', '$routeParams', '$route', '$ionicPopup',
    function($scope, $http, $location, $routeParams, $route, $ionicPopup) {
        $scope.bomId = $routeParams.bomId;
        $scope.itemId = $routeParams.itemId;
        $scope.partId = $routeParams.partId;
        $scope.partData = {}
        $scope.partData.version = '';
        $scope.partData.code = 'CZ-PAD';
        $scope.partData.description = '';
        $scope.partData.color = '';
        $scope.partData.quantity = '';
        $scope.partData.width = '';
        $scope.partData.height = '';
        $scope.partData.length = '';
        $scope.partData.weight = '';

        $scope.partData.lengthType = 4;
        $scope.partData.heightType = 4;
        $scope.partData.widthType = 4;
        $scope.partData.weightType = 6;
        $scope.partData.quantityType = 8;

        $http({
            method: 'GET',
            url: 'http://data.altamira.com.br/common/color?max=0',
            headers: {'Content-Type': 'application/json'}
        }).success(function(data, status, headers, config) {
            $scope.partData.colorBox = data;

        }).error(function(data, status, headers, config) {
            $ionicPopup.alert({
                title: 'Failer',
                content: 'Please try again'
            }).then(function(res) {

            });
        });
        $http({
            method: 'GET',
            url: 'http://data.altamira.com.br/measurement/unit?magnitude=dimencional',
            headers: {'Content-Type': 'application/json'}
        }).success(function(data, status, headers, config) {
            $scope.partData.unitLengthBox = data;

        }).error(function(data, status, headers, config) {
            $ionicPopup.alert({
                title: 'Failer',
                content: 'Please try again'
            }).then(function(res) {

            });
        });
        $http({
            method: 'GET',
            url: 'http://data.altamira.com.br/measurement/unit?magnitude=peso',
            headers: {'Content-Type': 'application/json'}
        }).success(function(data, status, headers, config) {
            $scope.partData.unitWeightBox = data;

        }).error(function(data, status, headers, config) {
            $ionicPopup.alert({
                title: 'Failer',
                content: 'Please try again'
            }).then(function(res) {

            });
        });
        $http({
            method: 'GET',
            url: 'http://data.altamira.com.br/measurement/unit?magnitude=unidade',
            headers: {'Content-Type': 'application/json'}
        }).success(function(data, status, headers, config) {
            $scope.partData.unitQuantityBox = data;

        }).error(function(data, status, headers, config) {
            $ionicPopup.alert({
                title: 'Failer',
                content: 'Please try again'
            }).then(function(res) {

            });
        });

        $scope.loadPart = function() {
            $scope.loading = true;
            $http({
                method: 'GET',
                url: 'http://data.altamira.com.br/manufacturing/bom/' + $scope.bomId + '/item/' + $scope.itemId + '/part/' + $scope.partId,
                headers: {'Content-Type': 'application/json'}
            }).success(function(data, status, headers, config) {
                $scope.loading = false;
                $scope.partData.version = data.version;
                $scope.partData.code = data.code;
                $scope.partData.description = data.description;
                $scope.partData.color = data.color;
                $scope.partData.quantity = data.quantity.value;
                $scope.partData.quantityType = data.quantity.unit.id;
                $scope.partData.width = data.width.value;
                $scope.partData.widthType = data.width.unit.id;
                $scope.partData.height = data.height.value;
                $scope.partData.heightType = data.height.unit.id;
                $scope.partData.length = data.length.value;
                $scope.partData.lengthType = data.length.unit.id;
                $scope.partData.weight = data.weight.value;
                $scope.partData.weightType = data.weight.unit.id;
            }).error(function(data, status, headers, config) {
                $scope.loading = false;
                $ionicPopup.alert({
                    title: 'Failer',
                    content: 'Please try again'
                }).then(function(res) {

                });
            });
        };
        $scope.loadPart();
        $scope.submitPartForm = function(isValid) {
            if (isValid) {
                $scope.loading = true;
                $scope.postData = {};
                $scope.postData.id = $scope.partId;
                $scope.postData.code = $scope.partData.code;
                $scope.postData.description = $scope.partData.description;
                $scope.postData.color = $scope.partData.color;

                $scope.postData.quantity = {};
                $scope.postData.quantity.value = parseFloat($scope.partData.quantity);
                $scope.postData.quantity.unit = {};
                $scope.postData.quantity.unit.id = $scope.partData.quantityType;

                $scope.postData.width = {};
                $scope.postData.width.value = parseFloat($scope.partData.width);
                $scope.postData.width.unit = {};
                $scope.postData.width.unit.id = $scope.partData.widthType;

                $scope.postData.height = {};
                $scope.postData.height.value = parseFloat($scope.partData.height);
                $scope.postData.height.unit = {};
                $scope.postData.height.unit.id = $scope.partData.heightType;

                $scope.postData.length = {};
                $scope.postData.length.value = parseFloat($scope.partData.length);
                $scope.postData.length.unit = {};
                $scope.postData.length.unit.id = $scope.partData.lengthType;

                $scope.postData.weight = {};
                $scope.postData.weight.value = parseFloat($scope.partData.weight);
                $scope.postData.weight.unit = {};
                $scope.postData.weight.unit.id = $scope.partData.weightType;

                $http({
                    method: 'GET',
                    url: 'http://data.altamira.com.br/manufacturing/bom/' + $scope.bomId + '/item/' + $scope.itemId + '/part/' + $scope.partId,
                    headers: {'Content-Type': 'application/json'}
                }).success(function(data1, status, headers, config) {
                    $scope.postData.version = data1.version;
                    $http({
                        method: 'PUT',
                        url: 'http://data.altamira.com.br/manufacturing/bom/' + $scope.bomId + '/item/' + $scope.itemId + '/part/' + $scope.partId,
                        data: $scope.postData,
                        headers: {'Content-Type': 'application/json'}
                    }).success(function(data, status, headers, config) {
                        $scope.loading = false;
                        $location.path('/bom/item/update/' + $scope.bomId + '/' + $scope.itemId);
                    }).error(function(data, status, headers, config) {
                        $scope.loading = false;
                        $ionicPopup.alert({
                            title: 'Failer',
                            content: 'Please try again'
                        }).then(function(res) {

                        });
                    });
                }).error(function(data, status, headers, config) {
                    $scope.loading = false;
                    $ionicPopup.alert({
                        title: 'Failer',
                        content: 'Please try again'
                    }).then(function(res) {

                    });
                });
            }
        }

        $scope.removePart = function() {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Confirmation',
                template: 'Are you sure to remove this Part?'
            });
            confirmPopup.then(function(res) {
                if (res) {
                    $http({
                        method: 'DELETE',
                        url: 'http://data.altamira.com.br/manufacturing/bom/' + $scope.bomId + '/item/' + $scope.itemId + '/part/' + $scope.partId,
                        headers: {'Content-Type': 'application/json'}
                    }).success(function(response) {
                        $ionicPopup.alert({
                            title: 'Success',
                            content: 'A Part - ' + $scope.partId + ' removed successfully.'
                        }).then(function(res) {
                            $location.path('bom/item/update/' + $scope.bomId + '/' + $scope.itemId);
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
            $location.path('bom/item/update/' + $scope.bomId + '/' + $scope.itemId);
        };

    }]);

altamiraAppControllers.filter('setDecimal',
        function($filter) {
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