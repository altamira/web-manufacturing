var altamiraApp = angular.module('altamira', ['ionic', 'altamiraAppControllers', 'ngRoute', 'angularFileUpload', 'altamiraAppDirectives', 'ngStorage', 'checklist-model', 'restangular', 'angularUtils.directives.dirPagination']);

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
                /* manufacturing/process  Start */
                .when('/manufacturing/process', {
            templateUrl: 'templates/process/mf-process-list.html',
            controller: 'ManufacturingProcsSearchCtrl'
        })
                .when('/manufacturing/create/process', {
            templateUrl: 'templates/process/mf-process-create.html',
            controller: 'ManufacturingProcessCreateCtrl'
        })
                .when('/manufacturing/update/process/:processId', {
            templateUrl: 'templates/process/mf-process-update.html',
            controller: 'ManufacturingProcessUpdateCtrl'
        })
                .when('/manufacturing/process/operation/:processId', {
            templateUrl: 'templates/process/mf-operation-create.html',
            controller: 'ManufacturingProcessCreateOperationCtrl'
        })
                .when('/manufacturing/process/operation/update/:processId/:operationId', {
            templateUrl: 'templates/process/mf-operation-update.html',
            controller: 'ManufacturingProcessUpdateOperationCtrl'
        })
                .when('/manufacturing/process/operation/consume/:processId/:operationId', {
            templateUrl: 'templates/process/mf-operation-consume.html',
            controller: 'ManufacturingProcessOperationConsumeCtrl'
        })
                .when('/manufacturing/process/operation/consume/update/:processId/:operationId/:consumeId', {
            templateUrl: 'templates/process/mf-operation-consume.html',
            controller: 'ManufacturingProcessOperationConsumeCtrl'
        })
                .when('/manufacturing/process/operation/produce/:processId/:operationId', {
            templateUrl: 'templates/process/mf-operation-produce.html',
            controller: 'ManufacturingProcessOperationProduceCtrl'
        })
                .when('/manufacturing/process/operation/produce/update/:processId/:operationId/:produceId', {
            templateUrl: 'templates/process/mf-operation-produce.html',
            controller: 'ManufacturingProcessOperationProduceCtrl'
        })
                .when('/manufacturing/process/operation/use/:processId/:operationId', {
            templateUrl: 'templates/process/mf-operation-use.html',
            controller: 'ManufacturingProcessOperationUseCtrl'
        })
                .when('/manufacturing/process/operation/use/update/:processId/:operationId/:useId', {
            templateUrl: 'templates/process/mf-operation-use.html',
            controller: 'ManufacturingProcessOperationUseCtrl'
        })
                /* manufacturing/process  End */
                /* BOM pages  Start */
                .when('/manufacturing/bom', {
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
            controller: 'ShippingPlanningListCtrl'
        })
                /* Material pages  End */

                .otherwise({
            redirectTo: '/manufacturing/process'
        });
    }]);

altamiraApp.config(function(RestangularProvider) {
    RestangularProvider.setBaseUrl('http://data.altamira.com.br/data-rest-0.7.5-SNAPSHOT');
    sessionStorage.setItem('reportBaseUrl','http://data.altamira.com.br/manufacturing-report-0.4.0-SNAPSHOT');
    RestangularProvider.setFullResponse(true);
    RestangularProvider.setDefaultHeaders({'Content-Type': 'application/json; charset=iso-8859-1'});
    RestangularProvider.setRestangularFields({
        id: "id"
    });
    if (sessionStorage.getItem('token') != null && sessionStorage.getItem('token') != '')
    {
        RestangularProvider.setDefaultRequestParams({token: sessionStorage.getItem('token')})
    }
    RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
        if (response.status === 401)
        {
            window.location = 'http://localhost/altamira_main/www/#/blacktheme/login';
        } else
        {
            var extractedData;
            extractedData = data;
            return extractedData;
        }
    });
});

altamiraApp.factory('IntegrationRestangular', function(Restangular) {
    return Restangular.withConfig(function(RestangularProvider) {
        RestangularProvider.setBaseUrl('http://ec2-54-207-103-15.sa-east-1.compute.amazonaws.com');
    RestangularProvider.setDefaultHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    });
});

var altamiraAppControllers = angular.module('altamiraAppControllers', []);
