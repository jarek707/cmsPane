angular.module('app.services', ['app.gridConf'])
    .factory('dom', ['$compile', '$http', function($compile, $http) {
        return {
            'pushRelToIterate': function(el, rel) {
                $(el).find('>div[iterate]').attr('rel', rel);
            },
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
            'getTpl' : function($scope, tpl, cb) {
                $http.get('partials/' + tpl + '.html').success(function(html) {
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
                var comp = angular.element(el.data().outer);
                comp.data().meta = data;
                comp = $compile(comp)(parentScope);
                el.replaceWith( comp );
            },
            'convertChild' : function( child ) {
                var dataAttrs = {};
                var el = child.get()[0];
                for (var i=0; i<el.attributes.length; i++) {
                    var key = el.attributes[i].nodeName;
                    var val = el.attributes[i].nodeValue;

                    if (key !== 'class')
                        key.indexOf('-') > -1 && (key = UT.camelDash(key));
                        try { // Invalid JSON string will be considered a valid argument string
                            dataAttrs[key] = _(['[', '{']).contains(val.substr(0,1)) ? JSON.parse(val) : val;
                        } catch (e) { }
                }


                child.data().outer = 
                    '<div cms-pane row-id="{{rowId}}" parent-id="{{id}}"  parent-list="list" exposer="exposing(data)"' +
                    ' key="' + dataAttrs.key + '" rel="' + dataAttrs.rel + '">' +
                        el.innerHTML +
                    '</div>'
                ;
                child.data().meta  = dataAttrs;

                el.innerHTML = '';
                return;
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
    }])
    .factory('jquery_ui', ['$http', 'config', function($http, config) {
        return  {
            'init' : function(el, cbs) { 
                var meta = el.data().meta;

                _.isUndefined(meta.jqSortable) || this.sortable(el, cbs.sortable, meta.jqSortable);
            }, 
            'sortable' : function(el, cb, sortable) {
                var params = {
                    'tolerance' : 'pointer',
                    'helper'    : 'clone',
                    'cursor'    : 'move',
                    'distance'  : 1,
                    'cursorAt'  : {left: 5},
                    'update'    : function(evt, obj) {
                        sort = $(this).sortable('toArray', {"attribute" : "jq-row-id"});
                        _.isFunction(cb) && cb(evt, obj, sort);
                    }
                };

                _.isEmpty(sortable) ||
                    (params = _.extend(params, {"connectWith" : '[key="' + sortable + '"] .dataContent'}));

                setTimeout( function() {
                    $(el).find('.sortable').sortable(params);
                }, 100);
            }
        }
    }])
    .factory('lData', ['$http', 'config', function($http, config) {
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

            getData: function(key, cb, pid) {
                if (false && this.useLocal) {
                    var localData = localStorage[this.prefix + key];
                    if (_.isUndefined(localData) || _.isEmpty(localData))
                        cb({});
                    else 
                        cb(JSON.parse(localData));
                } else {
                    var url = key.replace('/','_');
                    var rel = ( url.indexOf('_') > -1 ) ? '&rel' : ''; 
                    var pid = _.isUndefined(pid) ? '' : '&pid=' + pid;
                    $http.get('data/db.php?action=get&table=' + url + rel + pid).success( function(data) { 
                        if (_.isEmpty(data)) data = {};
                        cb(data); 
                    }).error(
                        function(data) { LGE('GET DATA ERROR FOR ' + data, key );}
                    )
                    ;
                }
            }
        };
    }])
;
