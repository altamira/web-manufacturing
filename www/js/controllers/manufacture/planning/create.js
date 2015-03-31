altamiraAppControllers.controller('ManufacturePlanningCreateCtrl',
        function($scope, $location, $route, Restangular, services, $ionicModal, CommonFun, $ionicSideMenuDelegate, $routeParams) {
            $scope.inicialDate = true;
            $scope.finalDate = true;
            $scope.startDate = true;
            $scope.manageBomSection = false;
            $scope.operationIdArr = [];
            $scope.bomIdArr = [];
            $scope.itemIdArr = [];
            $scope.componentIdArr = [];
            $scope.componentQunArr = [];
            $scope.componentPesoArr = [];
            $scope.totalWeight = 0;
            var pt = moment().locale('pt-br');
            $scope.today = pt.format('dddd, LL');
            moment.locale('pt-br');
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
            $scope.loadOperations = function()
            {
                $scope.loading = true;
                Restangular.one('manufacture').one('planning').one('operation').get().then(function(response) {
                    $scope.operationData = [];
                    if (response.data.length > 0)
                    {
                        for (var i = 0; i < response.data.length; i++)
                        {
                            $scope.tempOpeData = {};
                            $scope.tempOpeData.id = response.data[i].id;
                            $scope.tempOpeData.type = response.data[i].type;
                            $scope.tempOpeData.description = response.data[i].description;
                            $scope.tempOpeData.bom = [];
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
            $scope.getOperationBomData = function(operationId)
            {
                $scope.loading = true;
                Restangular.one('manufacture').one('planning').one('operation', operationId).one('bom').get().then(function(response) {
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
                Restangular.one('shipping').one('planning', bomId).one('item').get().then(function(response) {
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
                Restangular.one('shipping').one('planning', bomId).one('item', itemId).one('component').get().then(function(response) {
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
                                                if ($(this).children().hasClass('fa-check-square-o') == false)
                                                {
                                                    $scope.operationIdArr.push(parseInt($(this).children().attr('operationid')));
                                                    $scope.bomIdArr.push(parseInt($(this).children().attr('bomid')));
                                                    $scope.itemIdArr.push(parseInt($(this).children().attr('itemid')));
                                                    $scope.componentIdArr.push(parseInt($(this).children().attr('componentid')));
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
                $scope.calculateTotalWeight();
            }
            $scope.uncheckAllOperationDelivery = function(operationId)
            {
                for (var i = 0; i < $scope.operationData.length; i++)
                {
                    if (parseInt($scope.operationData[i].id) == parseInt(operationId))
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
                                                if ($(this).children().hasClass('fa-check-square-o') == true)
                                                {
                                                    $scope.operationIdArr.splice($scope.operationIdArr.indexOf(parseInt($(this).children().attr('operationid'))), 1);
                                                    $scope.bomIdArr.splice($scope.bomIdArr.indexOf(parseInt($(this).children().attr('bomid'))), 1);
                                                    $scope.itemIdArr.splice($scope.itemIdArr.indexOf(parseInt($(this).children().attr('itemid'))), 1);
                                                    $scope.componentIdArr.splice($scope.componentIdArr.indexOf(parseInt($(this).children().attr('componentid'))), 1);
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
                $scope.calculateTotalWeight();
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
                                            if ($(this).children().hasClass('fa-check-square-o') == false)
                                            {
                                                $scope.operationIdArr.push(parseInt($(this).children().attr('operationid')));
                                                $scope.bomIdArr.push(parseInt($(this).children().attr('bomid')));
                                                $scope.itemIdArr.push(parseInt($(this).children().attr('itemid')));
                                                $scope.componentIdArr.push(parseInt($(this).children().attr('componentid')));
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
                $scope.calculateTotalWeight();
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
                                            if ($(this).children().hasClass('fa-check-square-o') == true)
                                            {
                                                $scope.operationIdArr.splice($scope.operationIdArr.indexOf(parseInt($(this).children().attr('operationid'))), 1);
                                                $scope.bomIdArr.splice($scope.bomIdArr.indexOf(parseInt($(this).children().attr('bomid'))), 1);
                                                $scope.itemIdArr.splice($scope.itemIdArr.indexOf(parseInt($(this).children().attr('itemid'))), 1);
                                                $scope.componentIdArr.splice($scope.componentIdArr.indexOf(parseInt($(this).children().attr('componentid'))), 1);
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
                $scope.calculateTotalWeight();
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
                                            if ($(this).children().hasClass('fa-check-square-o') == false)
                                            {
                                                $scope.operationIdArr.push(parseInt($(this).children().attr('operationid')));
                                                $scope.bomIdArr.push(parseInt($(this).children().attr('bomid')));
                                                $scope.itemIdArr.push(parseInt($(this).children().attr('itemid')));
                                                $scope.componentIdArr.push(parseInt($(this).children().attr('componentid')));
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
                $scope.calculateTotalWeight();
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
                                            if ($(this).children().hasClass('fa-check-square-o') == true)
                                            {
                                                $scope.operationIdArr.splice($scope.operationIdArr.indexOf(parseInt($(this).children().attr('operationid'))), 1);
                                                $scope.bomIdArr.splice($scope.bomIdArr.indexOf(parseInt($(this).children().attr('bomid'))), 1);
                                                $scope.itemIdArr.splice($scope.itemIdArr.indexOf(parseInt($(this).children().attr('itemid'))), 1);
                                                $scope.componentIdArr.splice($scope.componentIdArr.indexOf(parseInt($(this).children().attr('componentid'))), 1);
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
                $scope.calculateTotalWeight();
            }

            $scope.checkAllDelivery = function()
            {
                $scope.operationIdArr = [];
                $scope.bomIdArr = [];
                $scope.itemIdArr = [];
                $scope.componentIdArr = [];
                $scope.componentQunArr = [];
                $('.delivery-table > tbody > tr > td:last-child').each(function() {
                    if ($(this).children().hasClass('fa-check-square-o') == false)
                    {
                        $scope.operationIdArr.push(parseInt($(this).children().attr('operationid')));
                        $scope.bomIdArr.push(parseInt($(this).children().attr('bomid')));
                        $scope.itemIdArr.push(parseInt($(this).children().attr('itemid')));
                        $scope.componentIdArr.push(parseInt($(this).children().attr('componentid')));
                        $scope.componentQunArr.push(parseFloat($(this).children().attr('componentqun')));
                        $scope.componentPesoArr.push(parseFloat($(this).children().attr('componentpeso')));
                        $(this).children().toggleClass('fa-check-square-o');
                    }
                });
                $scope.expandAll();
                $scope.calculateTotalWeight();
            }

            $scope.uncheckAllDelivery = function()
            {
                $scope.operationIdArr = [];
                $scope.bomIdArr = [];
                $scope.itemIdArr = [];
                $scope.componentIdArr = [];
                $scope.componentQunArr = [];
                $scope.componentPesoArr = [];
                $('.delivery-table > tbody > tr > td:last-child').each(function() {
                    if ($(this).children().hasClass('fa-check-square-o') == true)
                    {
                        $(this).children().toggleClass('fa-check-square-o');
                    }
                });
                $scope.calculateTotalWeight();
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
                    $scope.postData.createdDate = moment().format('YYYY-MM-DD');
                    $scope.postData.startDate = $scope.planning.inicial;
                    $scope.postData.endDate = $scope.planning.final;
                    $scope.postData.produce = [];
                    Restangular.all('manufacture').all('planning').post($scope.postData).then(function(res) {
                        $scope.startDateCreateModalHide();
                        var i = 0;
                        $scope.createProduce = function()
                        {
                            Restangular.all('shipping')
                                    .one('planning', $scope.bomIdArr[i])
                                    .one('item', $scope.itemIdArr[i])
                                    .one('component', $scope.componentIdArr[i])
                                    .get().then(function(response) {
                                var comp_temp_id = $scope.componentIdArr[i];
                                var remaining_temp = '#remaining_' + $scope.operationIdArr[i] + '_' + $scope.bomIdArr[i] + '_' + $scope.itemIdArr[i] + '_' + $scope.componentIdArr[i];
                                $scope.produceData = {};
                                $scope.produceData.id = 0;
                                $scope.produceData.version = 0;
                                $scope.produceData.type = 'br.com.altamira.data.model.manufacture.planning.Produce';

                                $scope.produceData.order = {};
                                $scope.produceData.order.id = res.data.id;
                                $scope.produceData.order.type = "br.com.altamira.data.model.manufacture.planning.Order";
                                $scope.produceData.order.createdDate = moment().format('YYYY-MM-DD');
                                $scope.produceData.order.startDate = sessionStorage.getItem('createOrderFormInicial');
                                $scope.produceData.order.endDate = sessionStorage.getItem('createOrderFormFinal');

                                $scope.produceData.component = {};
                                $scope.produceData.component.id = comp_temp_id;
                                $scope.produceData.component.type = response.data.type;
                                $scope.produceData.component.material = {};
                                $scope.produceData.component.material.id = response.data.material.id;
                                $scope.produceData.component.material.version = response.data.material.version;
                                $scope.produceData.component.material.type = response.data.material.type;
                                $scope.produceData.component.material.code = response.data.material.code;
                                $scope.produceData.component.material.description = response.data.material.description;

                                $scope.produceData.startDate = moment($scope.planningStartDate.startDate, 'DD/MM/YYYY').format('YYYY-MM-DD');

                                $scope.produceData.produced = {};
                                $scope.produceData.produced.value = 0;
                                $scope.produceData.produced.unit = response.data.delivery[0].quantity.unit;

                                $scope.produceData.remaining = {};
                                $scope.produceData.remaining.value = 0;
                                $scope.produceData.remaining.unit = response.data.delivery[0].quantity.unit;

                                $scope.produceData.quantity = {};
                                $scope.produceData.quantity.value = parseFloat($(remaining_temp).val());
                                $scope.produceData.quantity.unit = response.data.delivery[0].quantity.unit;

                                Restangular.all('manufacture').one('planning', res.data.id).all('produce').post($scope.produceData).then(function(res) {
                                    i++;
                                    if (i < $scope.operationIdArr.length)
                                    {
                                        $scope.createProduce();
                                    }
                                    else
                                    {
                                        $scope.loading = false;
                                        services.showAlert('Successo', 'Material Order created !').then(function(res) {
                                            $scope.getLatetComponentData();
                                        });
                                    }
                                }, function() {
                                    $scope.loading = false;
                                    services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
                                });
                            }, function() {
                                $scope.loading = false;
                                services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
                            });
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
                $scope.getCompData();
            }

            var pt = moment().locale('pt-br');
            $scope.today = pt.format('dddd, LL');
            moment.locale('pt-br');
            var month = moment.months();
            moment.locale('en');
            $scope.tempUnixTS = [];
            $scope.viewWeekly = false;
            $scope.setToday = 'yes';
            $scope.inicialDate = true;
            $scope.finalDate = true;
            $scope.currentYear = moment().format('YYYY');
            $scope.validYears = [parseInt($scope.currentYear) - 1, parseInt($scope.currentYear), parseInt($scope.currentYear) + 1];
            $scope.formView = function() {
                $scope.viewtype = 'form';
                $scope.setToday = 'yes'
                $('#form_view').show();
                $('#formShowBtn').removeClass('month');
                $('#grid_view').hide();
                $('#gridShowBtn').addClass('month');
                $scope.loadOperations();
            }
            $scope.gridView = function() {
                $scope.viewtype = 'grid';
                $('#form_view').hide();
                $('#formShowBtn').addClass('month');
                $('#grid_view').show();
                $('#gridShowBtn').removeClass('month');
                $scope.loadGrid();
            }

            $scope.getCellColor = function(st, weight) {
                if (st < moment().valueOf() || (parseInt(weight) > 30))
                {
                    return 'red';
                }
            }
            $scope.checkDay = function(st) {
                return moment(st).format('D');
            }
            $scope.checkMonth = function(st) {
                return moment(st).format('M');
            }
            $scope.checkYear = function(st) {
                return moment(st).format('YYYY');
            }
            $scope.getWeekDay = function(date) {
                return moment(date, "D_M_YYYY").format('dddd');
            }
            $scope.getWeekDayShort = function(date) {
                return moment(date, "D_M_YYYY").locale('pt-br').format('ddd');
            }
            $scope.getDay = function(date) {
                return parseInt(moment(date, "D_M_YYYY").format('D'));
            }
            $scope.getMonth = function(date) {
                return parseInt(moment(date, "D_M_YYYY").format('M'));
            }
            $scope.getMonthName = function(date) {
                moment.locale('pt-br');
                var month = moment(date, "D_M_YYYY").format('MMMM')
                moment.locale('en');
                return month;
            }
            $scope.getYear = function(date) {
                return moment(date, "D_M_YYYY").format('YYYY')
            }

            $scope.makeCalender = function() {
                $scope.days = [];
                $scope.monthDays = [];
                var startMonth = parseInt(moment($scope.tempUnixTS[$scope.tempUnixTS.length - 1]).format('M'));
                var startYear = parseInt(moment($scope.tempUnixTS[$scope.tempUnixTS.length - 1]).format('YYYY'));
                var endMonth = parseInt(moment($scope.tempUnixTS[0]).format('M'));
                var endYear = parseInt(moment($scope.tempUnixTS[0]).format('YYYY'));
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
                                arrTemp.days = range(1, daysInMonth(i, year));
                                createDaysArray(arrTemp.days, i, year);
                                $scope.monthDays.push(arrTemp);
                            }
                        } else
                        {
                            var arrTemp = {};
                            arrTemp.name = month[i - 1] + ',' + year;
                            arrTemp.days = range(1, daysInMonth(i, year));
                            createDaysArray(arrTemp.days, i, year);
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

            function createDaysArray(daysArray, m, y)
            {
                for (var j = 0; j < daysArray.length; j++) {
                    $scope.days.push(daysArray[j] + '_' + m + '_' + y);
                }
            }
            function daysInMonth(month, year) {
                return moment(month + "-" + year, "M-YYYY").daysInMonth();
            }
            function range(a, b, step) {
                var A = [];
                A[0] = a;
                step = step || 1;
                while (a + step <= b) {
                    A[A.length] = a += step;
                }
                return A;
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
                $(".planning-page").mCustomScrollbar({
                    axis: "y",
                    theme: "inset-3",
                    scrollButtons: {enable: true},
                    scrollbarPosition: "outside"
                });
//                if ($scope.setToday == 'yes')
//                {
//                    $(".mainRow").mCustomScrollbar("scrollTo", $('.' + moment().format('D_M_YYYY')));
//                    setTimeout(function() {
//                        var w = ($(window).width() / 2) - 100;
//                        $(".mainRow").mCustomScrollbar("scrollTo", '+=' + w);
//                        $scope.setToday = 'no';
//                    }, 1000);
//                }


                $('.dragDiv').on('dblclick', function(e) {
                    $location.path('shipping/planning/' + $(this).data('orderid'));
                    $scope.$apply();
                });
                setTimeout(function() {

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

            $scope.loadGrid = function() {
                $scope.loading = true;
                $scope.itemId = [];
                $scope.itemPartIdArr = [];
                $scope.itemPartDeliveryArr = [];
                $scope.finalArr = '';
                Restangular.one('manufacture/planning/operation/summary').get().then(function(response) {
                    $scope.loading = false;
                    $scope.finalArr = response.data;
                    var main = [];
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

                    }, 100);
                }, function(response) {
                    services.showAlert('Falhou', 'Tente Novamente UO Entre em Contato com o Suporte Técnico.');
                });
            };
        });
