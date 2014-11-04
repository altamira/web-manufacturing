var altamiraAppControllers = angular.module('altamiraAppControllers', []);

altamiraAppControllers.controller('ManufacturingProcsSearchCtrl',
        function($scope, $http, $location, $routeParams) {
            $scope.startPage = $routeParams.start;
            $scope.maxRecord = 2;
            $scope.currentPage = 1;
            $scope.pageSize = 1;
            $scope.pageStack = [];
            $scope.searchText = '';

            $scope.loadBom = function(searchText) {
                var url = '';
                $scope.searchText = searchText;
                if (searchText == '')
                {
                    url = 'http://data.altamira.com.br/manufacturing/process?start=' + $scope.startPage + '&max=' + $scope.maxRecord;
                }
                else
                {
                    url = 'http://data.altamira.com.br/manufacturing/process/search?search=' + searchText + '&start=' + $scope.startPage + '&max=' + $scope.maxRecord;
                }
                var httpRequest = $http({
                    method: 'GET',
                    url: url,
                    headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
                }).success(function(data) {
                    if (data != '')
                    {
                        $scope.processes = data;
                        $scope.range();
                    } else
                    {
                        $location.path('/manufacturing/process/' + (parseInt($scope.startPage) - 1));
                    }
                });
            };
            $scope.searchProcess = function(searchVal) {
                $scope.searchText = searchVal;
                $scope.loadBom($scope.searchText);
            };
            if ($scope.searchText == '')
            {
                $scope.loadBom($scope.searchText);
            }

            $scope.newProcess = function() {
                $location.path('/manufacturing/create/process');
            }
            $scope.goPage = function(pageNumber) {
                var nextPage = parseInt(pageNumber) - 1;
                $location.path('/manufacturing/process/' + nextPage);
            }
            $scope.nextPage = function() {
                var nextPage = parseInt($scope.startPage) + parseInt($scope.maxRecord);
                $location.path('/manufacturing/process/' + nextPage);
            }
            $scope.prevPage = function(nextPage) {
                $location.path('/manufacturing/process/' + nextPage);
            }
            $scope.goUpdate = function(processId) {
                $location.path('/manufacturing/update/process/' + processId);
            }
            $scope.range = function() {
                var start = parseInt($scope.startPage) + 1;
                var input = [];
                for (var i = 1; i <= start; i++)
                    $scope.pageStack.push(i);
            };
        });

altamiraAppControllers.controller('ManufacturingProcessCreateCtrl', ['$scope', '$http', '$location',
    function($scope, $http, $location) {
        $scope.processData = {};
        $scope.postdata = {};
        $scope.submitCreateProcess = function(isValid) {
            if (isValid) {
                $scope.postdata.code = $scope.processData.code;
                $scope.postdata.description = $scope.processData.description;
                console.log(JSON.stringify($scope.postdata));
                $http({
                    method: 'POST',
                    url: 'http://data.altamira.com.br/manufacturing/process/',
                    data: $scope.postdata, // pass in data as strings
                    headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
                }).success(function(data, status, headers, config) {

                    $location.path('/manufacturing/update/process/' + data.id);

                }).error(function(data, status, headers, config) {
                    console.log(data);
                    console.log(status);
                    console.log(headers);
                    console.log(config);
                });
            }
        };
        $scope.goBack = function() {
            $location.path('/manufacturing/process/' + 0);
        };
    }]);
altamiraAppControllers.controller('ManufacturingProcessUpdateCtrl', ['$scope', '$http', '$location', '$routeParams',
    function($scope, $http, $location, $routeParams) {
        $scope.processId = $routeParams.processId;
        $scope.processData = {};
        $scope.loadProcess = function() {
            $http({
                method: 'GET',
                url: 'http://data.altamira.com.br/manufacturing/process/' + $scope.processId,
                headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
            }).success(function(data) {
                console.log(data);
                $scope.processData.id = data.id;
                $scope.processData.code = data.code;
                $scope.processData.description = data.description;
            });
        };
        $scope.loadProcess();
        $scope.submitUpdateProcess = function(isValid) {
            if (isValid) {
                $scope.postdata = {};
                $scope.postdata.id = $scope.processData.id;
                $scope.postdata.code = $scope.processData.code;
                $scope.postdata.description = $scope.processData.description;
                console.log(JSON.stringify($scope.postdata));
                $http({
                    method: 'PUT',
                    url: 'http://data.altamira.com.br/manufacturing/process/' + $scope.postdata.id,
                    data: $scope.postdata, // pass in data as strings
                    headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
                }).success(function(data, status, headers, config) {

                    $location.path('/manufacturing/update/process/' + data.id);

                }).error(function(data, status, headers, config) {
                    console.log(data);
                    console.log(status);
                    console.log(headers);
                    console.log(config);
                });
            }
        };
        $scope.goBack = function() {
            $location.path('/manufacturing/process/' + 0);
        };
        $scope.updateOperation = function() {
            $location.path('/manufacturing/process/operation/' + $scope.processId);
        };
    }]);
altamiraAppControllers.controller('ManufacturingProcessOperationCtrl', ['$scope', '$http', '$location', '$routeParams','$upload',
    function($scope, $http, $location, $routeParams,$upload) {
        $scope.processId = $routeParams.processId;
        $scope.submitOperation = function(isValid) {
            if (isValid) {
                $scope.postdata = {};

                $scope.postdata.sequence = $scope.operationData.sequence;
                $scope.postdata.name = $scope.operationData.name;
                $scope.postdata.description = $scope.operationData.description;
                $scope.postdata.sketch = $scope.operationData.sketch;
                console.log(JSON.stringify($scope.postdata));
                $scope.onFileSelect = function($files) {
                    alert(1);
                    //$files: an array of files selected, each file has name, size, and type.
                    for (var i = 0; i < $files.length; i++) {
                        var file = $files[i];
                        $scope.upload = $upload.upload({
                            url: 'www/', //upload.php script, node.js route, or servlet url
                            //method: 'POST' or 'PUT',
                            //headers: {'header-key': 'header-value'},
                            //withCredentials: true,
                            data: {myObj: $scope.myModelObj},
                            file: file, // or list of files ($files) for html5 only
                            //fileName: 'doc.jpg' or ['1.jpg', '2.jpg', ...] // to modify the name of the file(s)
                            // customize file formData name ('Content-Disposition'), server side file variable name.
                            //fileFormDataName: myFile, //or a list of names for multiple files (html5). Default is 'file'
                            // customize how data is added to formData. See #40#issuecomment-28612000 for sample code
                            //formDataAppender: function(formData, key, val){}
                        }).progress(function(evt) {
                            console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                        }).success(function(data, status, headers, config) {
                            // file is uploaded successfully
                            console.log(data);
                        });
                        //.error(...)
                        //.then(success, error, progress);
                        // access or attach event listeners to the underlying XMLHttpRequest.
                        //.xhr(function(xhr){xhr.upload.addEventListener(...)})
                    }
                    /* alternative way of uploading, send the file binary with the file's content-type.
                     Could be used to upload files to CouchDB, imgur, etc... html5 FileReader is needed.
                     It could also be used to monitor the progress of a normal http post/put request with large data*/
                    // $scope.upload = $upload.http({...})  see 88#issuecomment-31366487 for sample code.
                };
//                $http({
//                    method: 'PUT',
//                    url: 'http://data.altamira.com.br/manufacturing/process/' + $scope.postdata.id,
//                    data: $scope.postdata, // pass in data as strings
//                    headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
//                }).success(function(data, status, headers, config) {
//
//                    $location.path('/manufacturing/update/process/' + data.id);
//
//                }).error(function(data, status, headers, config) {
//                    console.log(data);
//                    console.log(status);
//                    console.log(headers);
//                    console.log(config);
//                });
            }
        };
        $scope.goBack = function() {
            $location.path('/manufacturing/update/process/' + $scope.processId);
        };
    }]);