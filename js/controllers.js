angular.module('app.directiveScopes', ['app.gridConf'])
    /*
     *
     *          LINKERS
     *
    */
    .service('linkers', ['$http', 'config', '$compile', 'gridDataSrv','jquery_ui',
        function($http, config, $compile, gridDataSrv, jquery_ui) {
            'use strict';

            return {
                'set' : function(type, $scope, $element) {
                    this[type]['default']($scope, $element);
                    var rel = $scope.meta.rel;
                    
                    if (!_.isUndefined(rel) && _.isFunction(this[type][rel])) {
                        this[type][rel]($scope, $element);
                    }
                },
                // Main grid scope LINK
                'main' : {
                    '1-m'  :function($scope) {
                    },
                    'm-p'  :function($scope, $element) {
                        $scope.relDataKey = $scope.expose({data: 'meta'}).key + '/' + $scope.meta.key;
                        
                        $scope.saveRelData = function() {
                            gridDataSrv.save($scope.relDataKey, $scope.relData);
                        };

                        gridDataSrv.getData($scope.relDataKey, function(data) {
                            $scope.relData = _.isEmpty(data) ? {} : data;
                        });
                    },
                    'm-p-m'  :function($scope, $element) {
                        var saveRelData = $scope.expose({data:'saveRelData'});

                        $scope.updateList = function() {
                            if ($scope.rowId) {
                                $scope.list = {};
                                var relData = $scope.expose({data:'relData'})[$scope.rowId];

                                if (!_.isUndefined(relData)) {
                                    for (var i in relData) {
                                        $scope.list[relData[i].ord] = $scope.parentList[i];
                                        $scope.list[relData[i].ord].id = i;
                                    }
                                }

                                jquery_ui.mkSortable($scope, $element, function(evt) {
                                    var items = $(evt.target).find('.row');

                                    for (var i=0; i<items.length; i++) {
                                        relData[$(items[i]).attr('ord-id')].ord = i;
                                    }
                                    saveRelData();
                                });

                                saveRelData();
                            }
                        };

                        $scope.$on('relDataChanged', function() { $scope.updateList(); });
                        $scope.$watch('rowId',       function() { $scope.updateList(); });
                    },
                    'default' : function($scope, $element) {
                        jquery_ui.setUp($scope);

                        $scope.lastRowScope = null;
                        $scope.relScope     = null;

                        if (!_.isUndefined($scope.meta.key)) {
                            gridDataSrv.getData($scope.meta.key, function(data) {
                                $scope.list  = data;
                                $scope.listW = angular.copy(data);
                                setTimeout( function() { 
                                    jquery_ui.mkSortable($scope, $element, $scope.handleSort); 
                                }, 300);
                            });
                        }

                        $scope.handleSort = function() {
                            LGW( 'Presistent sorting not implemented for this relation');
                        }
                        
                        // Append child pane after the table
                        $scope.after = function(html, rowScope) {
                            // IE8 needs this
                            if ($element.find('table').parent().children().length > 2) {
                                $element.find('table').next().remove();
                            }

                            var compiled = $compile(html)(rowScope);
                            $element.find('table').after( compiled );
                        };
                    }
                },
                'row' : { // LINK
                    '1-m' : function($scope, $element) {
                        $scope.attachAfterRow = function() {
                            $element.parent().after($scope.compiled);
                        }
                    },
                    'm-p' : function($scope) {
                    },
                    'm-p-m' : function($scope) {
                        $scope.buttonsOnOff('close', 'add,save,sub,del,save,edit');
                    },
                    'default' : function($scope, $element) {
                        $scope.buttons = {};
                        $scope.buttonsOnOff = function (on, off) {
                            _(on.split(',')).each(function(v,k)  { $scope.buttons[v] = true; });
                            _(off.split(',')).each(function(v,k)  { $scope.buttons[v] = false; });
                        };

                        $scope.buttonsOnOff('edit,del', 'add,save,sub,close');
                        $scope.rowClass  = '';

                        var joinVals = false;
                        for (var i=0; i<$scope.meta.cols.length; i++ ) {
                            joinVals |= $scope.row[$scope.meta.cols[i][0]] !== '';
                        }

                        if (joinVals) {
                            $scope.rowClass = false; 
                        } else {
                            $scope.rowClass = 'editable'; 
                        }

                        // Setup a shadow data row to keep local changes for comparisons and saving
                        $scope.workRow = angular.copy($scope.row);
                    }
                } 

            };
        }
    ])
    /*
     *
     *          CONTROLLERS
     *
    */
    .service('controllers', ['$http', 'config', '$compile', 'gridDataSrv', 
        function($http, config, $compile, gridDataSrv) {
            'use strict';
            return {
                'set' : function(type, $scope) {
                    this[type]['default']($scope);
                    
                    if (!_.isUndefined($scope.meta.rel) && _.isFunction(this[type][$scope.meta.rel])) {
                        this[type][$scope.meta.rel]($scope);
                    }
                },
                'head' : {
                    'default' : function($scope) {
                        $scope.showContent = function() {
                            $scope.hideContent = $scope.hideContent ? false : 'hidden';
                        };

                        $scope.reload = function() {
                            $scope.list  = UT.dobuleCopy($scope.list, $scope.listW);
                            $scope.notify('rel', 'success', _.isEmpty($scope.list) ? ' (empty)' : '');
                            if ($scope.hideContent) { 
                                $scope.toggleTable();
                            }
                        };
                    }
                },
                'main' : { // CONTROLLER
                    'default' : function($scope) {
                        // Turns off selected/edittable in the last row, stores currently clicked row
                        // Returns : true  - different row was clicked
                        //           false - same row was clicked (or double clicked)
                        $scope.closeLastRow = function(rowScope) {
                            var $return = true;

                            if ($scope.lastRowScope === false) { //New row was added
                                $return = false;
                            } else {
                                if ($scope.lastRowScope !== null) { // Not the first row click
                                    if ($scope.lastRowScope.$id !== rowScope.$id) {
                                        $scope.lastRowScope.blr();
                                    } else {
                                        $return = false;
                                    }
                                }
                            }

                            $scope.lastRowScope = rowScope;
                            return $return;
                        };

                        // Row data methods BEGIN

                        $scope.save = function(row, id) {
                            $scope.list[id] = _.clone(row);
                            $scope.notify('sav', gridDataSrv.save($scope.meta.key, $scope.list, id));

                            if ($scope.meta.autoAdd) { //autoAdd
                                $scope.add();
                            }
                        };

                        $scope.del = function(id)  { 
                            var firstField = _($scope.list[id]).values().pop();
                            delete $scope.list[id];
                            $scope.notify(  'del', 
                                            gridDataSrv.save($scope.meta.key, $scope.list), 
                                            ' <b>"' + firstField + '"</b>'
                                         );
                        };

                        $scope.add = function() {
                            var newIdx = UT.minIntKey($scope.list, -1);

                            $scope.list[newIdx]  = {};
                            $scope.listW[newIdx] = {};
                            for (var i=0; i<$scope.meta.cols.length; i++ ) {
                                $scope.list[newIdx][$scope.meta.cols[i][0]]  = '';
                                $scope.listW[newIdx][$scope.meta.cols[i][0]] = '';
                            }

                            $scope.closeLastRow(false);
                            $scope.hideContent = false;
                        };
                        // Row data methods END

                        // Sub panes BEGIN
                        $scope.openSub = function(rowData) {
                            $scope.hideContent  = $scope.meta.autoHide;
                            $scope.rowContent = '{' + rowData + '}';
                        };

                        $scope.subPane = function(rowScope, workRow) {
                            _(config.getChildren($scope.meta.key)).each( function(v, childKey) { 
                                $scope.after(
                                    '<div grid key="' + $scope.meta.key + '/' + rowScope.id + '/' + childKey + '" ' +
                                    'expose="exposing(data)" parentList="list" ></div>', rowScope
                                );
                            });
                            $scope.openSub(workRow);
                        };

                        $scope.edit = function(rowScope, rowText) {
                            $scope.closeLastRow(rowScope);
                            $scope.after(
                                '<div edit key="' + $scope.meta.key + '/' + rowScope.id + '/"></div>', rowScope
                            );
                            $scope.openSub(rowText);
                        };
                        // Sub panes END
                    }
                },
                'row' : { // CONTROLLER
                    '1-m' : function($scope) {
                        var parentClk = $scope.clk;
                        $scope.clk = function(){
                            $scope.$parent.rowId = $scope.id;
                            parentClk();
                            if ($scope.meta.relContainer === 'inline') {
                                $scope.attachAfterRow();
                            }
                        };
                    },
                    'm-p' : function($scope) {
                        $scope.clk = function(){ // We are adding on click in this one
                            /// TODO see if contains does anything here
                            if (!_.contains($scope.relData[$scope.rowId], $scope.id)) {
                                var relData = $scope.relData[$scope.rowId];

                                if ( _.isUndefined(relData)) {
                                    $scope.relData[$scope.rowId] = relData = {};
                                }

                                var maxId = 0;
                                // Get max id of all related items 
                                for ( var i in relData) {
                                    if (relData[i].ord >= maxId ) {
                                       maxId = parseInt(relData[i].ord) + 1;
                                    }
                                }

                                if (_.isUndefined(relData[$scope.id])) {
                                    $scope.relData[$scope.rowId][$scope.id] = ({'ord' : maxId});
                                }
                            }

                            $scope.saveRelData();
                            $scope.$parent.$broadcast('relDataChanged'); // update rel pane
                        };

                        var parentDel = $scope.del;
                        $scope.del = function() {
                            // TODO add sorting 'ord' for relData
                            if ( $scope.relData ) {
                                for (var i in $scope.relData ) {
                                    if (!_.has($scope.relData[i], $scope.id))
                                        $scope.relData[i] = _($scope.relData[i]).omit($scope.id);
                                }
                            }

                            $scope.saveRelData();
                            $scope.$parent.$broadcast('relDataChanged'); // update rel pane
                            parentDel();
                        };
                    },
                    'm-p-m' : function($scope) {
                        $scope.close = function() { // Remove related item
                            delete $scope.expose({data:'relData'})[$scope.rowId][$scope.list[$scope.id].id];
                            $scope.updateList();
                        };
                    },
                    'default' : function($scope) {
                        function isDirty() { 
                            return ($scope.buttons.save = $scope.dirty = !_($scope.row).isEqual($scope.workRow));
                        }

                        function rowDataLabel() { 
                            return UT.join(_($scope.workRow).filter( function(v,k) {
                                if (!_.isUndefined($scope.meta.tab[k])) {
                                    return $scope.meta.tab[k].type === 'T' ? v : false;
                                }
                            }));
                        }

                        $scope.getElementClass = function(i) {
                            return $scope.meta.tab[i].type === 'T' ? '' : 'notext';
                        };

                        $scope.chg = function() {
                            $scope.rowClass = 'editable' + (isDirty() ? ' dirty' : '');   

                        };

                        $scope.sel = function() {
                            $scope.rowClass = 'selected' + (isDirty() ? ' dirty' : '');   
                        };

                        $scope.blr = function() { 
                            if ( $scope.rowClass ) {
                                $scope.rowClass = $scope.rowClass.replace('editable','')
                                                                 .replace('selected','');
                            } else {
                                $scope.rowClass = '';
                            }

                            $scope.buttonsOnOff('edit','save,close');
                        };
                        
                        $scope.editRow = function() { // Usually on ng-Dblclick
                           $scope.closeLastRow($scope);
                           $scope.chg();
                        };

                        $scope.defaultClk = function(idx) {
                        };

                        $scope.clk = function(idx) {
                            if ($scope.closeLastRow($scope)) {
                                $scope.sel();
                            }
                        };

                        $scope.save = function() {
                            $scope.$parent.save($scope.workRow, $scope.id);
                            $scope.rowClass = '';
                            $scope.buttonsOnOff('edit','close,save');
                        };

                        $scope.del = function() {
                            $scope.$parent.del($scope.id);
                        };

                        $scope.subPane = function() {
                            $scope.$parent.subPane($scope, rowDataLabel());
                        };

                        $scope.edit = function() {
                            $scope.chg();
                            $scope.closeLastRow($scope);
                            $scope.buttonsOnOff('close','edit');
                        };

                        $scope.close = function() {
                            $scope.workRow = _.clone($scope.row);
                            $scope.blr();
                        };
                    }
                }
            };
        }
    ])
;
