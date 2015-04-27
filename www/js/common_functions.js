altamiraApp.factory('CommonFun', ['$http', 'Restangular', function($http, Restangular) {

        return {
            // call to get rates
            getOrderDetails: function() {
                return 'from factory';
            },
            getDefaultWidthType: 213,
            getDefaultHeightType: 213,
            getDefaultLengthType: 213,
            getDefaultDepthType: 213,
            getDefaultAreaType: 213,
            getDefaultThicknessType: 213,
            getDefaultWeightType: 215,
            getDefaultQuantityType: 217,
            getDefaultColor: 1016,
            getColorBox: function() {
                Restangular.one('common/color').get({max: 0}).then(function(response) {
                    sessionStorage.setItem('colorBoxData',response.data);
                });
//                return $http.get(Restangular.configuration.baseUrl + '/common/color');
            },
            getFullTimestamp: function(date) {
                return moment.utc(date, 'DD/MM/YYYY').valueOf();
            },
            getFullDate: function(timestamp) {
                return moment.utc(timestamp).format('DD/MM/YYYY');
            },
            setDefaultDateFormat: function(dateString, format) {
                return moment.utc(dateString, format).format('DD/MM/YYYY');
            },
        }

    }]);