angular.module('app.directives', ['app.gridConf', 'app.directiveScopes'])
    .directive('pImg', ['config', function(config) {
        return {
            restrict    : 'A',
            replace     : true,
            transclude  : true,
            templateUrl : 'partials/pImg.html',
            link        : function($scope, $element) { 
            },
            controller: function($scope, $element) {
                $scope.trClass = false;
            }
        };
    }])
    .directive('cmsText', ['config', function(config) {
        return {
            restrict    : 'A',
            replace     : true,
            transclude  : true,
            templateUrl : 'partials/cmsText.html',
            link        : function($scope, $element) { 
                if (!_.isUndefined($scope.meta.columns))
                    $scope.meta = $scope.meta.columns;

                $scope.meta = $scope.meta.tab[$scope.i]; 
                $scope.chg  = function() { $scope.$parent.chg($scope.meta.pos); };

                if ($scope.i === 0 && $scope.row[$scope.i] === '')
                    $($element.find('input')).focus();
            },
            controller: function($scope, $element) {
            }
        };
    }])
    .directive('cmsRadio', ['config', function(config) {
        return {
            restrict    : 'EA',
            replace     : true,
            transclude  : true,
            templateUrl : 'partials/cmsRadio.html',
            link        : function($scope) { 
                if (!_.isUndefined($scope.meta.columns))
                    $scope.meta = $scope.meta.columns;

                $scope.meta = $scope.meta[$scope.metaType][$scope.i]; 
                $scope.chg  = function() { $scope.$parent.chg($scope.meta.pos); };
            }
        };
    }])
    .directive('cmsCheckbox', ['config', function(config) {
        return {
            replace     : true,
            restrict    : 'EA',
            transclude  : true,
            templateUrl : '/partials/cmsCheckbox.html',
            link        : function($scope, $element) { // link function
                if (!_.isUndefined($scope.meta.columns))
                    $scope.meta = $scope.meta.columns;

                $scope.meta   = $scope.meta[$scope.metaType][$scope.i];

                if ( typeof $scope.workRow[$scope.meta.pos] != 'object' ) {
                    $scope.workRow[$scope.meta.pos] = UT.mkEmpty($scope.meta.labs, false);
                    $scope.row[$scope.meta.pos]     = UT.mkEmpty($scope.meta.labs, false);
                }

                $scope.chg = function() { $scope.$parent.chg($scope.meta.pos); };
            }
        };
    }])
    .directive('cmsSelect', ['config', function(config) {
        return {
            replace     : true,
            restrict    : 'EA',
            scope       : true, 
            transclude  : true,
            templateUrl : 'partials/cmsSelect.html',
            link    : function($scope, $element) {
                $scope.meta = $scope.meta[$scope.metaType][$scope.i];
                $scope.chg  = function() { $scope.$parent.chg($scope.meta.pos); };
            }
        };
    }])
    .directive('cmsFooter', ['config', 'controllers', 'linkers', '$compile',
        function(config, controllers, linkers, $compile) {
            return {
                replace  : false,
                restrict : 'EA',
                templateUrl: 'partials/cmsFooter.html',
                link        : function($scope, $element, $attrs) {
                    //($scope.spaces = UT.gridKey($scope.$attrs.key).split('/')).pop();
                },
                controller  : function($scope) { controllers.head['default']($scope); }
            };
        }
    ])
    .directive('cmsHeader', ['config', 'controllers', 'linkers', '$compile',
        function(config, controllers, linkers, $compile) {
            return {
                replace  : false,
                restrict : 'EA',
                templateUrl: 'partials/cmsHead.html',
                link        : function($scope, $element, $attrs) {
                    //($scope.spaces = UT.gridKey($scope.$attrs.key).split('/')).pop();
                },
                controller  : function($scope) { controllers.head['default']($scope); }
            };
        }
    ])
    .directive('cmsRow', ['config', 'controllers', 'linkers',
        function(config, controllers, linkers) {
            return {
                replace     : true,
                restrict    : 'AE',
                template : '<li ng-repeat="(id,row) in list" ng-class="rowClass" class="row" ord-id="{{row.id}}">',
                compile     : function(el, attrs) {
                    return function($scope, $element) { 
                        linkers.set('row', $scope, $element); 
                    };
                },
                controller  : function($scope) { 
                    controllers.set('row', $scope); 
                }
            };
        }
    ])
    .directive('rowButtons', ['config', 'controllers', 'linkers',
        function(config, controllers, linkers) {
            return {
                replace     : true,
                restrict    : 'AE',
                templateUrl : 'partials/rowButtons.html',
                compile     : function(el, attrs) {
                    return function($scope, $element) { 
                        linkers.set('row', $scope, $element); 

                        //if ( !_.isUndefined($scope.$parent.meta) )
                            //$scope.meta = $scope.$parent.meta.columns;
                    };
                },
                controller  : function($scope) { 
                    controllers.set('row', $scope); 
                }
            };
        }
    ])
    .directive('replaceWithCmsPane', ['config', 'dom', function(config, dom) {
        return {
            restrict    : 'EA',
            replace     : true,
            transclude  : false,
            template    : '',
            compile     : function(el, attrs) { 
                dom.paramTransclude(el, attrs);
            }
        };
    }])
    .directive('cmsIterate', ['config', function(config) {
        return {
            restrict   : 'E',
            replace    : true,
            transclude : 'element',
            template   : '<div></div>'
        };
    }])
    .directive('cmsPane', ['$compile',  'config', 'controllers','linkers','dom',
        function ($compile, config, controllers, linkers, dom) {
            return {
                replace     : false,
                restrict    : 'EA',
                scope       : { expose : '&', parentList : '=', rowId : "@"},
                transclude  : false,
                template    : "",
                compile     : function(el, attrs, trans) {
                    var params = dom.paramTransclude(el, attrs, true);

                    return  function($scope, $element, $attrs) {
                        $scope.meta = _(config.setParams($attrs)).extend(params);

                        linkers.set('main', $scope, $element);

                        config.getAllTemplates($scope, [], function() {

                            html = $scope.templates.cmsPane;

                            if (html.indexOf('<inject-iterator-here />') > -1)
                                html = html.replace('<inject-iterator-here />', $scope.meta.iterate);

                            if ($scope.meta.children.indexOf('{{ITERATION}}') > -1)
                                html = $scope.meta.children.replace('{{ITERATION}}',html); 

                            var compiled = $compile(html)($scope);
                            $element.append(compiled);

                            if (!_.isUndefined($scope.meta.relContainer)) {
                                setTimeout( function() {
                                    dom.injectRelChild($scope, $element);
                                }, 0);
                            }
                        });
                    };
                },
                controller  :  function($scope, $element, $attrs) {
                    $scope.meta = _.isUndefined($attrs.params) ? {} 
                                : JSON.parse($attrs.params);

                    $scope.exposing = function(dataItem) {
                        return $scope[dataItem];
                    };

                    controllers.set('main', $scope);
                }
            };
        }
    ])
    .directive('notify', function factory() {
        return {
            restrict   : 'C',
            replace    : true,
            scope      : true,
            controller : function($scope, $element) {

                $scope.$parent.notify = function(msgId, type, msg, howLong) {
                    if ( _.isUndefined(type)) type = 'info';
                    if ( _.isUndefined(msg))  msg  = '';

                    switch (msgId) {
                        case 'sav' : flash('Saving Row.'      + msg, type, howLong); break;
                        case 'rel' : flash('Reloading Table.' + msg, type, howLong); break;
                        case 'del' : flash('Deleting Row'     + msg, type, howLong); break;
                        default    : flash(                     msg, type, howLong); break;
                    }
                };

                function flash(msg, type, howLong) {
                    var colors = {"success":"green", "warn":"#a80", "error":"red", "info":"#888"};

                    if (_.isUndefined(howLong)) howLong = 1;

                    $element.html('<b><i>' + UT.camelize(type, true) + ':</i></b> ' + msg)
                            .css( {display:"block", color:colors[type]} );

                    setTimeout(function() {$element.css({display:"none"}); }, 2000*howLong);
                }
            }
        };
    })
    .directive('box', function factory() {
        return {
            restrict:   'EA',
            template:   '<div class="box">text in a box</div>',
            transclude: true,
            replace:    true
        };
    })
    .filter('last', function() {
        return function(input, delim) {
            return input.split(_.isUndefined(delim) ? '/' : delim).pop();
        };
    })
    .filter('Last', function() {
        return function(input, delim) {
            var last = input.split(_.isUndefined(delim) ? '/' : delim).pop();
            return last.charAt(0).toUpperCase() + last.substr(1);
        };
    })
    .filter('colName', function() {
        return function(input, delim) {
            return input.split(_.isUndefined(delim) ? ':' : delim).shift();
        };
    })
    .filter('toLabel', function() {
        return function(input, labels, type) {
            if ( typeof labels == 'undefined' ) return 'no labels';

            if (_.isUndefined(input) || input === '') {
                return '--none--';
            } else {
                var $return = '';
                switch (type) {
                    case 'chk' :
                        _.some(input) 
                            ? _(input).each(function(v,k) { $return += v ? ',' + labels[k] : ''; })
                            : $return = ' --none--';
                        $return = $return.substr(1);
                        break;
                    case 'sel' : 
                        _(labels).each( function(v,k) { 
                            if ( v.id == input ) {
                                $return = v.val;
                            }
                        });
                        break;
                    default    : $return = labels[input];     break;
                }

                return $return;
            }
        };
    })
;
//  Directives END

angular.module('app', ['app.services', 'app.directives', 'app.customDirectives']);
