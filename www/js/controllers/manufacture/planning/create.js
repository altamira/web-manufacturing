altamiraAppControllers.controller('ManufacturePlanningCreateCtrl',
        function($scope, $location, $route, Restangular, services, $ionicModal, CommonFun, $ionicSideMenuDelegate, $routeParams) {
            $scope.startDate = true;
            $scope.planning = {};
            $ionicModal.fromTemplateUrl('templates/manufacture/planning/popup/start_date_create.html', {
                scope: $scope,
                animation: 'fade-in'
            }).then(function(modal) {
                $scope.startDateCreateModal = modal;
            });
            $scope.startDateCreateModalShow = function() {
                $scope.startDateCreateModal.show();
            }
            $scope.startDateCreateModalHide = function() {
                $scope.startDateCreateModal.hide();
            }
            $scope.submitStartDateCreate = function(isValid)
            {
                if (isValid)
                {
                    console.log(JSON.stringify($scope.planning));
                }
            }
            $scope.manageSection = function()
            {
                $('.list_manage_button').click(function() {
                    var listId = $(this).data('listid');
                    if ($(this).hasClass('fa-minus-square-o')) {
                        $('.list_section_'+listId).hide('slow');
                        $(this).removeClass('fa-minus-square-o');
                    }
                    else
                    {
                        $('.list_section_'+listId).show('slow');
                        $(this).addClass('fa-minus-square-o');
                    }
                });
                $('.item_mange_button').click(function() {
                    var itemId = $(this).data('itemid');
                    if ($(this).hasClass('fa-minus-square-o')) {
                        $('.item_desc_'+itemId).hide('slow');
                        $(this).removeClass('fa-minus-square-o');
                    }
                    else
                    {
                        $('.item_desc_'+itemId).show('slow');
                        $(this).addClass('fa-minus-square-o');
                    }
                });
                $('.order_manage_button').click(function() {
                    var orderid = $(this).data('orderid');
                    if ($(this).hasClass('fa-minus-square-o')) {
                        $('.order_section_'+orderid).hide('slow');
                        $(this).removeClass('fa-minus-square-o');
                    }
                    else
                    {
                        $('.order_section_'+orderid).show('slow');
                        $(this).addClass('fa-minus-square-o');
                    }
                });
            }
            $scope.manageSection();
        });
