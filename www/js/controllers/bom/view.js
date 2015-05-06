altamiraAppControllers.controller('BomViewCtrl',
        function($scope, $location, $route, $routeParams, Restangular, services, $ionicModal) {
            $scope.bomId = $routeParams.bomId;
            console.log(JSON.stringify("Token=>"+localStorage.getItem('token')));
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
            Restangular.one('manufacture/bom', $scope.bomId).get().then(function(response) {
                $scope.loading = false;
                var data = response.data;
                if (data != '')
                {
                    $scope.bomData.checked = data.checked;
                    $scope.bomData.number = data.number;
                    $scope.bomData.project = data.project;
                    $scope.bomData.customer = data.customer;
                    $scope.bomData.representative = data.representative;
                    $scope.bomData.finish = data.finish;
                    $scope.bomData.quotation = data.quotation;
                    $scope.bomData.created = data.created;
                    $scope.bomData.delivery = data.delivery;
                    $scope.bomData.items = data.item;
                }
            }, function(response) {
                services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
            });
            $scope.makeChecked = function() {
                services.showConfirmBox('Confirmation', 'A Lista de Material foi conferida ?').then(function(res) {
                    if (res) {
                        $scope.loading = true;
                        Restangular.one('manufacture/bom', $scope.bomId).all('checked').customPUT().then(function(response) {
                            $scope.loading = false;
                            services.showAlert('Success', 'A Lista de Material do Pedido ' + $scope.bomData.number + ' foi marcada como conferida.').then(function(res) {
                                if (res) {
                                    $location.path('/manufacture/bom');
                                }
                            });

                        }, function(response) {
                            $scope.loading = false;
                            services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
                        });
                    }
                });
            };
            $scope.makeUnchecked = function() {
                services.showConfirmBox('Confirmation', 'A Lista de Material foi conferida ?').then(function(res) {
                    if (res) {
                        $scope.loading = true;
                        Restangular.one('manufacture/bom', $scope.bomId).all('unchecked').customPUT().then(function(response) {
                            $scope.loading = false;
                            services.showAlert('Success', 'A Lista de Material do Pedido ' + $scope.bomData.number + ' foi marcada como conferida.').then(function(res) {
                                if (res) {
                                    $route.reload();
                                }
                            });

                        }, function(response) {
                            $scope.loading = false;
                            services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
                        });
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
                services.showConfirmBox('Confirmation', 'Tem certeza de remover esta Lista de Material ?').then(function(res) {
                    if (res) {
                        $scope.loading = true;
                        Restangular.one('manufacture/bom', $scope.bomId).remove().then(function() {
                            $scope.loading = false;
                            services.showAlert('A Lista de Material foi removida com sucesso.').then(function(res) {
                                if (res) {
                                    $location.path('/manufacture/bom');
                                }
                            });
                        }, function() {
                            $scope.loading = false;
                            services.showAlert('Falhou', 'Tente novamente ou entre em contato com o Suporte Técnico.');
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
                    $scope.token = localStorage.getItem('token');
                    $scope.reportURL = localStorage.getItem('reportBaseUrl');
                    console.log(JSON.stringify($scope.token));
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
                    console.log(JSON.stringify(localStorage.getItem('reportBaseUrl') + '/report/manufacture/bom/' + $scope.bomId + '?report=' + $scope.totalReport.join('&report=') + '&token=' + $scope.token));
                    window.open($scope.reportURL + '/report/manufacture/bom/' + $scope.bomId + '?report=' + $scope.totalReport.join('&report=') + '&token=' + $scope.token, '_blank');
                } else {
                    services.showAlert('Falhou', 'Please select report type');
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
            $scope.updatePart = function(itemId, partId) {
                $location.path('bom/component/update/' + $scope.bomId + '/' + itemId + '/' + partId);
            };
            $scope.goBack = function() {
                $location.path('manufacture/bom');
            };
        });