angular.module('app.customDirectives', ['app.gridConf'])
    .directive('details', function factory($compile, lData, config) { // head scope
        return {
            restrict    : 'A',
            replace     : true,
            transclude  : true,
            templateUrl : config.tplUrls.sub,
            scope       : true,
            compile     : function(el, attrs) {
                return function($scope, $element, $attrs) {
                    $scope.detailShow = true;
                    $scope.getType = function(i) {
                        return $scope.meta.all[i].type;
                    };
                };
            },
            controller: function($scope, $element) {
                $scope.metaType = 'all';

                $scope.sav = function() { 
                    $scope.close();
                    $scope.$parent.sav();
                };

                $scope.close = function() {
                    $element.remove();
                    $scope.$parent.$parent.tableHide = false;
                };
            }
        };
    })
    .directive('cmsUser', ['config', function(config) {
        return {
            restrict    : 'A',
            replace     : true,
            transclude  : true,
            templateUrl : 'partials/cmsUser.html'
        };
    }])
    .directive('divImg', ['config', function(config) {
        return {
            restrict    : 'A',
            replace     : true,
            transclude  : true,
            templateUrl : 'partials/divImg.html'
        };
    }])
    .directive('cmsCaption', ['config', function(config) {
        return {
            restrict    : 'A',
            replace     : true,
            transclude  : true,
            template    : "<div ng-click='clk()'>{{row[meta.cols[0][0]]}}:{{row[meta.cols[1][0]]}}</div>"
        };
    }])
    .directive('cmsImg', ['config', function(config) {
        return {
            restrict    : 'A',
            replace     : true,
            transclude  : true,
            template    : "<div ng-click='clk()'><img ng-src='{{row[meta.cols[1][0]]}}' width=20 height=20></img></div>"
        };
    }])
    .directive('aCaption', ['config', function(config) {
        return {
            restrict    : 'A',
            replace     : true,
            transclude  : true,
            template    : "<div ng-click='clk()'>{{row[meta.cols[0][0]]}}:{{row[meta.cols[1][0]]}}></div>"
        };
    }])
;
