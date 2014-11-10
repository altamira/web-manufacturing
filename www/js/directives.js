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
altamiraApp.directive('base64ToImage', function() {
    return function(scope, elm, attrs) {

        document.getElementById("uploadedImg").style.display = 'block';
//        document.getElementById("img").style.display = 'inline-block';
        document.getElementById("removeBtn").style.display = 'block';
        document.getElementById("removeBtn1").style.display = 'block';
        document.getElementById("uploadBtn").style.display = 'none';
        document.getElementById("removeBtn").style.display = 'block';
        var newImage = new Image();
        newImage.id = 'newImg';
        newImage.src = 'data:image/jpg;base64,' + scope.operationData.sketch;
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
altamiraApp.directive('toggleCheckClass', function() {
    return function(scope, elm, attrs) {
        elm.bind('click', function() {
            //alert(this.next().hasClass('fa-square-o'))
            if(elm.next().hasClass('fa-square-o'))
            {
                alert($(this).next().attr('class'));
               $(this).next().addClass('fa-check-square-o');
//                elm.next().removeClass('fa-square-o');
//                elm.next().addClass('fa-check-square-o');
            }
            if(elm.next().hasClass('fa-check-square-o'))
            {
                elm.next().attr('class','fa-square-o');
//                elm.next().removeClass('fa-check-square-o');
//                elm.next().addClass('fa-square-o');
            }
        });
    }
});