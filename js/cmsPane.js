LG( localStorage);
angular.module('app.directives', ['app.gridConf', 'app.directiveScopes'])
    .directive('pImg', ['config', function(config) {
        return {
            restrict    : 'A',
            replace     : true,
            transclude  : true,
            templateUrl : 'partials/pImg.html',
            link        : function($scope, $element) { 
                if (!_.isUndefined($scope.meta.columns))
                    $scope.meta = $scope.meta.columns;
            },
            controller: function($scope, $element) {
                $scope.trClass = false;
            }
        }
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

                $scope.meta = $scope.meta['tab'][$scope.i]; 
                $scope.chg  = function() { $scope.$parent.chg($scope.meta.pos) };

                if ($scope.i == 0 && $scope.row[$scope.i] == '')
                    $($element.find('input')).focus();
            },
            controller: function($scope, $element) {
            }
        }
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
                $scope.chg  = function() { $scope.$parent.chg($scope.meta.pos) };
            }
        }
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
        }
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
        }
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
            }
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
            }
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
                        LG( ' linker' , $scope.$id );
                        linkers.set('row', $scope, $element); 
                    }
                },
                controller  : function($scope, $element) { 
                    controllers.set('row', $scope, $element); 
                }
            }
        }
    ])
    .directive('cmsPane', ['$compile',  'config', 'controllers','linkers',
        function ($compile, config, controllers, linkers) {
            return {
                replace     : false,
                restrict    : 'E',
                scope       : { expose : '&', parentList : '='},
                transclude  : false,
                template    : "",
                //templateUrl : 'partials/cmsPane.html',
                compile     : function(el, attrs, trans) {
                    var meta     = !_.isUndefined(attrs.meta) ? JSON.parse(attrs.meta) : {};
                    var children = '';
                    var matches  = $(el).html().match(/<!--.*?ITERATE([\s\S]*?)-->/);
                    var iterate  = matches ? matches[1] : '';

                    if ( el.find('*').length ) {
                        // Use the first comment that has ITERATE string in it, discard such others
                        children     = el.html().replace(/<!--.*?ITERATE[\s\S]*?-->/, '{{ITERATION}}')
                                                .replace(/<!--.*?ITERATE[\s\S]*?-->/g, '');
                    }
                    el.find('*').remove();
                    
                    return  function($scope, $element, $attrs) {
                        $scope.templates = {};
                        var tplDir = _.isUndefined($attrs['tpl-dir']) ? 'partials' : $attrs['tpl-dir'];

                        config.getAllTemplates($scope, tplDir, [], function() {
                            $scope.meta = _.extend(config.setParams($scope.$attrs), 
                                                   config.getMeta($scope.$attrs.key));
                            $scope.meta.children = children;
                            $scope.meta.iterate  = iterate;

                            linkers.set('main', $scope, $element);

                            html = $scope.templates['cmsPane'];

                            if (html.indexOf('{{injectHtml}}') > -1)
                                html = html.replace('{{injectHtml}}', iterate);

                            if (children.indexOf('{{ITERATION}}') > -1)
                                html = children.replace('{{ITERATION}}',html); 

                            $element.append($compile(html)($scope));
                        });
                    }
                },
                controller  :  function($scope, $element, $attrs) {
                    $scope.exposing = function(dataItem) {
                        return $scope[dataItem];
                    };

                    $scope.$attrs = $attrs;
                    $scope.key    = $attrs.key;
                    controllers.set('main', $scope);
                }
            }
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

                    setTimeout(function() {$element.css({display:"none"})}, 2000*howLong);
                };
            }
        }
    })
    .directive('box', function factory() {
        return {
            restrict:   'EA',
            template:   '<div class="box">text in a box</div>',
            transclude: true,
            replace:    true
        }
        
    })
    .filter('last', function() {
        return function(input, delim) {
            return input.split(_.isUndefined(delim) ? '/' : delim).pop();
        }
    })
    .filter('Last', function() {
        return function(input, delim) {
            var last = input.split(_.isUndefined(delim) ? '/' : delim).pop();
            return last.charAt(0).toUpperCase() + last.substr(1);
        }
    })
    .filter('colName', function() {
        return function(input, delim) {
            return input.split(_.isUndefined(delim) ? ':' : delim).shift();
        }
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
                            ?  _(input).each(function(v,k) { $return += v ? ',' + labels[k] : ''; })
                            : $return = ' --none--';
                        $return = $return.substr(1);
                        break;
                    case 'sel' : 
                        _(labels).each( function(v,k) { 
                            if ( v.id == input ) {
                                $return = v.val;
                            }
                        }) 
                        break;
                    default    : $return = labels[input];     break;
                }

                return $return;
            }
        }
    })
;
//  Directives END

angular.module('app', ['app.services', 'app.directives', 'app.customDirectives']);
