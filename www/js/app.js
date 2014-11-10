var altamiraApp = angular.module('altamira', ['ionic', 'altamiraAppControllers', 'ngRoute', 'angularFileUpload', 'altamiraAppDirectives', 'ngStorage','checklist-model'])

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
            controller: 'ManufacturingProcessOperationCtrl'
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
                .when('/manufacturing/process/operation/uso/:processId/:operationId', {
            templateUrl: 'templates/mf-operation-uso.html',
            controller: 'ManufacturingProcessOperationUsoCtrl'
        })
                .when('/manufacturing/process/operation/uso/update/:processId/:operationId/:usoId', {
            templateUrl: 'templates/mf-operation-uso.html',
            controller: 'ManufacturingProcessOperationUsoCtrl'
        })
        /* manufacturing/process  End */
                .when('/bom/list', {
            templateUrl: 'templates/bom/list.html',
            controller: 'BomListCtrl'
        })
                .when('/bom/edit', {
            templateUrl: 'templates/bom/edit.html',
            controller: 'BomEditCtrl'
        })
                .when('/bom/item/create', {
            templateUrl: 'templates/bom/item-create.html',
            controller: 'BomItemCreateCtrl'
        })
                .when('/bom/part/create', {
            templateUrl: 'templates/bom/part-create.html',
            controller: 'BomPartCreateCtrl'
        })
                .otherwise({
            redirectTo: '/manufacturing/process/0'
        });
    }]);