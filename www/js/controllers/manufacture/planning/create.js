altamiraAppControllers.controller('ManufacturePlanningCreateCtrl',
        function($scope, $location, $route, Restangular, services, $ionicModal, CommonFun, $ionicSideMenuDelegate, $routeParams) {
            $scope.inicialDate = true;
            $scope.finalDate = true;
            $scope.startDate = true;
            $scope.manageBomSection = false;
            $scope.tempOperationId = '';
            $scope.totalWeight = 0;
            $scope.viewtype = 'list';
            $scope.listView = function() {
                $scope.viewtype = 'list';
                $('#grid_view').hide();
                $('#form_view').hide();
                $('#list_view').show();
                $('#listShowBtn').addClass('button-bar-selected');
                $('#formShowBtn').removeClass('button-bar-selected');
                $('#gridShowBtn').removeClass('button-bar-selected');
                $scope.loadOperations();
            }
            $scope.formView = function() {
                $scope.viewtype = 'form';
                $('#list_view').hide();
                $('#grid_view').hide();
                $('#form_view').show();
                $('#formShowBtn').addClass('button-bar-selected');
                $('#listShowBtn').removeClass('button-bar-selected');
                $('#gridShowBtn').removeClass('button-bar-selected');
                $scope.loadOperations();
            }
            $scope.gridView = function() {
                $scope.viewtype = 'grid';
                $('#form_view').hide();
                $('#list_view').hide();
                $('#grid_view').show();
                $('#gridShowBtn').addClass('button-bar-selected');
                $('#listShowBtn').removeClass('button-bar-selected');
                $('#formShowBtn').removeClass('button-bar-selected');
                $scope.loadGrid();
            }
            $ionicModal.fromTemplateUrl('templates/manufacture/planning/popup/create.html', {
                scope: $scope,
                animation: 'fade-in'
            }).then(function(modal) {
                $scope.createManPlanningModal = modal;
                $scope.planning = {}
                $scope.planning.inicial = sessionStorage.getItem('createOrderFormInicial');
                $scope.planning.final = sessionStorage.getItem('createOrderFormFinal');
                $scope.createManPlanningModalShow = function() {
                    $scope.createManPlanningModal.show();
                }
                $scope.createManPlanningModalHide = function() {
                    $scope.createManPlanningModal.hide();
                }
            });
            $scope.submitCreateManufacturePlanning = function(isValid) {
                if (isValid) {
                    sessionStorage.setItem('createOrderFormInicial', $scope.planning.inicial);
                    sessionStorage.setItem('createOrderFormFinal', $scope.planning.final);
                    $scope.createManPlanningModalHide();
//                    $location.path('manufacture/planning/create');
                }
            };
            $scope.loadOperations = function()
            {
                $scope.operationIdArr = [];
                $scope.bomIdArr = [];
                $scope.itemIdArr = [];
                $scope.componentIdArr = [];
                $scope.materialIdArr = [];
                $scope.componentQunArr = [];
                $scope.componentPesoArr = [];
                $scope.operationData = [];
                $scope.loading = true;
                Restangular.one('manufacture').one('planning').one('process').get().then(function(response) {
                    if (response.data.length > 0)
                    {
                        for (var i = 0; i < response.data.length; i++)
                        {
                            $scope.tempOpeData = {};
                            $scope.tempOpeData.id = response.data[i].id;
                            $scope.tempOpeData.type = response.data[i].type;
                            $scope.tempOpeData.name = response.data[i].name;
                            $scope.tempOpeData.bom = [];
                            $scope.tempOpeData.operationComponent = [];
                            $scope.operationData.push($scope.tempOpeData);
                        }
                    } else
                    {
                        services.showAlert('Message', 'No data found');
                    }

                    $scope.loading = false;
                }, function(response) {
                    $scope.loading = false;
                    services.showAlert('Falhou', 'Tente Novamente UO Entre em Contato com o Suporte Técnico.');
                });
            }
            $scope.loadOperations();
            $scope.loadOperationComponents = function(processId)
            {
                $scope.loading = true;
                $scope.operationIdArr = [];
                $scope.bomIdArr = [];
                $scope.itemIdArr = [];
                $scope.componentIdArr = [];
                $scope.materialIdArr = [];
                $scope.componentQunArr = [];
                $scope.componentPesoArr = [];
                Restangular.one('manufacture').one('planning').one('process', processId).one('component').get().then(function(response) {
                    $scope.operationComponent = [];
                    if (response.data.length > 0)
                    {
                        for (var i = 0; i < response.data.length; i++)
                        {
                            for (var j = 0; j < response.data[i].item.length; j++)
                            {
                                for (var k = 0; k < response.data[i].item[j].component.length; k++)
                                {
                                    $scope.tempComponentArr = {};
                                    $scope.tempComponentArr.operationid = processId;
                                    $scope.tempComponentArr.bomid = response.data[i].id;
                                    $scope.tempComponentArr.bomnumber = response.data[i].number;
                                    $scope.tempComponentArr.bomcustomer = response.data[i].customer;
                                    $scope.tempComponentArr.itemid = response.data[i].item[j].id;
                                    $scope.tempComponentArr.component = response.data[i].item[j].component[k];
                                    $scope.operationComponent.push($scope.tempComponentArr);
                                }
                            }
                        }
                        for (var i = 0; i < $scope.operationData.length; i++)
                        {
                            if (parseInt($scope.operationData[i].id) == parseInt(processId))
                            {
                                $scope.operationData[i].operationComponent = $scope.operationComponent;
                                $scope.operationData[i].bom = response.data;
                            }
                        }
                    } else
                    {
                        services.showAlert('Message', 'No data found');
                    }
                    $scope.loading = false;
                }, function(response) {
                    $scope.loading = false;
                    services.showAlert('Falhou', 'Tente Novamente UO Entre em Contato com o Suporte Técnico.');
                });
            }
            $scope.getOperationBomData = function(operationId)
            {
                $scope.loading = true;
                Restangular.one('manufacture').one('planning').one('process', operationId).one('bom').get().then(function(response) {
                    for (var i = 0; i < $scope.operationData.length; i++)
                    {
                        if (parseInt($scope.operationData[i].id) == parseInt(operationId))
                        {
                            for (var j = 0; j < response.data.length; j++)
                            {
                                $scope.tempOpeBomData = {};
                                $scope.tempOpeBomData.id = response.data[j].id;
                                $scope.tempOpeBomData.version = response.data[j].version;
                                $scope.tempOpeBomData.type = response.data[j].type;
                                $scope.tempOpeBomData.number = response.data[j].number;
                                $scope.tempOpeBomData.customer = response.data[j].customer;
                                $scope.tempOpeBomData.representative = response.data[j].representative;
                                $scope.tempOpeBomData.created = response.data[j].created;
                                $scope.tempOpeBomData.delivery = response.data[j].delivery;
                                $scope.tempOpeBomData.quotation = response.data[j].quotation;
                                $scope.tempOpeBomData.comment = response.data[j].comment;
                                $scope.tempOpeBomData.finish = response.data[j].finish;
                                $scope.tempOpeBomData.project = response.data[j].project;
                                $scope.tempOpeBomData.item = [];
                                $scope.operationData[i].bom.push($scope.tempOpeBomData);
                            }
                        }
                    }
                    $scope.loading = false;
                }, function(response) {
                    $scope.loading = false;
                    services.showAlert('Falhou', 'Tente Novamente UO Entre em Contato com o Suporte Técnico.');
                });
            }

            $scope.getBomItemData = function(operationid, bomId)
            {
                $scope.loading = true;
                Restangular.one('manufacture').one('planning').one('process', operationid).one('bom', bomId).one('item').get().then(function(response) {
                    for (var i = 0; i < $scope.operationData.length; i++)
                    {
                        if (parseInt($scope.operationData[i].id) == parseInt(operationid))
                        {
                            for (var j = 0; j < $scope.operationData[i].bom.length; j++)
                            {
                                if (parseInt($scope.operationData[i].bom[j].id) == parseInt(bomId))
                                {
                                    for (var k = 0; k < response.data.length; k++)
                                    {
                                        $scope.tempOpeItemData = {};
                                        $scope.tempOpeItemData.id = response.data[k].id;
                                        $scope.tempOpeItemData.type = response.data[k].type;
                                        $scope.tempOpeItemData.item = response.data[k].item;
                                        $scope.tempOpeItemData.description = response.data[k].description;
                                        $scope.tempOpeItemData.component = response.data[k].component;
                                        $scope.operationData[i].bom[j].item.push($scope.tempOpeItemData);
                                    }
                                }
                            }
                        }
                    }
                    $scope.loading = false;
                }, function(response) {
                    $scope.loading = false;
                    services.showAlert('Falhou', 'Tente Novamente UO Entre em Contato com o Suporte Técnico.');
                });
            }

            $scope.getItemComponentData = function(operationid, bomId, itemId)
            {
                $scope.loading = true;
                Restangular.one('manufacture').one('planning').one('process', operationid).one('bom', bomId).one('item', itemId).one('component').get().then(function(response) {
                    for (var i = 0; i < $scope.operationData.length; i++)
                    {
                        if (parseInt($scope.operationData[i].id) == parseInt(operationid))
                        {
                            for (var j = 0; j < $scope.operationData[i].bom.length; j++)
                            {
                                if (parseInt($scope.operationData[i].bom[j].id) == parseInt(bomId))
                                {
                                    for (var k = 0; k < $scope.operationData[i].bom[j].item.length; k++)
                                    {
                                        if (parseInt($scope.operationData[i].bom[j].item[k].id) == parseInt(itemId))
                                        {
                                            $scope.operationData[i].bom[j].item[k].component = response.data;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    $scope.loading = false;
                }, function(response) {
                    $scope.loading = false;
                    services.showAlert('Falhou', 'Tente Novamente UO Entre em Contato com o Suporte Técnico.');
                });
            }


            $scope.calculateTotalWeight = function()
            {
                if ($scope.componentPesoArr.length > 0)
                {
                    $scope.totalWeight = $scope.componentPesoArr.reduce(function(a, b) {
                        return a + b;
                    });
                }
                else
                {
                    $scope.totalWeight = 0;
                }
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                    $scope.$apply();
                }
            }

            $scope.checkAllOperationDelivery = function(operationId)
            {
                for (var i = 0; i < $scope.operationData.length; i++)
                {
                    if (parseInt($scope.operationData[i].id) == parseInt(operationId))
                    {
                        if ($scope.viewtype == 'list')
                        {
                            if ($('.operation_compo_section_' + $scope.operationData[i].id).html() != undefined)
                            {
                                $('.component_table_' + $scope.operationData[i].id + ' > tbody > tr > td:last-child').each(function() {
                                    if ($(this).children().hasClass('fa-check-square-o') == false && $(this).children().hasClass('fa-ban') == false)
                                    {
                                        $scope.operationIdArr.push(parseInt($(this).children().attr('operationid')));
                                        $scope.bomIdArr.push(parseInt($(this).children().attr('bomid')));
                                        $scope.itemIdArr.push(parseInt($(this).children().attr('itemid')));
                                        $scope.componentIdArr.push(parseInt($(this).children().attr('componentid')));
                                        $scope.materialIdArr.push(parseInt($(this).children().attr('materialid')));
                                        $scope.componentQunArr.push(parseFloat($(this).children().attr('componentqun')));
                                        $scope.componentPesoArr.push(parseFloat($(this).children().attr('componentpeso')));
                                        $(this).children().toggleClass('fa-check-square-o');
                                    }
                                });
                            }
                        } else
                        {
                            if ($('.operation_section_' + $scope.operationData[i].id).html() != undefined)
                            {
                                for (var j = 0; j < $scope.operationData[i].bom.length; j++)
                                {
                                    if ($('.bom_section_' + $scope.operationData[i].id + '_' + $scope.operationData[i].bom[j].id).html() != undefined)
                                    {
                                        for (var k = 0; k < $scope.operationData[i].bom[j].item.length; k++)
                                        {
                                            if ($('.item_section_' + $scope.operationData[i].id + '_' + $scope.operationData[i].bom[j].id + '_' + $scope.operationData[i].bom[j].item[k].id).html() != undefined)
                                            {
                                                $('.operation_manage_button_' + $scope.operationData[i].id).addClass('fa-minus-square-o');
                                                $('.operation_section_' + $scope.operationData[i].id).show('slow');

                                                $('.bom_manage_button_' + $scope.operationData[i].id + '_' + $scope.operationData[i].bom[j].id).addClass('fa-minus-square-o');
                                                $('.bom_section_' + $scope.operationData[i].id + '_' + $scope.operationData[i].bom[j].id).show('slow');

//                                            $('.item_mange_button_' + $scope.operationData[i].id + '_' + $scope.operationData[i].bom[j].id + '_' + $scope.operationData[i].bom[j].item[k].id).addClass('fa-minus-square-o');
//                                            $('.item_section_' + $scope.operationData[i].id + '_' + $scope.operationData[i].bom[j].id + '_' + $scope.operationData[i].bom[j].item[k].id).show('slow');

                                                $('.component_table_' + $scope.operationData[i].id + '_' + $scope.operationData[i].bom[j].id + '_' + $scope.operationData[i].bom[j].item[k].id + ' > tbody > tr > td:last-child').each(function() {
                                                    if ($(this).children().hasClass('fa-check-square-o') == false && $(this).children().hasClass('fa-ban') == false)
                                                    {
                                                        $scope.operationIdArr.push(parseInt($(this).children().attr('operationid')));
                                                        $scope.bomIdArr.push(parseInt($(this).children().attr('bomid')));
                                                        $scope.itemIdArr.push(parseInt($(this).children().attr('itemid')));
                                                        $scope.componentIdArr.push(parseInt($(this).children().attr('componentid')));
                                                        $scope.materialIdArr.push(parseInt($(this).children().attr('materialid')));
                                                        $scope.componentQunArr.push(parseFloat($(this).children().attr('componentqun')));
                                                        $scope.componentPesoArr.push(parseFloat($(this).children().attr('componentpeso')));
                                                        $(this).children().toggleClass('fa-check-square-o');
                                                    }
                                                });
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
//                $scope.calculateTotalWeight();
                calculateWeight();
            }
            $scope.uncheckAllOperationDelivery = function(operationId)
            {
                for (var i = 0; i < $scope.operationData.length; i++)
                {
                    if (parseInt($scope.operationData[i].id) == parseInt(operationId))
                    {
                        if ($scope.viewtype == 'list')
                        {
                            if ($('.operation_compo_section_' + $scope.operationData[i].id).html() != undefined)
                            {
                                $('.component_table_' + $scope.operationData[i].id + ' > tbody > tr > td:last-child').each(function() {
                                    if ($(this).children().hasClass('fa-check-square-o') == true && $(this).children().hasClass('fa-ban') == false)
                                    {
                                        $scope.operationIdArr.splice($scope.operationIdArr.indexOf(parseInt($(this).children().attr('operationid'))), 1);
                                        $scope.bomIdArr.splice($scope.bomIdArr.indexOf(parseInt($(this).children().attr('bomid'))), 1);
                                        $scope.itemIdArr.splice($scope.itemIdArr.indexOf(parseInt($(this).children().attr('itemid'))), 1);
                                        $scope.componentIdArr.splice($scope.componentIdArr.indexOf(parseInt($(this).children().attr('componentid'))), 1);
                                        $scope.materialIdArr.splice($scope.materialIdArr.indexOf(parseInt($(this).children().attr('materialid'))), 1);
                                        $scope.componentQunArr.splice($scope.componentQunArr.indexOf(parseFloat($(this).children().attr('componentqun'))), 1);
                                        $scope.componentPesoArr.splice($scope.componentPesoArr.indexOf(parseFloat($(this).children().attr('componentpeso'))), 1);
                                        $(this).children().toggleClass('fa-check-square-o');
                                    }
                                });
                            }
                        }
                        else
                        {
                            if ($('.operation_section_' + $scope.operationData[i].id).html() != undefined)
                            {
                                for (var j = 0; j < $scope.operationData[i].bom.length; j++)
                                {
                                    if ($('.bom_section_' + $scope.operationData[i].id + '_' + $scope.operationData[i].bom[j].id).html() != undefined)
                                    {
                                        for (var k = 0; k < $scope.operationData[i].bom[j].item.length; k++)
                                        {
                                            if ($('.item_section_' + $scope.operationData[i].id + '_' + $scope.operationData[i].bom[j].id + '_' + $scope.operationData[i].bom[j].item[k].id).html() != undefined)
                                            {
                                                $('.component_table_' + $scope.operationData[i].id + '_' + $scope.operationData[i].bom[j].id + '_' + $scope.operationData[i].bom[j].item[k].id + ' > tbody > tr > td:last-child').each(function() {
                                                    if ($(this).children().hasClass('fa-check-square-o') == true && $(this).children().hasClass('fa-ban') == false)
                                                    {
                                                        $scope.operationIdArr.splice($scope.operationIdArr.indexOf(parseInt($(this).children().attr('operationid'))), 1);
                                                        $scope.bomIdArr.splice($scope.bomIdArr.indexOf(parseInt($(this).children().attr('bomid'))), 1);
                                                        $scope.itemIdArr.splice($scope.itemIdArr.indexOf(parseInt($(this).children().attr('itemid'))), 1);
                                                        $scope.componentIdArr.splice($scope.componentIdArr.indexOf(parseInt($(this).children().attr('componentid'))), 1);
                                                        $scope.materialIdArr.splice($scope.materialIdArr.indexOf(parseInt($(this).children().attr('materialid'))), 1);
                                                        $scope.componentQunArr.splice($scope.componentQunArr.indexOf(parseFloat($(this).children().attr('componentqun'))), 1);
                                                        $scope.componentPesoArr.splice($scope.componentPesoArr.indexOf(parseFloat($(this).children().attr('componentpeso'))), 1);
                                                        $(this).children().toggleClass('fa-check-square-o');
                                                    }
                                                });
                                            }
                                        }
                                    }
                                }
                            }
                        }

                    }
                }
//                $scope.calculateTotalWeight();
                calculateWeight();
            }

            $scope.checkAllBomDelivery = function(operationId, bomId)
            {
                for (var i = 0; i < $scope.operationData.length; i++)
                {
                    if (parseInt($scope.operationData[i].id) == parseInt(operationId) && $('.operation_section_' + $scope.operationData[i].id).html() != undefined)
                    {
                        for (var j = 0; j < $scope.operationData[i].bom.length; j++)
                        {
                            if (parseInt($scope.operationData[i].bom[j].id) == parseInt(bomId) && $('.bom_section_' + $scope.operationData[i].id + '_' + $scope.operationData[i].bom[j].id).html() != undefined)
                            {
                                for (var k = 0; k < $scope.operationData[i].bom[j].item.length; k++)
                                {
                                    if ($('.item_section_' + $scope.operationData[i].id + '_' + $scope.operationData[i].bom[j].id + '_' + $scope.operationData[i].bom[j].item[k].id).html() != undefined)
                                    {
                                        $('.bom_manage_button_' + $scope.operationData[i].id + '_' + $scope.operationData[i].bom[j].id).addClass('fa-minus-square-o');
                                        $('.bom_section_' + $scope.operationData[i].id + '_' + $scope.operationData[i].bom[j].id).show('slow');

//                                        $('.item_mange_button_' + $scope.operationData[i].id + '_' + $scope.operationData[i].bom[j].id + '_' + $scope.operationData[i].bom[j].item[k].id).addClass('fa-minus-square-o');
//                                        $('.item_section_' + $scope.operationData[i].id + '_' + $scope.operationData[i].bom[j].id + '_' + $scope.operationData[i].bom[j].item[k].id).show('slow');

                                        $('.component_table_' + $scope.operationData[i].id + '_' + $scope.operationData[i].bom[j].id + '_' + $scope.operationData[i].bom[j].item[k].id + ' > tbody > tr > td:last-child').each(function() {
                                            if ($(this).children().hasClass('fa-check-square-o') == false && $(this).children().hasClass('fa-ban') == false)
                                            {
                                                $scope.operationIdArr.push(parseInt($(this).children().attr('operationid')));
                                                $scope.bomIdArr.push(parseInt($(this).children().attr('bomid')));
                                                $scope.itemIdArr.push(parseInt($(this).children().attr('itemid')));
                                                $scope.componentIdArr.push(parseInt($(this).children().attr('componentid')));
                                                $scope.materialIdArr.push(parseInt($(this).children().attr('materialid')));
                                                $scope.componentQunArr.push(parseFloat($(this).children().attr('componentqun')));
                                                $scope.componentPesoArr.push(parseFloat($(this).children().attr('componentpeso')));
                                                $(this).children().toggleClass('fa-check-square-o');
                                            }
                                        });
                                    }
                                }
                            }
                        }
                    }
                }
//                $scope.calculateTotalWeight();
                calculateWeight();
            }
            $scope.uncheckAllBomDelivery = function(operationId, bomId)
            {
                for (var i = 0; i < $scope.operationData.length; i++)
                {
                    if (parseInt($scope.operationData[i].id) == parseInt(operationId) && $('.operation_section_' + $scope.operationData[i].id).html() != undefined)
                    {
                        for (var j = 0; j < $scope.operationData[i].bom.length; j++)
                        {
                            if (parseInt($scope.operationData[i].bom[j].id) == parseInt(bomId) && $('.bom_section_' + $scope.operationData[i].id + '_' + $scope.operationData[i].bom[j].id).html() != undefined)
                            {
                                for (var k = 0; k < $scope.operationData[i].bom[j].item.length; k++)
                                {
                                    if ($('.item_section_' + $scope.operationData[i].id + '_' + $scope.operationData[i].bom[j].id + '_' + $scope.operationData[i].bom[j].item[k].id).html() != undefined)
                                    {
                                        $('.component_table_' + $scope.operationData[i].id + '_' + $scope.operationData[i].bom[j].id + '_' + $scope.operationData[i].bom[j].item[k].id + ' > tbody > tr > td:last-child').each(function() {
                                            if ($(this).children().hasClass('fa-check-square-o') == true && $(this).children().hasClass('fa-ban') == false)
                                            {
                                                $scope.operationIdArr.splice($scope.operationIdArr.indexOf(parseInt($(this).children().attr('operationid'))), 1);
                                                $scope.bomIdArr.splice($scope.bomIdArr.indexOf(parseInt($(this).children().attr('bomid'))), 1);
                                                $scope.itemIdArr.splice($scope.itemIdArr.indexOf(parseInt($(this).children().attr('itemid'))), 1);
                                                $scope.componentIdArr.splice($scope.componentIdArr.indexOf(parseInt($(this).children().attr('componentid'))), 1);
                                                $scope.materialIdArr.splice($scope.materialIdArr.indexOf(parseInt($(this).children().attr('materialid'))), 1);
                                                $scope.componentQunArr.splice($scope.componentQunArr.indexOf(parseFloat($(this).children().attr('componentqun'))), 1);
                                                $scope.componentPesoArr.splice($scope.componentPesoArr.indexOf(parseFloat($(this).children().attr('componentpeso'))), 1);
                                                $(this).children().toggleClass('fa-check-square-o');
                                            }
                                        });
                                    }
                                }
                            }
                        }
                    }
                }
//                $scope.calculateTotalWeight();
                calculateWeight();
            }

            $scope.checkAllItemDelivery = function(operationId, bomId, itemId)
            {
                for (var i = 0; i < $scope.operationData.length; i++)
                {
                    if (parseInt($scope.operationData[i].id) == parseInt(operationId) && $('.operation_section_' + $scope.operationData[i].id).html() != undefined)
                    {
                        for (var j = 0; j < $scope.operationData[i].bom.length; j++)
                        {
                            if (parseInt($scope.operationData[i].bom[j].id) == parseInt(bomId) && $('.bom_section_' + $scope.operationData[i].id + '_' + $scope.operationData[i].bom[j].id).html() != undefined)
                            {
                                for (var k = 0; k < $scope.operationData[i].bom[j].item.length; k++)
                                {
                                    if (parseInt($scope.operationData[i].bom[j].item[k].id) == parseInt(itemId) && $('.item_section_' + $scope.operationData[i].id + '_' + $scope.operationData[i].bom[j].id + '_' + $scope.operationData[i].bom[j].item[k].id).html() != undefined)
                                    {
//                                        $('.item_mange_button_' + $scope.operationData[i].id + '_' + $scope.operationData[i].bom[j].id + '_' + $scope.operationData[i].bom[j].item[k].id).addClass('fa-minus-square-o');
//                                        $('.item_section_' + $scope.operationData[i].id + '_' + $scope.operationData[i].bom[j].id + '_' + $scope.operationData[i].bom[j].item[k].id).show('slow');

                                        $('.component_table_' + $scope.operationData[i].id + '_' + $scope.operationData[i].bom[j].id + '_' + $scope.operationData[i].bom[j].item[k].id + ' > tbody > tr > td:last-child').each(function() {
                                            if ($(this).children().hasClass('fa-check-square-o') == false && $(this).children().hasClass('fa-ban') == false)
                                            {
                                                $scope.operationIdArr.push(parseInt($(this).children().attr('operationid')));
                                                $scope.bomIdArr.push(parseInt($(this).children().attr('bomid')));
                                                $scope.itemIdArr.push(parseInt($(this).children().attr('itemid')));
                                                $scope.componentIdArr.push(parseInt($(this).children().attr('componentid')));
                                                $scope.materialIdArr.push(parseInt($(this).children().attr('materialid')));
                                                $scope.componentQunArr.push(parseFloat($(this).children().attr('componentqun')));
                                                $scope.componentPesoArr.push(parseFloat($(this).children().attr('componentpeso')));
                                                $(this).children().toggleClass('fa-check-square-o');
                                            }
                                        });
                                    }
                                }
                            }
                        }
                    }
                }
//                $scope.calculateTotalWeight();
                calculateWeight();
            }
            $scope.uncheckAllItemDelivery = function(operationId, bomId, itemId)
            {
                for (var i = 0; i < $scope.operationData.length; i++)
                {
                    if (parseInt($scope.operationData[i].id) == parseInt(operationId) && $('.operation_section_' + $scope.operationData[i].id).html() != undefined)
                    {
                        for (var j = 0; j < $scope.operationData[i].bom.length; j++)
                        {
                            if (parseInt($scope.operationData[i].bom[j].id) == parseInt(bomId) && $('.bom_section_' + $scope.operationData[i].id + '_' + $scope.operationData[i].bom[j].id).html() != undefined)
                            {
                                for (var k = 0; k < $scope.operationData[i].bom[j].item.length; k++)
                                {
                                    if (parseInt($scope.operationData[i].bom[j].item[k].id) == parseInt(itemId) && $('.item_section_' + $scope.operationData[i].id + '_' + $scope.operationData[i].bom[j].id + '_' + $scope.operationData[i].bom[j].item[k].id).html() != undefined)
                                    {
//                                        $('.item_mange_button_' + $scope.operationData[i].id + '_' + $scope.operationData[i].bom[j].id + '_' + $scope.operationData[i].bom[j].item[k].id).removeClass('fa-minus-square-o');
//                                        $('.item_section_' + $scope.operationData[i].id + '_' + $scope.operationData[i].bom[j].id + '_' + $scope.operationData[i].bom[j].item[k].id).hide('slow');
                                        $('.component_table_' + $scope.operationData[i].id + '_' + $scope.operationData[i].bom[j].id + '_' + $scope.operationData[i].bom[j].item[k].id + ' > tbody > tr > td:last-child').each(function() {
                                            if ($(this).children().hasClass('fa-check-square-o') == true && $(this).children().hasClass('fa-ban') == false)
                                            {
                                                $scope.operationIdArr.splice($scope.operationIdArr.indexOf(parseInt($(this).children().attr('operationid'))), 1);
                                                $scope.bomIdArr.splice($scope.bomIdArr.indexOf(parseInt($(this).children().attr('bomid'))), 1);
                                                $scope.itemIdArr.splice($scope.itemIdArr.indexOf(parseInt($(this).children().attr('itemid'))), 1);
                                                $scope.componentIdArr.splice($scope.componentIdArr.indexOf(parseInt($(this).children().attr('componentid'))), 1);
                                                $scope.materialIdArr.splice($scope.materialIdArr.indexOf(parseInt($(this).children().attr('materialid'))), 1);
                                                $scope.componentQunArr.splice($scope.componentQunArr.indexOf(parseFloat($(this).children().attr('componentqun'))), 1);
                                                $scope.componentPesoArr.splice($scope.componentPesoArr.indexOf(parseFloat($(this).children().attr('componentpeso'))), 1);
                                                $(this).children().toggleClass('fa-check-square-o');
                                            }
                                        });
                                    }
                                }
                            }
                        }
                    }
                }
//                $scope.calculateTotalWeight();
                calculateWeight();
            }

            $scope.checkAllDelivery = function()
            {
                $scope.operationIdArr = [];
                $scope.bomIdArr = [];
                $scope.itemIdArr = [];
                $scope.componentIdArr = [];
                $scope.materialIdArr = [];
                $scope.componentQunArr = [];
                $scope.componentPesoArr = [];
                $('.delivery-table > tbody > tr > td:last-child').each(function() {
                    if ($(this).children().hasClass('fa-check-square-o') == false && $(this).children().hasClass('fa-ban') == false)
                    {
                        $scope.operationIdArr.push(parseInt($(this).children().attr('operationid')));
                        $scope.bomIdArr.push(parseInt($(this).children().attr('bomid')));
                        $scope.itemIdArr.push(parseInt($(this).children().attr('itemid')));
                        $scope.componentIdArr.push(parseInt($(this).children().attr('componentid')));
                        $scope.materialIdArr.push(parseInt($(this).children().attr('materialid')));
                        $scope.componentQunArr.push(parseFloat($(this).children().attr('componentqun')));
                        $scope.componentPesoArr.push(parseFloat($(this).children().attr('componentpeso')));
                        $(this).children().toggleClass('fa-check-square-o');
                    }
                });
                $scope.expandAll();
//                $scope.calculateTotalWeight();
                calculateWeight();
            }

            $scope.uncheckAllDelivery = function()
            {
                $scope.operationIdArr = [];
                $scope.bomIdArr = [];
                $scope.itemIdArr = [];
                $scope.componentIdArr = [];
                $scope.materialIdArr = [];
                $scope.componentQunArr = [];
                $scope.componentPesoArr = [];
                $('.delivery-table > tbody > tr > td:last-child').each(function() {
                    if ($(this).children().hasClass('fa-check-square-o') == true && $(this).children().hasClass('fa-ban') == false)
                    {
                        $(this).children().toggleClass('fa-check-square-o');
                    }
                });
//                $scope.calculateTotalWeight();
                calculateWeight();
            }

            $scope.expandAll = function()
            {
                for (var i = 0; i < $scope.operationData.length; i++)
                {
                    if ($('.operation_section_' + $scope.operationData[i].id).html() != undefined)
                    {
                        $('.operation_manage_button_' + $scope.operationData[i].id).addClass('fa-minus-square-o');
                        $('.operation_section_' + $scope.operationData[i].id).show('slow');
                    }
                    for (var j = 0; j < $scope.operationData[i].bom.length; j++)
                    {
                        if ($('.bom_section_' + $scope.operationData[i].id + '_' + $scope.operationData[i].bom[j].id).html() != undefined)
                        {
                            $('.bom_manage_button_' + $scope.operationData[i].id + '_' + $scope.operationData[i].bom[j].id).addClass('fa-minus-square-o');
                            $('.bom_section_' + $scope.operationData[i].id + '_' + $scope.operationData[i].bom[j].id).show('slow');
                        }
                        for (var k = 0; k < $scope.operationData[i].bom[j].item.length; k++)
                        {
                            if ($('.item_section_' + $scope.operationData[i].id + '_' + $scope.operationData[i].bom[j].id + '_' + $scope.operationData[i].bom[j].item[k].id).html() != undefined)
                            {
                                $('.item_mange_button_' + $scope.operationData[i].id + '_' + $scope.operationData[i].bom[j].id + '_' + $scope.operationData[i].bom[j].item[k].id).addClass('fa-minus-square-o');
                                $('.item_section_' + $scope.operationData[i].id + '_' + $scope.operationData[i].bom[j].id + '_' + $scope.operationData[i].bom[j].item[k].id).show('slow');
                            }
                        }
                    }
                }
            }

            $scope.collapseAll = function()
            {
                for (var i = 0; i < $scope.operationData.length; i++)
                {
                    if ($('.operation_section_' + $scope.operationData[i].id).html() != undefined)
                    {
                        $('.operation_manage_button_' + $scope.operationData[i].id).removeClass('fa-minus-square-o');
                        $('.operation_section_' + $scope.operationData[i].id).hide('slow');
                    }
                    for (var j = 0; j < $scope.operationData[i].bom.length; j++)
                    {
                        if ($('.bom_section_' + $scope.operationData[i].id + '_' + $scope.operationData[i].bom[j].id).html() != undefined)
                        {
                            $('.bom_manage_button_' + $scope.operationData[i].id + '_' + $scope.operationData[i].bom[j].id).removeClass('fa-minus-square-o');
                            $('.bom_section_' + $scope.operationData[i].id + '_' + $scope.operationData[i].bom[j].id).hide('slow');
                        }
                        for (var k = 0; k < $scope.operationData[i].bom[j].item.length; k++)
                        {
                            if ($('.item_section_' + $scope.operationData[i].id + '_' + $scope.operationData[i].bom[j].id + '_' + $scope.operationData[i].bom[j].item[k].id).html() != undefined)
                            {
                                $('.item_mange_button_' + $scope.operationData[i].id + '_' + $scope.operationData[i].bom[j].id + '_' + $scope.operationData[i].bom[j].item[k].id).removeClass('fa-minus-square-o');
                                $('.item_section_' + $scope.operationData[i].id + '_' + $scope.operationData[i].bom[j].id + '_' + $scope.operationData[i].bom[j].item[k].id).hide('slow');
                            }
                        }
                    }
                }
            }

            $ionicModal.fromTemplateUrl('templates/manufacture/planning/popup/start_date_create.html', {
                scope: $scope,
                animation: 'fade-in'
            }).then(function(modal) {
                $scope.startDateCreateModal = modal;
            });
            $scope.startDateCreateModalShow = function()
            {
                $scope.startDateCreateModal.show();
            }
            $scope.startDateCreateModalHide = function()
            {
                $scope.startDateCreateModal.hide();
            }

            $scope.openStartDateModal = function()
            {
                if ($scope.operationIdArr.length > 0)
                {
                    $scope.planningStartDate = {};
                    $scope.planningStartDate.chnDateTotalQuantity = 0;
                    $scope.planningStartDate.pesoTotal = 0;
                    for (var i = 0; i < $scope.componentIdArr.length; i++)
                    {
                        $scope.planningStartDate.chnDateTotalQuantity = $scope.planningStartDate.chnDateTotalQuantity + $scope.componentQunArr[i];
                        $scope.planningStartDate.pesoTotal = $scope.planningStartDate.pesoTotal + $scope.componentPesoArr[i];
                    }
                    $scope.startDateCreateModalShow();
                }
                else
                {
                    services.showAlert('Successo', 'Please select component').then(function(res) {
                    });
                }
            }

            $scope.submitStartDateCreate = function(isValid)
            {
                if (isValid)
                {
                    $scope.loading = true;
                    $scope.postData = {};
                    $scope.postData.id = 0;
                    $scope.postData.version = 0;
                    $scope.postData.type = "br.com.altamira.data.model.manufacture.planning.Order";
                    $scope.postData.createdDate = CommonFun.orderCreateDate();
                    $scope.postData.startDate = $scope.planning.inicial;
                    $scope.postData.endDate = $scope.planning.final;
                    $scope.postData.produce = [];
                    Restangular.all('manufacture').all('planning').post($scope.postData).then(function(res) {
                        $scope.startDateCreateModalHide();
                        var i = 0;
                        $scope.createProduce = function()
                        {
                            for (var n = 0; n < $scope.operationData.length; n++)
                            {
                                if (parseInt($scope.operationData[n].id) == parseInt($scope.operationIdArr[i]))
                                {
                                    for (var j = 0; j < $scope.operationData[n].bom.length; j++)
                                    {
                                        if (parseInt($scope.operationData[n].bom[j].id) == parseInt($scope.bomIdArr[i]))
                                        {
                                            for (var k = 0; k < $scope.operationData[n].bom[j].item.length; k++)
                                            {
                                                if (parseInt($scope.operationData[n].bom[j].item[k].id) == parseInt($scope.itemIdArr[i]))
                                                {
                                                    for (var l = 0; l < $scope.operationData[n].bom[j].item[k].component.length; l++)
                                                    {
                                                        if (parseInt($scope.operationData[n].bom[j].item[k].component[l].id) == parseInt($scope.componentIdArr[i]))
                                                        {
                                                            var comp_temp_id = $scope.componentIdArr[i];
                                                            var remaining_temp = '#remaining_' + $scope.operationIdArr[i] + '_' + $scope.bomIdArr[i] + '_' + $scope.itemIdArr[i] + '_' + $scope.componentIdArr[i];
                                                            $scope.produceData = {};
                                                            $scope.produceData.id = 0;
                                                            $scope.produceData.version = 0;
                                                            $scope.produceData.type = 'br.com.altamira.data.model.manufacture.planning.Produce';

                                                            $scope.produceData.order = {};
                                                            $scope.produceData.order.id = res.data.id;
                                                            $scope.produceData.order.type = "br.com.altamira.data.model.manufacture.planning.Order";
                                                            $scope.produceData.order.createdDate = CommonFun.orderCreateDate();
                                                            $scope.produceData.order.startDate = sessionStorage.getItem('createOrderFormInicial');
                                                            $scope.produceData.order.endDate = sessionStorage.getItem('createOrderFormFinal');

                                                            $scope.produceData.component = {};
                                                            $scope.produceData.component.id = comp_temp_id;

                                                            $scope.produceData.startDate = CommonFun.formatDate($scope.planningStartDate.startDate, 'DD/MM/YYYY', 'YYYY-MM-DD');

                                                            $scope.produceData.produced = {};
                                                            $scope.produceData.produced.value = 0;
                                                            $scope.produceData.produced.unit = $scope.operationData[n].bom[j].item[k].component[l].quantity.unit;

                                                            $scope.produceData.remaining = {};
                                                            $scope.produceData.remaining.value = 0;
                                                            $scope.produceData.remaining.unit = $scope.operationData[n].bom[j].item[k].component[l].quantity.unit;

                                                            $scope.produceData.quantity = {};
                                                            $scope.produceData.quantity.value = parseFloat($(remaining_temp).val());
                                                            $scope.produceData.quantity.unit = $scope.operationData[n].bom[j].item[k].component[l].quantity.unit;
                                                            $scope.produceData.weight = {};
                                                            $scope.produceData.weight.value = 0;
                                                            $scope.produceData.weight.unit = $scope.operationData[n].bom[j].item[k].component[l].weight.unit;
                                                            console.log(JSON.stringify($scope.produceData));
                                                            Restangular.all('manufacture').one('planning', res.data.id).one('bom', $scope.operationData[n].bom[j].id).one('item', $scope.operationData[n].bom[j].item[k].id).one('component', $scope.operationData[n].bom[j].item[k].component[l].id).all('produce').post($scope.produceData).then(function(resp) {
                                                                $scope.tempOperationId = $scope.operationIdArr[i];
                                                                i++;
                                                                if (i < $scope.operationIdArr.length)
                                                                {
                                                                    $scope.createProduce();
                                                                }
                                                                else
                                                                {
                                                                    $scope.loading = false;
                                                                    services.showAlert('Successo', 'Material Order created !').then(function(r) {
                                                                        $location.path('manufacture/planning/edit/' + res.data.id);
//                                                                        if ($scope.viewtype == 'form')
//                                                                        {
//                                                                            $scope.getLatetComponentData();
//                                                                        }
//                                                                        if ($scope.viewtype == 'list')
//                                                                        {
//                                                                            $scope.loadOperationComponents($scope.tempOperationId);
//                                                                        }
                                                                    });
                                                                }
                                                            }, function() {
                                                                $scope.loading = false;
                                                                services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
                                                            });
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        $scope.createProduce();
                    }, function() {
                        $scope.loading = false;
                        services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
                    });
                }
            }

            $scope.getLatetComponentData = function()
            {
                $scope.loading = true;
                var i = 0;
                var tempItemArr = [];
                $scope.getCompData = function()
                {
                    if (tempItemArr.indexOf(parseInt($scope.itemIdArr[i])) < 0)
                    {
                        Restangular.one('shipping').one('planning', $scope.bomIdArr[i]).one('item', $scope.itemIdArr[i]).one('component').get().then(function(response) {
                            for (var n = 0; n < $scope.operationData.length; n++)
                            {
                                if (parseInt($scope.operationData[n].id) == parseInt($scope.operationIdArr[i]))
                                {
                                    for (var j = 0; j < $scope.operationData[n].bom.length; j++)
                                    {
                                        if (parseInt($scope.operationData[n].bom[j].id) == parseInt($scope.bomIdArr[i]))
                                        {
                                            for (var k = 0; k < $scope.operationData[n].bom[j].item.length; k++)
                                            {
                                                if (parseInt($scope.operationData[n].bom[j].item[k].id) == parseInt($scope.itemIdArr[i]))
                                                {
                                                    $scope.operationData[n].bom[j].item[k].component = response.data;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            tempItemArr.push(parseInt($scope.itemIdArr[i]));
                            i++;
                            if (i < $scope.itemIdArr.length)
                            {
                                $scope.getCompData();
                            }
                            else
                            {
                                $scope.operationIdArr = [];
                                $scope.bomIdArr = [];
                                $scope.itemIdArr = [];
                                $scope.componentIdArr = [];
                                $scope.materialIdArr = [];
                                $scope.componentQunArr = [];
                                $scope.componentPesoArr = [];
                                $scope.totalWeight = 0;
                                $scope.loading = false;
                            }
                        }, function(response) {
                            $scope.loading = false;
                            services.showAlert('Falhou', 'Tente Novamente UO Entre em Contato com o Suporte Técnico.');
                        });
                    }
                    else
                    {
                        i++;
                        if (i < $scope.itemIdArr.length)
                        {
                            $scope.getCompData();
                        }
                        else
                        {
                            $scope.operationIdArr = [];
                            $scope.bomIdArr = [];
                            $scope.itemIdArr = [];
                            $scope.componentIdArr = [];
                            $scope.materialIdArr = [];
                            $scope.componentQunArr = [];
                            $scope.componentPesoArr = [];
                            $scope.totalWeight = 0;
                            $scope.loading = false;
                        }
                    }
                }
                $scope.getCompData();
            }

            $scope.today = CommonFun.toDay();
            var month = CommonFun.months();
            moment.locale('en');
            $scope.tempUnixTS = [];
            $scope.viewWeekly = false;
            $scope.setToday = 'yes';
            $scope.inicialDate = true;
            $scope.finalDate = true;
            $scope.currentYear = CommonFun.currentYear();
            $scope.selectDate = CommonFun.selectDate();
            $scope.validYears = CommonFun.validYears();
            sessionStorage.setItem('selectDate', $scope.selectDate);

            $scope.getCellColor = function(st, weight) {
                if (st < CommonFun.toDayTimeStamp() || (parseInt(weight) > 30))
                {
                    return 'red';
                }
            }
            $scope.checkDay = function(st) {
                return CommonFun.checkDay(st);
            }
            $scope.checkMonth = function(st) {
                return CommonFun.checkMonth(st);
            }
            $scope.checkYear = function(st) {
                return CommonFun.checkYear(st);
            }
            $scope.getWeekDay = function(date) {
                return CommonFun.getWeekDay(date);
            }
            $scope.getWeekDayShort = function(date) {
                return CommonFun.getWeekDayShort(date);
            }
            $scope.getDay = function(date) {
                return CommonFun.getDay(date);
            }
            $scope.getMonth = function(date) {
                return CommonFun.getMonth(date);
            }
            $scope.getMonthName = function(date) {
                return CommonFun.getMonthName(date);
            }
            $scope.getYear = function(date) {
                return CommonFun.getYear(date);
            }

            $scope.makeCalender = function() {
                $scope.days = [];
                $scope.monthDays = [];
                var startMonth = CommonFun.startMonth($scope.tempUnixTS);
                var startYear = CommonFun.startYear($scope.tempUnixTS);
                var endMonth = CommonFun.endMonth($scope.tempUnixTS);
                var endYear = CommonFun.endYear($scope.tempUnixTS);
                $scope.maxYear = endYear;
                $scope.subCalander = function(stMonth, year) {
                    for (var i = stMonth; i <= 12; i++)
                    {
                        if (year == endYear)
                        {
                            if (i <= endMonth)
                            {
                                var arrTemp = {};
                                arrTemp.name = month[i - 1] + ',' + year;
                                arrTemp.days = CommonFun.range(1, CommonFun.daysInMonth(i, year));
                                $scope.createDaysArray(arrTemp.days, i, year);
                                $scope.monthDays.push(arrTemp);
                            }
                        } else
                        {
                            var arrTemp = {};
                            arrTemp.name = month[i - 1] + ',' + year;
                            arrTemp.days = CommonFun.range(1, CommonFun.daysInMonth(i, year));
                            $scope.createDaysArray(arrTemp.days, i, year);
                            $scope.monthDays.push(arrTemp);
                        }
                        if (i == 12)
                        {
                            if (year < endYear)
                            {
                                $scope.subCalander(1, year + 1);
                            }
                        }
                    }
                }
                $scope.subCalander(startMonth, startYear);
            };

            $scope.createDaysArray = function(daysArray, m, y) {
                for (var j = 0; j < daysArray.length; j++) {
                    $scope.days.push(daysArray[j] + '_' + m + '_' + y);
                }
            }
            $scope.decorateTable = function() {
                var dragging = false;
                $('#dragbar').mousedown(function(e) {
                    e.preventDefault();

                    dragging = true;
                    var main = $('.planning-detail');
                    var ghostbar = $('<div>',
                            {id: 'ghostbar',
                                css: {
                                    height: main.outerHeight(),
                                    top: main.offset().top,
                                    left: main.offset().left
                                }
                            }).appendTo('body');

                    $(document).mousemove(function(e) {
                        ghostbar.css("left", e.pageX + 2);
                    });
                });

                $(document).mouseup(function(e) {
                    if (dragging)
                    {
                        var width = $(window).width();
                        var parentWidth = e.pageX;
                        var percent = 100 * parentWidth / width;
                        $('#sidebar').css("width", percent + "%");
                        $('.planning-detail').css("left", e.pageX + 32);
                        $('.planning-detail').css("width", (100 - percent) + '%');
                        $('#ghostbar').remove();
                        $(document).unbind('mousemove');
                        dragging = false;
                    }
                });
                $(".mainRow").mCustomScrollbar({
                    axis: "x",
                    theme: "inset-3",
                    scrollButtons: {enable: true},
                    scrollbarPosition: "outside"
                });
                if ($scope.setToday == 'yes')
                {
                    $(".mainRow").mCustomScrollbar("scrollTo", $('.' + CommonFun.gridToday()));
                    setTimeout(function() {
                        var w = ($(window).width() / 2) - 350;
                        $(".mainRow").mCustomScrollbar("scrollTo", '+=' + w);
                        $scope.setToday = 'no';
                    }, 1500);
                }

                $('.prev-btn').on('click', function(e) {
                    var oldDate = sessionStorage.getItem('selectDate');
                    var newDate = $('.' + CommonFun.formatDate(oldDate, 'DD/MM/YYYY', 'D_M_YYYY')).prev().data('day');
                    if (newDate != undefined && newDate != '')
                    {
                        $scope.$apply(function() {
                            $scope.selectDate = CommonFun.formatDate(newDate, 'D_M_YYYY', 'DD/MM/YYYY');
                            $('#select_date').val($scope.selectDate);
                            sessionStorage.setItem('selectDate', CommonFun.formatDate(newDate, 'D_M_YYYY', 'DD/MM/YYYY'));
                        });
                        var val = 150;
                        $('.mainRow').mCustomScrollbar("scrollTo", "+=" + val);
                    } else
                    {
                        services.showAlert('Notice', "Grid reached to it's minimum limit");
                    }

                });
                $('.next-btn').on('click', function(e) {
                    var oldDate = sessionStorage.getItem('selectDate');
                    var newDate = $('.' + CommonFun.formatDate(oldDate, 'DD/MM/YYYY', 'D_M_YYYY')).next().data('day');

                    if (newDate != undefined && newDate != '')
                    {
                        $scope.$apply(function() {
                            $scope.selectDate = CommonFun.formatDate(newDate, 'D_M_YYYY', 'DD/MM/YYYY');
                            $('#select_date').val($scope.selectDate);
                            sessionStorage.setItem('selectDate', CommonFun.formatDate(newDate, 'D_M_YYYY', 'DD/MM/YYYY'));
                        });
                        var val = 150;
                        $('.mainRow').mCustomScrollbar("scrollTo", "-=" + val);
                    } else
                    {
                        services.showAlert('Notice', "Grid reached to it's maximum limit");
                    }
                });

                $('.dragDiv').on('dblclick', function(e) {
                    $location.path('shipping/planning/' + $(this).data('orderid'));
                    $scope.$apply();
                });
                setTimeout(function() {
                    $('.date-head').on('click', function(e) {
                        var newDate = $(this).data('day');
                        $scope.$apply(function() {
                            $scope.selectDate = CommonFun.formatDate(newDate, 'D_M_YYYY', 'DD/MM/YYYY');
                            $('#select_date').val($scope.selectDate);
                            sessionStorage.setItem('selectDate', CommonFun.formatDate(newDate, 'D_M_YYYY', 'DD/MM/YYYY'));
                        });
                    });
                    $('.makeDroppable').on('click', function(e) {
                        var newDate = $(this).data('day');
                        $scope.$apply(function() {
                            $scope.selectDate = CommonFun.formatDate(newDate, 'D_M_YYYY', 'DD/MM/YYYY');
                            $('#select_date').val($scope.selectDate);
                            sessionStorage.setItem('selectDate', CommonFun.formatDate(newDate, 'D_M_YYYY', 'DD/MM/YYYY'));
                        });
                    });
                    $(".dragDiv").draggable({
                        revert: 'invalid'
                    });
                    $(".makeDroppable").droppable({
//                        accept: function(item) {
//                            return $(this).closest("tr").is(item.closest("tr")) && $(this).find("*").length == 0;
//                        },
                        drop: function(event, ui) {
                            $scope.changeDelDateByDrag(ui.draggable.data('orderid'), ui.draggable.data('olddate'), $(this).data('day'));

                            var $this = $(this);
                            $this.append(ui.draggable.css({
                                top: 0,
                                left: '0px !important'
                            }));
                            ui.draggable.position({
                                my: "center",
                                at: "center",
                                of: $this,
                                using: function(pos) {
                                    $(this).animate(pos, 500, "linear", function() {
                                        $(this).css('top', '0px');
                                        $(this).css('left', '0px');
                                    });
                                }
                            });
                        }
                    });
                    totalWeightCal();
                }, 100);
            }
            $scope.setGridDate = function(date)
            {
                $(".mainRow").mCustomScrollbar("scrollTo", $('.' + date));
                setTimeout(function() {
                    var w = ($(window).width() / 2) - 350;
                    $(".mainRow").mCustomScrollbar("scrollTo", '+=' + w);
                }, 1000);
            }
            $scope.loadGrid = function() {
                $scope.loading = true;
                $scope.itemId = [];
                $scope.itemPartIdArr = [];
                $scope.itemPartDeliveryArr = [];
                $scope.finalArr = '';
                Restangular.one('manufacture').one('planning').one('process').one('summary').get({max: 99999}).then(function(response) {
                    $scope.loading = false;
                    $scope.finalArr = response.data;
                    $scope.gridArr = [];
                    for (var i = 0; i < response.data.length; i++)
                    {
                        $scope.tempArr = {};
                        $scope.tempArr.id = response.data[i].id;
                        $scope.tempArr.type = response.data[i].type;
                        $scope.tempArr.name = response.data[i].name;
                        $scope.tempArr.produce = [];
                        for (var j = 0; j < $scope.finalArr.length; j++)
                        {
                            if (parseInt($scope.tempArr.id) == parseInt($scope.finalArr[j].id))
                            {
                                $scope.tempArr.produce.push($scope.finalArr[j].produce)
                            }
                        }
                        if ($scope.getObjects($scope.gridArr, 'id', $scope.tempArr.id).length == 0)
                        {
                            $scope.gridArr.push($scope.tempArr);
                        }
                    }
                    for (var i = 0; i < $scope.finalArr.length; i++)
                    {
                        $scope.tempUnixTS.push(CommonFun.getFullTimestamp(CommonFun.setDefaultDateFormat($scope.finalArr[i].produce.startDate, 'YYYY-MM-DD')));
                    }
                    $scope.tempUnixTS.sort(function(a, b) {
                        return b - a
                    });
                    $scope.makeCalender();
                    setTimeout(function() {
                        $scope.decorateTable();
                        $scope.makeDummyRowL();
                        $scope.makeDummyRowR();
                    }, 100);
                }, function(response) {
                    services.showAlert('Falhou', 'Tente Novamente UO Entre em Contato com o Suporte Técnico.');
                });
            };
            $scope.getObjects = function(obj, key, val) {
                var objects = [];
                for (var i in obj) {
                    if (!obj.hasOwnProperty(i))
                        continue;
                    if (typeof obj[i] == 'object') {
                        objects = objects.concat($scope.getObjects(obj[i], key, val));
                    } else if (i == key && obj[key] == val) {
                        objects.push(obj);
                    }
                }
                return objects;
            };
            $scope.makeDummyRowL = function()
            {
                var totalrow = 17; // total 23
                var usedrow = $scope.gridArr.length;
                var dataTableRowLen = $('.dataTable tr').length;

                if (dataTableRowLen < totalrow)
                {
                    for (usedrow; usedrow <= totalrow; usedrow++)
                    {
                        if (($('.dataTable tr').length % 2) == 0)
                        {
                            $('.dataTable tr:last').before('<tr class="even" style="height: 36px;"><td></td></tr>');
                        }
                        else
                        {
                            $('.dataTable tr:last').before('<tr class="odd" style="height: 36px;"><td></td></tr>');
                        }
                    }
                }
            }
            $scope.makeDummyRowR = function()
            {
                var totalrow = 18;
                var usedrow = $scope.gridArr.length;
                var mainTableRowLen = $('.manufactureTable tr').length;
                if (mainTableRowLen < totalrow)
                {
                    var mainTableTR = '';
                    $('.manufactureTable tr:nth-last-child(2) td').each(function() {
                        var strClass = $(this).attr("class");
                        var dataDay = $(this).data("day");
                        if (strClass.indexOf('holiday') > -1) {
                            mainTableTR += '<td class="' + dataDay + ' holiday">&nbsp;</td>';
                        } else {
                            mainTableTR += '<td class="' + dataDay + '">&nbsp;</td>';
                        }
                    });
                    for (usedrow; usedrow < totalrow; usedrow++)
                    {
                        if (($('.manufactureTable tr').length % 2) == 0)
                        {
                            $('.manufactureTable tr:last').before('<tr class="even" style="height: 36px;">' + mainTableTR + '</tr>');
                        }
                        else
                        {
                            $('.manufactureTable tr:last').before('<tr class="odd" style="height: 36px;">' + mainTableTR + '</tr>');
                        }

                    }
                }
//                var allCells = $(".mainTable td");
//                allCells.on("mouseover", function() {
//                    var el = $(this),
//                            pos = el.index();
//                    el.parent().find("th, td").addClass("hover");
//                    allCells.filter(":nth-child(" + (pos + 1) + ")").addClass("hover");
//                })
//                        .on("mouseout", function() {
//                    allCells.removeClass("hover");
//                });
            }
            $scope.goBack = function() {
                $location.path('manufacture/planning');
            }

            $ionicModal.fromTemplateUrl('templates/manufacture/planning/popup/process_list.html', {
                scope: $scope,
                animation: 'fade-in'
            }).then(function(modal) {
                $scope.processListModal = modal;
            });
            $scope.processListModalShow = function()
            {
                if ($scope.materialIdArr.length > 0)
                {
                    $scope.processListModal.show();
                    $scope.loadProcess();
                } else
                {
                    services.showAlert('Error', 'Please select component!');
                }

            }
            $scope.processListModalHide = function()
            {
                $scope.processListModal.hide();
            }
            $scope.resetProcess = function() {
                $scope.startPage = 0;
                $scope.maxRecord = 10;
                $scope.processes = '';
                $scope.processesArray = [];
                $scope.nextButton = true;
            };
            $scope.resetProcess();
            $scope.searchText = sessionStorage.getItem('searchProcess');
            $scope.tempSearch = '';
            $scope.isDataSearch = '';

            $scope.loadProcess = function() {
                $scope.loading = true;
                Restangular.one('manufacture').one('process').get({search: sessionStorage.getItem('searchProcess'), start: $scope.startPage, max: $scope.maxRecord}).then(function(response) {
                    if (response.data == '') {
                        $scope.loading = false;
                        if ((parseInt($scope.startPage) != 0))
                        {
                            $scope.nextButton = false;
                            $scope.startPage = (parseInt($scope.startPage) - 1);
                            $scope.loadProcess();
                        } else
                        {
                            $scope.pageStack = [];
                            services.showAlert('Aviso', 'Lista de Processos de Fabricação esta vazia.').then(function(res) {
                            });
                        }
                    } else
                    {
                        if ($scope.processes.length <= 0 && $scope.isDataSearch == '')
                        {
                            $scope.processes = response.data;
                            $scope.processesArray = response.data;
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
                                    $scope.processesArray.push(value);
                                });
                                $scope.pageProcesses();
                            }
                        }
                        $scope.loading = false;
                        $scope.range();
                    }
                }, function(response) {
                    $scope.loading = false;
                    services.showAlert('Falhou', 'Tente Novamente UO Entre em Contato com o Suporte Técnico.');
                });
            };

            $scope.pageProcesses = function() {
                $scope.processes = [];
                $scope.start = $scope.startPage * $scope.maxRecord;
                $scope.end = ($scope.startPage * $scope.maxRecord) + $scope.maxRecord;
                for (var i = $scope.start; i < $scope.end; i++)
                {
                    if ($scope.processesArray[i])
                    {
                        $scope.processes.push($scope.processesArray[i]);
                    }
                }
                if ($scope.processes.length != $scope.maxRecord)
                {
                    $scope.nextButton = false;
                }
            };

            $scope.searchProcess = function(text) {
                if (text != '')
                {
                    $scope.resetProcess();
                    sessionStorage.setItem('searchProcess', text);
                } else
                {
                    sessionStorage.setItem('searchProcess', '');
                    $scope.resetProcess();
                }
                $scope.loadProcess();
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
                $scope.loadProcess();

            }
            $scope.prevPage = function(nextPage) {
                $scope.startPage = nextPage;
                $scope.loadProcess();
            }
            $scope.goPage = function(pageNumber) {
                var nextPage = parseInt(pageNumber) - 1;
                $scope.startPage = nextPage;
                if ($scope.processesArray.length > 0)
                {
                    if ($scope.searchText == '' || ($scope.searchText != '' && $scope.isDataSearch != ''))
                    {
                        $scope.pageProcesses();
                    }
                }
                else
                {
                    $scope.loadProcess();
                }
            }

            $scope.changeProcess = function(id, name)
            {
                $scope.processListModalHide();
                var i = 0;
                $scope.changeMaterialProcess = function()
                {
                    $scope.loading = true;
                    $scope.postdata = {};
                    $scope.postdata.id = $scope.operationIdArr[i];
                    Restangular.all('common').one('material', $scope.materialIdArr[i]).all('process').post($scope.postdata).then(function(response) {

                        i++;
                        if (i < $scope.materialIdArr.length)
                        {
                            $scope.changeMaterialProcess();
                        }
                        else
                        {
                            $scope.loading = false;
                            $scope.loadOperationComponents($scope.operationIdArr[0]);
                        }
                    }, function(response) {
                        $scope.loading = false;
                        services.showAlert('Falhou', 'Tente Novamente UO Entre em Contato com o Suporte Técnico.');
                    });
                }
                $scope.changeMaterialProcess();
            }
        });