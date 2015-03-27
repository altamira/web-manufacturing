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
                    for (var i = 0; i < response.data.length; i++)
                    {
                        $scope.tempOpeData = {};
                        $scope.tempOpeData.id = response.data[i].id;
                        $scope.tempOpeData.type = response.data[i].type;
                        $scope.tempOpeData.description = response.data[i].description;
                        $scope.tempOpeData.bom = [];
                        $scope.operationData.push($scope.tempOpeData);
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
                                        $scope.tempOpeItemData.component = [];
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

            $scope.checkAllDelivery = function()
            {
                $scope.operationIdArr = [];
                $scope.bomIdArr = [];
                $scope.itemIdArr = [];
                $scope.componentIdArr = [];
                $scope.componentQunArr = [];
                $('.delivery-table > tbody > tr > td:last-child').each(function() {
                    $scope.operationIdArr.push(parseInt($(this).children().attr('operationid')));
                    $scope.bomIdArr.push(parseInt($(this).children().attr('bomid')));
                    $scope.itemIdArr.push(parseInt($(this).children().attr('itemid')));
                    $scope.componentIdArr.push(parseInt($(this).children().attr('componentid')));
                    $scope.componentQunArr.push(parseFloat($(this).children().attr('componentqun')));
                    $scope.componentPesoArr.push(parseFloat($(this).children().attr('componentpeso')));
                    if ($(this).children().hasClass('fa-check-square-o') == false)
                    {
                        $(this).children().toggleClass('fa-check-square-o');
                    }
                });
                $scope.expandAll();
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
                $scope.collapseAll();
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
                    console.log(JSON.stringify($scope.postData));
                    Restangular.all('manufacture').all('planning').post($scope.postData).then(function(response) {
                        console.log(JSON.stringify(response.data));
                        $scope.loading = false;
//                        services.showAlert('Success', 'Planning foi gravado com sucesso !').then(function(res) {
//
//                        });
                    }, function() {
                        $scope.loading = false;
                        services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
                    });
                }
            }
        });
