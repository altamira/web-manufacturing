var altamiraApp = angular.module('altamira', ['ionic', 'altamiraAppControllers', 'ngRoute', 'angularFileUpload', 'altamiraAppDirectives', 'ngStorage', 'checklist-model', 'restangular', 'angularUtils.directives.dirPagination'])

        .run(function($ionicPlatform) {
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
                .when('/manufacturing/process/:start', {
            templateUrl: 'templates/mf-process-list.html',
            controller: 'ManufacturingProcsSearchCtrl'
        })
                .when('/manufacturing/create/process', {
            templateUrl: 'templates/mf-process-create.html',
            controller: 'ManufacturingProcessCreateCtrl'
        })
                .when('/manufacturing/update/process/:processId', {
            templateUrl: 'templates/mf-process-update.html',
            controller: 'ManufacturingProcessUpdateCtrl'
        })
                .when('/manufacturing/process/operation/:processId', {
            templateUrl: 'templates/mf-operation-create.html',
            controller: 'ManufacturingProcessCreateOperationCtrl'
        })
                .when('/manufacturing/process/operation/update/:processId/:operationId', {
            templateUrl: 'templates/mf-operation-update.html',
            controller: 'ManufacturingProcessUpdateOperationCtrl'
        })
                .when('/manufacturing/process/operation/consume/:processId/:operationId', {
            templateUrl: 'templates/mf-operation-consume.html',
            controller: 'ManufacturingProcessOperationConsumeCtrl'
        })
                .when('/manufacturing/process/operation/consume/update/:processId/:operationId/:consumeId', {
            templateUrl: 'templates/mf-operation-consume.html',
            controller: 'ManufacturingProcessOperationConsumeCtrl'
        })
                .when('/manufacturing/process/operation/produce/:processId/:operationId', {
            templateUrl: 'templates/mf-operation-produce.html',
            controller: 'ManufacturingProcessOperationProduceCtrl'
        })
                .when('/manufacturing/process/operation/produce/update/:processId/:operationId/:produceId', {
            templateUrl: 'templates/mf-operation-produce.html',
            controller: 'ManufacturingProcessOperationProduceCtrl'
        })
                .when('/manufacturing/process/operation/use/:processId/:operationId', {
            templateUrl: 'templates/mf-operation-use.html',
            controller: 'ManufacturingProcessOperationUsoCtrl'
        })
                .when('/manufacturing/process/operation/use/update/:processId/:operationId/:useId', {
            templateUrl: 'templates/mf-operation-use.html',
            controller: 'ManufacturingProcessOperationUsoCtrl'
        })
                /* manufacturing/process  End */
                /* BOM pages  Start */
                .when('/bom/list', {
            templateUrl: 'templates/bom/list.html',
            controller: 'BomListCtrl'
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
                .when('/bom/part/create/:bomId/:itemId', {
            templateUrl: 'templates/bom/part-create.html',
            controller: 'BomPartCreateCtrl'
        })
                .when('/bom/part/update/:bomId/:itemId/:partId', {
            templateUrl: 'templates/bom/part-update.html',
            controller: 'BomPartUpdateCtrl'
        })
                /* BOM pages  End */
                /* Material pages  Start */
                .when('/material/list', {
            templateUrl: 'templates/material/list-material.html',
            controller: 'MaterialListCtrl'
        })
                .when('/material/create', {
            templateUrl: 'templates/material/create-material.html',
            controller: 'MaterialCreateCtrl'
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
                /* Material pages  End */
                .otherwise({
            redirectTo: '/manufacturing/process/0'
        });
    }]);