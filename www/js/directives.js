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
                        scope.uploadSketch();
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
        document.getElementById("uploadedImg").appendChild(newImage);
        setTimeout(function() {
            if (document.getElementById("newImg").clientWidth > 1024)
            {
                document.getElementById("newImg").style.width = '100%';
            }
        }, 500);
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

            var image_x = document.getElementById('newImg');
            image_x.parentNode.removeChild(image_x);
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
altamiraApp.directive('calendar', function() {
    return {
        require: 'ngModel',
        link: function(scope, el, attr, ngModel) {
            $(el).datepicker({
                dateFormat: 'dd/mm/yy',
                beforeShowDay: function(date) {
                    var day = date.getDay();
                    return [day == 1 || day == 2 || day == 3 || day == 4 || day == 5, ''];
                },
                onSelect: function(dateText) {
                    scope.$apply(function() {
                        ngModel.$setViewValue(dateText);
                    });
                }
            });
        }
    };
})
altamiraApp.directive('fromDate', function() {
    return {
        require: 'ngModel',
        link: function(scope, el, attr, ngModel) {
            $(el).datepicker({
                dateFormat: 'dd/mm/yy',
                beforeShowDay: function(date) {
                    var day = date.getDay();
                    return [day == 1 || day == 2 || day == 3 || day == 4 || day == 5, ''];
                },
                onSelect: function(dateText) {
                    scope.$apply(function() {
                        ngModel.$setViewValue(dateText);
                        $("#toDate").datepicker("option", "minDate", dateText)
                    });
                }
            });
        }
    };
})
altamiraApp.directive('toDate', function() {
    return {
        require: 'ngModel',
        link: function(scope, el, attr, ngModel) {
            $(el).datepicker({
                dateFormat: 'dd/mm/yy',
                minDate: attr.datadate,
                inline: true,
                beforeShowDay: function(date) {
                    var day = date.getDay();
                    return [day == 1 || day == 2 || day == 3 || day == 4 || day == 5, ''];
                },
                onSelect: function(dateText) {
                    scope.$apply(function() {
                        ngModel.$setViewValue(dateText);
                    });
                }
            });
        }
    };
});
altamiraApp.directive('toNewDate', function() {
    return {
        link: function(scope, el, attr) {
            $(el).datepicker({
                dateFormat: 'dd/mm/yy',
                minDate: attr.datadate,
                inline: true,
                defaultDate: scope.bomData.delivery,
                beforeShowDay: function(date) {
                    var day = date.getDay();
                    return [day == 1 || day == 2 || day == 3 || day == 4 || day == 5, ''];
                },
                onSelect: function(dateText) {
                    scope.$apply(function() {
                        scope.bomData.delivery = dateText
                        scope.showdate = true;
                    });
                }
            });
        }
    };
});
altamiraApp.directive('joinDateChange', function() {
    return {
        link: function(scope, el, attr) {
            $(el).datepicker({
                dateFormat: 'dd/mm/yy',
                inline: true,
                defaultDate: scope.joinData.delivery,
                beforeShowDay: function(date) {
                    var day = date.getDay();
                    return [day == 1 || day == 2 || day == 3 || day == 4 || day == 5, ''];
                },
                onSelect: function(dateText) {
                    scope.$apply(function() {
                        scope.joinData.delivery = dateText
                        scope.showdate = true;
                    });
                }
            });
        }
    };
});
altamiraApp.directive('divideDateChange', function() {
    return {
        link: function(scope, el, attr) {
            $(el).datepicker({
                dateFormat: 'dd/mm/yy',
                inline: true,
                defaultDate: scope.divideData.delivery,
                beforeShowDay: function(date) {
                    var day = date.getDay();
                    return [day == 1 || day == 2 || day == 3 || day == 4 || day == 5, ''];
                },
                onSelect: function(dateText) {
                    scope.$apply(function() {
                        scope.divideData.delivery = dateText
                        scope.showdate = true;
                    });
                }
            });
        }
    };
});
altamiraApp.directive('componentDate', function() {
    return {
        link: function(scope, el, attr) {
            $(el).datepicker({
                dateFormat: 'dd/mm/yy',
                inline: true,
                defaultDate: scope.divideData.component.delivery,
                beforeShowDay: function(date) {
                    var day = date.getDay();
                    return [day == 1 || day == 2 || day == 3 || day == 4 || day == 5, ''];
                },
                onSelect: function(dateText) {
                    scope.$apply(function() {
                        scope.divideData.component.delivery = dateText
                        scope.showdate = true;
                    });
                }
            });
        }
    };
});
altamiraApp.directive('loadHtml', function() {
    return function(scope, el, attrs) {
        $(el).load('templates/menu.html');
    }
});
altamiraApp.directive('sortableFunc', ['$timeout', function(grid) {
        return function(scope, el, attrs) {
            var loadGrid = function() {
                $(".dragDiv").draggable({
                    revert: 'invalid'
                });
                $(".makeDroppable").droppable({
                    accept: function(item) {
                        return $(this).closest("tr").is(item.closest("tr")) && $(this).find("*").length == 0;
                    },
                    drop: function(event, ui) {
//                        scope.getData(ui.draggable.attr('id'), $(this).data('day'), $(this).attr('id'));
                        scope.getData($(this).data('day'), $(this).attr('id'));
                        var $this = $(this);
                        $this.append(ui.draggable.css({
                            top: 0,
                            left: '0px !important'
                        }));
                        ui.draggable.position({
                            my: "center",
                            at: "center",
                            of: $this,
                            using: function(pos) {
                                $(this).animate(pos, 500, "linear", function() {
                                    $(this).css('top', '0px');
                                    $(this).css('left', '0px');
                                });
                            }
                        });
                    }
                });
                $(".dataRow").mCustomScrollbar({
                    axis: "x",
                    theme: "inset-3",
                    scrollButtons: {enable: true},
                    scrollbarPosition: "outside"
                });
                $(".mainRow").mCustomScrollbar({
                    axis: "x",
                    theme: "inset-3",
                    scrollButtons: {enable: true},
                    scrollbarPosition: "outside",
                    callbacks: {
                        whileScrolling: function() {
//                            $(".dataRow").mCustomScrollbar("scrollTo",[this.mcs.topPct,0]);
                        }
                    },
                });
                $('.dataTable tr').hover(function() {
                    var hoverClass = $(this).attr('id');
                    $(this).css('background-color', '#95bcf2');
                    $('.' + hoverClass).css('background-color', '#95bcf2');
                });
                $('.dataTable tr').mouseleave(function() {
                    var hoverClass = $(this).attr('id');
                    $(this).css('background-color', '#ffffff');
                    $('.' + hoverClass).css('background-color', '#ffffff');
                });
                $('.mainTable tr').hover(function() {
                    var hoverClass = $(this).attr('class');
                    $(this).css('background-color', '#95bcf2 !important');
                    $('#' + hoverClass).css('background-color', '#95bcf2 !important');
                });
                $('.mainTable tr').mouseleave(function() {
                    var hoverClass = $(this).attr('class');
                    $(this).css('background-color', '#ffffff');
                    $('#' + hoverClass).css('background-color', '#ffffff');
                });
                $('.mainTable tr td').on('dblclick', function(e) {
//                    scope.materialListModalShow();
                    if (!$(this).is(':has(.dragDiv)') && $(this).attr('class') != 'holiday') {
                        var destTd = $(this);
                        var srcTd = $(this).parent().find('td:has(.dragDiv)');
                        var drgElement = srcTd.find('.dragDiv');
                        var id1 = $(this).data('day');
                        var id2 = $(this).attr('id');
                        drgElement.animate({left: "+=" + (destTd.position().left - srcTd.position().left)}, 500, "linear", function() {
                            drgElement.appendTo(destTd);
                            drgElement.css({left: 0});
                            scope.getData(id1, id2);
                        });
                    }
                });
                $('.red').on('dblclick', function(e) {
                    scope.changeDeliveryDate($(this).parent().attr('id'));
                });
            };
            setTimeout(function() {
                loadGrid();
            }, 100);
        }
    }]);
var tempMaterialId = '';
var tempItemId = '';
altamiraApp.directive('selectBom', function(services) {
    return function(scope, elm, attr) {
        elm.bind('click', function() {
            elm.toggleClass('fa-check-square-o');
            if (elm.hasClass('fa-check-square-o'))
            {
                if (tempMaterialId == '' && tempItemId == '')
                {
                    tempMaterialId = attr.datamaterial;
                    tempItemId = attr.dataitem;
                    scope.itemPartIdArr.push(parseInt(attr.datapart));
                    scope.itemId.push(parseInt(tempItemId));
                } else {
                    if (tempMaterialId == attr.datamaterial && (scope.itemPartIdArr.indexOf(parseInt(attr.datapart)) < 0) && tempItemId == attr.dataitem) {
                        scope.itemPartIdArr.push(parseInt(attr.datapart));
                    }
                    if (tempMaterialId != attr.datamaterial || tempItemId != attr.dataitem)
                    {
                        elm.toggleClass('fa-check-square-o');
                        services.showAlert('Error', 'Not a same material');
                    }
                }
            }
            else
            {
                scope.itemPartIdArr.splice(scope.itemPartIdArr.indexOf(parseInt(attr.datapart)), 1);
                if (scope.itemPartIdArr.length == 0) {
                    tempMaterialId = '';
                    tempItemId = '';
                    scope.itemId.splice(scope.itemId.indexOf(parseInt(attr.dataitem)), 1);
                }
            }
        });

    }
});
//var color = '';
//$('div').click(function() {
//    var x = $(this).css('backgroundColor');
//    hexc(x);
//    alert(color);
//})
//
//function hexc(colorval) {
//    var parts = colorval.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
//    delete(parts[0]);
//    for (var i = 1; i <= 3; ++i) {
//        parts[i] = parseInt(parts[i]).toString(16);
//        if (parts[i].length == 1)
//            parts[i] = '0' + parts[i];
//    }
//    color = '#' + parts.join('');
//}