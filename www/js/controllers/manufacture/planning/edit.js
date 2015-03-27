altamiraAppControllers.controller('ManufacturePlanningEditCtrl',
        function($scope, $location, $route, Restangular, services, $ionicModal, CommonFun, $ionicSideMenuDelegate, $routeParams) {
            $scope.planningId = $routeParams.planningId;
            $ionicModal.fromTemplateUrl('templates/manufacture/planning/popup/report_type.html', {
                scope: $scope,
                animation: 'fade-in'
            }).then(function(modal) {
                $scope.reportType = modal;
                $scope.totalReport = [];
            });
            $scope.reportTypeModalShow = function() {
                $scope.reportType.show();
            };
            $scope.reportTypeModalClose = function() {
                $scope.reportType.hide();
            };
            $scope.reportBOM = function() {
                $scope.loading = true;
                Restangular.one('manufacture').one('planning', $scope.planningId).one('operation').get().then(function(response) {
//                Restangular.one('manufacture').one('planning').one('operation').get().then(function(response) {
                    $scope.reportData = response.data;
                    for (var i = 0; i < $scope.reportData.length; i++)
                    {
                        $scope.pushReportName($scope.reportData[i].id);
                    }
                    $scope.reportTypeModalShow();
                    $scope.loading = false;
                }, function(response) {
                    $scope.loading = false;
                    services.showAlert('Falhou', 'Tente Novamente UO Entre em Contato com o Suporte Técnico.');
                });
            };
            $scope.genrateReport = function() {
                if ($scope.totalReport.length > 0) {
                    $scope.reportTypeModalClose();
                    window.open(sessionStorage.getItem('reportBaseUrl') + '/report/manufacturing/planning/' + $scope.planningId + '?op=' + $scope.totalReport.join('&op='), '_blank');
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
                $location.path('manufacture/planning');
            }
        });