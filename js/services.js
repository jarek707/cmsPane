angular.module('app.services', ['app.gridConf'])
    .factory('jquery_ui', function($http, config) {
        return  {
            mkSortable : function( $scope, relData ) { 
                $scope.sortable = 'sortable';

                $('[key="' + $scope.meta.key + '"] .sortable').sortable();
                $('[key="' + $scope.meta.key + '"] .sortable').on('sortupdate' , function(evt, obj) { 
                    var items =  $(evt.target).find('.sort-item');

                    for (var i=0; i<items.length; i++) {
                    LG( items[i] );
                        relData[$(items[i]).attr('ord-id')].ord = i;
                    }

                    $scope.expose({data:'updateRelData'})();
                });
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
