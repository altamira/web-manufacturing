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
altamiraApp.directive('reportToggle', function() {
    return function(scope, elm, attrs) {
        elm.bind('click', function() {
            if (elm.hasClass('fa-check-square-o') == false)
            {
                scope.pushReportName(attrs.reportname);
            } else
            {
                scope.popReportName(attrs.reportname);
            }
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
            console.log(JSON.stringify(attr.defaultdate));
            $(el).datepicker({
                dateFormat: 'dd/mm/yy',
                inline: true,
                defaultDate: attr.defaultdate,
                beforeShowDay: function(date) {
                    var day = date.getDay();
                    return [day == 1 || day == 2 || day == 3 || day == 4 || day == 5, ''];
                },
                onSelect: function(dateText) {
                    scope.$apply(function() {
                        scope.partData.delivery = dateText
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
altamiraApp.directive('divideDateChange1', function() {
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
                        scope.divideData.delivery1 = dateText
                        scope.showdate_1 = true;
                    });
                }
            });
        }
    };
});
altamiraApp.directive('divideDateChange2', function() {
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
                        scope.divideData.delivery2 = dateText
                        scope.showdate_2 = true;
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
altamiraApp.directive('getQuantity', function() {
    return function(scope, el, attrs) {
        console.log(JSON.stringify(parseInt(scope.divideData.chnDateTotalQuantity) - parseInt(scope.divideData.quantity1)));
    }
});
altamiraApp.directive('loadHtml', function() {
    return function(scope, el, attrs) {
        $(el).load('templates/menu.html');
    }
});
altamiraApp.directive('datarowLoad', function() {
    return function(scope, el, attrs) {
//        $(".dataRow").mCustomScrollbar({
//            axis: "x",
//            theme: "inset-3",
//            scrollButtons: {enable: true},
//            scrollbarPosition: "outside"
//        });
    }
});
altamiraApp.directive('sortableFunc', ['$timeout', function(grid) {
        return function(scope, el, attrs) {
            var loadGrid = function() {

                $(document).ready(function() {

                    $('.dragDiv').on('dblclick', function(e) {
                        scope.changeDeliveryDate($(this).parent().attr('id'));
                    });


                    var allCells = $(".mainTable td");

                    allCells.on("mouseover", function() {
                        var el = $(this),
                                pos = el.index();
                        el.parent().find("th, td").addClass("hover");
                        allCells.filter(":nth-child(" + (pos + 1) + ")").addClass("hover");
                    })
                            .on("mouseout", function() {
                        allCells.removeClass("hover");
                    });

                });
            };
            setTimeout(function() {
                loadGrid();
            }, 100);
        }
    }]);
var tempMaterialId = '';
var tempItemId = '';
altamiraApp.directive('selectDelivery', function(services) {
    return function(scope, elm, attr) {
        elm.bind('click', function() {
            elm.toggleClass('fa-check-square-o');
            if (elm.hasClass('fa-check-square-o'))
            {
                if (scope.itemId.length == 0)
                {
                    tempItemId = parseInt(attr.dataitem);
                    tempMaterialId = parseInt(attr.datamaterial);
                    scope.itemId.push(parseInt(attr.dataitem));
                    scope.itemPartIdArr.push(parseInt(attr.datapart));
                    scope.itemPartDeliveryArr.push(parseInt(attr.datadelivery));
                }
                else if (scope.itemId.length > 0 && tempItemId == parseInt(attr.dataitem)) {

                    if (tempMaterialId == parseInt(attr.datamaterial))
                    {
                        scope.itemId.push(parseInt(attr.dataitem));
                        scope.itemPartIdArr.push(parseInt(attr.datapart));
                        scope.itemPartDeliveryArr.push(parseInt(attr.datadelivery));
                    } else {
                        elm.toggleClass('fa-check-square-o');
                        services.showAlert('Error', 'Not a same Material');
                    }

                } else {
                    elm.toggleClass('fa-check-square-o');
                    services.showAlert('Error', 'Not a same Item');
                }
            }
            else
            {
                scope.itemId.splice(scope.itemId.indexOf(parseInt(attr.dataitem)), 1);
                scope.itemPartIdArr.splice(scope.itemPartIdArr.indexOf(parseInt(attr.datapart)), 1);
                scope.itemPartDeliveryArr.splice(scope.itemPartDeliveryArr.indexOf(parseInt(attr.datadelivery)), 1);
            }
            console.log(JSON.stringify(scope.itemId));
            console.log(JSON.stringify(scope.itemPartIdArr));
            console.log(JSON.stringify(scope.itemPartDeliveryArr));
        });

    }
});
altamiraApp.directive('changeRemainingQuantity', function(services) {
    return function(scope, elm, attr) {
        elm.bind('click', function() {
            elm.toggleClass('fa-check-square-o');
            if (elm.hasClass('fa-check-square-o'))
            {
                scope.remainingQtnArr.push(parseInt(attr.datadelivery));
            }
            else
            {
                scope.remainingQtnArr.splice(scope.remainingQtnArr.indexOf(parseInt(attr.datadelivery)), 1);
            }
//            console.log(JSON.stringify($("[datadelivery='"+attr.datadelivery+"']").attr('dataitem')));
//            console.log(JSON.stringify(scope.remainingQtnArr));
//            scope.changeRemainingQun($('#remaining_' + attr.datadelivery).val(), attr.dataitem, attr.datapart, attr.datadelivery);
        });

    }
});

function totalWeightCal() {
    $('.totalWeightRow td').each(function(e) {
        var $th = $(this);
        $th.removeClass('totalWeightShow');
        $th.removeClass('green');
        var tempTotalWeight = 0;
        $('.' + $th.data('date')).each(function(f) {
            if ($(this).children().data('weight') != undefined && $(this).children().data('weight') != '')
            {
                tempTotalWeight += Math.ceil(parseFloat($(this).children().data('weight')));
            }
        });
        if (tempTotalWeight != 0)
        {
            $th.addClass('totalWeightShow');
            $th.addClass('green');
            $th.html(Math.ceil(tempTotalWeight));
        } else
        {
            $th.removeClass('totalWeightShow');
            $th.html('');
        }
//        if (tempTotalWeight != 0 && (tempTotalWeight / 1000 < 40))
//        {
//            $th.addClass('totalWeightShow');
//            $th.addClass('green');
//            if (tempTotalWeight >= 1000)
//            {
//                var ton = Math.floor(tempTotalWeight / 1000);
//                $th.html(ton + ' T');
//            } else
//            {
//                $th.html(Math.ceil(tempTotalWeight));
//            }
//        } else if (tempTotalWeight != 0 && (tempTotalWeight / 1000 > 40))
//        {
//            $th.addClass('totalWeightShow');
//            $th.addClass('red');
//            if (tempTotalWeight >= 1000)
//            {
//                var ton = Math.floor(tempTotalWeight / 1000);
//                $th.html(ton + ' T');
//            }
//            else
//            {
//                $th.html(Math.ceil(tempTotalWeight));
//            }
//        }
//        else
//        {
//            $th.removeClass('totalWeightShow');
//            $th.html('');
//        }
    });
}
function isNumber(o) {
    return !isNaN(o - 0) && o !== null && o !== "" && o !== false;
}

function totalRow() {
    return $('.dataTable tr').length;
}
function makeDummyRowLeft() {
    var totalrow = 23; // total 23
    var usedrow = $('#orderListLength').val();
    var dataTableRowLen = $('.dataTable tr').length;
    if (dataTableRowLen < totalrow)
    {
        for (usedrow; usedrow < totalrow; usedrow++)
        {
            $('.dataTable tr:last').after('<tr><td></td><td></td><td></td><td></td><td></td></tr>');
        }
    }

}
function makeDummyRowRight() {
    var totalrow = 21;
    var usedrow = $('#orderListLength').val();
    var mainTableRowLen = $('.mainTable tr').length;
    if (mainTableRowLen < totalrow)
    {
        var mainTableTR = '<tr style="height: 30px;">';
        $('.mainTable tr:nth-last-child(2) td').each(function() {
            var strClass = $(this).attr("class");
            var dataDay = $(this).data("day");
            if (strClass.indexOf('holiday') > -1) {
                mainTableTR += '<td class="' + dataDay + ' holiday">&nbsp;</td>';
            } else {
                mainTableTR += '<td class="' + dataDay + '">&nbsp;</td>';
            }
        });
        mainTableTR += '</tr>';
        for (usedrow; usedrow <= totalrow; usedrow++)
        {
            $('.mainTable tr:last').before(mainTableTR);
        }
    }
    var allCells = $(".mainTable td");
    allCells.on("mouseover", function() {
        var el = $(this),
                pos = el.index();
        el.parent().find("th, td").addClass("hover");
        allCells.filter(":nth-child(" + (pos + 1) + ")").addClass("hover");
    })
            .on("mouseout", function() {
        allCells.removeClass("hover");
    });

}