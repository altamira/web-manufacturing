altamiraAppControllers.controller('ManufacturePlanningCreateCtrl',
        function($scope, $location, $route, Restangular, services, $ionicModal, CommonFun, $ionicSideMenuDelegate, $routeParams) {
            $scope.inicialDate = true;
            $scope.finalDate = true;
            $scope.startDate = true;
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
            $scope.loadOperations = function() {
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
                    setTimeout(function() {
                        $scope.manageOperationSection();
                    }, 500);
                    $scope.loading = false;
                }, function(response) {
                    $scope.loading = false;
                    services.showAlert('Falhou', 'Tente Novamente UO Entre em Contato com o Suporte Técnico.');
                });
            }
            $scope.loadOperations();
            $scope.getOperationBomData = function(operationId) {
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
                    setTimeout(function() {
                        $scope.manageOrderSection();
                    }, 500);
                    $scope.loading = false;
                }, function(response) {
                    $scope.loading = false;
                    services.showAlert('Falhou', 'Tente Novamente UO Entre em Contato com o Suporte Técnico.');
                });
            }
            $scope.getBomItemData = function(bomId) {
                $scope.loading = true;
                Restangular.one('shipping').one('planning', bomId).one('item').get().then(function(response) {
                    for (var i = 0; i < $scope.operationData.length; i++)
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
                    $scope.loading = false;
                }, function(response) {
                    $scope.loading = false;
                    services.showAlert('Falhou', 'Tente Novamente UO Entre em Contato com o Suporte Técnico.');
                });
            }
            $scope.manageOperationSection = function()
            {
                $('.operation_manage_button').click(function() {
                    var operationid = $(this).data('operationid');
                    if ($('.operation_section_' + operationid).html() == undefined)
                    {
                        $scope.getOperationBomData(operationid);
                        $(this).addClass('fa-minus-square-o');
                    } else if ($('.operation_section_' + operationid).html() != undefined && $(this).hasClass('fa-minus-square-o') == false)
                    {
                        $('.operation_section_' + operationid).show('slow');
                        $(this).addClass('fa-minus-square-o');
                    }
                    else
                    {
                        $('.operation_section_' + operationid).hide('slow');
                        $(this).removeClass('fa-minus-square-o');
                    }
                });
            }
            $scope.manageOrderSection = function()
            {
                $('.order_manage_button').click(function() {
                    var bomid = $(this).data('bomid');
                    if ($('.order_section_' + bomid).html() == undefined)
                    {
                        $scope.getBomItemData(bomid);
                        $(this).addClass('fa-minus-square-o');
                    } else if ($('.order_section_' + bomid).html() != undefined && $(this).hasClass('fa-minus-square-o') == false)
                    {
                        $('.order_section_' + bomid).show('slow');
                        $(this).addClass('fa-minus-square-o');
                    }
                    else
                    {
                        $('.order_section_' + bomid).hide('slow');
                        $(this).removeClass('fa-minus-square-o');
                    }
                });
            }
//            $scope.manageOperationSection();
//            $scope.planning = {};
//            $ionicModal.fromTemplateUrl('templates/manufacture/planning/popup/start_date_create.html', {
//                scope: $scope,
//                animation: 'fade-in'
//            }).then(function(modal) {
//                $scope.startDateCreateModal = modal;
//            });
//            $scope.startDateCreateModalShow = function() {
//                $scope.startDateCreateModal.show();
//            }
//            $scope.startDateCreateModalHide = function() {
//                $scope.startDateCreateModal.hide();
//            }
//            $scope.submitStartDateCreate = function(isValid)
//            {
//                if (isValid)
//                {
//                    console.log(JSON.stringify($scope.planning));
//                }
//            }
        });
