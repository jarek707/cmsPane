angular.module('app.directiveScopes', ['app.gridConf'])
    /*
     *
     *          LINKERS
     *
    */
    .service('linkers', ['$http', 'config', '$compile', 'gridDataSrv', 
        function($http, config, $compile, gridDataSrv) {


            return {
                'set' : function(type, $scope, $element) {
                    this[type]['default']($scope, $element);
                    
                    if (!_.isUndefined($scope.$attrs.rel) && _.isFunction(this[type][$scope.$attrs.rel])) {
                        if (_.isUndefined($scope.$attrs.child)) {
                            this[type][$scope.$attrs.rel]($scope, $element);
                        } else {
                            this[type][$scope.$attrs.rel + '_child']($scope, $element);
                        }
                    }
                },
                'head' :  {
                    'default' : function(el, attrs) {
                    }
                },
                'row' : {
                    'm1_child' : function($scope, $element) {
                        $($element).find('.delButton').removeClass('delButton')
                                                      .addClass('removeButton'); //JQ
                    },
                    'friend_child' : function($scope, $element) {
                        $($element).find('.delButton').removeClass('delButton')
                                                      .addClass('removeButton'); //JQ
                    },
                    'm1' : function($scope, $element) {
                        $scope.init =  function(force) { // click on the member list
                            // Execute only if row has changed
                            var html = 
                                "<div grid='singleLoop'"
                                    //+ " key='" + $scope.key + "/" + $scope.id + "/" + $scope.$parent.meta.relKey + "'"
                                    + " key='" + $scope.key + "'"
                                    + " child-container='" + $scope.$parent.meta.childContainer + "'"
                                    + " expose='exposing(data)'"
                                    + " parent-list='list' >"
                                    + " <div grid-head class='rowClass></div>"
                                    + " <!--ITERATE<div p-img></div>--></div>";
                                    //+ " <!--ITERATE<div td-text>--></div>";

                            $scope.after(html, $scope, $scope.$parent.meta.relKey);
                        }

                        //
                        $scope.after = function(html, rowScope, container) {
                            if (!rowScope) return;

                            var parentMeta = $scope.$parent.meta;
                            var container = (!_.isUndefined(container)) 
                                            ? container
                                            : parentMeta.childContainer;


                            // hide open rows before appending the new one
                            if (!parentMeta.autoClose)
                                if (container) {
                                    if ( $(container).children().length ) {
                                        $scope.relScope.list 
                                            = $scope.relScope.mkList(rowScope.lastRowScope);
                                        return;
                                    }
                                }
                                else
                                    $($element.parent().parent().parent()).find('.friend_child').remove();
                                    
                            if (rowScope) {
                                if (container) {
                                    $(container).append($compile(html)(rowScope));
                                } else {
                                    $element.parent().parent().after( 
                                        $compile('<li child>' + html +'</li>')(rowScope)
                                    );
                                }
                            }
                        }
                        $scope.init();
                    },
                    'friend' : function($scope, $element) {

                        $($element).find('.subButton').removeClass('subButton')
                                                      .addClass('addButton'); //JQ
                        //
                        $scope.after = function(html, rowScope) {
                            if (!rowScope) return;

                            var parentMeta = $scope.$parent.meta;

                            // hide open rows before appending the new one
                            if (!parentMeta.autoClose)
                                if (parentMeta.childContainer) {
                                    if ( $(parentMeta.childContainer).children().length ) {
                                        $scope.relScope.list 
                                            = $scope.relScope.mkList(rowScope.lastRowScope);
                                        return;
                                    }
                                }
                                else
                                    $($element.parent().parent().parent()).find('.friend_child').remove();
                                    
                            if (rowScope) {
                                if (parentMeta.childContainer) {
                                    $(parentMeta.childContainer).append($compile(html)(rowScope));
                                } else {
                                    $element.parent().parent().after( 
                                        $compile('<li child>' + html +'</li>')(rowScope)
                                    );
                                }
                            }
                        }
                    },
                    'default' : function($scope) {
                        if ( !_.isUndefined($scope.$parent.meta) )
                            $scope.meta = $scope.$parent.meta.columns;

                        $scope.metaType = 'tab';
                        $scope.rowClass  = '';

                        if (_.some($scope.row)) {
                            $scope.rowClass = false; 
                        } else {
                            $scope.rowClass = 'editable'; 
                        }

                        // Setup a shadow data row to keep local changes for comparisons and saving
                        $scope.workRow = angular.copy($scope.row);
                    }
                }, 

                // Main grid scope
                'main' : {
                    'm1_child' : function($scope) {
                        $scope.mkList = function(memberScope) {
                            var $return = {};
                            var data    = memberScope.relationData[memberScope.id];

                            for (var i in data) {
                                if (_.isUndefined($return[data[i]])) 
                                    $return[data[i]] = [];

                                $return[data[i]] = memberScope.childList[data[i]];
                            }
                            return $return;
                        }

                        $scope.$parent.relScope = $scope;
                        $scope.id   = $scope.key.split('/')[1];

                        if ( $scope.$parent.lastRowScope ) 
                            $scope.list = $scope.mkList($scope.$parent.lastRowScope);
                        else
                            $scope.list = $scope.$parent.childList;
                    },
                    'friend_child' : function($scope) {
                        $scope.mkList = function(memberScope) {
                            var $return = {};
                            var data    = memberScope.relationData[memberScope.id];

                            for (var i in data) {
                                if (_.isUndefined($return[data[i]])) 
                                    $return[data[i]] = [];

                                $return[data[i]] = memberScope.list[data[i]];
                            }
                            return $return;
                        }

                        $scope.$parent.relScope = $scope;
                        $scope.id   = $scope.key.split('/')[1];

                        $scope.list = $scope.mkList($scope.$parent.lastRowScope);
                    },
                    'm1' : function($scope) {
                        $scope.relationData = gridDataSrv.getData($scope.key + '/' + $scope.meta.relKey);
                        $scope.childList    = gridDataSrv.getData($scope.meta.relKey);
                    },
                    'friend' : function($scope) {
                        $scope.relationData = gridDataSrv.getData($scope.key + '/friend');
                    },
                    'default' : function($scope, $element) {
                        $scope.buttons = {};
                        $scope.buttonsOnOff = function (on, off) {
                            _(on.split(',')).each(function(v,k)  { $scope.buttons[v] = true; });
                            _(off.split(',')).each(function(v,k)  { $scope.buttons[v] = false; });
                        }

                        //$scope.buttons = { add : false, save : false, sub : false, edit : true, del : true , close : false };
                        $scope.buttonsOnOff('edit,del', 'add,save,sub,close');
                        $scope.lastRowScope         = null;
                        $scope.relScope       = null;
                        $scope.ngRepeatColumnLimit  = $scope.meta.columns.tab.length;

                        //$scope.list = gridDataSrv.get($scope.meta, $scope);
                        gridDataSrv.getData($scope.$attrs.key, function(data) {
                             $scope.list = data;
                             $scope.listW = angular.copy(data);
                        });
                        
                        // Append child pane after the table
                        $scope.after = function(html, rowScope) {
                            // IE8 needs this
                            if ( $element.find('table').parent().children().length > 2) 
                                delete $element.find('table').next().remove();

                            var compiled = $compile(html)(rowScope);
                            $element.find('table').after( compiled );
                        }

                        $scope.restore = function() {
                            $element.find('grid').remove();
                            $scope.tableHide = false;
                            return $scope.rowContent = '';
                        }

                    }
                }
            }
        }
    ])
    /*
     *
     *          CONTROLLERS
     *
    */
    .service('controllers', ['$http', 'config', '$compile', 'gridDataSrv', 
        function($http, config, $compile, gridDataSrv) {
            return {
                'set' : function(type, $scope) {
                    this[type]['default']($scope);
                    
                    if (!_.isUndefined($scope.$attrs.rel) && _.isFunction(this[type][$scope.$attrs.rel]))
                        if (_.isUndefined($scope.$attrs.child))
                            this[type][$scope.$attrs.rel]($scope);
                        else
                            this[type][$scope.$attrs.rel + '_child']($scope);
                },
                'head' : {
                    'default' : function($scope) {
                        $scope.peekTable = function() {
                            $scope.tableHide = $scope.tableHide ? false : 'hidden';
                        }

                        $scope.reload = function() { 
                            $scope.list  = UT.dobuleCopy($scope.list, $scope.listW);
                            $scope.notify('rel', 'success', _.isEmpty($scope.list) ? ' (empty)' : '');
                            if ($scope.tableHide) $scope.toggleTable();
                        }
                    }
                },
                'row' : {
                    'm1_child' : function($scope) {
                        $scope.del = function(cb) {
                            var activeId     = $scope.expose({data: 'lastRowScope'}).id;
                            var relationData = $scope.expose({data: 'relationData'});
                            relationData[activeId] = _(relationData[activeId]).without($scope.id);
                            if (!_.isUndefined($scope.$parent.meta.mutual) )
                                relationData[$scope.id] = _(relationData[$scope.id]).without(activeId);

                            delete $scope.list[$scope.id];
                            gridDataSrv.save($scope.key, relationData);

                            $scope.expose({data: 'lastRowScope'}).rowClicked();
                        }

                        $scope.editRow = function() {} //disabled
                    },
                    'friend_child' : function($scope) {
                        $scope.del = function(cb) {
                            var activeId     = $scope.expose({data: 'lastRowScope'}).id;
                            var relationData = $scope.expose({data: 'relationData'});
                            relationData[activeId] = _(relationData[activeId]).without($scope.id);
                            if (!_.isUndefined($scope.$parent.meta.mutual) )
                                relationData[$scope.id] = _(relationData[$scope.id]).without(activeId);

                            delete $scope.list[$scope.id];
                            gridDataSrv.save($scope.key, relationData);

                            $scope.expose({data: 'lastRowScope'}).rowClicked();
                        }

                        $scope.editRow = function() {} //disabled
                    },
                    'm1'     : function($scope) {
                        $scope.$on('rowClicked', function (evt, scopeId) {
                            $scope.buttons.add = !_($scope.relationData[$scope.id]).contains(scopeId);
                        });

                        // Child grid will call this when deleting friends from its list
                        $scope.rowClicked = function() {
                            $scope.$parent.$broadcast('rowClicked', $scope.id);
                        }

                        //
                        $scope.clk =  function(force) { // click on the member list
                            // Execute only if row has changed
                            if ($scope.closeLastRow($scope)) {
                                var html = 
                                    "<div grid='singleLoop'"
                                        + " key='" + $scope.key + "/" + $scope.id + "/" + $scope.$parent.meta.relKey + "'"
                                        + " meta='" + JSON.stringify($scope.$parent.meta) + "'"
                                        + " expose='exposing(data)' rel='m1' child" 
                                        + " parent-list='list' >"
                                        + " <!--ITERATE<div p-img>--></div>";
                                        //+ " <!--ITERATE<div td-text>--></div>";

                                $scope.after(html, $scope.$parent);
                            }
                            $scope.sel();
                            $scope.rowClicked();
                        }

                        var defaultFn = $scope.del;
                        $scope.del = function() {
                            var relationData = $scope.relationData;
                            var related = relationData[$scope.id];

                            if ( !_.isUndefined(related) )
                                for (var i=0; related.length>i; i++) {
                                    relationData[related[i]] = _(relationData[related[i]]).without($scope.id);
                                    if (true) // for mutual case
                                        relationData[$scope.id] = _(relationData[$scope.id]).without(related[i]);
                                }

                            gridDataSrv.save($scope.key + '/friend', _(relationData).omit($scope.id));
                            if ($scope.relScope)
                                delete $scope.relScope.list[$scope.id];
                            defaultFn();
                        }

                        //
                        $scope.subPane = function() { // add friend to member
                            if ( $scope.lastRowScope ) {
                                var relationData = $scope.$parent.relationData;
                                var activeId     = $scope.lastRowScope.id;
                                
                                // Update relations table
                                if (!_(relationData[activeId]).contains($scope.id)) {
                                    function addRelation(activeId, scopeId) {
                                        if ( _.isUndefined(relationData[activeId]) )
                                            relationData[activeId] = [];
                                        relationData[activeId].push(scopeId);
                                    }

                                    addRelation(activeId, $scope.id);
                                    if (true && activeId != $scope.id) // mutual case
                                        addRelation($scope.id, activeId);

                                    //TODO normalize $scope.key
                                    gridDataSrv.save($scope.key + '/' + $scope.id + '/' + $scope.$parent.meta.relKey, relationData);

                                    $scope.relScope.list[$scope.id] = $scope.row;

                                    $scope.buttons.add = false; 
                                }
                            }
                        }

                        var parentSave = $scope.save;
                        $scope.save = function() {
                            $scope.after('', null);
                            $scope.list=$scope.list;
                            parentSave();
                        }
                    },
                    'friend'     : function($scope) {
                        $scope.$on('rowClicked', function (evt, scopeId) {
                            $scope.buttons.add = !_($scope.relationData[$scope.id]).contains(scopeId);
                        });

                        // Child grid will call this when deleting friends from its list
                        $scope.rowClicked = function() {
                            $scope.$parent.$broadcast('rowClicked', $scope.id);
                        }

                        //
                        $scope.clk =  function(force) { // click on the member list
                            // Execute only if row has changed
                            if ($scope.closeLastRow($scope)) {
                                var html = 
                                    "<div grid='singleLoop' key='" + $scope.key + "/" + $scope.id + "/friend'"
                                        + " meta='" + JSON.stringify($scope.$parent.meta) + "'"
                                        + " expose='exposing(data)' rel='friend' child" 
                                        + " parent-list='list' >"
                                        + " <!--ITERATE<div p-img>--></div>";
                                        //+ " <!--ITERATE<div td-text>--></div>";

                                $scope.after(html, $scope.$parent);
                            }
                            $scope.sel();
                            $scope.rowClicked();
                        }

                        var defaultFn = $scope.del;
                        $scope.del = function() {
                            var relationData = $scope.relationData;
                            var related = relationData[$scope.id];

                            if ( !_.isUndefined(related) )
                                for (var i=0; related.length>i; i++) {
                                    relationData[related[i]] = _(relationData[related[i]]).without($scope.id);
                                    if (true) // for mutual case
                                        relationData[$scope.id] = _(relationData[$scope.id]).without(related[i]);
                                }

                            gridDataSrv.save($scope.key + '/friend', _(relationData).omit($scope.id));
                            if ($scope.relScope)
                                delete $scope.relScope.list[$scope.id];
                            defaultFn();
                        }

                        //
                        $scope.subPane = function() { // add friend to member
                            if ( $scope.lastRowScope ) {
                                var relationData = $scope.$parent.relationData;
                                var activeId     = $scope.lastRowScope.id;
                                
                                // Update relations table
                                if (!_(relationData[activeId]).contains($scope.id)) {
                                    function addRelation(activeId, scopeId) {
                                        if ( _.isUndefined(relationData[activeId]) )
                                            relationData[activeId] = [];
                                        relationData[activeId].push(scopeId);
                                    }

                                    addRelation(activeId, $scope.id);
                                    if (true && activeId != $scope.id) // mutual case
                                        addRelation($scope.id, activeId);

                                    //TODO normalize $scope.key
                                    gridDataSrv.save($scope.key + '/' + $scope.id + '/friend', relationData);

                                    $scope.relScope.list[$scope.id] = $scope.row;

                                    $scope.buttons.add = false; 
                                }
                            }
                        }

                        var parentSave = $scope.save;
                        $scope.save = function() {
                            $scope.after('', null);
                            $scope.list=$scope.list;
                            parentSave();
                        }
                    },
                    'default' : function($scope) {
                        function isDirty() { 
                            return $scope.buttons.save = $scope.dirty = !_($scope.row).isEqual($scope.workRow);
                        };

                        function rowDataLabel() { 
                            return UT.join(_($scope.workRow).filter( function(v,k) {
                                if (!_.isUndefined($scope.meta.tab[k]))
                                    return $scope.meta.tab[k].type == 'T' ? v : false;
                            }))
                        }

                        $scope.getElementClass = function(i) {
                            return $scope.meta.tab[i].type == 'T' ? '' : 'notext';
                        }

                        $scope.chg = function() {
                            $scope.rowClass = 'editable' + (isDirty() ? ' dirty' : '');   

                        }

                        $scope.sel = function() {
                            $scope.rowClass = 'selected' + (isDirty() ? ' dirty' : '');   
                        }

                        $scope.blr = function() { 
                            if ( $scope.rowClass )
                                $scope.rowClass = $scope.rowClass.replace('editable','')
                                                                 .replace('selected','');
                            else
                                $scope.rowClass = '';
                            $scope.buttonsOnOff('edit','save,close');
                        }
                        
                        $scope.editRow = function() { // Usually on ng-Dblclick
                           $scope.closeLastRow($scope);
                           $scope.chg();
                        }

                        $scope.defaultClk = function(idx) {
                        } 

                        $scope.clk = function(idx) {
                            if ($scope.closeLastRow($scope))
                                $scope.sel();
                        }

                        $scope.save = function() {
                            $scope.$parent.save($scope.workRow, $scope.id);
                            $scope.rowClass = '';
                            $scope.buttonsOnOff('edit','close,save');
                        }

                        $scope.del = function() {
                            $scope.$parent.del($scope.id);
                        }

                        $scope.subPane = function() {
                            $scope.$parent.subPane($scope, rowDataLabel());
                        }

                        $scope.edit = function() {
                            $scope.chg();
                            $scope.closeLastRow($scope);
                            $scope.buttonsOnOff('close','edit');
                            LG( 'close and off edit');
                        }

                        $scope.close = function() {
                            $scope.workRow = _.clone($scope.row);
                            $scope.blr();
                        }
                    }
                },
                'main' : {
                    'm1_child' : function($scope) {
                    },
                    'friend_child' : function($scope) {
                    },
                    'm1' : function($scope) {
                        var parentAdd = $scope.add;
                        $scope.add = function() {
                            parentAdd();
                        }
                    },
                    'friend' : function($scope) {
                        var parentAdd = $scope.add;
                        $scope.add = function() {
                            parentAdd();
                        }
                    },
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
                                    if ($scope.lastRowScope.$id != rowScope.$id) {
                                        $scope.lastRowScope.blr();
                                    } else {
                                        $return = false;
                                    }
                                }
                            }
                            $scope.lastRowScope = rowScope;
                            return $return;
                        }

                        // Row data methods BEGIN

                        $scope.save = function(row, id) {
                            $scope.list[id] = _.clone(row);
                            LG( $scope.key );
                            $scope.notify('sav', gridDataSrv.save($scope.key, $scope.list, id));

                            if ($scope.meta.autoAdd) { //autoAdd
                                $scope.add();
                            }
                        };

                        $scope.del = function(id)  { 
                            var firstField = $scope.list[id].shift();
                            delete $scope.list[id];
                            $scope.notify(  'del', 
                                            gridDataSrv.save($scope.key, $scope.list), 
                                            ' <b>"' + firstField + '"</b>'
                                         );
                        };

                        $scope.add = function() {
                            var newIdx = UT.minIntKey($scope.list, -1);

                            $scope.list[newIdx]  = UT.mkEmpty($scope.meta.columns.all, '');
                            $scope.listW[newIdx] = UT.mkEmpty($scope.meta.columns.all, '');

                            $scope.closeLastRow(false);
                            $scope.tableHide = false;
                        }
                        // Row data methods END

                        // Sub panes BEGIN
                        $scope.openSub = function(rowData) {
                            $scope.tableHide  = $scope.meta.autoHide;
                            $scope.rowContent = '{' + rowData + '}';
                        };

                        $scope.subPane = function(rowScope, workRow) {
                            _(config.getChildren($scope.key)).each( function(v, childKey) { 
                                $scope.after(
                                    '<div grid key="' + $scope.key + '/' + rowScope.id + '/' + childKey + '" '
                                    + 'expose="exposing(data)" parentList="list" ></div>', rowScope
                                );
                            });
                            $scope.openSub(workRow);
                        };

                        $scope.edit = function(rowScope, rowText) {
                            $scope.closeLastRow(rowScope);
                            $scope.after(
                                '<div edit key="' + $scope.key + '/' + rowScope.id + '/"></div>', rowScope
                            );
                            $scope.openSub(rowText);
                        };
                        // Sub panes END
                    }
                }
            }
        }
    ])
;