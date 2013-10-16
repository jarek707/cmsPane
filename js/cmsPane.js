angular.module('app.directives', ['app.gridConf', 'app.scopes'])
    .directive('menu', [ function() {
        return {
            restrict    : 'A',
            replace     : false,
            transclude  : true,
            templateUrl : 'partials/menu.html',
            link        : function($scope, $element, $attrs) { 
                $scope.signUp = function() {
                    $scope.pwNotify = false;
                    $scope.showSignup = true;
                    $element.find('input').val('');
                };

                $scope.logIn = function() {
                    $scope.userName = _.isUndefined($scope.userName) ? 'Guest' : $scope.userName;
                    $scope.logged = true;
                };

                $scope.logOut = function() {
                    $scope.logged = false;
                    $scope.showSignup = false;
                };

                $scope.passVerify = function() {
                    $scope.pwNotify = true;
                    var match = $scope.password == $scope.confirmPassword;
                    $scope.pwMatch = match ? '' : 'do not';
                    $element.find('notify').toggleClass('matched');
                };

                $scope.submitSignUp = function() {
                    $scope.logIn();
                };

                //$scope.logOut();
                $scope.logIn();
            }
        };
    }])
    .directive('cmsItem', ['dom', function(dom) {
        return {
            restrict    : 'A',
            replace     : true,
            transclude  : true,
            template    : '',
            link        : function($scope, $element, $attrs) { 
                dom.getTpl($scope, $attrs.cmsItem, function(compiled) {
                    $element.replaceWith(compiled);
                });
            }
        };
    }])
    .directive('pImg', [ function() {
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
    .directive('cmsText', [function() {
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
    .directive('cmsRadio', [function() {
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
    .directive('cmsCheckbox', [function() {
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
    .directive('cmsSelect', [function() {
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
    .directive('cmsFooter', ['controllers', function(controllers) {
            return {
                replace  : false,
                restrict : 'EA',
                templateUrl: 'partials/cmsFooter.html',
                link        : function($scope, $element, $attrs) {
                    //($scope.spaces = UT.gridKey($scope.$attrs.key).split('/')).pop();
                },
                controller  : function($scope) { controllers.head($scope); }
            };
        }
    ])
    .directive('cmsHeader', [ 'controllers', function(controllers) {
            return {
                replace  : false,
                restrict : 'EA',
                templateUrl: 'partials/cmsHead.html',
                link        : function($scope, $element, $attrs) {
                    $scope.title       = _.isUndefined($attrs.title) ? $scope.meta.key : $attrs.title;
                    $scope.showHeadAdd = _.isUndefined($attrs.noAddButton);
                },
                controller  : function($scope) { controllers.head($scope); }
            };
        }
    ])
    .directive('buttons', ['controllers', 'linkers', 'dom',
        function(controllers, linkers, dom) {
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
    .directive('detail', ['dom', function(dom) {
        return {
            restrict    : 'E',
            replace     : false,
            transclude  : true,
            template    : '',
            scope       : {},
            compile     : function(el, attrs) {
                return function($scope, $element, $attrs) { 
                    var tpl = $attrs.tpl;
                    tpl = _.isEmpty(tpl) ? 'detail' : tpl;
                    dom.getTpl($scope, tpl, function(compiled) {
                        $element.append(compiled);
                        $element.data(_.extend($element.data(), {'$scope' : $scope}));
                    });

                    $scope.close = function() {
                        $element.hide();
                    };

                    $scope.show = function(args) {
                        $element.show();
                        _.each(args, function(v,k) { $scope[k] = v; });
                    };
                }
            }
        };
    }])
    .directive('iterate', ['$compile',
        function ($compile) {
            return {
                replace : true,
                restrict : 'AE',
                template : '',
                compile  : function(el, attrs) {
                    var iterate = el.html();
                    el.html('');
                    return {
                        post : function post($scope, $element) {
                            var tpl = $scope.templates.cmsPane;

                            if ( iterate.indexOf('buttons') === -1 && tpl.indexOf('buttons') === -1) {
                                if (!_.isUndefined(attrs.buttons) ) {
                                    iterate = '<buttons use="' + attrs.buttons + '"></buttons>' + iterate;
                                } else {
                                    iterate = '<buttons use="none"></buttons>' + iterate;
                                }
                            }

                            $element.append($compile(tpl.replace('<inject-iterator />', iterate))($scope));
                        }
                    }
                }
            }
        }
    ])
    .directive('cmsPane', ['config', 'controllers','linkers','dom',
        function (config, controllers, linkers, dom) {
            return {
                replace     : false,
                restrict    : 'EA',
                scope       : { exposer : '&', parentList : '=', rowId : "@", parentId : "@" },
                transclude  : false,
                template    : "",
                compile     : function(el, attrs, trans) {
                    dom.pushRelToIterate(el, attrs.rel);
                    if ( typeof USING_IE == 'undefined') USING_IE = false;

                    function link($scope, $element, $attrs) {
                        var parentMeta = _.clone($scope.exposer({data:'meta'}));

                        $scope.meta = _.isUndefined(parentMeta) ? {} : parentMeta;
                        $scope.meta = _($scope.meta).extend( config.setParams(domMeta) );
                        $scope.meta.element = $element;

                        linkers.set('main', $scope, $element);

                        config.getAllTemplates($scope, [], function() { dom.makeMain($element); });

                        _.defer(function() { 
                            $scope.$root.$broadcast('scopeReady', $attrs.key, $scope); 
                        });
                    };

                    var domMeta = dom.paramTransclude(el, attrs);

                    return link;
                },
                controller  :  function($scope, $element, $attrs) {
                    $scope.scopeId = -1;
                    $scope.exposing = function(dataItem) {
                        return $scope[dataItem];
                    };

                    $scope.meta = {"rel" : $attrs.rel};
                    controllers.set('main', $scope);
                }
            };
        }
    ])
    .directive('cmsChild', ['dom', function (dom) {
            return {
                replace     : false,
                restrict    : 'EA',
                scope       : { exposer : '&', parentList : '=', rowId : "@"},
                transclude  : false,
                template    : "",
                compile     : function(el, attrs, trans) {
                    dom.convertChild(el);

                    // We need to compile child pane against parent $scope.  Parent might be rendered
                    // after the child so the child has to wait until parent $scope is available.
                    return function($scope, $element) {
                        var parentScope = false;

                        _(angular.element('body cms-pane')).each(function(v,k) {
                            if (angular.element(v).attr('key') === attrs.parentKey) {
                                parentScope = angular.element(v).data().$scope;
                            }
                        });

                        if (!parentScope) {
                            _($('body div[cms-pane]')).each(function(v,k) {
                                if (angular.element(v).attr('key') === attrs.parentKey) {
                                    parentScope = angular.element(v).data().$scope;
                                }
                            });
                        }

                        if (parentScope) {
                            dom.compileChildPane(parentScope, el);
                        } else {
                            $scope.$on('scopeReady', function(evtObj, key, pScope) {
                                if (attrs.parentKey === key ) {
                                    _.defer(function() { dom.compileChildPane(pScope, el); }, 300);
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
    .filter('noEmpty', function() {
        return function(input, delim) {
            return input === '' ? 'noName' : input;
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

