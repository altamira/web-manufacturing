altamiraAppControllers.controller('BomEditCtrl',
        function($scope, $http, $location, $route, $routeParams, $ionicPopup, Restangular, services, CommonFun, $ionicModal) {
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
            Restangular.one('manufacture/bom', $scope.bomId).get().then(function(response) {
                $scope.loading = false;
                var data = response.data;
                if (data != '')
                {
                    $scope.bomData.version = data.version;
                    $scope.bomData.number = data.number;
                    $scope.bomData.project = data.project;
                    $scope.bomData.customer = data.customer;
                    $scope.bomData.representative = data.representative;
                    $scope.bomData.finish = data.finish;
                    $scope.bomData.quotation = data.quotation;
                    $scope.bomData.created = CommonFun.getFullDate(data.created);
                    $scope.bomData.delivery = CommonFun.getFullDate(data.delivery);
                    $scope.bomData.items = data.item;
                }
            }, function(response) {
                services.showAlert('Falhou', 'Tente novamente ou entre em contato com o suporte técnico.');
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
                    $scope.postdata.created = CommonFun.getFullTimestamp($scope.bomData.created);
                    $scope.postdata.delivery = CommonFun.getFullTimestamp($scope.bomData.delivery);

                    Restangular.one('manufacture/bom', $scope.bomId).get().then(function(response1) {
                        $scope.postdata.version = response1.data.version;
                        Restangular.one('manufacture/bom', $scope.bomId).customPUT($scope.postdata).then(function(response) {
                            $scope.loading = false;
                            $location.path('/manufacture/bom');
                        }, function(response) {
                            $scope.loading = false;
                            services.showAlert('Falhou', 'Tente novamente ou entre em contato com o suporte técnico.');
                        });
                    }, function(response1) {
                        $scope.loading = false;
                        services.showAlert('Falhou', 'Tente novamente ou entre em contato com o suporte técnico.');
                    });
                }
                else
                {
                    services.showAlert('Falhou', 'Você perdeu alguma coisa. Por favor, verifique as mensagens de erro.');
                }
            };
            $scope.createItem = function() {
                $location.path('/bom/item/create/' + $scope.bomId);
            };
            $scope.updateItem = function(itemId) {
                $location.path('/bom/item/update/' + $scope.bomId + '/' + itemId);
            };
            $scope.reportBOM = function() {
                window.open(localStorage.getItem('reportBaseUrl') + '/report/manufacture/bom/' + $scope.bomId + '/checklist' + '?token=' + localStorage.getItem('token'), '_blank');
            };
            $scope.removeBom = function() {
                services.showConfirmBox('Confirmation', 'Confirma a exclusão desta Lista de Material ?').then(function(res) {
                    if (res) {
                        $scope.loading = true;
                        Restangular.one('manufacture/bom', $scope.bomId).remove().then(function() {
                            $scope.loading = false;
                            services.showAlert(' A Lista de Material - ' + $scope.bomId + ' foi excluida.').then(function(res) {
                                if (res) {
                                    $location.path('/manufacture/bom');
                                }
                            });
                        }, function() {
                            $scope.loading = false;
                            services.showAlert('Falhou', 'Tente novamente ou entre em contato com o suporte técnico.');
                        });
                    }
                });
            };
            $scope.removeItem = function(itemId) {
                services.showConfirmBox('Confirmation', 'Confirma a exclusão deste item ?').then(function(res) {
                    if (res) {
                        $scope.loading = true;
                        Restangular.one('manufacture/bom', $scope.bomId).one('item', itemId).remove().then(function() {
                            $scope.loading = false;
                            services.showAlert('O Item - ' + itemId + ' foi excluido.').then(function(res) {
                                if (res) {
                                    $route.reload();
                                }
                            });
                        }, function() {
                            $scope.loading = false;
                            services.showAlert('Falhou', 'Tente novamente ou entre em contato com o suporte técnico.');
                        });
                    }
                });
            };
            $scope.updatePart = function(itemId, partId) {
                $location.path('bom/component/update/' + $scope.bomId + '/' + itemId + '/' + partId);
            };
            $scope.removePart = function(itemId, partId) {
                services.showConfirmBox('Confirmation', 'Confirma a exclusão deste componente ?').then(function(res) {
                    if (res) {
                        $scope.loading = true;
                        Restangular.one('manufacture/bom', $scope.bomId).one('item', itemId).one('component', partId).remove().then(function() {
                            $scope.loading = false;
                            services.showAlert('Componente ' + partId + ' removido com sucesso.').then(function(res) {
                                if (res) {
                                    $route.reload();
                                }
                            });
                        }, function() {
                            $scope.loading = false;
                            services.showAlert('Falhou', 'Tente novamente ou entre em contato com o suporte técnico.');
                        });
                    }
                });
            };
            $scope.reportBOM = function() {
                $ionicModal.fromTemplateUrl('templates/bom/report_type.html', {
                    scope: $scope,
                    animation: 'fade-in'
                }).then(function(modal) {
                    $scope.reportType = modal;
                    $scope.reportType.show();
                    $scope.totalReport = [];
                    $scope.totalReport.push('checklist');
                });
                $scope.reportTypeModalShow = function() {
                    $scope.reportType.show();
                };
                $scope.reportTypeModalClose = function() {
                    $scope.reportType.hide();
                };
            };
            $scope.genrateReport = function() {
                if ($scope.totalReport.length > 0) {
                    $scope.reportTypeModalClose();
                    var token = localStorage.getItem('token');
                    window.open(localStorage.getItem('reportBaseUrl') + '/report/manufacture/bom/' + $scope.bomId + '?report=' + $scope.totalReport.join('&report=') + '&token=' + token, '_blank');
                } else {
                    services.showAlert('Falhou', 'Escolha Tipo Relatório');
                }
            }
            $scope.selectAllReport = function() {
                $scope.totalReport = [];
                $('.bom-report').each(function() {
                    $(this).addClass('fa-check-square-o');
                    $scope.pushReportName($(this).attr('reportname'));
                });
            }
            $scope.UnSelectAllReport = function() {
                $scope.totalReport = [];
                $('.bom-report').each(function() {
                    $(this).removeClass('fa-check-square-o');
                });
            }
            $scope.pushReportName = function(reportName) {
                if ($.inArray(reportName, $scope.totalReport) < 0)
                {
                    $scope.totalReport.push(reportName);
                }
            }
            $scope.popReportName = function(reportName) {
                $scope.totalReport = $.grep($scope.totalReport, function(value) {
                    return value != reportName;
                });
            }
            $scope.goBack = function() {
                $location.path('manufacture/bom');
            };
        });