angular.module('app.services', ['app.gridConf'])
    .factory('dom', function($compile) {
        return {
            // Convert all propagated attributes and convert <iterate> tag
            'compileChildren' : function(el, $scope) {
                _.isUndefined(el.data().compiled) && (el.data().compiled = []);

                _(el.data().inline).each(function(v,k) {
                    el.data().compiled[k] = $compile(v)($scope);
                });
                //el.find('>inline').remove();
            },
            'genMeta' : function(el) {
                function propagate(el, parentMeta) {
                    el.data().meta = parentMeta;

                    _(el.get()[0].attributes).each(function(v,k) {
                        _(['params', 'class', 'expose', 'row-id', 'parent-list']).contains(v.nodeName) 
                        || (el.data().meta[v.nodeName] = v.nodeValue);
                    });

                    
                    if (!_.isEmpty(el.find('>inline'))) {
                        _.isUndefined(el.data().inline) && (el.data().inline = []);

                        _(el.find('>inline >cms-pane')).each( function(v,k) {
                            propagate(angular.element(v), _(el.data().meta).omit(
                                'rel', 'jquery-ui', 'rel-container', 'class'
                            ));

                            el.data().inline[k] = v;
                            angular.element(v).data().meta.children = v.innerHTML;
                        });

                    }
                }

                propagate(el, {});
            },
            'paramTransclude' : function(el, attrs, keepAttributes) {
                _.isUndefined(el.data().meta) && this.genMeta(el);

                var meta = el.data().meta;

                var iterate =   el.find('>iterate'); 
                if ( iterate.length ) {
                    meta.iterate             = iterate.get()[0].innerHTML;
                    iterate.get()[0].outerHTML = '{{ITERATION}}';
                }

                if (_.isEmpty(el.get()[0].innerHTML)) {
                    meta.children = "{{ITERATION}}";
                }else {
                    meta.children = el.get()[0].innerHTML;
                }

                // Intercept all JSON param strings and convert them to an object
                _(meta).each(function(v,k) {
                    if ( _.isString(v) &&  (v.substr(0,1) === '[' || v.substr(0,1) === '{')) {
                        try       { meta[k] = JSON.parse(v); } 
                        catch (e) { /* ignore exception, value will not change */}
                    }
                });

                el.get()[0].innerHTML = '';
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
