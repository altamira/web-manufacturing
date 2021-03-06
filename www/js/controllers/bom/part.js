altamiraAppControllers.controller('BomPartOperationCtrl',
        function($scope, $http, $location, $routeParams, $ionicPopup, Restangular, services, $ionicModal, CommonFun) {
            $scope.bomId = $routeParams.bomId;
            $scope.itemId = $routeParams.itemId;
            $scope.partId = $routeParams.partId;
            $scope.action = 'create';
            $scope.operationType = "bom";
            $scope.partData = {};
            $scope.postData = {};
            $scope.partData.version = '';
            $scope.partData.code = '';
            $scope.partData.description = '';
            $scope.partData.color = CommonFun.getDefaultColor;

            $scope.partData.length = 0;
            $scope.partData.height = 0;
            $scope.partData.width = 0;
            $scope.partData.quantity = 0;
            $scope.partData.weight = 0;

            $scope.partData.lengthType = CommonFun.getDefaultLengthType;
            $scope.partData.heightType = CommonFun.getDefaultHeightType;
            $scope.partData.widthType = CommonFun.getDefaultWidthType;
            $scope.partData.weightType = CommonFun.getDefaultWeightType;
            $scope.partData.quantityType = CommonFun.getDefaultQuantityType;


            Restangular.one('common/color').get({max: 0}).then(function(response) {
                $scope.partData.colorBox = response.data;
            }, function(response) {
                services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
            });
            Restangular.one('measurement/unit').get({magnitude: 'dimencional'}).then(function(response) {
                $scope.partData.unitLengthBox = response.data;
            }, function(response) {
                services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
            });
            Restangular.one('measurement/unit').get({magnitude: 'peso'}).then(function(response) {
                $scope.partData.unitWeightBox = response.data;
            }, function(response) {
                services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
            });
            Restangular.one('measurement/unit').get({magnitude: 'unidade'}).then(function(response) {
                $scope.partData.unitQuantityBox = response.data;
            }, function(response) {
                services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
            });

            $scope.loadPart = function() {
                $scope.loading = true;
                Restangular.one('manufacture/bom', $scope.bomId).one('item', $scope.itemId).one('component', $scope.partId).get().then(function(response) {
                    $scope.loading = false;
                    var data = response.data;
                    $scope.partData.version = data.version;
                    $scope.partData.code = data.material.code;
                    $scope.partData.description = data.material.description;
                    $scope.partData.color = data.color.id;
                    $scope.partData.quantity = CommonFun.setDecimal(data.quantity.value);
                    $scope.partData.quantityType = data.quantity.unit.id;
                    $scope.partData.width = CommonFun.setDecimal(data.width.value);
                    $scope.partData.widthType = data.width.unit.id;
                    $scope.partData.height = CommonFun.setDecimal(data.height.value);
                    $scope.partData.heightType = data.height.unit.id;
                    $scope.partData.length = CommonFun.setDecimal(data.length.value);
                    $scope.partData.lengthType = data.length.unit.id;
                    $scope.partData.weight = CommonFun.setDecimal(data.weight.value);
                    $scope.partData.weightType = data.weight.unit.id;
                }, function(response) {
                    services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
                });
            };

            if ($scope.partId != '' && $scope.partId != undefined)
            {
                $scope.action = 'update';
                $scope.loading = true;
                $scope.postData.id = $scope.partId;
                $scope.loadPart();
            }
            else
            {
                $scope.postData.id = 0;
            }


            $scope.submitPartForm = function(isValid) {
                if (isValid) {
                    $scope.loading = true;
                    $scope.postData.version = 0;
                    Restangular.one('common/material').get({code: $scope.partData.code}).then(function(response) {
                        if (response.data != '')
                        {
                            $scope.postData.code = $scope.partData.code;
                            $scope.postData.description = $scope.partData.description;
                            $scope.postData.material = {};
                            $scope.postData.material.id = response.data.id;

                            $scope.postData.color = $scope.partData.color;
                            Restangular.one('common/color', $scope.postData.color).get({max: 0}).then(function(response) {
                                $scope.postData.color = {};
                                $scope.postData.color.id = response.data.id;
                                $scope.postData.color.version = response.data.version;
                                $scope.postData.color.code = response.data.code;
                                $scope.postData.color.name = response.data.name;
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
                                if ($scope.action == 'create')
                                {
                                    Restangular.one('manufacture/bom', $scope.bomId).one('item', $scope.itemId).all('component').post($scope.postData).then(function(response) {
                                        $scope.loading = false;
                                        $location.path('/bom/item/update/' + $scope.bomId + '/' + $scope.itemId);
                                    }, function() {
                                        $scope.loading = false;
                                        services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
                                    });
                                }
                                else
                                {
                                    Restangular.one('manufacture/bom', $scope.bomId).one('item', $scope.itemId).one('component', $scope.partId).get().then(function(response1) {
                                        $scope.postData.version = response1.data.version;
                                        Restangular.one('manufacture/bom', $scope.bomId).one('item', $scope.itemId).one('component', $scope.partId).customPUT($scope.postData).then(function(response) {
                                            $scope.loading = false;
                                            $location.path('/bom/item/update/' + $scope.bomId + '/' + $scope.itemId);
                                        }, function(response) {
                                            $scope.loading = false;
                                            services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
                                        });
                                    }, function(response1) {
                                        $scope.loading = false;
                                        services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
                                    });
                                }
                            }, function(response) {
                                services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
                            });
                        }
                        else
                        {
                            services.showAlert('Error', 'Material não localizado, verifique o código.').then(function(res) {
                                return false;
                            });
                        }
                    }, function(response1) {
                        $scope.loading = false;
                        services.showAlert('Falhou', 'Material não localizado, verifique o código.');
                    });
                }
                else
                {
                    services.showAlert('Falhou', 'Você perdeu alguma coisa. Por favor, verifique as mensagens de erro.');
                }
            }
            $scope.goMaterialUpdate = function() {
                Restangular.one('common/material').get({code: $scope.partData.code}).then(function(response) {
                    if (response.data != '')
                    {
                        $location.path('/material/update/' + response.data.id);
                    }
                    else
                    {
                        services.showAlert('Error', 'Material não localizado, verifique o código.').then(function(res) {
                            return false;
                        });
                    }
                }, function(response1) {
                    $scope.loading = false;
                    services.showAlert('Falhou', 'Material não localizado, verifique o código.');
                });
            };
            $scope.removePart = function() {
                services.showConfirmBox('Confirmation', 'Tem certeza de remover este componente ?').then(function(res) {
                    if (res) {
                        $scope.loading = true;
                        Restangular.one('manufacture/bom', $scope.bomId).one('item', $scope.itemId).one('component', $scope.partId).remove().then(function() {
                            $scope.loading = false;
                            services.showAlert('Componente ' + $scope.partId + ' removido com sucesso.').then(function(res) {
                                if (res) {
                                    $location.path('bom/item/update/' + $scope.bomId + '/' + $scope.itemId);
                                }
                            });
                        }, function() {
                            $scope.loading = false;
                            services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
                        });
                    }
                });
            };

            $scope.goBack = function() {
                $location.path('bom/item/update/' + $scope.bomId + '/' + $scope.itemId);
            };


            $ionicModal.fromTemplateUrl('templates/popup/material_list.html', {
                scope: $scope,
                animation: 'fade-in'
            }).then(function(modal) {
                $scope.materialList = modal;
            });
            $scope.materialListModalShow = function() {
                $scope.searchText = '';
                $scope.isDataSearch = '';
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
                $scope.materialListModalShow();
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

            $scope.selectMaterial = function(code, description) {
                $scope.material.code = code;
                $scope.material.description = description;
                $scope.materialImportListModalClose();
            };

            $scope.resetImportMaterial = function() {
                $scope.startImportMaterialPage = 0;
                $scope.maxImportMaterialRecord = 5;
                $scope.itemsImportMaterial = '';
                $scope.itemImportMaterialArray = '';
                $scope.nextImportMaterialButton = true;
            }
            $scope.searchImportMaterialText = '';
            $scope.tempImportMaterialSearch = '';
            $scope.isImportMaterialDataSearch = '';
            $scope.resetImportMaterial();
            $scope.openImportMaterialList = function() {
                $scope.resetImportMaterial();
                $scope.searchImportMaterialText = '';
                $scope.tempImportMaterialSearch = '';
                $scope.isImportMaterialDataSearch = '';
                $scope.loadImportMaterial();
            };
            $scope.loadImportMaterial = function() {
                Restangular.one('common/material').get({search: $scope.searchImportMaterialText, start: $scope.startImportMaterialPage, max: $scope.maxImportMaterialRecord}).then(function(response) {
                    if (response.data == '') {
                        if ((parseInt($scope.startImportMaterialPage) != 0))
                        {
                            $scope.nextImportMaterialButton = false;
                            $scope.startImportMaterialPage = (parseInt($scope.startImportMaterialPage) - 1);
                            $scope.loadImportMaterial();
                        } else
                        {
                            $scope.materialType.hide();
                            services.showAlert('Notice', 'A lista de Material esta vazia.').then(function(res) {
                            });
                        }
                    } else
                    {
                        if ($scope.itemsImportMaterial.length <= 0)
                        {
                            $scope.itemsImportMaterial = response.data;

                            $scope.itemImportMaterialArray = response.data;
                            if ($scope.searchImportMaterialText != '')
                            {
                                $scope.isImportMaterialDataSearch = 'yes';
                            }
                            else
                            {
                                $scope.isImportMaterialDataSearch = '';
                            }
                            if ($scope.materialImportList != undefined)
                            {
                                $scope.materialImportList.hide();
                            }
                            $ionicModal.fromTemplateUrl('templates/popup/material_import_list.html', {
                                scope: $scope,
                                animation: 'fade-in'
                            }).then(function(modal) {
                                $scope.materialImportList = modal;
                                $scope.materialImportListModalShow();
                            });
                        }
                        else
                        {
                            if ($scope.nextImportMaterialButton != false)
                            {
                                $scope.temp = response.data;
                                angular.forEach($scope.temp, function(value, key) {
                                    $scope.itemImportMaterialArray.push(value);
                                });
                                $scope.pageImportMaterial();
                            }
                        }
                        $scope.loading = false;
                        $scope.rangeImportMaterial();
                    }
                }, function(response) {
                    services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
                });
            };

            $scope.backToCreatePage = function() {
                $scope.materialImportList.hide();
                $scope.materialImportList.hide();
            };

            $scope.pageImportMaterial = function() {
                $scope.itemsImportMaterial = [];
                $scope.start = $scope.startImportMaterialPage * $scope.maxImportMaterialRecord;
                $scope.end = ($scope.startImportMaterialPage * $scope.maxImportMaterialRecord) + $scope.maxImportMaterialRecord;
                for (var i = $scope.start; i < $scope.end; i++)
                {
                    if ($scope.itemImportMaterialArray[i])
                    {
                        $scope.itemsImportMaterial.push($scope.itemImportMaterialArray[i]);
                    }
                }
                if ($scope.itemsImportMaterial.length != $scope.maxImportMaterialRecord)
                {
                    $scope.nextImportMaterialButton = false;
                }
            };
            $scope.searchImportMaterial = function(text) {
                $scope.searchImportMaterialText = text;
                if ($scope.isImportMaterialDataSearch == '')
                {
                    $scope.resetImportMaterial();
                }
                if ($scope.searchImportMaterialText == '' && $scope.isImportMaterialDataSearch != '')
                {
                    $scope.resetImportMaterial();
                    $scope.isImportMaterialDataSearch = '';
                }
                if ($scope.searchImportMaterialText != '' && ($scope.tempImportMaterialSearch == $scope.searchImportMaterialText))
                {
                    $scope.tempImportMaterialSearch = $scope.searchImportMaterialText;
                }
                else
                {
                    $scope.resetImportMaterial();
                    $scope.isImportMaterialDataSearch = '';
                    $scope.tempImportMaterialSearch = $scope.searchImportMaterialText;
                }
                $scope.loadImportMaterial();
            };
            $scope.rangeImportMaterial = function() {
                $scope.pageStackImportMaterial = [];
                var start = parseInt($scope.startImportMaterialPage) + 1;
                for (var i = 1; i <= start; i++) {
                    $scope.pageStackImportMaterial.push(i);
                }
            };
            $scope.nextPageImportMaterial = function(len) {
                var nextPage = parseInt(len);
                $scope.startImportMaterialPage = nextPage;
                $scope.loadImportMaterial();

            }
            $scope.prevPageImportMaterial = function(nextPage) {
                $scope.startImportMaterialPage = nextPage;
                $scope.loadImportMaterial();
            }
            $scope.goPageImportMaterial = function(pageNumber) {
                var nextPage = parseInt(pageNumber) - 1;
                $scope.startImportMaterialPage = nextPage;
                if ($scope.itemImportMaterialArray.length > 0)
                {
                    if ($scope.searchImportMaterialText == '' || ($scope.searchImportMaterialText != '' && $scope.isImportMaterialDataSearch != ''))
                    {
                        $scope.pageImportMaterial();
                    }
                }
                else
                {
                    $scope.loadImportMaterial();
                }
            }
            $scope.materialImportListModalShow = function() {
                $scope.materialCreate.hide();
                $scope.materialImportList.show();
            };
            $scope.materialImportListModalClose = function() {
                $scope.materialImportList.hide();
                $scope.materialCreate.show();
            };
        });

altamiraAppControllers.controller('BomPartUpdateCtrl',
        function($scope, $http, $location, $routeParams, $route, $ionicPopup, Restangular, services, $ionicModal, $ionicLoading, CommonFun) {
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

            $scope.partData.lengthType = CommonFun.getDefaultLengthType;
            $scope.partData.heightType = CommonFun.getDefaultHeightType;
            $scope.partData.widthType = CommonFun.getDefaultWidthType;
            $scope.partData.weightType = CommonFun.getDefaultWeightType;
            $scope.partData.quantityType = CommonFun.getDefaultQuantityType;

            Restangular.one('common/color').get({max: 0}).then(function(response) {
                $scope.partData.colorBox = response.data;
            }, function(response) {
                services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
            });
            Restangular.one('measurement/unit').get({magnitude: 'dimencional'}).then(function(response) {
                $scope.partData.unitLengthBox = response.data;
            }, function(response) {
                services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
            });
            Restangular.one('measurement/unit').get({magnitude: 'peso'}).then(function(response) {
                $scope.partData.unitWeightBox = response.data;
            }, function(response) {
                services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
            });
            Restangular.one('measurement/unit').get({magnitude: 'unidade'}).then(function(response) {
                $scope.partData.unitQuantityBox = response.data;
            }, function(response) {
                services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
            });

            $scope.loadPart = function() {
                $scope.loading = true;
                Restangular.one('manufacture/bom', $scope.bomId).one('item', $scope.itemId).one('component', $scope.partId).get().then(function(response) {
                    $scope.loading = false;
                    var data = response.data;
                    $scope.partData.version = data.version;
                    $scope.partData.code = data.code;
                    $scope.partData.description = data.description;
                    $scope.partData.color = data.color.id;
                    $scope.partData.quantity = data.quantity.value;
                    $scope.partData.quantityType = data.quantity.unit.id;
                    $scope.partData.width = data.width.value;
                    if ($scope.partData.width == 0)
                    {
                        $scope.partData.width = 0.000001;
                    }
                    $scope.partData.widthType = data.width.unit.id;
                    $scope.partData.height = data.height.value;
                    if ($scope.partData.height == 0)
                    {
                        $scope.partData.height = 0.000001;
                    }
                    $scope.partData.heightType = data.height.unit.id;
                    $scope.partData.length = data.length.value;
                    if ($scope.partData.length == 0)
                    {
                        $scope.partData.length = 0.000001;
                    }
                    $scope.partData.lengthType = data.length.unit.id;
                    $scope.partData.weight = data.weight.value;
                    if ($scope.partData.weight == 0)
                    {
                        $scope.partData.weight = 0.000001;
                    }
                    $scope.partData.weightType = data.weight.unit.id;
                }, function(response) {
                    services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
                });
            };
            $scope.loadPart();

            $scope.removePart = function() {
                services.showConfirmBox('Confirmation', 'Tem certeza de remover este componente ?').then(function(res) {
                    if (res) {
                        $scope.loading = true;
                        Restangular.one('manufacture/bom', $scope.bomId).one('item', $scope.itemId).one('component', $scope.partId).remove().then(function() {
                            $scope.loading = false;
                            services.showAlert('Componente ' + $scope.partId + ' removido com sucesso.').then(function(res) {
                                if (res) {
                                    $location.path('bom/item/update/' + $scope.bomId + '/' + $scope.itemId);
                                }
                            });
                        }, function() {
                            $scope.loading = false;
                            services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
                        });
                    }
                });
            };
            $scope.goBack = function() {
                $location.path('bom/item/update/' + $scope.bomId + '/' + $scope.itemId);
            };

            $scope.resetMaterial = function() {
                $scope.startPage = 0;
                $scope.maxRecord = 10;
                $scope.items = '';
                $scope.itemArray = '';
                $scope.nextButton = true;
            };
            $scope.searchText = '';
            $scope.tempSearch = '';
            $scope.isDataSearch = '';
            $scope.isModal = true;
            $scope.resetMaterial();

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
                            services.showAlert('Notice', 'A lista de Material esta vazia.').then(function(res) {
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
                    services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
                });
            };
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
                if ($scope.items.length != $scope.maxRecord)
                {
                    $scope.nextButton = false;
                }
            };
            $scope.searchMaterial = function(text) {
                $scope.searchText = text;
                if ($scope.isDataSearch == '')
                {
                    $scope.resetMaterial();
                }
                if ($scope.searchText == '' && $scope.isDataSearch != '')
                {
                    $scope.resetMaterial();
                    $scope.isDataSearch = '';
                }
                if ($scope.searchText != '' && ($scope.tempSearch == $scope.searchText))
                {
                    $scope.tempSearch = $scope.searchText;
                }
                else
                {
                    $scope.resetMaterial();
                    $scope.isDataSearch = '';
                    $scope.tempSearch = $scope.searchText;
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
            $scope.goUpdate = function(code, desc) {
                $scope.partData.code = code;
                $scope.partData.description = desc;
                $scope.materialList.hide();
            };

            $ionicModal.fromTemplateUrl('templates/popup/material_list.html', {
                scope: $scope,
                animation: 'fade-in'
            }).then(function(modal) {
                $scope.materialList = modal;
            });
            $scope.materialListModalShow = function() {
                $scope.searchText = '';
                $scope.isDataSearch = '';
                $scope.resetMaterial();
                $scope.loadMaterial();
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
                $scope.materialListModalShow();
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

                    materialBaseUrl.post($scope.material).then(function(response) {
                        $scope.loading = false;

                        if (response.status == 201) {
                            $scope.items.push({"id": response.data.id, "code": $scope.material.code, "description": $scope.material.description});
                            services.showAlert('Success', 'Processo foi gravado com sucesso !').then(function(res) {
                                $scope.consumeData.code = $scope.material.code;
                                $scope.consumeData.description = $scope.material.description;

                                $scope.materialCreate.hide();
                            });
                        }
                    }, function() {
                        $scope.loading = false;
                        services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
                    });
                }
                else
                {
                    services.showAlert('Falhou', 'Você perdeu alguma coisa. Por favor, verifique as mensagens de erro.');
                }
            };

            $scope.importOrder = function() {
                $scope.materialCreate.hide();
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
                                $scope.materialCreate.show();
                            }
                        },
                        {text: '<b>Importar</b>',
                            type: 'button-positive',
                            onTap: function(res) {
                                if ($scope.importData.materialSearchText == '' || $scope.importData.materialSearchText == undefined)
                                {
                                    services.showAlert('Notice', 'Please enter text').then(function(res) {
                                        $scope.materialCreate.show();
                                    });
                                }
                                else
                                {
                                    $scope.resetImportMaterial();
                                    $scope.loadImportMaterial(true);
                                }
                            }
                        },
                    ]
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

            $scope.resetImportMaterial = function() {
                $scope.startImportMaterialPage = 0;
                $scope.maxImportMaterialRecord = 5;
                $scope.itemsImportMaterial = '';
                $scope.itemImportMaterialArray = '';
                $scope.nextImportMaterialButton = true;
            }
            $scope.searchImportMaterialText = '';
            $scope.tempImportMaterialSearch = '';
            $scope.isImportMaterialDataSearch = '';
            $scope.resetImportMaterial();
            $scope.openImportMaterialList = function() {
                $scope.resetImportMaterial();
                $scope.searchImportMaterialText = '';
                $scope.tempImportMaterialSearch = '';
                $scope.isImportMaterialDataSearch = '';
                $scope.loadImportMaterial();
            };
            $scope.loadImportMaterial = function() {
                Restangular.one('common/material').get({search: $scope.searchImportMaterialText, start: $scope.startImportMaterialPage, max: $scope.maxImportMaterialRecord}).then(function(response) {
                    if (response.data == '') {
                        if ((parseInt($scope.startImportMaterialPage) != 0))
                        {
                            $scope.nextImportMaterialButton = false;
                            $scope.startImportMaterialPage = (parseInt($scope.startImportMaterialPage) - 1);
                            $scope.loadImportMaterial();
                        } else
                        {
                            $scope.materialType.hide();
                            services.showAlert('Notice', 'Lista de Material esta vazia.').then(function(res) {
                            });
                        }
                    } else
                    {
                        if ($scope.itemsImportMaterial.length <= 0)
                        {
                            $scope.itemsImportMaterial = response.data;

                            $scope.itemImportMaterialArray = response.data;
                            if ($scope.searchImportMaterialText != '')
                            {
                                $scope.isImportMaterialDataSearch = 'yes';
                            }
                            else
                            {
                                $scope.isImportMaterialDataSearch = '';
                            }
                            if ($scope.materialImportList != undefined)
                            {
                                $scope.materialImportList.hide();
                            }
                            $ionicModal.fromTemplateUrl('templates/popup/material_import_list.html', {
                                scope: $scope,
                                animation: 'fade-in'
                            }).then(function(modal) {
                                $scope.materialImportList = modal;
                                $scope.materialImportListModalShow();
                            });
                        }
                        else
                        {
                            if ($scope.nextImportMaterialButton != false)
                            {
                                $scope.temp = response.data;
                                angular.forEach($scope.temp, function(value, key) {
                                    $scope.itemImportMaterialArray.push(value);
                                });
                                $scope.pageImportMaterial();
                            }
                        }
                        $scope.loading = false;
                        $scope.rangeImportMaterial();
                    }
                }, function(response) {
                    services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
                });
            };

            $scope.backToCreatePage = function() {
                $scope.materialImportList.hide();
                $scope.materialImportList.hide();
            };

            $scope.pageImportMaterial = function() {
                $scope.itemsImportMaterial = [];
                $scope.start = $scope.startImportMaterialPage * $scope.maxImportMaterialRecord;
                $scope.end = ($scope.startImportMaterialPage * $scope.maxImportMaterialRecord) + $scope.maxImportMaterialRecord;
                for (var i = $scope.start; i < $scope.end; i++)
                {
                    if ($scope.itemImportMaterialArray[i])
                    {
                        $scope.itemsImportMaterial.push($scope.itemImportMaterialArray[i]);
                    }
                }
                if ($scope.itemsImportMaterial.length != $scope.maxImportMaterialRecord)
                {
                    $scope.nextImportMaterialButton = false;
                }
            };
            $scope.searchImportMaterial = function(text) {
                $scope.searchImportMaterialText = text;
                if ($scope.isImportMaterialDataSearch == '')
                {
                    $scope.resetImportMaterial();
                }
                if ($scope.searchImportMaterialText == '' && $scope.isImportMaterialDataSearch != '')
                {
                    $scope.resetImportMaterial();
                    $scope.isImportMaterialDataSearch = '';
                }
                if ($scope.searchImportMaterialText != '' && ($scope.tempImportMaterialSearch == $scope.searchImportMaterialText))
                {
                    $scope.tempImportMaterialSearch = $scope.searchImportMaterialText;
                }
                else
                {
                    $scope.resetImportMaterial();
                    $scope.isImportMaterialDataSearch = '';
                    $scope.tempImportMaterialSearch = $scope.searchImportMaterialText;
                }
                $scope.loadImportMaterial();
            };
            $scope.rangeImportMaterial = function() {
                $scope.pageStackImportMaterial = [];
                var start = parseInt($scope.startImportMaterialPage) + 1;
                for (var i = 1; i <= start; i++) {
                    $scope.pageStackImportMaterial.push(i);
                }
            };
            $scope.nextPageImportMaterial = function(len) {
                var nextPage = parseInt(len);
                $scope.startImportMaterialPage = nextPage;
                $scope.loadImportMaterial();

            }
            $scope.prevPageImportMaterial = function(nextPage) {
                $scope.startImportMaterialPage = nextPage;
                $scope.loadImportMaterial();
            }
            $scope.goPageImportMaterial = function(pageNumber) {
                var nextPage = parseInt(pageNumber) - 1;
                $scope.startImportMaterialPage = nextPage;
                if ($scope.itemImportMaterialArray.length > 0)
                {
                    if ($scope.searchImportMaterialText == '' || ($scope.searchImportMaterialText != '' && $scope.isImportMaterialDataSearch != ''))
                    {
                        $scope.pageImportMaterial();
                    }
                }
                else
                {
                    $scope.loadImportMaterial();
                }
            }
            $scope.materialImportListModalShow = function() {
                $scope.materialCreate.hide();
                $scope.materialImportList.show();
            };
            $scope.materialImportListModalClose = function() {
                $scope.materialImportList.hide();
                $scope.materialCreate.show();
            };
        });