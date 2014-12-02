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