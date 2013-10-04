angular.module('app.directiveScopes', ['app.gridConf'])
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
                        var saveRelData = $scope.expose({data:'saveRelData'});

                        $scope.updateList = function() {
                            if (!_.isEmpty($scope.rowId)) {
                                $scope.list = {};
                                var relData = $scope.expose({data:'relData'})[$scope.rowId];

                                if (!_.isUndefined(relData)) {
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
                                }

                                _.isEmpty(relData) && (relData = {} );
                                saveRelData();
                            }
                        };

                        $scope.$on('relDataChanged', $scope.updateList);
                        $scope.$watch('rowId',       $scope.updateList);
                        $scope.handleSort = function(evt) {
                            var items = $(evt.target).find('.row');
                            var relData = $scope.expose({data:'relData'})[$scope.rowId];

                            for (var i=0; i<items.length; i++) {
                                relData[$(items[i]).attr('ord-id')].ord = i;
                            }
                            saveRelData();
                        }
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
                            relData = _.isString(relData) ? json_parse(relData) : relData;
                            $scope.relData = _.isEmpty(relData) ? {} : relData;
                        });


                        var parentSetData = $scope.setData;
                        $scope.setData = function(data) {
                            parentSetData(data);
                            $scope.fullList = angular.copy($scope.list);
                        }
                    },
                    '1-m'  :function($scope, $element) {
                        if (!_.isUndefined($scope.meta.selected)) // autoInit - simulate click of the first data row
                            setTimeout( function() { $scope.$broadcast('init',$scope.meta.selected); },500);
                    },
                    'default' : function($scope, $element) {
                        jquery_ui.setUp($scope);

                        $scope.lastRowScope = null;
                        $scope.relScope     = null;

                        $scope.setData = function(data) {
                            $scope.list  = data;
                            $scope.listW = angular.copy(data);
                            setTimeout( function() { 
                                jquery_ui.mkSortable($scope, $element, $scope.handleSort); 
                            }, 300);
                        };

                        setTimeout( function() { // wait for other relations to load
                            _.isUndefined($scope.meta.key) || lData.getData($scope.meta.key, $scope.setData);
                        },0);

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
                    },
                    'm-p' : function($scope) {
                        $scope.buttonsOnOff('edit,del,add,out', 'save,sub,close');
                    },
                    'm-p-out' : function($scope) {
                        $scope.buttonsOnOff('remove', '');
                    },
                    'default' : function($scope, $element) {
                        $scope.attachAfterRow = function() {
                            var inEl = $element.parent().parent().parent().find('inline').show().detach();
                            $element.parent().after(inEl);
                        };

                        $scope.buttons = {};
                        $scope.buttonsOnOff = function (on, off) {
                            _(on.split(',')).each(function(v,k)  { $scope.buttons[v] = true; });
                            _(off.split(',')).each(function(v,k)  { $scope.buttons[v] = false; });
                        };

                        $scope.buttonsOnOff('edit,del', 'add,save,sub,close');
                        $scope.rowClass  = '';

                        var joinVals = false;
                        if (!_.isUndefined($scope.row) ) {
                            for (var i=0; i<$scope.meta.cols.length; i++ ) {
                                joinVals |= $scope.row[$scope.meta.cols[i][0]] !== '';
                            }
                        }

                        if (joinVals) {
                            $scope.rowClass = ''; 
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
    .service('controllers', ['$http', 'config', '$compile', 'lData', 
        function($http, config, $compile, lData) {
            'use strict';
            return {
                'defaultScope' : null,
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
                        }
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

                        $scope.dblClk = function(){ // We are adding on click in this one
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

                                //$scope.saveRelData();
                                $scope.$parent.$broadcast('relDataChanged'); // update rel pane
                            }
                        };

                        $scope.out = function() {
                            $scope.dblClk();
                        }

                        function updateRelData() {
                            if ( $scope.relData ) {
                                for (var i in $scope.relData ) {
                                    if (!_.has($scope.relData[i], $scope.id))
                                        $scope.relData[i] = _($scope.relData[i]).omit($scope.id);
                                }
                            }
                        };

                        var parentDel = $scope.del;
                        $scope.del = function() {
                            // TODO add sorting 'ord' for relData
                            updateRelData();

                            $scope.saveRelData();
                            updateRelData();
                            $scope.$parent.$broadcast('relDataChanged'); // update rel pane
                            parentDel();
                        };
                        
                        var parentSave = $scope.save;
                        $scope.save = function() {
                            parentSave();
                            updateRelData();
                            $scope.$parent.$broadcast('relDataChanged'); // update rel pane
                        };
                        $scope.clk = function() {
                            angular.element('detail').html('').show();;
                            angular.element('detail').append(
                                '<div class="box" style="width:99%">' +
                                '<input type="button" onclick="$(this).parent().html(\'\').hide();" style="position:relative; margin:12px 12px 0 12px; float:right;" value="close"></input>' +
                                '<div style="margin:12px 12px 0 12px;">' + $scope.workRow.left + '</div>' +
                                '<img src="' + $scope.workRow.right + '"></img>' +
                                '</div>'
                            );
                        }
                    },
                    'm-p-out' : function($scope, $element) {
                        $scope.remove = function() { // Remove related item
                            delete $scope.expose({data:'relData'})[$scope.rowId][$scope.list[$scope.id].id];
                            $scope.updateList();
                        };
                        $scope.clk = function() {
                            angular.element('detail').html('').show();
                            angular.element('detail').append(
                                '<div class="box" style="width:99%">' +
                                '<input type="button" onclick="$(this).parent().html(\'\').hide();" style="position:relative; margin:12px 12px 0 12px; float:right;" value="close"></input>' +
                                '<div style="margin:12px 12px 0 12px;">' + $scope.workRow.left + '</div>' +
                                '<img src="' + $scope.workRow.right + '"></img>' +
                                '</div>'
                            );
                        }
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

                        $scope.clk = function(idx, noAttach) {
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
