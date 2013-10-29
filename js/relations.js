angular.module('app.relationScopes', [])
.service('relData', ['lData',function(lData) {
    this.init = function($scope) {
        this.scope = $scope;

        this.load = function() {
            lData.getData($scope.relDataKey, function(relData) {
                $scope.relData    = _.isEmpty(relData) ? {} : relData;
            });
        };

        this.save = function() {
            _.isEmpty($scope.relData[$scope.rowId]) && 
                ($scope.relData[$scope.rowId] = {});

            lData.save($scope.relDataKey, $scope.relData, $scope.rowId);
        };

        this.sort = function() {
        };

        this.del = function() {
        };

        this.add = function() {
            if ( $scope.rowClass.indexOf('editable') === -1 ) {
                /// TODO see if contains does anything here
                if (!_.contains($scope.relData[$scope.rowId], $scope.id)) {
                    var relData = $scope.relData[$scope.rowId];

                    _.isUndefined(relData) && 
                        ($scope.relData[$scope.rowId] = relData = {});

                    // Get max id of all related items 
                    var maxId = 0;
                    for (var i in relData) {
                        relData[i].ord >= maxId && (maxId = parseInt(relData[i].ord) + 1);
                    }

                    if (_.isUndefined(relData[$scope.id])) {
                        $scope.relData[$scope.rowId][$scope.id] = ({'ord' : maxId});
                    }
               }

               $scope.saveRelData();
               $scope.$parent.$broadcast('relDataChanged'); // update rel pane
           }
        };
    };
}])
.service('relScopes', ['lData', 'relData', function(lData, relData) {
    return {
        'oneToMany' : function($scope, $element, dest, type) {
            this.link = {
                'main' : function() {
                    _.defer($scope.dataInit);
                }, 
                'row' : function() {
                    var selected = $scope.meta.selected;

                    _.isUndefined(selected) || UT.wait($scope, 'id', function() {
                        if (_.isEmpty(selected)) {
                            $scope.id == _.keys($scope.list)[0] && $scope.clk(true);
                        } else {
                            $scope.list[$scope.id][$scope.meta.cols[0][0]] === selected && $scope.clk(true);
                        }
                    });
                }
            };
            this.controller = {
                'row' : function() {
                    var parentClk = $scope.clk;
                    $scope.clk = function(doDigest) {
                        $scope.$parent.rowId = $scope.id;
                        $scope.attachAfterRow();
                        parentClk();

                        doDigest && $scope.$parent.$digest();
                    };
                }
            };

            _.isUndefined(this[dest]) || !_.isFunction(this[dest][type]) || this[dest][type]();
        },
        'manyToOne' : function($scope, $element, dest, type) {
            this.link = {
                'main' : function() {
                    $scope.saveRelData = function() {};
                    $scope.dataInit = function() {
                        $scope.loadData($scope.rowId);
                    };

                    $scope.$watch('rowId', function() { _.isEmpty($scope.rowId) || $scope.dataInit(); });
                }, 
                'row' : function() {
                    UT.wait($scope, 'id', function() {
                        if ($scope.id == _.keys($scope.list).shift()) {
                            $scope.clk();
                            $scope.$parent.$digest();
                        }
                    });
                }
            };
            this.controller = {
                'main' : function() {
                    var parentSave = $scope.save;
                    $scope.save = function(row, id) {
                        row.pid = $scope.rowId;
                        parentSave(row,id);
                    }
                }
            };
            _.isUndefined(this[dest]) || !_.isFunction(this[dest][type]) || this[dest][type]();
        },
        'manyToOneOut' : function($scope, $element, dest, type) {
            this.link = {
                'main' : function() {
                    $scope.loadData = function() {};  // turn off default loadData

                    $scope.updateRefList = function() {
                        if (!_.isEmpty($scope.rowId) && !_.isUndefined($scope.parentList)) {
                            $scope.list = {};
                            $scope.list[$scope.parentId] =  $scope.parentList[$scope.parentId];
                        }
                    };

                    $scope.$watch('parentId', $scope.updateRefList);
                }
            };
            _.isUndefined(this[dest]) || !_.isFunction(this[dest][type]) || this[dest][type]();
        },
        'oneToSelect' : function($scope, $element, dest, type){
            var relD = new relData.init($scope);
            this.link = {
                'main' : function() {
                    $scope.relDataKey = $scope.expose('meta').key + '/' + $scope.meta.key;
                    
                    $scope.saveRelData = function() { relD.save(); };

                    $scope.listFilter = function(list) {
                        if (_.isUndefined($scope.relData) || _.isEmpty($scope.rowId)) {
                            return list;
                        } else {
                            if (_.isUndefined($scope.relData[$scope.rowId])) return list;
                        }
                        return _(list).omit(_($scope.relData[$scope.rowId]).keys());
                    };

                    relD.load();
                    $scope.dataInit();
                },
                'row': function() {
                    $scope.buttonsOnOff('edit,del,add,out', 'save,sub,close');
                    $scope.$watch('id', function() { $scope.$parent.id = $scope.id;} );
                }
            };
            this.controller = {
                'main' : function() {
                    var parentSave = $scope.save;
                    $scope.save = function(row, id) {
                        parentSave(row, id);
                    };

                    $scope.remove = function(id) {
                        delete $scope.relData[$scope.rowId][id];
                        $scope.saveRelData();
                    };
                },
                'row': function() {
                    function add(){ // We are adding on click in this one
                        if ( $scope.rowClass.indexOf('editable') === -1 ) {
                            /// TODO see if contains does anything here
                            if (!_.contains($scope.relData[$scope.rowId], $scope.id)) {
                                var relData = $scope.relData[$scope.rowId];

                                _.isUndefined(relData) && 
                                    ($scope.relData[$scope.rowId] = relData = {});

                                // Get max id of all related items 
                                var maxId = 0;
                                for (var i in relData) {
                                    relData[i].ord >= maxId && (maxId = parseInt(relData[i].ord) + 1);
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
            };

            _.isUndefined(this[dest]) || !_.isFunction(this[dest][type]) || this[dest][type]();
        },
        'oneToSelectOut' : function($scope, $element, dest, type) {
            this.link = {
                'main' : function() {
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

                        $scope.updateRefList();
                        $scope.expose('saveRelData')();
                    };
                },
                'row': function() {
                    $scope.buttonsOnOff('remove', '');
                }
            };
            this.controller = {
                'row': function() {
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
            };

            _.isUndefined(this[dest]) || !_.isFunction(this[dest][type]) || this[dest][type]();
        },
        'relationTemplate' : function($scope, $element) {
            this.link = {
                'main' : function() {
                },
                'row': function() {
                }
            };
            this.controller = {
                'main' : function() {
                },
                'row': function() {
                }
            }
            _.isUndefined(this[dest]) || !_.isFunction(this[dest][type]) || this[dest][type]();
        }
    }
}]);
