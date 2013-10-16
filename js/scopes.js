angular.module('app.scopes', ['app.relationScopes'])
    /*
     *          LINKERS
    */
    .service('linkers', ['lData', 'relScopes', 'jquery_ui', function(lData, relScopes, jquery_ui) {
        return {
            'set' : function(type, $scope, $element) {
                this[type]($scope, $element);
                var relObj = relScopes[$scope.meta.rel];

                !_.isUndefined(relObj) && _.isFunction(relObj.link[type]) &&
                    relObj.link[type]($scope, $element);
            },
            // Main grid scope LINK
            'main' : function($scope, $element) {
                $scope.sortable = _.isUndefined($scope.meta.jqSortable) ? false : 'sortable';
                $scope.expose   = function(arg) { return $scope.exposer({"data" : arg}) };

                $scope.lastRowScope = null;

                $scope.setList = function() { $scope.list = angular.copy($scope.listW); };

                $scope.getData = function(data) {
                    $scope.listW = angular.copy(data); 
                    $scope.setList();
                };

                $scope.loadData = function(pid) { 
                    _.defer( function() { // wait for other relations to load
                        _.isUndefined($scope.meta.key) || lData.getData($scope.meta.key, $scope.getData, pid);
                    });
                };

                $scope.dataInit = function() { $scope.loadData(); };

                $scope.handleSort = function() {
                    LGW( 'Presistent sorting not implemented for this relation');
                };

                UT.wait($scope, 'list', function() {
                    jquery_ui.init($element, {"sortable" : $scope.handleSort}); 
                    TM($scope.meta.key);
                });
            },
            'row' : function($scope, $element) {
                $scope.rowClass  = '';
                $scope.buttons = {};
                $scope.buttonsOnOff = function (on, off) {
                    _(on.split(',')).each(function(v,k)  { $scope.buttons[v] = true; });
                    _(off.split(',')).each(function(v,k)  { $scope.buttons[v] = false; });
                };

                $scope.buttonsOnOff('edit,del', 'add,save,sub,close');

                $scope.attachAfterRow = function() {
                    $element.parent().after($scope.meta.element.find('inline').detach());
                };

                $scope.rowEmpty = function() {
                    var $return = false;
                    if (_.isUndefined($scope.meta.cols)) return $return;

                    if (!_.isUndefined($scope.row) ) {
                        for (var i=0; i<$scope.meta.cols.length; i++ ) {
                            $return |= $scope.row[$scope.meta.cols[i][0]] !== '';
                        }
                    }
                    return !$return;
                }

                if ($scope.rowEmpty()) {
                    $scope.rowClass = 'editable'; 
                    $scope.buttonsOnOff('close','edit');
                }

                // Setup a shadow data row to keep local changes for comparisons and saving
                $scope.workRow = angular.copy($scope.row);
            } 
        };
    }])
    /*
     *
     *          CONTROLLERS
     *
    */
    .service('controllers', ['lData', 'relScopes',
        function(lData, relScopes) {
            'use strict';
            return {
                'set' : function(type, $scope, $element) {
                    this[type]($scope);
                    var relObj = relScopes[$scope.meta.rel];

                    !_.isUndefined(relObj) && _.isFunction(relObj.controller[type]) &&
                        relObj.controller[type]($scope, $element);
                },
                'head' : function($scope) {
                        $scope.loadButton = false;

                        $scope.toggleContent = function() {
                            $scope.hideContent = $scope.hideContent ? false : 'hidden';
                        };

                        $scope.reload = function() {
                            $scope.list  = UT.dobuleCopy($scope.list, $scope.listW);
                            $scope.notify('rel', 'success', _.isEmpty($scope.list) ? ' (empty)' : '');
                            if ($scope.hideContent) { 
                                $scope.toggleTable();
                            }
                        };
                },
                'main' : function($scope) {
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
                            var result = lData.save($scope.meta.key, $scope.list, id);
                            _.isFunction($scope.notify) && $scope.notify('sav', result);

                            $scope.meta.autoAdd && $scope.add();  //autoAdd
                        };

                        $scope.del = function(id)  { 
                            var firstField = _($scope.list[id]).values().pop();
                            delete $scope.list[id];

                            var result = lData.save($scope.meta.key, $scope.list, id); 
                            _.isFunction($scope.notify) && 
                                $scope.notify('del', result, ' <b>"' + firstField + '"</b>');
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

                },
                'row' : function($scope) {
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

                        $scope.chg = function() {
                            $scope.rowClass = 'editable' + (isDirty() ? ' dirty' : '');   
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

                        $scope.sel = function() {
                            $scope.rowClass = 'selected' + (isDirty() ? ' dirty' : '');   
                        };

                        $scope.clk = function() {
                            $scope.closeLastRow($scope) && $scope.sel();
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
                            if ($scope.rowEmpty()) {
                                $scope.$parent.list = _($scope.list).omit($scope.id);
                            } else {
                                $scope.workRow = _.clone($scope.row);
                            }
                            $scope.blr();
                        };
                    }
            };
        }
    ])
;
