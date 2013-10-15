angular.module('app.relationScopes', [])
    .service('relScopes', ['lData','jquery_ui', function(lData, jquery_ui) {
        return {
            'oneToMany' : {
                'link' : {
                    'main' : function($scope) {
                        LG( ' here ' );
                        _.isUndefined($scope.meta.selected) ||
                            UT.wait($scope, 'list', function() {
                                $scope.$broadcast('initSelected',$scope.meta.selected); 
                            });

                        _.defer($scope.dataInit);
                    }, 
                    'row' : function($scope) {
                        $scope.$on('initSelected', function(evt, selected) {
                            if ( _.isEmpty(selected) ) {
                                // Simulate click on the first row for autoInit
                                if ($scope.id === _.keys($scope.list)[0]) {
                                    $scope.clk();
                                    $scope.$parent.$digest();
                                }
                            } else {
                                UT.wait($scope, 'id', function() {
                                    LG( ' got id' );
                                    if ($scope.list[$scope.id][$scope.meta.cols[0][0]] === selected) {
                                        $scope.clk();
                                        $scope.$parent.$digest();
                                    }
                                });
                            }
                        });
                    }
                },
                'controller' : {
                    'row': function($scope) {
                        var parentClk = $scope.clk;
                        $scope.clk = function() {
                            $scope.$parent.rowId = $scope.id;
                            $scope.attachAfterRow();
                            parentClk();
                        };
                    }
                }
            },
            'manyToOne' : {
                'link' : {
                    'main' : function($scope) {
                        $scope.saveRelData = function() {};
                        $scope.dataInit = function() {
                            $scope.loadData($scope.rowId);
                        };

                        $scope.$watch('rowId', function() {
                            if (!_.isEmpty($scope.rowId)) {
                                $scope.dataInit();
                            }
                        });
                    }
                },
                'controller' : {
                    'main' : function($scope) {
                        var parentSave = $scope.save;
                        $scope.save = function(row, id) {
                            row.pid = $scope.rowId;
                            parentSave(row,id);
                        }
                    },
                    'row': function($scope) {
                        var parentClk = $scope.clk;
                        $scope.clk = function() {
                            $scope.$parent.id = $scope.id;
                            parentClk();
                        };
                    }
                }
            },
            'manyToOneOut' : {
                'link' : {
                    'main' : function($scope) {
                        $scope.loadData = function() {};  // turn off default loadData

                        $scope.updateRefList = function() {
                            if (!_.isEmpty($scope.rowId) && !_.isUndefined($scope.parentList)) {
                                $scope.list = {};
                                $scope.list[$scope.parentId] =  $scope.parentList[$scope.parentId];
                            }
                        };

                        $scope.$watch('parentId', $scope.updateRefList);
                    }
                },
                'controller' : {}
            },
            'oneToSelect' : {
                'link' : {
                    'main' : function($scope, $element) {
                        $scope.saveRelData = function() {
                            _.isEmpty($scope.relData[$scope.rowId]) && 
                                ($scope.relData[$scope.rowId] = {});

                            lData.save($scope.relDataKey, $scope.relData, $scope.rowId);
                        };

                        $scope.listFilter = function(list) {
                            if (_.isUndefined($scope.relData) || _.isEmpty($scope.rowId)) {
                                return list;
                            } else {
                                if (_.isUndefined($scope.relData[$scope.rowId])) return list;
                            }
                            return _(list).omit(_($scope.relData[$scope.rowId]).keys());
                        };

                        $scope.relDataKey = $scope.expose('meta').key + '/' + $scope.meta.key;

                        lData.getData($scope.relDataKey, function(relData) {
                            $scope.relData    = _.isEmpty(relData) ? {} : relData;
                        });

                        $scope.dataInit();
                            
                        UT.wait($scope, 'list', function() { 
                            jquery_ui.init($element, {"sortable" : $scope.handleSort}); 
                        });
                    },
                    'row': function($scope) {
                        $scope.buttonsOnOff('edit,del,add,out', 'save,sub,close');
                        $scope.$watch('id', function() { $scope.$parent.id = $scope.id;} );
                    }
                },
                'controller' : {
                    'main' : function($scope, $element) {
                        var parentSave = $scope.save;
                        $scope.save = function(row, id) {
                            parentSave(row, id);
                        };

                        $scope.remove = function(id) {
                            delete $scope.relData[$scope.rowId][id];
                            $scope.saveRelData();
                        };
                    },
                    'row': function($scope, $element) {
                        function add(){ // We are adding on click in this one
                            if ( $scope.rowClass.indexOf('editable') === -1 ) {
                                /// TODO see if contains does anything here
                                if (!_.contains($scope.relData[$scope.rowId], $scope.id)) {
                                    var relData = $scope.relData[$scope.rowId];

                                    _.isUndefined(relData) && 
                                        ($scope.relData[$scope.rowId] = relData = {});

                                    var maxId = 0;
                                    // Get max id of all related items 
                                    for (var i in relData) {
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
                            }
                        };

                        function updateRelData() {
                            if ( $scope.relData ) {
                                for (var i in $scope.relData ) {
                                    if (!_.has($scope.relData[i], $scope.id))
                                        $scope.relData[i] = _($scope.relData[i]).omit($scope.id);
                                }
                            }
                        };

                        $scope.dblClk = function() { add(); }
                        $scope.out    = function() {  add();}

                        var parentDel = $scope.del;
                        $scope.del = function() {
                            // TODO add sorting 'ord' for relData
                            updateRelData();
                            $scope.saveRelData();
                            $scope.$parent.$broadcast('relDataChanged'); // update rel pane
                            parentDel();
                        };
                        
                        var parentSave = $scope.save;
                        $scope.save = function() {
                            updateRelData();
                            parentSave();
                            $scope.$parent.$broadcast('relDataChanged'); // update rel pane
                        };
                        $scope.clk = function() {
                            var detailScope = angular.element('detail').show().data().$scope;

                            detailScope.url     = $scope.workRow.right;
                            detailScope.caption = $scope.workRow.left;
                        };
                    }
                }
            },
            'oneToSelectOut' : {
                'link' : {
                    'main' : function($scope, $element) {
                        $scope.updateRefList = function() {
                            $scope.list = {};
                            if (!_.isEmpty($scope.rowId)) { 
                                var relData = $scope.expose('relData')[$scope.rowId];
                                if (!_.isUndefined(relData) && !_.isEmpty(relData)) {
                                    var list = {};
                                    for (var i in relData) {
                                        list[relData[i].ord] = $scope.parentList[i];
                                        if (_.isUndefined(list[relData[i].ord])) {
                                            delete relData[i]; // SAFETY orphaned relation
                                        } else {
                                            list[relData[i].ord].id = i;
                                        }
                                    }
                                    _.defer(function() { $scope.list = list; $scope.$digest(); });
                                } else {
                                    relData = {};
                                }
                            }
                            return $scope;
                        };

                        $scope.loadData = function() {}; // parent will handle relational data

                        $scope.$on('relDataChanged', $scope.updateRefList);
                        $scope.$watch('rowId',       $scope.updateRefList);

                        $scope.handleSort = function(evt, obj, sorted) {
                            var relData = $scope.expose('relData');

                            _.isUndefined(relData[$scope.rowId]) && (relData[$scope.rowId] = {});

                            var relRow = relData[$scope.rowId];
                            for (var i=0; i<sorted.length; i++) {
                                _.isUndefined(relRow[sorted[i]]) && (relRow[sorted[i]] = {});
                                relRow[sorted[i]].ord = i;
                            }

                            $scope.updateRefList().expose('saveRelData')();
                        };

                        UT.wait($scope, 'list', function() {
                            jquery_ui.init($element, {"sortable" : $scope.handleSort}); 
                            TM($scope.meta.key);
                        });
                    },
                    'row': function($scope, $element) {
                        $scope.buttonsOnOff('remove', '');
                    }
                },
                'controller' : {
                    'row': function($scope, $element) {
                        $scope.remove = function() { // Remove related item
                            $scope.expose('remove')($scope.list[$scope.id].id);
                            $scope.updateRefList();
                        };
                        $scope.clk = function() {
                            var detailScope = angular.element('detail').show().data().$scope;

                            detailScope.show({
                                'url'     : $scope.workRow.right,
                                'caption' : $scope.workRow.left
                            });
                        }
                    }
                }
            },
            'null' : {
                'link' : {
                    'main' : function($scope, $element) {
                    },
                    'row': function($scope, $element) {
                    }
                },
                'controller' : {
                    'main' : function($scope, $element) {
                    },
                    'row': function($scope, $element) {
                    }
                }
            }
        }
    }])
;
