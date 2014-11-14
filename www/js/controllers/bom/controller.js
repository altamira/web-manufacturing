'use strict';

altamiraAppControllers.controller('BomListCtrl',
        function($scope, $http, $location, $route, $routeParams, $ionicPopup, $ionicLoading, $timeout, $state, Restangular) {
            $scope.checked = {
                items: []
            };
            $scope.makeChecked = function(itemId, itemNumber) {
                //If order is not checked show pop up for check
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Confirmação',
                    template: 'A Lista de Material foi conferida ?'
                });
                confirmPopup.then(function(res) {
                    if (res) {
                        $http({
                            method: 'PUT',
                            url: 'http://data.altamira.com.br/manufacturing/bom/' + itemId + '/checked',
                            headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
                        }).success(function(response) {
                            $ionicPopup.alert({
                                title: 'Successo',
                                content: 'A Lista de Material do Pedido ' + itemNumber + ' foi marcada como conferida.'
                            }).then(function(res) {
                                $route.reload();
                            });
                        }).error(function(data, status, headers, config) {
                            alert("Please try again")
                        });
                    } else {
                        console.log("NO");
                    }
                });
            };
            $scope.makeUnchecked = function(itemId, itemNumber) {
                //If order is not checked show pop up for check
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Confirmação',
                    template: 'A Lista de Material foi conferida ?'
                });
                confirmPopup.then(function(res) {
                    if (res) {
                        $http({
                            method: 'PUT',
                            url: 'http://data.altamira.com.br/manufacturing/bom/' + itemId + '/unchecked',
                            headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
                        }).success(function(response) {
                            $ionicPopup.alert({
                                title: 'Successo',
                                content: 'A Lista de Material do Pedido ' + itemNumber + ' foi marcada como conferida.'
                            }).then(function(res) {
                                $route.reload();
                            });
                        }).error(function(data, status, headers, config) {
                            alert("Please try again")
                        });
                    } else {
                        console.log("NO");
                    }
                });
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
                            url: 'http://data.altamira.com.br/manufacturing/bom/search/',
                            params: {"search": this.criteria, "start": page, "max": this.size},
                            headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
                        }).then(function(response) {
                            console.log(response);
                            $scope.loading = false;
                            $scope.search.last = response.data;
                        });
                    } else {
                        $scope.loading = true;
                        $http({
                            method: 'GET',
                            url: 'http://data.altamira.com.br/manufacturing/bom/',
                            params: {"start": page, "max": this.size},
                            headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
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
                                        data: data, // pass in data as strings
                                        headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
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
                                        // alert if an error occurs
                                        $ionicPopup.alert({
                                            title: 'Falhou',
                                            content: 'Erro ao importar o Pedido ' + $scope.orderData.ordernumber
                                        }).then(function(res) {
                                            importPopup.close();
                                        });
                                    });
                                }).error(function(msg, code) {
                                    // alert if an error occurs
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
                    importPopup.close(); //close the popup after 3 seconds for some reason
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
                headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
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
                alert("Please try again")
            });
            $scope.makeChecked = function() {
                //If order is not checked show pop up for check
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Confirmação',
                    template: 'A Lista de Material foi conferida ?'
                });
                confirmPopup.then(function(res) {
                    if (res) {
                        $http({
                            method: 'PUT',
                            url: 'http://data.altamira.com.br/manufacturing/bom/' + $scope.bomId + '/checked',
                            headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
                        }).success(function(response) {
                            $ionicPopup.alert({
                                title: 'Successo',
                                content: 'A Lista de Material do Pedido ' + $scope.bomData.number + ' foi marcada como conferida.'
                            }).then(function(res) {
                                $route.reload();
                            });
                        }).error(function(data, status, headers, config) {
                            alert("Please try again")
                        });
                    } else {
                        console.log("NO");
                    }
                });
            };
            $scope.makeUnchecked = function() {
                //If order is not checked show pop up for check
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Confirmação',
                    template: 'A Lista de Material foi conferida ?'
                });
                confirmPopup.then(function(res) {
                    if (res) {
                        $http({
                            method: 'PUT',
                            url: 'http://data.altamira.com.br/manufacturing/bom/' + $scope.bomId + '/unchecked',
                            headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
                        }).success(function(response) {
                            $ionicPopup.alert({
                                title: 'Successo',
                                content: 'A Lista de Material do Pedido ' + $scope.bomData.number + ' foi marcada como conferida.'
                            }).then(function(res) {
                                $route.reload();
                            });
                        }).error(function(data, status, headers, config) {
                            alert("Please try again")
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
                $scope.loading = true;
                $http({
                    method: 'DELETE',
                    url: 'http://data.altamira.com.br/manufacturing/bom/' + $scope.bomId,
                }).success(function(data) {
                    $scope.loading = false;
                    $location.path('/bom/list');
                }).error(function(data, status, headers, config) {
                    $scope.loading = false;
                    alert("Please try again")
                });
            };
            $scope.removeItem = function(itemId) {
                $http({
                    method: 'DELETE',
                    url: 'http://data.altamira.com.br/manufacturing/bom/' + $scope.bomId + '/item/' + itemId,
                }).success(function(data) {
                    $scope.loading = false;
                    $route.reload();
                }).error(function(data, status, headers, config) {
                    $scope.loading = false;
                    alert("Please try again")
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
        function($scope, $http, $location, $route, $routeParams) {
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
                headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
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
                alert("Please try again")
            });
            $scope.submitBomForm = function() {
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
                    data: $scope.postdata, // pass in data as strings
                    headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
                }).success(function(data1) {
                    $scope.postdata.version = data1.version;
                    $http({
                        method: 'PUT',
                        url: 'http://data.altamira.com.br/manufacturing/bom/' + $scope.bomId,
                        data: $scope.postdata, // pass in data as strings
                        headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
                    }).success(function(data, status, headers, config) {
                        $scope.loading = false;
                        $location.path('/bom/list');
                    }).error(function(data, status, headers, config) {
                        $scope.loading = false;
                        alert("Please try again")
                    });

                }).error(function(data, status, headers, config) {
                    $scope.loading = false;
                    alert("Please try again")
                });



            };
            $scope.createItem = function() {
                $location.path('/bom/item/create/' + $scope.bomId);
            };
            $scope.updateItem = function(itemId) {
                $location.path('/bom/item/update/' + $scope.bomId + '/' + itemId);
            };
            $scope.removeBom = function() {
                $scope.loading = true;
                $http({
                    method: 'DELETE',
                    url: 'http://data.altamira.com.br/manufacturing/bom/' + $scope.bomId,
                }).success(function(data) {
                    $scope.loading = false;
                    $location.path('/bom/list');
                }).error(function(data, status, headers, config) {
                    $scope.loading = false;
                    alert("Please try again")
                });
            };
            $scope.removeItem = function(itemId) {
                $scope.loading = true;
                $http({
                    method: 'DELETE',
                    url: 'http://data.altamira.com.br/manufacturing/bom/' + $scope.bomId + '/item/' + itemId,
                }).success(function(data) {
                    $scope.loading = false;
                    $route.reload();
                }).error(function(data, status, headers, config) {
                    $scope.loading = false;
                    alert("Please try again")
                });
            };
            $scope.updatePart = function(itemId, partId) {
                $location.path('bom/part/update/' + $scope.bomId + '/' + itemId + '/' + partId);
            };
            $scope.removePart = function(itemId, partId) {
                $scope.loading = true;
                $http({
                    method: 'DELETE',
                    url: 'http://data.altamira.com.br/manufacturing/bom/' + $scope.bomId + '/item/' + itemId + '/part/' + partId,
                }).success(function(data) {
                    $scope.loading = false;
                    $route.reload();
                }).error(function(data, status, headers, config) {
                    $scope.loading = false;
                    alert("Please try again")
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
            $scope.loading = true;
            $scope.postdata = {};
            $scope.postdata.item = $scope.itemData.item;
            $scope.postdata.description = $scope.itemData.description;
            $http({
                method: 'POST',
                url: 'http://data.altamira.com.br/manufacturing/bom/' + $scope.bomId + '/item',
                data: $scope.postdata, // pass in data as strings
                headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
            }).success(function(data, status, headers, config) {
                $scope.loading = false;
                $location.path('/bom/item/update/' + $scope.bomId + '/' + data.id);
            }).error(function(data, status, headers, config) {
                $scope.loading = false;
                alert("Please try again")
            });
        };
        $scope.goBack = function() {
            $location.path('bom/edit/' + $scope.bomId);
        };

    }]);

altamiraAppControllers.controller('BomItemUpdateCtrl', ['$scope', '$http', '$location', '$routeParams', '$route',
    function($scope, $http, $location, $routeParams, $route) {
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
                headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
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
                alert("Please try again")
            });
        };
        $scope.loadItem();

        $scope.submitUpdateItem = function(isValid) {
            $scope.loading = true;
            $scope.postdata = {};
            $scope.postdata.id = $scope.itemId;
            $scope.postdata.version = $scope.itemData.version;
            $scope.postdata.item = $scope.itemData.item;
            $scope.postdata.description = $scope.itemData.description;

            $http({
                method: 'GET',
                url: 'http://data.altamira.com.br/manufacturing/bom/' + $scope.bomId + '/item/' + $scope.itemId,
                headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
            }).success(function(data1, status, headers, config) {
                $scope.postdata.version = data1.version;
                $http({
                    method: 'PUT',
                    url: 'http://data.altamira.com.br/manufacturing/bom/' + $scope.bomId + '/item/' + $scope.itemId,
                    data: $scope.postdata, // pass in data as strings
                    headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
                }).success(function(data, status, headers, config) {
                    $scope.loading = false;
                    $location.path('bom/edit/' + $scope.bomId);
                }).error(function(data, status, headers, config) {
                    $scope.loading = false;
                    alert("Please try again")
                });
            }).error(function(data, status, headers, config) {
                $scope.loading = false;
                alert("Please try again")
            });

        };

        $scope.removeItem = function() {
            $scope.loading = true;
            $http({
                method: 'DELETE',
                url: 'http://data.altamira.com.br/manufacturing/bom/' + $scope.bomId + '/item/' + $scope.itemId,
            }).success(function() {
                $scope.loading = false;
                $location.path('bom/edit/' + $scope.bomId);
            }).error(function(data, status, headers, config) {
                $scope.loading = false;
                alert("Please try again")
            });
        };

        $scope.createPart = function() {
            $location.path('/bom/part/create/' + $scope.bomId + '/' + $scope.itemId);
        };

        $scope.updatePart = function(partId) {
            $location.path('bom/part/update/' + $scope.bomId + '/' + $scope.itemId + '/' + partId);
        };

        $scope.removePart = function(PartId) {
            $scope.loading = true;
            $http({
                method: 'DELETE',
                url: 'http://data.altamira.com.br/manufacturing/bom/' + $scope.bomId + '/item/' + $scope.itemId + '/part/' + PartId,
            }).success(function() {
                $scope.loading = false;
                $route.reload();
            }).error(function(data, status, headers, config) {
                $scope.loading = false;
                alert("Please try again")
            });
        };

        $scope.goBack = function() {
            $location.path('bom/edit/' + $scope.bomId);
        };

    }]);

altamiraAppControllers.controller('BomPartCreateCtrl', ['$scope', '$http', '$location', '$routeParams',
    function($scope, $http, $location, $routeParams) {
        $scope.bomId = $routeParams.bomId;
        $scope.itemId = $routeParams.itemId;
        $scope.partData = {}
        $scope.partData.version = '';
        $scope.partData.code = '';
        $scope.partData.description = '';
        $scope.partData.color = '';

        $scope.partData.length = '';
        $scope.partData.height = '';
        $scope.partData.width = '';
        $scope.partData.quantity = '';
        $scope.partData.weight = '';

        $scope.partData.lengthType = 'milimetro';
        $scope.partData.heightType = 'milimetro';
        $scope.partData.widthType = 'milimetro';
        $scope.partData.weightType = 'milimetro';
        $scope.partData.quantityType = 'unidade';
        $scope.partData.weightType = 'quilogram';

        $scope.submitPartForm = function(isValid) {
            $scope.loading = true;
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
                $scope.loading = false;
                $location.path('/bom/part/update/' + $scope.bomId + '/' + $scope.itemId + '/' + data.id);
            }).error(function(data, status, headers, config) {
                $scope.loading = false;
                alert("Please try again")
            });
        }
        $scope.goBack = function() {
            $location.path('bom/item/update/' + $scope.bomId + '/' + $scope.itemId);
        };
    }]);

altamiraAppControllers.controller('BomPartUpdateCtrl', ['$scope', '$http', '$location', '$routeParams', '$route',
    function($scope, $http, $location, $routeParams, $route) {
        $scope.bomId = $routeParams.bomId;
        $scope.itemId = $routeParams.itemId;
        $scope.partId = $routeParams.partId;
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

        $scope.partData.lengthType = 'milimetro';
        $scope.partData.heightType = 'milimetro';
        $scope.partData.widthType = 'milimetro';
        $scope.partData.weightType = 'milimetro';
        $scope.partData.quantityType = 'unidade';
        $scope.partData.weightType = 'quilogram';

        $scope.loadPart = function() {
            $scope.loading = true;
            $http({
                method: 'GET',
                url: 'http://data.altamira.com.br/manufacturing/bom/' + $scope.bomId + '/item/' + $scope.itemId + '/part/' + $scope.partId,
                headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
            }).success(function(data, status, headers, config) {

                $scope.loading = false;
                $scope.partData.version = data.version;
                $scope.partData.code = data.code;
                $scope.partData.description = data.description;
                $scope.partData.color = data.color;
                $scope.partData.quantity = data.quantity;
                $scope.partData.width = data.width;
                $scope.partData.height = data.height;
                $scope.partData.length = data.length;
                $scope.partData.weight = data.weight;
            }).error(function(data, status, headers, config) {
                $scope.loading = false;
                alert("Please try again")
            });
        };
        $scope.loadPart();
        $scope.submitPartForm = function(isValid) {
            $scope.loading = true;
            $scope.postData = {};
            $scope.postData.id = $scope.partId;
            $scope.postData.code = $scope.partData.code;
            $scope.postData.description = $scope.partData.description;
            $scope.postData.color = $scope.partData.color;
            $scope.postData.quantity = parseInt($scope.partData.quantity);
            $scope.postData.width = parseInt($scope.partData.width);
            $scope.postData.height = parseInt($scope.partData.height);
            $scope.postData.length = parseInt($scope.partData.length);
            $scope.postData.weight = parseInt($scope.partData.weight);
            $http({
                method: 'GET',
                url: 'http://data.altamira.com.br/manufacturing/bom/' + $scope.bomId + '/item/' + $scope.itemId + '/part/' + $scope.partId,
                headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
            }).success(function(data1, status, headers, config) {
                $scope.postData.version = data1.version;
                $http({
                    method: 'PUT',
                    url: 'http://data.altamira.com.br/manufacturing/bom/' + $scope.bomId + '/item/' + $scope.itemId + '/part/' + $scope.partId,
                    data: $scope.postData, // pass in data as strings
                    headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
                }).success(function(data, status, headers, config) {
                    $scope.loading = false;
                    $location.path('/bom/item/update/' + $scope.bomId + '/' + $scope.itemId);
                }).error(function(data, status, headers, config) {
                    $scope.loading = false;
                    alert("Please try again")
                });
            }).error(function(data, status, headers, config) {
                $scope.loading = false;
                alert("Please try again")
            });

        }

        $scope.removePart = function() {
            $scope.loading = true;
            $http({
                method: 'DELETE',
                url: 'http://data.altamira.com.br/manufacturing/bom/' + $scope.bomId + '/item/' + $scope.itemId + '/part/' + $scope.partId,
            }).success(function() {
                $scope.loading = false;
                $location.path('bom/item/update/' + $scope.bomId + '/' + $scope.itemId);
            }).error(function(data, status, headers, config) {
                $scope.loading = false;
                alert("Please try again")
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