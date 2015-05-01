altamiraAppControllers.controller('MaterialUpdateCtrl',
        function($scope, $http, $location, $ionicPopup, $routeParams, Restangular, services, $ionicModal) {
            $scope.materialId = $routeParams.materialId;
            $scope.material = {};
            $scope.loading = true;
            $scope.materialTypeText = '';
            Restangular.all('common').one('material', $scope.materialId).get().then(function(response) {
                $scope.loading = false;
                $scope.materialTypeText = response.data.type.substring(response.data.type.lastIndexOf('.') + 1, response.data.type.length);
                Restangular.one('measurement/unit').get({magnitude: 'dimencional'}).then(function(response) {
                    $scope.unitLengthBox = response.data;
                }, function(response) {
                    services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
                });
                Restangular.one('measurement/unit').get({magnitude: 'peso'}).then(function(response) {
                    $scope.unitWeightBox = response.data;
                }, function(response) {
                    services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
                });


                $scope.materialBaseUrl = '';
                $scope.material.version = response.data.version;
                $scope.material.code = response.data.code;
                $scope.material.description = response.data.description;
                $scope.material.processId = response.data.process.id;
                $scope.material.process = response.data.process.name;
                switch ($scope.materialTypeText) {
                    case 'Product':
                        $scope.materialBaseUrl = Restangular.all('sales').one('product', $scope.materialId);
                        $scope.material.width = response.data.width.expression;
                        $scope.material.widthType = response.data.width.unit.id;
                        $scope.material.height = response.data.height.expression;
                        $scope.material.heightType = response.data.height.unit.id;
                        $scope.material.length = response.data.length.expression;
                        $scope.material.lengthType = response.data.length.unit.id;
                        $scope.material.weight = response.data.weight.expression;
                        $scope.material.weightType = response.data.weight.unit.id;
                        $scope.material.depth = response.data.depth.expression;
                        $scope.material.depthType = response.data.depth.unit.id;
                        $scope.material.area = response.data.area.expression;
                        $scope.material.areaType = response.data.area.unit.id;
                        break;
                    case 'Component':
                        $scope.materialBaseUrl = Restangular.all('sales').one('component', $scope.materialId);
                        $scope.material.width = response.data.width.expression;
                        $scope.material.widthType = response.data.width.unit.id;
                        $scope.material.height = response.data.height.expression;
                        $scope.material.heightType = response.data.height.unit.id;
                        $scope.material.length = response.data.length.expression;
                        $scope.material.lengthType = response.data.length.unit.id;
                        $scope.material.weight = response.data.weight.expression;
                        $scope.material.weightType = response.data.weight.unit.id;
                        $scope.material.depth = response.data.depth.expression;
                        $scope.material.depthType = response.data.depth.unit.id;
                        $scope.material.area = response.data.area.expression;
                        $scope.material.areaType = response.data.area.unit.id;
                        break;
                    case 'Material':
                        $scope.materialBaseUrl = Restangular.all('purchase').one('steel', $scope.materialId);
                        $scope.material.lamination = response.data.lamination;
                        $scope.material.treatment = response.data.treatment;
                        $scope.material.thickness = response.data.thickness.expression;
                        $scope.material.thicknessType = response.data.thickness.unit.id;
                        $scope.material.width = response.data.width.expression;
                        $scope.material.widthType = response.data.width.unit.id;
                        $scope.material.length = response.data.length.expression;
                        $scope.material.lengthType = response.data.length.unit.id;
                        $scope.material.weight = response.data.weight.expression;
                        $scope.material.weightType = response.data.weight.unit.id;
                        break;
                    case 'Inputs':
                        $scope.materialBaseUrl = Restangular.all('purchase').one('inputs', $scope.materialId);
                        break;
                    case 'Ink':
                        $scope.materialBaseUrl = Restangular.all('purchase').one('ink', $scope.materialId);
                        break;
                    case 'Machine':
                        $scope.materialBaseUrl = Restangular.all('manufacture').one('machine', $scope.materialId);
                        break;
                    case 'Tooling':
                        $scope.materialBaseUrl = Restangular.all('manufacture').one('tooling', $scope.materialId);
                        break;
                }
            }, function(response) {
                $scope.loading = false;
                services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
            });
            $scope.submitUpdateMaterial = function(isValid) {
                if (isValid) {
                    $scope.loading = true;

                    $scope.postData = {};
                    $scope.postData.id = parseInt($scope.materialId);
                    $scope.postData.version = $scope.material.version;
                    $scope.postData.code = $scope.material.code;
                    $scope.postData.description = $scope.material.description;
                    $scope.postData.process = {};
                    $scope.postData.process.id = $scope.material.processId;
                    $scope.postData.component = [];
                    switch ($scope.materialTypeText) {
                        case 'Product':
                            $scope.postData.type = "br.com.altamira.data.model.sales.Product";
                            $scope.postData.width = {};
                            $scope.postData.width.expression = $scope.material.width;
                            $scope.postData.width.unit = {};
                            $scope.postData.width.unit.id = $scope.material.widthType;

                            $scope.postData.height = {};
                            $scope.postData.height.expression = $scope.material.height;
                            $scope.postData.height.unit = {};
                            $scope.postData.height.unit.id = $scope.material.heightType;

                            $scope.postData.length = {};
                            $scope.postData.length.expression = $scope.material.length;
                            $scope.postData.length.unit = {};
                            $scope.postData.length.unit.id = $scope.material.lengthType;

                            $scope.postData.area = {};
                            $scope.postData.area.expression = 0;
                            $scope.postData.area.expression = $scope.material.area;
                            $scope.postData.area.unit = {};
                            $scope.postData.area.unit.id = $scope.material.areaType;

                            $scope.postData.weight = {};
                            $scope.postData.weight.expression = $scope.material.weight;
                            $scope.postData.weight.unit = {};
                            $scope.postData.weight.unit.id = $scope.material.weightType;

                            $scope.postData.depth = {};
                            $scope.postData.depth.expression = $scope.material.depth;
                            $scope.postData.depth.unit = {};
                            $scope.postData.depth.unit.id = $scope.material.depthType;

                            $scope.postData.area = {};
                            $scope.postData.area.expression = $scope.material.area;
                            $scope.postData.area.unit = {};
                            $scope.postData.area.unit.id = $scope.material.areaType;
                            break;
                        case 'Component':
                            $scope.postData.type = "br.com.altamira.data.model.sales.Component";
                            $scope.postData.width = {};
                            $scope.postData.width.expression = $scope.material.width;
                            $scope.postData.width.unit = {};
                            $scope.postData.width.unit.id = $scope.material.widthType;

                            $scope.postData.height = {};
                            $scope.postData.height.expression = $scope.material.height;
                            $scope.postData.height.unit = {};
                            $scope.postData.height.unit.id = $scope.material.heightType;

                            $scope.postData.length = {};
                            $scope.postData.length.expression = $scope.material.length;
                            $scope.postData.length.unit = {};
                            $scope.postData.length.unit.id = $scope.material.lengthType;

                            $scope.postData.area = {};
                            $scope.postData.area.expression = 0;
                            $scope.postData.area.expression = $scope.material.area;
                            $scope.postData.area.unit = {};
                            $scope.postData.area.unit.id = $scope.material.areaType;

                            $scope.postData.weight = {};
                            $scope.postData.weight.expression = $scope.material.weight;
                            $scope.postData.weight.unit = {};
                            $scope.postData.weight.unit.id = $scope.material.weightType;

                            $scope.postData.depth = {};
                            $scope.postData.depth.expression = $scope.material.depth;
                            $scope.postData.depth.unit = {};
                            $scope.postData.depth.unit.id = $scope.material.depthType;

                            $scope.postData.area = {};
                            $scope.postData.area.expression = $scope.material.area;
                            $scope.postData.area.unit = {};
                            $scope.postData.area.unit.id = $scope.material.areaType;
                            break;
                        case 'Material':
                            $scope.postData.type = "br.com.altamira.data.model.sales.Material";
                            $scope.postData.lamination = $scope.material.lamination;
                            $scope.postData.treatment = $scope.material.treatment;

                            $scope.postData.thickness = {};
                            $scope.postData.thickness.expression = $scope.material.thickness;
                            $scope.postData.thickness.unit = {};
                            $scope.postData.thickness.unit.id = $scope.material.widthType;

                            $scope.postData.width = {};
                            $scope.postData.width.expression = $scope.material.width;
                            $scope.postData.width.unit = {};
                            $scope.postData.width.unit.id = $scope.material.widthType;

                            $scope.postData.length = {};
                            $scope.postData.length.expression = $scope.material.length;
                            $scope.postData.length.unit = {};
                            $scope.postData.length.unit.id = $scope.material.lengthType;

                            $scope.postData.weight = {};
                            $scope.postData.weight.expression = 0;
                            $scope.postData.weight.expression = $scope.material.weight;
                            $scope.postData.weight.unit = {};
                            $scope.postData.weight.unit.id = $scope.material.weightType;
                            break;
                        case 'Inputs':

                            break;
                        case 'Ink':

                            break;
                        case 'Machine':

                            break;
                        case 'Tooling':

                            break;
                    }
                    console.log(JSON.stringify($scope.postData));
                    $scope.materialBaseUrl.customPUT($scope.postData).then(function(response) {
                        $scope.loading = false;
                        services.showAlert('Success', 'Processo foi gravado com sucesso !').then(function(res) {
                            $location.path('/material/list');
                        });
                    }, function() {
                        $scope.loading = false;
                        services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
                    });
                }
            };

            $scope.removeMaterial = function() {
                services.showConfirmBox('Confirmation', 'Are you sure to remove this Material?').then(function(res) {
                    if (res) {
                        $scope.loading = true;
                        Restangular.all('common').one('material', $scope.materialId).remove().then(function() {
                            $scope.loading = false;
                            services.showAlert(' A Material - ' + $scope.materialId + ' removed successfully.').then(function(res) {
                                if (res) {
                                    $location.path('/material/list');
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
                $location.path('/material/list');
            };
            $ionicModal.fromTemplateUrl('templates/popup/process_list.html', {
                scope: $scope,
                animation: 'fade-in'
            }).then(function(modal) {
                $scope.processListModal = modal;
            });
            $scope.processListModalShow = function()
            {
                $scope.processListModal.show();
                $scope.loadProcess();
            }
            $scope.processListModalHide = function()
            {
                $scope.processListModal.hide();
            }
            $scope.resetProcess = function() {
                $scope.startProcessPage = 0;
                $scope.maxProcessRecord = 10;
                $scope.processes = '';
                $scope.processesArray = [];
                $scope.nextProcessButton = true;
            };
            $scope.resetProcess();
            $scope.searchProcessText = localStorage.getItem('searchProcess');
            $scope.isDataSearchProcess = '';

            $scope.loadProcess = function() {
                $scope.loading = true;
                Restangular.one('manufacture').one('process').get({search: localStorage.getItem('searchProcess'), start: $scope.startProcessPage, max: $scope.maxProcessRecord}).then(function(response) {
                    if (response.data == '') {
                        $scope.loading = false;
                        if ((parseInt($scope.startProcessPage) != 0))
                        {
                            $scope.nextProcessButton = false;
                            $scope.startProcessPage = (parseInt($scope.startProcessPage) - 1);
                            $scope.loadProcess();
                        } else
                        {
                            $scope.pageStackProcess = [];
                            services.showAlert('Aviso', 'Lista de Processos de Fabricação esta vazia.').then(function(res) {
                            });
                        }
                    } else
                    {
                        if ($scope.processes.length <= 0 && $scope.isDataSearchProcess == '')
                        {
                            $scope.processes = response.data;
                            $scope.processesArray = response.data;
                            if ($scope.searchProcessText != '')
                            {
                                $scope.isDataSearchProcess = 'yes';
                            }
                            else
                            {
                                $scope.isDataSearchProcess = '';
                            }
                        }
                        else
                        {
                            if ($scope.nextProcessButton != false)
                            {
                                $scope.temp = response.data;
                                angular.forEach($scope.temp, function(value, key) {
                                    $scope.processesArray.push(value);
                                });
                                $scope.pageProcesses();
                            }
                        }
                        $scope.loading = false;
                        $scope.rangeProcess();
                    }
                }, function(response) {
                    $scope.loading = false;
                    services.showAlert('Falhou', 'Tente Novamente UO Entre em Contato com o Suporte Técnico.');
                });
            };

            $scope.pageProcesses = function() {
                $scope.processes = [];
                $scope.start = $scope.startProcessPage * $scope.maxProcessRecord;
                $scope.end = ($scope.startProcessPage * $scope.maxProcessRecord) + $scope.maxProcessRecord;
                for (var i = $scope.start; i < $scope.end; i++)
                {
                    if ($scope.processesArray[i])
                    {
                        $scope.processes.push($scope.processesArray[i]);
                    }
                }
                if ($scope.processes.length != $scope.maxProcessRecord)
                {
                    $scope.nextProcessButton = false;
                }
            };

            $scope.searchProcess = function(text) {
                if (text != '')
                {
                    $scope.resetProcess();
                    localStorage.setItem('searchProcess', text);
                } else
                {
                    localStorage.setItem('searchProcess', '');
                    $scope.resetProcess();
                }
                $scope.loadProcess();
            };
            $scope.rangeProcess = function() {
                $scope.pageStackProcess = [];
                var start = parseInt($scope.startProcessPage) + 1;
                for (var i = 1; i <= start; i++) {
                    $scope.pageStackProcess.push(i);
                }
            };
            $scope.nextPageProcess = function(len) {
                var nextPage = parseInt(len);
                $scope.startProcessPage = nextPage;
                $scope.loadProcess();

            }
            $scope.prevPageProcess = function(prevPage) {
                $scope.startProcessPage = prevPage;
                $scope.loadProcess();
            }
            $scope.goPageProcess = function(pageNumber) {
                var nextPage = parseInt(pageNumber) - 1;
                $scope.startProcessPage = nextPage;
                if ($scope.processesArray.length > 0)
                {
                    if ($scope.searchProcessText == '' || ($scope.searchProcessText != '' && $scope.isDataSearchProcess != ''))
                    {
                        $scope.pageProcesses();
                    }
                }
                else
                {
                    $scope.loadProcess();
                }
            }

            $scope.selectProcess = function(id, name)
            {
                $scope.material.processId = id;
                $scope.material.process = name;
                $scope.processListModalHide();
            }
            $scope.goProcessUpdate = function()
            {
                $location.url('/manufacture/update/process/' + $scope.material.processId);
            }
        });