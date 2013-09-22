angular.module('app.services', ['app.gridConf'])
    .factory('dom', function($compile) {
        return {
            // Convert all propagated attributes and convert <iterate> tag
            'genMeta' : function(el) {
                function propagate(el, parentMeta) {
                    el.data().meta = parentMeta;

                    _(el.get()[0].attributes).each(function(v,k) {
                        _(['params', 'class', 'expose', 'row-id', 'parent-list']).contains(v.nodeName) 
                        || (el.data().meta[v.nodeName] = v.nodeValue);
                    });

                    var iterate =   el.find('>iterate');
                    if ( iterate.length ) {
                        el.data().meta.iterate = iterate.get()[0].innerHTML;
                        //iterate.get()[0].outerHTML = '{{ITERATION}}';
                    } else {
                        //el.prepend('{{ITERATION}}');
                    }

                    _(el.find('>inline')).each(function(v,k){ 
                        propagate(angular.element(v), _(el.data().meta).omit(
                            'rel', 'jquery-ui', 'rel-container', 'class'
                        ));
                    });
                }

                propagate(el, {});
            },
            'paramTransclude' : function(el, attrs, keepAttributes) {
                var params = {};

                if (!_.isUndefined(attrs.params)) {
                    _.extend(params, JSON.parse(decodeURIComponent(attrs.params)));
                }

                var iterate =   el.find('iterate'); 
                if ( iterate.length ) {
                    params.iterate             = iterate.get()[0].innerHTML;
                    iterate.get()[0].outerHTML = '{{ITERATION}}';
                }

                _.isEmpty(el.get()[0].innerHTML) || (params.children = el.get()[0].innerHTML);

                // Attributes of the wrapper element override ones in <cms-pane-content><params>
                _(attrs).each(function(v,k) { 
                    if (typeof v === 'string' && k !== 'params') params[k] = v;
                    // Remove ones with JSON
                    _(['jqueryUi','cols']).contains(k) && el.removeAttr(k);
                });
                
                // Intercept all JSON param strings and convert them to an object
                _(params).each(function(v,k) {
                    if ( _.isString(v)) {
                        var firstChar = v.substr(0,1);
                        if (firstChar == '[' || firstChar == '{') {
                            try {
                                params[k] = JSON.parse(v);
                            } catch (e) { /* ignore exception, value will not change */}
                        }
                    }
                });

                el.attr('params', encodeURIComponent(JSON.stringify(params)));

                el.get()[0].innerHTML = '';
                return params;
            },
            'injectRelChild' : function($scope, $element) {
                
                var elm = $scope.meta.relContainer !== 'inline'
                         ? angular.element($scope.meta.relContainer)
                         : $element.find('inline');

                if ( elm.length === 0 ) return; // safety

                var html = '';
                for (var i=0; i<elm.length; i++) {
                    el = angular.element(elm[i]);

                    var params = JSON.parse(decodeURIComponent(el.attr('params')));

                    var meta = _(angular.copy($scope.meta)).omit('relContainer','jqueryUi')
                    meta = _(meta).extend(params);

                    if (typeof meta.cols === 'string') 
                        meta.cols = JSON.parse(meta.cols);

                    html += '<div cms-pane' + 
                        ' class="' + $scope.meta.relContainer + '"' +
                        ' key="' + meta.key + '"' +
                        ' rel="' + meta.rel + '"' +
                        ' row-id="{{rowId}}"' +
                        ' expose="exposing(data)"' +
                        ' parent-list="list"' +
                        ' params=\'' + JSON.stringify(meta) + '\'' +
                        ' ></div>';
                }
                    
                if ( $scope.meta.relContainer === 'inline' ) {
                    $scope.inlineHtml = '<li>' + html + '</li>';
                    $scope.compiled = $compile($scope.inlineHtml)($scope);
                } else {
                    var compiled = $compile(html)($scope);
                    angular.element($scope.meta.relContainer).replaceWith(compiled);
                }
            }
        }
    })
    .factory('jquery_ui', function($http, config) {
        return  {
            setUp : function($scope) {
                if ( !_.isUndefined($scope.meta.jqueryUi)){
                    var jqObj = _.isObject($scope.meta.jqueryUi) ?
                                $scope.meta.jqueryUi             :
                                JSON.parse($scope.meta.jqueryUi);

                    $scope.sortable = _(jqObj).has('sortable')  ? 'sortable' : false;
                }
            },
            mkSortable : function( $scope, $element, cb) { 
                if ( !_.isUndefined($scope.meta.jqueryUi)){
                    
                    var jqObj = _.isObject($scope.meta.jqueryUi) ?
                                $scope.meta.jqueryUi             :
                                JSON.parse($scope.meta.jqueryUi);

                    if (!_.isFunction(cb)) cb = function() {};

                    var params = {
                        'tolerance' : 'pointer',
                        'helper'    : 'clone',
                        'cursor'    : 'move',
                        'distance'  : 1,
                        'cursorAt'  : {left: 5},
                        'update'    : cb
                    };

                    if (!_.isEmpty(jqObj.sortable)) {
                        params = _.extend(params, {"connectWith" : jqObj.sortable});
                    }

                    $($element).find('.sortable').sortable(params);
                }
            }
        }
    })
    .factory('gridDataSrv', function($http, config) {
        return  {
            prefix: 'GRID:',
            useLocal : true,

            clear: function() { 
                var keys = '';

                for (var i in localStorage) 
                    if (i.substr(0,5) == this.prefix) 
                        keys += i.substr(5) + '\n';

                var key = prompt('Enter key from the list:\n\n' + keys );
                _.isEmpty(key) ? localStorage.clear() : delete localStorage[this.prefix + key]; 
            },

            save: function(key, listOrRow, byRow) {
                if (_.isUndefined(byRow) || !byRow) {
                    key = UT.gridKey(key);
                }
                if (this.useLocal)
                    localStorage[this.prefix + key] = JSON.stringify(listOrRow);
                else // TODO implement real server save
                    ;
                return 'success';
            },

            get: function(attrs, scope) {
                scope.listW = angular.copy(scope.list = this.getData(attrs.key));
            },

            getData: function(key, cb) {
                if (this.useLocal) {
                    var localData = localStorage[this.prefix + key];
                    if (_.isUndefined(localData) || _.isEmpty(localData))
                        cb({});
                    else 
                        cb(JSON.parse(localData));
                } else {
                    $http.get(config.findMeta(key).url).success( function(data) { 
                        cb(data); 
                    });
                }
            }
        };
    })
;
