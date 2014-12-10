altamiraAppControllers.controller('MaterialListCtrl',
        function($scope, $http, $location, $route, $routeParams, $ionicPopup, $ionicModal, $ionicLoading, $timeout, $state, Restangular, services, $window) {

            $scope.startPage = 0;
            $scope.maxRecord = 10;
            $scope.searchText = '';
            $scope.items = '';
            $scope.itemArray = '';
            $scope.isDataSearch = '';
            $scope.nextButton = true;
            if ($routeParams.token != null && $routeParams.token != '' && $routeParams.token != undefined && sessionStorage.getItem('token') == '')
            {
                sessionStorage.setItem('token', $routeParams.token);
                $window.location.reload();
            }
            $scope.loadMaterial = function() {
                $scope.loading = true;
                Restangular.one('common/material').get({search: $scope.searchText, start: $scope.startPage, max: $scope.maxRecord}).then(function(response) {
                    if (response.data == '') {
                        if ((parseInt($scope.startPage) != 0))
                        {
                            $scope.nextButton = false;
                            $scope.startPage = (parseInt($scope.startPage) - 1);
                            $scope.loadMaterial();
                        } else
                        {
                            services.showAlert('Notice', 'Material list is empty').then(function(res) {
                            });
                        }
                    } else
                    {
                        if ($scope.items.length <= 0 && $scope.isDataSearch == '')
                        {
                            $scope.items = response.data;
                            $scope.itemArray = response.data;
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
                                    $scope.itemArray.push(value);
                                });
                                $scope.pageItems();
                            }
                        }
                        $scope.loading = false;
                        $scope.range();
                    }
                }, function(response) {
                    services.showAlert('Falhou', 'Please try again');
                });
            };
            $scope.loadMaterial();
            $scope.pageItems = function() {
                $scope.items = [];
                $scope.start = $scope.startPage * $scope.maxRecord;
                $scope.end = ($scope.startPage * $scope.maxRecord) + $scope.maxRecord;
                for (var i = $scope.start; i < $scope.end; i++)
                {
                    if ($scope.itemArray[i])
                    {
                        $scope.items.push($scope.itemArray[i]);
                    }
                }
            };
            $scope.searchMaterial = function(text) {
                $scope.searchText = text;
                if ($scope.isDataSearch == '')
                {
                    $scope.startPage = 0;
                    $scope.items = '';
                    $scope.itemArray = '';
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
                $scope.loadMaterial();
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
                $scope.loadMaterial();

            }
            $scope.prevPage = function(nextPage) {
                $scope.startPage = nextPage;
                $scope.loadMaterial();
            }
            $scope.goPage = function(pageNumber) {
                var nextPage = parseInt(pageNumber) - 1;
                $scope.startPage = nextPage;
                if ($scope.itemArray.length > 0 && $scope.isDataSearch != '')
                {
                    $scope.pageItems();
                }
                else
                {
                    $scope.loadMaterial();
                }
            }
            $scope.goPage = function(pageNumber) {
                var nextPage = parseInt(pageNumber) - 1;
                $scope.startPage = nextPage;
                if ($scope.itemArray.length > 0)
                {
                    if ($scope.searchText == '' || ($scope.searchText != '' && $scope.isDataSearch != ''))
                    {
                        $scope.pageItems();
                    }
                }
                else
                {
                    $scope.loadMaterial();
                }
            }
            $scope.goUpdate = function(materialId) {
                $location.path('/material/update/' + materialId);
            };

            $ionicModal.fromTemplateUrl('templates/popup/material_list.html', {
                scope: $scope,
                animation: 'fade-in'
            }).then(function(modal) {
                $scope.materialList = modal;
            });
            $scope.materialListModalShow = function() {
                $scope.searchText = '';
                $scope.loadMaterial($scope.searchText);
                $scope.materialList.show();
            };
            $scope.materialListModalClose = function() {
                $scope.materialList.hide();
            };



            $ionicModal.fromTemplateUrl('templates/popup/material_type.html', {
                scope: $scope,
                animation: 'fade-in'
            }).then(function(modal) {
                $scope.materialType = modal;
            });

            $scope.materialTypeModalShow = function() {
                $scope.materialListModalClose();
                $scope.materialType.show();
            };

            $scope.materialTypeModalClose = function() {
                $scope.materialType.hide();
//                $scope.materialListModalShow();
            };

            $scope.selectMaterialType = function(type) {
                $scope.material = {};
                $scope.materialTypeText = type;
                $scope.material.version = 0;
                $scope.material.code = '';
                $scope.material.description = '';
                $scope.materialCreateModalShow();
            };

            $ionicModal.fromTemplateUrl('templates/popup/material_create.html', {
                scope: $scope,
                animation: 'fade-in'
            }).then(function(modal) {
                $scope.materialCreate = modal;
            });

            $scope.materialCreateModalShow = function() {
                $scope.materialType.hide();
                $scope.materialCreate.show();
            };

            $scope.materialCreateModalClose = function() {
                $scope.materialCreate.hide();
                $scope.materialTypeModalShow();
            };
            $scope.submitCreateMaterial = function(isValid) {
                if (isValid) {
                    var materialBaseUrl = '';
                    switch ($scope.materialTypeText) {
                        case 'product':
                            materialBaseUrl = Restangular.all('sales').all('product');
                            break;
                        case 'material':
                            materialBaseUrl = Restangular.all('purchase').all('material');
                            break;
                        case 'inputs':
                            materialBaseUrl = Restangular.all('purchase').all('inputs');
                            break;
                        case 'ink':
                            materialBaseUrl = Restangular.all('purchase').all('ink');
                            break;
                        case 'machine':
                            materialBaseUrl = Restangular.all('manufacture').all('machine');
                            break;
                        case 'tooling':
                            materialBaseUrl = Restangular.all('manufacture').all('tooling');
                            break;
                    }
                    console.log(JSON.stringify($scope.material));
                    materialBaseUrl.post($scope.material).then(function(response) {
                        $scope.loading = false;
                        console.log(JSON.stringify(response.data));
                        if (response.status == 201) {
                            $scope.items.push({"id": response.data.id, "code": $scope.material.code, "description": $scope.material.description});
                            services.showAlert('Success', 'Processo foi gravado com sucesso !').then(function(res) {
                                $scope.materialCreate.hide();
                                $scope.loadMaterial();
                            });
                        }
                    }, function() {
                        $scope.loading = false;
                        services.showAlert('Falhou', 'Please try again');
                    });
                }

            };


            $scope.importOrder = function() {
                $scope.importData = {};
                // An elaborate, custom popup
                var importPopup = $ionicPopup.show({
                    templateUrl: 'templates/popup/material_import.html',
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
                                $scope.loadImportMaterial(true);
                            }
                        },
                    ]
                });
                importPopup.then(function(res) {

                });
                $timeout(function() {
                    importPopup.close();
                }, 10000);
            };

            $scope.showLoading = function() {
                $ionicLoading.show({
                    template: 'Enviando, aguarde...'
                });
            };

            $scope.hideLoading = function() {
                $ionicLoading.hide();
            };
            $scope.selectMaterial = function(code, description) {
                $scope.material.code = code;
                $scope.material.description = description;
                $scope.materialImportListModalClose();
            };

            $scope.startImportMaterialPage = 0;
            $scope.maxImportMaterialRecord = 5;
            $scope.loadImportMaterial = function(popup) {
                $scope.showLoading();
                Restangular.one('common/material').get({search: $scope.importData.materialSearchText, start: $scope.startImportMaterialPage, max: $scope.maxImportMaterialRecord}).then(function(response) {
                    $scope.importedMaterial = response.data;
                    $scope.materialRange();
                    if (popup != false)
                    {
                        $ionicModal.fromTemplateUrl('templates/popup/material_import_list.html', {
                            scope: $scope,
                            animation: 'fade-in'
                        }).then(function(modal) {
                            $scope.materialImportList = modal;
                            $scope.materialImportListModalShow();
                        });
                    }
                }, function(response) {
                    services.showAlert('Falhou', 'Please try again');
                });
                $scope.hideLoading();
            };
            $scope.materialImportListModalShow = function() {
                $scope.materialCreate.hide();
                $scope.materialImportList.show();
            };
            $scope.materialImportListModalClose = function() {
                $scope.materialImportList.hide();
                $scope.materialCreate.show();
            };
            $scope.materialRange = function() {
                $scope.pageMaterialStack = [];
                var start = parseInt($scope.startImportMaterialPage) + 1;
                for (var i = 1; i <= start; i++) {
                    $scope.pageMaterialStack.push(i);
                }
                console.log(JSON.stringify($scope.pageMaterialStack));
            };
            $scope.nextImportMaterialPage = function(len) {
                var nextPage = parseInt(len);
                $scope.startImportMaterialPage = nextPage;
                $scope.loadImportMaterial(false);
            }
            $scope.prevImportMaterialPage = function(nextPage) {
                $scope.startImportMaterialPage = nextPage;
                $scope.loadImportMaterial(false);
            }
            $scope.goImportMaterialPage = function(pageNumber) {
                var nextPage = parseInt(pageNumber) - 1;
                $scope.startImportMaterialPage = nextPage;
                $scope.loadImportMaterial(false);
            }

        });