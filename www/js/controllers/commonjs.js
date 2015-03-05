altamiraAppControllers.controller('CommonCtrl',
        function($scope, $location, $routeParams, $ionicPopup, $ionicModal, Restangular, IntegrationRestangular, services, $ionicLoading, $timeout, $route, CommonFun) {
            $scope.material = {};
            $scope.material.width = 0;
            $scope.material.height = 0;
            $scope.material.length = 0;
            $scope.material.depth = 0;
            $scope.material.weight = 0;
            $scope.material.thickness = 0;

            $scope.material.widthType = CommonFun.getDefaultWidthType;
            $scope.material.heightType = CommonFun.getDefaultHeightType;
            $scope.material.lengthType = CommonFun.getDefaultLengthType;
            $scope.material.depthType = CommonFun.getDefaultDepthType;
            $scope.material.weightType = CommonFun.getDefaultWeightType;
            $scope.material.thicknessType = CommonFun.getDefaultThicknessType;
            $scope.material.areaType = CommonFun.getDefaultAreaType;

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
                    services.showAlert('Falhou', 'Tente Novamente UO Entre em Contato com o Suporte Técnico.');
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
                if ($scope.operationType == 'consume')
                {
                    $scope.consumeData.code = code;
                    $scope.consumeData.description = desc;
                } else if ($scope.operationType == 'use')
                {
                    $scope.useData.code = code;
                    $scope.useData.description = desc;
                } else if ($scope.operationType == 'produce')
                {
                    $scope.produceData.code = code;
                    $scope.produceData.description = desc;
                }else if ($scope.operationType == 'bom')
                {
                    $scope.partData.code = code;
                    $scope.partData.description = desc;
                }

                $scope.materialList.hide();
            };

            $scope.submitCreateMaterial = function(isValid) {
                if (isValid) {
                    var materialBaseUrl = '';
                    $scope.postData = {};
                    $scope.postData.id = 0;
                    $scope.postData.version = 0;
                    $scope.postData.code = $scope.material.code;
                    $scope.postData.description = $scope.material.description;
                    $scope.postData.component = [];
                    switch ($scope.materialTypeText) {
                        case 'product':
                            materialBaseUrl = Restangular.all('sales').all('product');
                            $scope.postData.type = "br.com.altamira.data.model.sales.Product";
                            $scope.postData.width = {};
                            $scope.postData.width.expression = 0;
                            $scope.postData.width.expression = $scope.material.width;
                            $scope.postData.width.unit = {};
                            $scope.postData.width.unit.id = $scope.material.widthType;

                            $scope.postData.height = {};
                            $scope.postData.height.expression = 0;
                            $scope.postData.height.expression = $scope.material.height;
                            $scope.postData.height.unit = {};
                            $scope.postData.height.unit.id = $scope.material.heightType;

                            $scope.postData.length = {};
                            $scope.postData.length.expression = 0;
                            $scope.postData.length.expression = $scope.material.length;
                            $scope.postData.length.unit = {};
                            $scope.postData.length.unit.id = $scope.material.lengthType;

                            $scope.postData.weight = {};
                            $scope.postData.weight.expression = 0;
                            $scope.postData.weight.expression = $scope.material.weight;
                            $scope.postData.weight.unit = {};
                            $scope.postData.weight.unit.id = $scope.material.weightType;

                            $scope.postData.depth = {};
                            $scope.postData.depth.expression = 0;
                            $scope.postData.depth.expression = $scope.material.depth;
                            $scope.postData.depth.unit = {};
                            $scope.postData.depth.unit.id = $scope.material.depthType;
                            break;
                        case 'component':
                            materialBaseUrl = Restangular.all('sales').all('component');
                            $scope.postData.type = "br.com.altamira.data.model.sales.Component";
                            $scope.postData.width = {};
                            $scope.postData.width.expression = 0;
                            $scope.postData.width.expression = $scope.material.width;
                            $scope.postData.width.unit = {};
                            $scope.postData.width.unit.id = $scope.material.widthType;

                            $scope.postData.height = {};
                            $scope.postData.height.expression = 0;
                            $scope.postData.height.expression = $scope.material.height;
                            $scope.postData.height.unit = {};
                            $scope.postData.height.unit.id = $scope.material.heightType;

                            $scope.postData.length = {};
                            $scope.postData.length.expression = 0;
                            $scope.postData.length.expression = $scope.material.length;
                            $scope.postData.length.unit = {};
                            $scope.postData.length.unit.id = $scope.material.lengthType;

                            $scope.postData.weight = {};
                            $scope.postData.weight.expression = 0;
                            $scope.postData.weight.expression = $scope.material.weight;
                            $scope.postData.weight.unit = {};
                            $scope.postData.weight.unit.id = $scope.material.weightType;

                            $scope.postData.depth = {};
                            $scope.postData.depth.expression = 0;
                            $scope.postData.depth.expression = $scope.material.depth;
                            $scope.postData.depth.unit = {};
                            $scope.postData.depth.unit.id = $scope.material.depthType;
                            break;
                        case 'material':
                            materialBaseUrl = Restangular.all('purchase').all('material');
                            $scope.postData.type = "br.com.altamira.data.model.sales.Material";
                            $scope.postData.lamination = $scope.material.lamination;
                            $scope.postData.treatment = $scope.material.treatment;

                            $scope.postData.thickness = {};
                            $scope.postData.thickness.expression = 0;
                            $scope.postData.thickness.expression = $scope.material.thickness;
                            $scope.postData.thickness.unit = {};
                            $scope.postData.thickness.unit.id = $scope.material.widthType;

                            $scope.postData.width = {};
                            $scope.postData.width.expression = 0;
                            $scope.postData.width.expression = $scope.material.width;
                            $scope.postData.width.unit = {};
                            $scope.postData.width.unit.id = $scope.material.widthType;

                            $scope.postData.length = {};
                            $scope.postData.length.expression = 0;
                            $scope.postData.length.expression = $scope.material.length;
                            $scope.postData.length.unit = {};
                            $scope.postData.length.unit.id = $scope.material.lengthType;
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
                    materialBaseUrl.post($scope.postData).then(function(response) {
                        $scope.loading = false;
                        if (response.status == 201) {
                            $scope.items.push({"id": response.data.id, "code": $scope.material.code, "description": $scope.material.description});
                            $scope.goUpdate($scope.material.code, $scope.material.description);

                            services.showAlert('Success', 'Processo foi gravado com sucesso !').then(function(res) {
                                if ($scope.operationType == 'material')
                                {
                                    $route.reload();
                                }
                                $scope.materialCreate.hide();
                                $scope.materialType.hide();
                                $scope.isDataSearch = '';
                                $scope.resetMaterial();
                                $scope.loadMaterial();
                            });
                        }
                    }, function() {
                        $scope.loading = false;
                        services.showAlert('Falhou', 'Tente Novamente UO Entre em Contato com o Suporte Técnico.');
                    });
                }
            };
        });