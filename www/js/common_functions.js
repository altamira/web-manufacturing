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
//                sessionStorage.setItem('colorBoxData','http://data.altamira.com.br/manufacturing-report-0.4.0-SNAPSHOT');
                console.log(JSON.stringify($http.get(Restangular.configuration.baseUrl + '/common/color')));
                ;
//                return $http.get(Restangular.configuration.baseUrl + '/common/color');
            },
            getFullTimestamp: function(date) {
                return moment(date, 'DD/MM/YYYY').valueOf();
            },
            getFullDate: function(timestamp) {
                return moment(timestamp).format('DD/MM/YYYY');
            },
            setDefaultDateFormat: function(dateString,format) {
                return moment(dateString,format).format('DD/MM/YYYY');
            },
        }

    }]);