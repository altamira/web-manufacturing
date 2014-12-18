altamiraApp.service('services', function($ionicPopup, $window, $state, $stateParams, Restangular, $location) {
    return {
        //to show alert box
        showConfirmBox: function(title, content) {
            var confirmPopup = $ionicPopup.confirm({
                title: title,
                template: content
            });
            return confirmPopup;
        },
        //to show alert box
        showAlert: function(title, content) {
            var alertPopup = $ionicPopup.alert({
                title: title,
                content: content
            });
            return alertPopup;
        },
        goToProcessUpdateForm: function(id) {
            $location.path('manufacturing/update/process/' + id);
        },
        goToOperationUpdateForm: function(processId, operationId) {
            $location.path('/manufacturing/process/operation/update/' + processId + '/' + operationId);
        },
    };
});

//altamiraApp.service('Unit', function(Restangular, services) {
//    this.color = function() {
//        Restangular.one('common/color').get({max: 0}).then(function(response) {
//            return response.data;
//        }, function(response) {
//            services.showAlert('Falhou', 'Please try again');
//        });
//    }
//
//    this.method2 = function() {
//        return 'nisarg2';
//    }
//});

altamiraApp.factory('Unit', function(Restangular, services) {

    var factory = {};

    factory.color = function() {
        Restangular.one('common/color').get({max: 0}).then(function(response) {
            return response.data;
        }, function(response) {
            services.showAlert('Falhou', 'Please try again');
        });
    }

    return factory;
});