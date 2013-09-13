angular.module('app.directives', ['app.gridConf', 'app.directiveScopes'])
    .directive('pImg', ['config', function(config) {
        return {
            restrict    : 'A',
            replace     : true,
            transclude  : true,
            templateUrl : 'partials/pImg.html',
            link        : function($scope, $element) { 
                //if (!_.isUndefined($scope.meta.columns))
                    //$scope.meta = $scope.meta.columns;
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
    .directive('rowButtons', ['config', 'controllers', 'linkers',
        function(config, controllers, linkers) {
            return {
                replace     : false,
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
    .directive('cmsPaneRelKey', ['config', function(config) {
        return {
            restrict    : 'EA',
            replace     : true,
            transclude  : false,
            template    : '',
            compile     : function(el, attrs) { 
                LG( ' compile rel key ' );
                var params = {};

                try {
                    if (el.find('params').length ) {
                    LG( el.find('params').attr('value') );
                        params = JSON.parse(el.find('params').remove().attr('value'));
                    }
                } catch(e) { console.log('bad JSON in cmsPaneRelKey compiler'); }

                var iterate =   el.find('iterate'); 
                if ( iterate.length ) {
                    params.iterate = iterate.replaceWith('{{ITERATION}}').html();
                }

                var children = el.html();
                if ( !_.isEmpty(children) && children !== '') {
                    params.children = children;
                }

                // Attributes of the wrapper element override ones in <cms-pane-content><params>
                _(attrs).each(function(v,k) { 
                    if (typeof v === 'string') params[k] = v;
                });
                params.key = attrs.cmsPaneRelKey;

                el.attr('params', JSON.stringify(params));
                el.find('*').remove();
            }
        };
    }])
    .directive('cmsPane', ['$compile',  'config', 'controllers','linkers',
        function ($compile, config, controllers, linkers) {
            return {
                replace     : false,
                restrict    : 'EA',
                scope       : { expose : '&', parentList : '=', rowId : "@"},
                transclude  : false,
                template    : "",
                compile     : function(el, attrs, trans) {
                    LG( ' commpile pane' );
                    function extractPaneContent( domEl ) {
                        var iterate  = domEl.find('iterate').replaceWith('{{ITERATION}}').html();
                        var children = domEl.html();
                        domEl.find('*').remove();
                        return {iterate : iterate, children : children};
                    }

                    // Always pull out the content and clear the element
                    var content = extractPaneContent(el);

                    return  function($scope, $element, $attrs) {
                        if (_.isEmpty($scope.meta)) {
                            $scope.meta = _(config.setParams($attrs)).extend(content);
                        }

                        linkers.set('main', $scope, $element);

                        config.getAllTemplates($scope, [], function() {

                            html = $scope.templates.cmsPane;

                            if (html.indexOf('{{injectHtml}}') > -1)
                                html = html.replace('{{injectHtml}}', $scope.meta.iterate);

                            if ($scope.meta.children.indexOf('{{ITERATION}}') > -1)
                                html = $scope.meta.children.replace('{{ITERATION}}',html); 

                            var compiled = $compile(html)($scope);
                            $element.append(compiled);

                            if (!_.isUndefined($scope.meta.relContainer)) {
                                setTimeout( function() {
                                    LG( ' send to inject ');
                                    linkers.injectRelChild($scope, $element);
                                }, 300);
                            }
                        });
                    };
                },
                controller  :  function($scope, $element, $attrs) {
                    $scope.meta = _.isUndefined($attrs.params) ? {} 
                                : JSON.parse(decodeURIComponent($attrs.params));

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
