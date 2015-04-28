altamiraAppControllers.filter('setDecimal',
        function($filter) {
            return function(value, precision) {
                var precision = precision || 0,
                        power = Math.pow(10, precision),
                        absValue = Math.abs(Math.round(value * power)),
                        result = (value < 0 ? '-' : '') + String(Math.floor(absValue / power));

                if (precision > 0) {
                    var fraction = String(absValue % power),
                            padding = new Array(Math.max(precision - fraction.length, 0) + 1).join('0');
                    result += '.' + padding + fraction;
                }
                return result;
            };
        });
altamiraAppControllers.filter('getDate',
        function() {
            return function(input) {
                return moment.utc(input).format('DD/MM/YYYY');
            };
        });
altamiraAppControllers.filter('getFullTimeStamp',
        function() {
            return function(date) {
                return moment.utc(date, 'YYYY-MM-DD').valueOf();
            };
        });