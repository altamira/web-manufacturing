'use strict';
var altamiraApp = angular.module('altamiraAppDirectives', []);

/* Directives */
altamiraApp.directive('imageConvert', function() {
    return function(scope, elm, attrs) {

        elm.bind('change', function() {


            if (this.files && this.files[0]) {
                var FR = new FileReader();
                console.log(FR);
                FR.onload = function(e) {
                    document.getElementById("img").src = e.target.result;
                    document.getElementById("uploadedImg").style.display = 'block';
                    document.getElementById("img").style.display = 'inline-block';
                    document.getElementById("removeBtn").style.display = 'block';
                    document.getElementById("removeBtn1").style.display = 'block';
                    document.getElementById("uploadBtn").style.display = 'none';
                    document.getElementById("removeBtn").style.display = 'block';
                    var base64string = e.target.result.split(',');
                    document.getElementById("base").value = base64string[1];
                    scope.$apply(function() {
                        scope.operationData.sketch = base64string[1];
                    });
                };
                FR.readAsDataURL(this.files[0]);
            }
        });

    }
});
altamiraApp.directive('cancelUpload', function() {
    return function(scope, elm, attrs) {

        elm.bind('click', function() {
            document.getElementById("uploadedImg").style.display = 'none';
            document.getElementById("removeBtn").style.display = 'none';
            document.getElementById("removeBtn1").style.display = 'none';
//            document.getElementById("img").src = e.target.result;
            document.getElementById("uploadBtn").style.display = 'block';
//            document.getElementById("removeBtn").style.display = 'block';
        });
    }
});

altamiraApp.directive('confirmationNeeded', function() {
    return {
        priority: 1,
        terminal: true,
        link: function(scope, element, attr) {
            var msg = attr.confirmationNeeded || "Are you sure?";
            var clickAction = attr.ngClick;
            element.bind('click', function() {
                if (window.confirm(msg)) {
                    scope.$eval(clickAction)
                }
            });
        }
    };
});