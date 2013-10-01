angular.module('app.directives', ['app.gridConf', 'app.directiveScopes'])
    .directive('cmsItem', ['config', 'dom', function(config, dom) {
        return {
            restrict    : 'A',
            replace     : true,
            transclude  : true,
            template    : '',
            link        : function($scope, $element, $attrs) { 
                dom.getItem($scope, $attrs.cmsItem, function(compiled) {
                    $element.replaceWith(compiled);
                });
            }
        };
    }])
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
                },
                controller  : function($scope) { controllers.head['default']($scope); }
            };
        }
    ])
    .directive('buttons', ['config', 'controllers', 'linkers', 'dom',
        function(config, controllers, linkers, dom) {
            return {
                replace     : true,
                restrict    : 'E',
                templateUrl : 'partials/buttons.html',
                compile     : function(el, attrs) {
                    dom.setupButtons(el, attrs);
                    return function($scope, $element) { 
                        linkers.set('row', $scope, $element); 
                    };
                },
                controller  : function($scope, $element) { 
                    controllers.set('row', $scope, $element); 
                }
            };
        }
    ])
    .directive('cmsPane', ['config', 'controllers','linkers','dom',
        function (config, controllers, linkers, dom) {
            return {
                replace     : false,
                restrict    : 'EA',
                scope       : { expose : '&', parentList : '=', rowId : "@"},
                transclude  : false,
                template    : "",
                compile     : function(el, attrs, trans) {
                    // TODO
                    if (!_.isUndefined(el.data().meta)) {
                        el.data().meta['jqueryUi'] = el.data().meta['jquery-ui'];
                    }

                    function link($scope, $element, $attrs) {
                        var parentMeta = _.clone($scope.expose({data:'meta'}));

                        $scope.meta = _.isUndefined(parentMeta) ? {} : parentMeta;
                        $scope.meta = _($scope.meta).extend( config.setParams(domMeta) );

                        linkers.set('main', $scope, $element);

                        config.getAllTemplates($scope, [], function() {
                            dom.makeMain($element);
                       //     _.isEmpty($scope.meta.inline ) || dom.injectInlines($element);
                            //_.isUndefined($attrs.relParent) || dom.findParent($scope);
                        });
                        setTimeout( function() {
                            $scope.$root.$broadcast('scopeReady', $attrs.key);
                        },0);
                    };

                    var domMeta = dom.paramTransclude(el, attrs);
                    if (_.isUndefined(attrs.parentKey) ) {
                        return link;
                    } else {
                        dom.appendExternals(el);
                        return function() {};
                    }
                },
                controller  :  function($scope, $element, $attrs) {
                    $scope.exposing = function(dataItem) {
                        return $scope[dataItem];
                    };

                    $scope.meta = {"rel" : $attrs.rel};
                    controllers.set('main', $scope);
                }
            };
        }
    ])
    .directive('cmsChild', ['config', 'dom', '$compile',
        function (config, dom, $compile) {
            return {
                replace     : false,
                restrict    : 'EA',
                scope       : { expose : '&', parentList : '=', rowId : "@"},
                transclude  : false,
                template    : "",
                compile     : function(el, attrs, trans) {
                    dom.convertChild(el.get()[0]);
                    return function($scope, $element) {

                        function getParentScope() {
                            var found = false;
                            cmsPanes = angular.element('body cms-pane');
                            _(cmsPanes).each(function(v,k) {
                                if (angular.element(v).attr('key') === attrs.parentKey) {
                                    found = angular.element(v).data().$scope;
                                }
                            });
                            return found;
                        }

                        function compileCmsPane(parentScope) {
                            var data = _.extend(el.data());
                            var inEl = angular.element(el.data().outer).data(data);
                            el.replaceWith($compile(inEl)(parentScope));
                        }

                        var parentScope = getParentScope();
                        if (parentScope) {
                            compileCmsPane(parentScope);
                        } else {
                            $scope.$on('scopeReady', function(evtObj, key) {
                                if (attrs.parentKey === key ) {
                                    setTimeout(function() {
                                        compileCmsPane(getParentScope());
                                    },0 );
                                }
                            });
                        }

                    }
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
    .filter('trimList', function() {
        return function(input, cb) {
            return _.isFunction(cb) ? cb(input) : input;
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
