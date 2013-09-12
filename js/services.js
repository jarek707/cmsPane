angular.module('app.services', ['app.gridConf'])
    .factory('jquery_ui', function($http, config) {
        return  {
            setUp : function($scope) {
                if ( $scope.meta.jqueryUi ){
                    var jqObj = JSON.parse($scope.meta.jqueryUi);

                    if ( _(jqObj).has('sortable')) {
                        $scope.sortable = 'sortable';
                    }
                }
            },
            mkSortable : function( $scope, cb, sortItem) { 
                var jqObj = JSON.parse($scope.meta.jqueryUi);

                if (_.isUndefined(sortItem) ) {
                    sortItem = '.sort-item';
                }

                var params = {
                    'tolerance' : 'pointer',
                    'helper'    : 'clone',
                    //'containment' : 'parent',
                    'cursor'    : 'move',
                    'distance'  : 1,
                    'cursorAt'  : { left: 5},
                    'update'    : function(evt, obj) { 
                        if (_.isFunction(cb)) {
                            cb($(evt.target).find(sortItem));
                        }
                    }
                };

                if (!_.isEmpty(jqObj.sortable)) {
                    params = _.extend(params, {"connectWith" : jqObj.sortable});
                }

                $('[key="' + $scope.meta.key + '"] .sortable').sortable(params);
            }
        }
    })
    .factory('gridDataSrv', function($http, config) {
        return  {
            prefix: 'GRID:',
            useLocal : true,

            parentKey : function(attrs) {
                var sp = attrs.key.split('/');
                sp.pop();
                sp.pop();
                
                var $return = _.clone(attrs);
                $return.key = UT.joins(sp, '/');
                return $return;
            }, 

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
