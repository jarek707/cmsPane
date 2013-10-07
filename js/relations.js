angular.module('app.relations', ['app.gridConf'])
    /*
     *
     *          LINKERS
     *
    */
    .service('linkers', ['$http', 'config', '$compile', 'lData','jquery_ui',
        function($http, config, $compile, lData, jquery_ui) {
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
                    'm-a' : function( $scope, $element) {
                        $scope.saveRelData = function() {
                            $scope.relDataKey = $scope.expose({data: 'meta'}).key + 
                                                '/' + $scope.rowId + '/' + $scope.meta.key;

                            lData.save($scope.relDataKey, $scope.relData, $scope.rowId);
                        };
                    },
                    'm-p-out'  :function($scope, $element) {
                        $scope.updateList = function() {
                            $scope.list = {};
                            if (!_.isEmpty($scope.rowId)) { 
                                var relData = $scope.expose({data:'relData'})[$scope.rowId];
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
                                    setTimeout(function() { $scope.list = list; $scope.$digest(); }, 0);
                                } else {
                                    relData = {};
                                }
                            }
                        };

                        $scope.setData = function() {
                        };

                        $scope.$on('relDataChanged', $scope.updateList);
                        $scope.$watch('rowId',       $scope.updateList);

                        $scope.handleSort = function(evt) {
                            var items = $(evt.target).find('.row');
                            var relData = $scope.expose({data:'relData'})[$scope.rowId];

                            for (var i=0; i<items.length; i++) {
                                relData[$(items[i]).attr('ord-id')].ord = i;
                            }
                            $scope.expose({data: 'saveRelData'})();
                        };

                        var stopWatching= $scope.$watch('list', function() {
                            setTimeout( function() {
                                jquery_ui.mkSortable($scope, $element, $scope.handleSort); 
                            }, 800); // let's be generous
                            stopWatching(); // turns off this $scope.$watch
                        });
                    },
                    'm-p'  :function($scope, $element) {
                        $scope.saveRelData = function() {
                            _.isEmpty($scope.relData[$scope.rowId]) && ($scope.relData[$scope.rowId] = {});

                            lData.save($scope.relDataKey, $scope.relData, $scope.rowId);
                        };

                        $scope.listFilter = function(list) {
                            if (_.isUndefined($scope.relData) || _.isEmpty($scope.rowId)) {
                                return list;
                             } else {
                                if (_.isUndefined($scope.relData[$scope.rowId])) return list;
                             }
                            return $ret = _(list).omit(_($scope.relData[$scope.rowId]).keys());
                        };

                        $scope.relDataKey = $scope.expose({data: 'meta'}).key + '/' + $scope.meta.key;

                        lData.getData($scope.relDataKey, function(relData) {
                            $scope.allRelData = _.isString(relData) ? json_parse(relData) : relData;
                            $scope.relData = _.isEmpty(relData) ? {} : relData;
                        });


                        var parentSetData = $scope.setData;
                        $scope.setData = function(data) {
                            parentSetData(data);
                            $scope.fullList = angular.copy($scope.list);
                        }
                            
                        setTimeout( function() { 
                            jquery_ui.mkSortable($scope, $element, $scope.handleSort); 
                        }, 800);
                    },
                    '1-m'  :function($scope, $element) {
                        if (!_.isUndefined($scope.meta.selected)) // autoInit - simulate click of the first data row
                            setTimeout( function() { 
                                $scope.$broadcast('init',$scope.meta.selected); 
                            }, 1000);
                    }
                },
                'row' : { // LINK
                    '1-m' : function($scope, $element) {
                    },
                    'm-p' : function($scope) {
                        $scope.buttonsOnOff('edit,del,add,out', 'save,sub,close');
                    },
                    'm-p-out' : function($scope) {
                        $scope.buttonsOnOff('remove', '');
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
    .service('controllers', ['$http', 'config', '$compile', 'lData', 
        function($http, config, $compile, lData) {
            'use strict';
            return {
                'set' : function(type, $scope, $element) {
                    this[type]['default']($scope);
                    this.defaultScope = _.clone($scope);
                    
                    _.isFunction(this[type][$scope.meta.rel]) && this[type][$scope.meta.rel]($scope, $element);
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
                    },
                    'm-p' : function($scope) {
                        var parentSave = $scope.save;
                        $scope.save = function(row, id) {
                            parentSave(row, id);
                        };

                        $scope.remove = function(id) {
                            delete $scope.relData[$scope.rowId][id];
                            $scope.saveRelData();
                        };
                    }
                },
                'row' : { // CONTROLLER
                    '1-m' : function($scope) {
                        $scope.$on('init', function(evt, data) {
                            // Simulate click on the first row for autoInit
                            if ( _.isEmpty(data) ) {
                                if ($scope.id === _.keys($scope.list)[0]) {
                                    $scope.clk();
                                    $scope.$parent.$digest();
                                }
                            } else {
                                if ( !_.isUndefined($scope.id)) 
                                    if ( $scope.list[$scope.id][$scope.meta.cols[0][0]] === data ) {
                                        $scope.clk();
                                        $scope.$parent.$digest();
                                    }
                            }
                        });

                        var parentClk = $scope.clk;
                        $scope.clk = function() {
                            $scope.$parent.rowId = $scope.id;
                            $scope.attachAfterRow();
                            parentClk();
                        };

                    },
                    'm-p' : function($scope) {
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
                            angular.element('detail').html('').show();;
                            angular.element('detail').append(
                                '<div class="box">' +
                                '<input type="button" onclick="$(this).parent().html(\'\').hide();" style="position:relative; margin:12px 12px 0 12px; float:right;" value="close"></input>' +
                                '<div style="margin:12px 12px 0 12px;">' + $scope.workRow.left + '</div>' +
                                '<img src="' + $scope.workRow.right + '"></img>' +
                                '</div>'
                            );
                        };
                    },
                    'm-p-out' : function($scope, $element) {
                        $scope.remove = function() { // Remove related item
                            $scope.expose({data : 'remove'})($scope.list[$scope.id].id);
                            $scope.updateList();
                        };
                        $scope.clk = function() {
                            angular.element('detail').html('').show();
                            angular.element('detail').append(
                                '<div class="box">' +
                                '<input type="button" onclick="$(this).parent().html(\'\').hide();" style="position:relative; margin:12px 12px 0 12px; float:right;" value="close"></input>' +
                                '<div style="margin:12px 12px 0 12px;">' + $scope.workRow.left + '</div>' +
                                '<img src="' + $scope.workRow.right + '"></img>' +
                                '</div>'
                            );
                        }
                    }
                }
            };
        }
    ])
;
