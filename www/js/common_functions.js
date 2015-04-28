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
                    sessionStorage.setItem('colorBoxData', response.data);
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
            orderCreateDate: function() {
                return moment.utc().format('YYYY-MM-DD');
            },
            formatDate: function(dateString, format, newFormat) {
                return moment.utc(dateString, format).format(newFormat);
            },
            gridToday: function() {
                return moment.utc().format('D_M_YYYY');
            },
            toDay: function() {
                var pt = moment().locale('pt-br');
                return pt.format('dddd, LL');
            },
            toDayString: function() {
                return moment.utc().format('DD/MM/YYYY');
            },
            toDayTimeStamp: function() {
                return moment.utc().valueOf();
            },
            months: function() {
                moment.locale('pt-br');
                return moment.months();
            },
            currentYear: function() {
                return moment.utc().format('YYYY');
            },
            selectDate: function() {
                return moment.utc().format('DD/MM/YYYY');
            },
            validYears: function() {
                var year = moment.utc().format('YYYY');
                return [parseInt(year) - 1, parseInt(year), parseInt(year) + 1]
            },
            getCellColor: function(st, weight) {
                if (st < moment.utc().valueOf() || (parseInt(weight) / 1000 > 20))
                {
                    return 'red';
                } else
                {
                    return 'green';
                }
            },
            checkDay: function(timestamp) {
                return moment.utc(timestamp).format('D');
            },
            checkMonth: function(timestamp) {
                return moment.utc(timestamp).format('M');
            },
            checkYear: function(timestamp) {
                return moment.utc(timestamp).format('YYYY');
            },
            getWeekDay: function(date) {
                return moment.utc(date, "D_M_YYYY").format('dddd');
            },
            getWeekDayShort: function(date) {
                return moment.utc(date, "D_M_YYYY").locale('pt-br').format('ddd');
            },
            getDay: function(date) {
                return parseInt(moment.utc(date, "D_M_YYYY").format('D'));
            },
            getMonth: function(date) {
                return parseInt(moment.utc(date, "D_M_YYYY").format('M'));
            },
            getMonthName: function(date) {
                moment.locale('pt-br');
                var month = moment.utc(date, "D_M_YYYY").format('MMMM');
                moment.locale('en');
                return month;
            },
            getYear: function(date) {
                return moment.utc(date, "D_M_YYYY").format('YYYY');
            },
            startMonth: function(tempUnixTS) {
                return parseInt(moment.utc(tempUnixTS[tempUnixTS.length - 1]).format('M'));
            },
            startYear: function(tempUnixTS) {
                return parseInt(moment.utc(tempUnixTS[tempUnixTS.length - 1]).format('YYYY'));
            },
            endMonth: function(tempUnixTS) {
                return parseInt(moment.utc(tempUnixTS[0]).format('M'));
            },
            endYear: function(tempUnixTS) {
                return parseInt(moment.utc(tempUnixTS[0]).format('YYYY'));
            },
            daysInMonth: function(month, year) {
                return moment.utc(month + "-" + year, "M-YYYY").daysInMonth();
            },
            range: function(a, b, step) {
                var A = [];
                A[0] = a;
                step = step || 1;
                while (a + step <= b) {
                    A[A.length] = a += step;
                }
                return A;
            },
            setGridDate: function(date) {
                $(".mainRow").mCustomScrollbar("scrollTo", $('.' + date));
                setTimeout(function() {
                    var w = ($(window).width() / 2) - 100;
                    $(".mainRow").mCustomScrollbar("scrollTo", '+=' + w);
                }, 2000);
            },
        }

    }]);