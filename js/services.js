angular.module('app.services', ['app.gridConf'])
    .factory('dom', function($compile) {
        return {
            // Convert all propagated attributes and convert <iterate> tag
            'attrParse' : function($attrs) {
                $ret = {};
                _($attrs).each(function(v,k) {
                    if (_.isString(v)) {
                        $ret[k] = v.substr(0,1) === '[' || v.substr(0,1) === '{' ? JSON.parse(v) : v;
                    }
                });
                return $ret;
            },
            'paramTransclude' : function(el, attrs) {
                var meta = {};

                var iterate =   el.find('>iterate'); 
                if ( iterate.length ) {
                    meta.iterate             = iterate.get()[0].innerHTML;
                    iterate.get()[0].outerHTML = '{{ITERATION}}';
                }

                if (!_.isUndefined(attrs.cmsPane)) {
                    el.attr('row-id', '{{rowId}}');
                    el.attr('parent-list', 'list');
                    el.attr('expose', 'exposing(data)');
                }

                var cmsPane =   el.find('>cms-pane'); 
                if ( cmsPane.length ) {
                    meta.inline = [];
                    for( var i=0; i<cmsPane.length; i++){
                        meta.inline[i] = cmsPane[i].outerHTML.replace('<cms-pane',
                            '<cms-pane row-id="{{rowId}}" parent-list="list" expose="exposing(data)" ');
                    }
                    cmsPane.remove();
                } else {
                    meta.inline = {};
                }

                if (_.isEmpty(el.get()[0].innerHTML)) {
                    meta.children = "{{ITERATION}}";
                }else {
                    meta.children = el.get()[0].innerHTML;
                }

                el.get()[0].innerHTML = '';
                return meta;
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
