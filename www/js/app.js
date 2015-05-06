var altamiraApp = angular.module('altamira', ['ionic', 'altamiraAppControllers', 'ngRoute', 'angularFileUpload', 'altamiraAppDirectives', 'ngStorage', 'checklist-model', 'restangular']);

altamiraApp.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
})

altamiraApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider
                /* manufacture/process  Start */
                .when('/manufacture/process', {
            templateUrl: 'templates/process/mf-process-list.html',
            controller: 'ManufacturingProcsSearchCtrl'
        })
                .when('/manufacture/create/process', {
            templateUrl: 'templates/process/mf-process-create.html',
            controller: 'ManufacturingProcessCreateCtrl'
        })
                .when('/manufacture/update/process/:processId', {
            templateUrl: 'templates/process/mf-process-update.html',
            controller: 'ManufacturingProcessUpdateCtrl'
        })
                .when('/manufacture/process/operation/:processId', {
            templateUrl: 'templates/process/mf-operation-create.html',
            controller: 'ManufacturingProcessCreateOperationCtrl'
        })
                .when('/manufacture/process/operation/update/:processId/:operationId', {
            templateUrl: 'templates/process/mf-operation-update.html',
            controller: 'ManufacturingProcessUpdateOperationCtrl'
        })
                .when('/manufacture/process/operation/consume/:processId/:operationId', {
            templateUrl: 'templates/process/mf-operation-consume.html',
            controller: 'ManufacturingProcessOperationConsumeCtrl'
        })
                .when('/manufacture/process/operation/consume/update/:processId/:operationId/:consumeId', {
            templateUrl: 'templates/process/mf-operation-consume.html',
            controller: 'ManufacturingProcessOperationConsumeCtrl'
        })
                .when('/manufacture/process/operation/produce/:processId/:operationId', {
            templateUrl: 'templates/process/mf-operation-produce.html',
            controller: 'ManufacturingProcessOperationProduceCtrl'
        })
                .when('/manufacture/process/operation/produce/update/:processId/:operationId/:produceId', {
            templateUrl: 'templates/process/mf-operation-produce.html',
            controller: 'ManufacturingProcessOperationProduceCtrl'
        })
                .when('/manufacture/process/operation/use/:processId/:operationId', {
            templateUrl: 'templates/process/mf-operation-use.html',
            controller: 'ManufacturingProcessOperationUseCtrl'
        })
                .when('/manufacture/process/operation/use/update/:processId/:operationId/:useId', {
            templateUrl: 'templates/process/mf-operation-use.html',
            controller: 'ManufacturingProcessOperationUseCtrl'
        })
                /* manufacture/process  End */
                /* BOM pages  Start */
                .when('/manufacture/bom', {
            templateUrl: 'templates/bom/list.html',
            controller: 'BomListCtrl'
        })
                .when('/bom/create', {
            templateUrl: 'templates/bom/create.html',
            controller: 'BomCreateCtrl'
        })
                .when('/bom/view/:bomId', {
            templateUrl: 'templates/bom/view.html',
            controller: 'BomViewCtrl'
        })
                .when('/bom/edit/:bomId', {
            templateUrl: 'templates/bom/edit.html',
            controller: 'BomEditCtrl'
        })
                .when('/bom/item/create/:bomId', {
            templateUrl: 'templates/bom/item-create.html',
            controller: 'BomItemCreateCtrl'
        })
                .when('/bom/item/update/:bomId/:itemId', {
            templateUrl: 'templates/bom/item-update.html',
            controller: 'BomItemUpdateCtrl'
        })
                .when('/bom/component/create/:bomId/:itemId', {
            templateUrl: 'templates/bom/part.html',
            controller: 'BomPartOperationCtrl'
        })
                .when('/bom/component/update/:bomId/:itemId/:partId', {
            templateUrl: 'templates/bom/part.html',
            controller: 'BomPartOperationCtrl'
        })
                /* BOM pages  End */
                /* Material pages  Start */
                .when('/material/list', {
            templateUrl: 'templates/material/list-material.html',
            controller: 'MaterialListCtrl'
        })
                .when('/material/update/:materialId', {
            templateUrl: 'templates/material/update-material.html',
            controller: 'MaterialUpdateCtrl'
        })
                .when('/material/component/create', {
            templateUrl: 'templates/material/components.html',
            controller: 'MaterialComponentCtrl'
        })
                .when('/material/component/:materialId/:componentId', {
            templateUrl: 'templates/material/components.html',
            controller: 'MaterialComponentCtrl'
        })
                .when('/shipping/planning', {
            templateUrl: 'templates/shipping/planning/list.html',
            controller: 'ShippingPlanningCtrl'
        })
                .when('/shipping/planning/:planningId', {
            templateUrl: 'templates/shipping/planning/edit.html',
            controller: 'ShippingPlanningEditCtrl'
        })
                .when('/shipping/execution', {
            templateUrl: 'templates/shipping/execution/list.html',
            controller: 'ShippingExecutionCtrl'
        })
                .when('/shipping/execution/:executionId/packinglist/:packingId', {
            templateUrl: 'templates/shipping/execution/packingList.html',
            controller: 'ShippingExecutionPackingCtrl'
        })
                .when('/shipping/execution/packinglist/create', {
            templateUrl: 'templates/shipping/execution/packingListCreate.html',
            controller: 'ShippingExecutionPackingCreateCtrl'
        })
                .when('/manufacture/execution', {
            templateUrl: 'templates/manufacture/execution/execution_type.html',
            controller: 'ManufactureExecutionCtrl'
        })
                .when('/manufacture/execution/list', {
            templateUrl: 'templates/manufacture/execution/list.html',
            controller: 'ManufactureExecutionListCtrl'
        })
                .when('/manufacture/execution/:executionId', {
            templateUrl: 'templates/manufacture/execution/packingList.html',
            controller: 'ManufactureExecutionPackingCtrl'
        })
                .when('/manufacture/planning', {
            templateUrl: 'templates/manufacture/planning/list.html',
            controller: 'ManufacturePlanningCtrl'
        })
                .when('/manufacture/planning/create', {
            templateUrl: 'templates/manufacture/planning/create.html',
            controller: 'ManufacturePlanningCreateCtrl'
        })
                .when('/manufacture/planning/edit/:planningId', {
            templateUrl: 'templates/manufacture/planning/edit.html',
            controller: 'ManufacturePlanningEditCtrl'
        })
                .when('/manufacture/main', {
            templateUrl: 'templates/manufacture/main.html',
            controller: 'ManufacturingMainCtrl'
        })
                .when('/manufacture/operation', {
            templateUrl: 'templates/operation/list.html',
            controller: 'ManufacturingOperationCtrl'
        })
                .when('/manufacture/operation/create', {
            templateUrl: 'templates/operation/create.html',
            controller: 'ManufacturingOperationCreateCtrl'
        })
                .when('/manufacture/operation/edit/:operationId', {
            templateUrl: 'templates/operation/edit.html',
            controller: 'ManufacturingOperationEditCtrl'
        })


                .otherwise({
            redirectTo: '/manufacture/process'
        });
    }]);

altamiraApp.config(function(RestangularProvider) {
    RestangularProvider.setBaseUrl('http://data.altamira.com.br/data-rest-0.9.0-SNAPSHOT');
    localStorage.setItem('reportBaseUrl', 'manufacture-report-0.9.0.Final');
    localStorage.setItem('MainRestangular', 'http://localhost/main/www/#/blacktheme/home');
    RestangularProvider.setFullResponse(true);
    RestangularProvider.setDefaultHeaders({'Content-Type': 'application/json; charset=iso-8859-1'});
    RestangularProvider.setRestangularFields({
        id: "id"
    });
    if (localStorage.getItem('token') != null && localStorage.getItem('token') != '')
    {
        RestangularProvider.setDefaultRequestParams({token: localStorage.getItem('token')})
    } else {
        function getQueryStringValue(key) {
            return unescape(window.location.hash.replace(new RegExp("^(?:.*[&\\?]" + escape(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
        }

        // Would write the value of the QueryString-variable called name to the console
        RestangularProvider.setDefaultRequestParams({token: getQueryStringValue("token")});
    }
    RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
        var extractedData;
        extractedData = data;
        return extractedData;
    });
    RestangularProvider.setErrorInterceptor(function(response, deferred, responseHandler) {
        if (response.status === 401)
        {
            localStorage.clear();
            if (response.data.message.indexOf("Invalid Token") >= 0)
            {
                var r = confirm("Invalid token!");
                if (r == true) {
                    window.location = 'http://localhost/main/www/#/blacktheme/login';
                } else {
                    location.reload();
                }
            } else
            {
                localStorage.clear();
                var r = confirm("Access denied!");
                if (r == true) {
                    window.location = 'http://localhost/main/www/#/blacktheme/login';
                } else {
                    location.reload();
                }
            }

        }
        if (response.status === 400)
        {
            var r = confirm("Você não ter permissão para acessar este recurso!");
            if (r == true) {
                window.location = 'http://localhost/main/www/#/blacktheme/login';
            } else {
                location.reload();
            }
        }
    });
});

altamiraApp.factory('IntegrationRestangular', function(Restangular) {
    return Restangular.withConfig(function(RestangularProvider) {
        RestangularProvider.setBaseUrl('http://ec2-54-207-103-15.sa-east-1.compute.amazonaws.com');
        RestangularProvider.setDefaultHeaders({'Content-Type': 'application/json; charset=iso-8859-1'});
        RestangularProvider.setFullResponse(true);
    });
});
altamiraApp.factory('resourceInterceptor', function() {
    return {
        response: function(response) {
            console.log('response intercepted: ', response);
        }
    }
});
var altamiraAppControllers = angular.module('altamiraAppControllers', []);
