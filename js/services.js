angular.module('app.services', ['app.gridConf'])
    .factory('dom', function($compile, $http) {
        return {
            'setupButtons' : function(el, attrs) {
                if ( !_.isUndefined(attrs.use)) {
                    var buttons = el.find('input');
                    var toUse = attrs.use.split(',');
                    for (var i=0; i<buttons.length; i++) {
                        if (!_(toUse).contains(buttons[i].className.replace('Button',''))) {
                            angular.element(buttons[i]).remove();
                        }
                    }
                    el.data().html = el.html();
                    //el.html('');
                }
            },
            'getItem' : function($scope, item, cb) {
                $http.get('partials/' + item + '.html').success(function(html) {
                    cb($compile(html)($scope));
                });
            },
            'attrsToMeta' : function($attrs) {
                $ret = {};
                _($attrs).each(function(v,k) {
                    if (_.isString(v)) {
                        try { // Invalid JSON string will be considered a valid argument string
                            $ret[k] = _(['[', '{']).contains(v.substr(0,1)) ? JSON.parse(v) : v;
                        } catch (e) { }
                    }
                });
                return $ret;
            },
            'compileChildPane' : function(parentScope, el) {
                var data = _.clone(el.data().meta);
                var comp = $compile(el.data().outer)(parentScope);
                comp.data().meta = data;
                el.replaceWith( comp );
            },
            'convertChild' : function( child ) {
                var dataAttrs = {};
                for (var i=0; i<child.attributes.length; i++) {
                    var key = child.attributes[i].nodeName;
                    var val = child.attributes[i].nodeValue;

                    if (key !== 'class')
                        try { // Invalid JSON string will be considered a valid argument string
                            dataAttrs[key] = _(['[', '{']).contains(val.substr(0,1)) ? JSON.parse(val) : val;
                        } catch (e) { }
                }

                angular.element(child).data().outer = 
                    '<div cms-pane row-id="{{rowId}}" parent-list="list" expose="exposing(data)"' +
                    ' key="' + dataAttrs.key + '" rel="' + dataAttrs.rel + '">' +
                        child.innerHTML +
                    '</div>'
                ;
                angular.element(child).data().meta  = dataAttrs;

                child.innerHTML = '';
                return angular.element(child).data().outer;
            },
            'paramTransclude' : function(el, attrs) {
                var meta = _.isUndefined(el.data().meta) ? {} : el.data().meta;

                meta.children = el.get()[0].innerHTML;

                el.html('');
                return _.extend(meta, this.attrsToMeta(attrs));
            },
            'makeMain' : function(el) {
                $scope = el.data().$scope;
                
                el.append($compile($scope.meta.children)($scope));
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

                    var params = {
                        'tolerance' : 'pointer',
                        'helper'    : 'clone',
                        'cursor'    : 'move',
                        'distance'  : 1,
                        'cursorAt'  : {left: 5},
                        'update'    : _.isFunction(cb) ? cb : function() {}
                    };

                    if (!_.isEmpty(jqObj.sortable)) {
                        params = _.extend(params, {"connectWith" : jqObj.sortable});
                    }

                    $($element).find('.sortable').sortable(params);
                }
            }
        }
    })
    .factory('lData', function($http, config) {
        return  {
            prefix: 'GRID:',
            useLocal : document.location.host === 'cms',

            clear: function() { 
                var keys = '';

                for (var i in localStorage) 
                    if (i.substr(0,5) == this.prefix) 
                        keys += i.substr(5) + '\n';

                var key = prompt('Enter key from the list:\n\n' + keys );
                _.isEmpty(key) ? localStorage.clear() : delete localStorage[this.prefix + key]; 
            },

            save: function(key, list, id, byRow) {
                if (_.isUndefined(byRow) || !byRow) {
                    key = UT.gridKey(key);
                }

                if (_.isEmpty(list) ) return false;
                if (false && this.useLocal)
                    localStorage[this.prefix + key] = JSON.stringify(list);
                else // TODO implement real server save
                    var url = key.replace('/','_');
                    var rel = ( url.indexOf('_') > -1 ) ? '&rel' : ''; 
                    var action = (_.isUndefined(list[id])) ? 'del' : 'post';
                    $.post('data/db.php?action=' + action + '&table=' + url + rel + '&rowId=' + id,list[id]).success( function(data) {
                    });
                    ;
                return 'success';
            },

            get: function(attrs, scope) {
                scope.listW = angular.copy(scope.list = this.getData(attrs.key));
            },

            getData: function(key, cb) {
                if (false && this.useLocal) {
                    var localData = localStorage[this.prefix + key];
                    if (_.isUndefined(localData) || _.isEmpty(localData))
                        cb({});
                    else 
                        cb(JSON.parse(localData));
                } else {
                    var url = key.replace('/','_');
                    var rel = ( url.indexOf('_') > -1 ) ? '&rel' : ''; 
                    $http.get('data/db.php?action=get&table=' + url + rel).success( function(data) { 
                        if (_.isEmpty(data)) data = {};
                        cb(data); 
                    }).error(
                        function(data) { LGE('GET DATA ERROR FOR ' + data, key );}
                    )
                    ;
                }
            }
        };
    })
;
