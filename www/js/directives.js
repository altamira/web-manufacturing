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
                    document.getElementById("img").style.display = 'block';
                    document.getElementById("img").src = e.target.result;
                    document.getElementById("base").value = e.target.result;
                };
                FR.readAsDataURL(this.files[0]);
            }
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