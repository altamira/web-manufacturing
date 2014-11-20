'use strict';
var altamiraApp = angular.module('altamiraAppDirectives', []);

/* Directives */
altamiraApp.directive('imageConvert', function() {
    return function(scope, elm, attrs) {

        elm.bind('change', function() {
            if (this.files && this.files[0]) {
                var FR = new FileReader();
                var filetype = this.files[0].type.split('/');
                var imagename = this.files[0].name;
                FR.onload = function(e) {

                    document.getElementById("img").src = '';
                    if (document.getElementById("img").src = e.target.result)
                    {
                        document.getElementById("img").style.width = 'auto';
                        setTimeout(function() {
                            if (document.getElementById("img").clientWidth > 1024)
                            {
                                document.getElementById("img").style.width = '100%';
                            }
                        }, 500);

                    }
                    document.getElementById("uploadedImg").style.display = 'block';
                    document.getElementById("img").style.display = 'inline-block';
                    document.getElementById("removeBtn").style.display = 'block';
                    document.getElementById("removeBtn1").style.display = 'block';
                    document.getElementById("uploadBtn").style.display = 'none';
                    document.getElementById("removeBtn").style.display = 'block';
                    var base64string = e.target.result.split(',');

                    scope.$apply(function() {
                        scope.operationData.format = base64string[0];
                        scope.operationData.sketch = base64string[1];
                        scope.operationData.filename = imagename;
                        scope.operationData.filetype = filetype[1];

                    });
                };
                FR.readAsDataURL(this.files[0]);
            }
        });

    }
});
altamiraApp.directive('base64ToImage', function() {
    return function(scope, elm, attrs) {

        document.getElementById("uploadedImg").style.display = 'block';
        document.getElementById("img").style.display = 'none';
        document.getElementById("removeBtn").style.display = 'block';
        document.getElementById("removeBtn1").style.display = 'block';
        document.getElementById("uploadBtn").style.display = 'none';
        document.getElementById("removeBtn").style.display = 'block';
        var newImage = new Image();
        newImage.id = 'newImg';
        newImage.src = scope.operationData.format + ',' + scope.operationData.sketch;
//        newImage.src = scope.operationData.sketch;
        document.getElementById("uploadedImg").appendChild(newImage);
    }
});
altamiraApp.directive('cancelUpdateUpload', function() {
    return function(scope, elm, attrs) {

        elm.bind('click', function() {
            document.getElementById("uploadedImg").style.display = 'none';
            document.getElementById("removeBtn").style.display = 'none';
            document.getElementById("removeBtn1").style.display = 'none';
            document.getElementById("newImg").style.display = 'none';
            document.getElementById("uploadBtn").style.display = 'block';
            document.getElementById("base").value = '';
            document.getElementById("format").value = '';
            document.getElementById("filename").value = '';
            document.getElementById("filetype").value = '';
            document.getElementById("img").removeAttribute('src');
            document.getElementById("img").style.width = 'auto';
            scope.$apply(function() {
                scope.operationData.sketch = '';
                scope.operationData.format = '';
                scope.operationData.filename = '';
                scope.operationData.filetype = '';
            });
        });
    }
});
altamiraApp.directive('cancelUpload', function() {
    return function(scope, elm, attrs) {

        elm.bind('click', function() {
            document.getElementById("uploadedImg").style.display = 'none';
            document.getElementById("removeBtn").style.display = 'none';
            document.getElementById("removeBtn1").style.display = 'none';
            document.getElementById("uploadBtn").style.display = 'block';
            document.getElementById("base").value = '';
            document.getElementById("img").removeAttribute('src');
            document.getElementById("img").style.width = 'auto';
        });
    }
});
altamiraApp.directive('sortList', function() {
    return function(scope, elm, attrs) {
        var elems = $('.processList').children('li').remove();
        elems.sort(function(a, b) {
            return parseInt(a.id) > parseInt(b.id);
        });
        $('.processList').append(elems);
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
altamiraApp.directive('toggleClass', function() {
    return function(scope, elm, attrs) {
        elm.bind('click', function() {
            elm.toggleClass('fa-check-square-o');
        });
    }
});
altamiraApp.directive('toggleViewClass', function() {
    return function(scope, elm, attrs) {

        elm.bind('click', function() {
            alert(1);
            elm.toggleClass('fa-check-viewpage');
        });
    }
});
altamiraApp.directive('makeActive', function() {
    return function(scope, elm, attrs) {
        elm.bind('click', function() {
            elm.toggleClass('make-active');
        });
    }
});
altamiraApp.directive('showUnchecked', function() {
    return function(scope, elm, attrs) {
        elm.bind('click', function() {
        });
    }
});

altamiraApp.directive('isNumber', function($parse) {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ngModel) {
            scope.$watch(attrs.ngModel, function(newValue, oldValue) {
                var arr = String(newValue).split("");
                if (arr.length === 0)
                    return;
                if (arr.length === 1 && (arr[0] == '-' || arr[0] === '.'))
                    return;
                if (arr.length === 2 && newValue === '-.')
                    return;
                if (isNaN(newValue)) {
                    $parse(attrs.ngModel).assign(scope, oldValue);
                }
            });
        }
    };
});

altamiraApp.directive('numberMask', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            $(element).numeric();
        }
    }
});