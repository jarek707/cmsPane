angular.module('app.services', ['app.gridConf'])
    .factory('dom', function($compile, $http) {
        return {
            'getItem' : function($scope, item, cb) {
                $http.get('partials/' + item + '.html').success(function(html) {
                    cb($compile(html)($scope));
                });
            },
            'makeMain' : function(el) {
                $scope = el.data().$scope;

                var html = $scope.templates.cmsPane;

                if (html.indexOf('<inject-iterator-here />') > -1)
                    html = html.replace('<inject-iterator-here />', $scope.meta.iterate);

                if ($scope.meta.children.indexOf('{{ITERATION}}') > -1) {
                    html = $scope.meta.children.replace('{{ITERATION}}',html); 
                } else {
                    html = $scope.meta.children + html;  // Put iterator at the bottom if not located
                }

                el.append($compile(html)($scope));
            },
            'injectInlines' : function(el) {
                $scope = el.data().$scope;
                for (var i=0; i<$scope.meta.inline.length; i++){
                    $scope.meta.inline[i] = $compile($scope.meta.inline[i])($scope);
                }
            },
            'replaceExternals' : function($scope) {
                var el = angular.element($scope.meta.relChild);
                var replacement = angular.element(
                    '<cms-pane key="' + el.attr('key') + '"' + 'rel="' + el.attr('rel') + '"' +
                    ' row-id="{{rowId}}" parent-list="list" expose="exposing(data)">' +
                    el.data().inner + '</cms-pane>'
                ).data({"meta" : el.data().meta});

                el.replaceWith($compile(replacement)($scope));
            },
            // Convert all JSON strings to objects and pass on remaining string attributes
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
            'paramTransclude' : function(el, attrs) {
                var meta = _.isUndefined(el.data().meta) ? {} : el.data().meta;

                if (!_.isUndefined(attrs.cmsPane)) {
                    el.data().meta  = this.attrsToMeta(attrs);
                    el.data().inner = el.get()[0].innerHTML;
                }

                var iterate =   el.find('>iterate'); 
                if ( iterate.length ) {
                    meta.iterate             = iterate.get()[0].innerHTML;
                    iterate.get()[0].outerHTML = '{{ITERATION}}';
                }

                meta.inline = [];
                var cmsPane =   el.find('>cms-pane'); 
                if ( cmsPane.length ) {
                    for( var i=0; i<cmsPane.length; i++){
                        meta.inline[i] = cmsPane[i].outerHTML.replace('<cms-pane',
                            '<cms-pane row-id="{{rowId}}" parent-list="list" expose="exposing(data)" ');
                        meta.inline[i] = '<div class="inlineWrapper">' + meta.inline[i] + '</div>';
                    }
                    cmsPane.remove();
                }
                
                meta.children = _.isEmpty(el.get()[0].innerHTML) ? "{{ITERATION}}" : el.get()[0].innerHTML;

                el.get()[0].innerHTML = '';
                return _.extend(meta, this.attrsToMeta(attrs));
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

                    if (!_.isFunction(cb)) cb = function() {};

                    var params = {
                        'tolerance' : 'pointer',
                        'helper'    : 'clone',
                        'cursor'    : 'move',
                        'distance'  : 1,
                        'cursorAt'  : {left: 5},
                        'update'    : cb
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
            useLocal : true,

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
