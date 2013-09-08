//
// Service Modules START
//
angular.module('app.gridConf', ['app.directives'])
    .service('config', function($http) {
        var selects = {};
        $http.get('data/selects').success(function(data) { selects = data; });

        return {
            setParams : function(attrs) {
                var $ret = {};

                function setDefault(arg, defaultVal) {
                    $ret[arg] = _.isUndefined(attrs[arg]) || _.isEmpty(attrs[arg])
                                ? defaultVal : attrs[arg];
                };

                setDefault('config',         'PaneConfig');
                setDefault('tplDir',         '');
                setDefault('pane',           'cmsMain');
                setDefault('childContainer', false);
                setDefault('rel',            '');
                setDefault('relKey',       '');
                setDefault('key',            false);

                $ret.child     = $ret['child']      || !_.isUndefined(attrs['child']);
                $ret.autoClose = $ret['auto-close'] || !_.isUndefined(attrs['auto-close']);

                this.setConfigObject($ret.config);

                return $ret;
            },

            standardTemplates: [
                'cmsPane',   'cmsCheckbox', 'cmsFooter', 'cmsPane', 'cmsRadio', 
                'cmsSelect', 'cmsText',     'pImg',      'rowButtons'
            ],
            getAllTemplates: function($scope, tplDir, extras, cb) {
                var tpls = _.isEmpty(extras) ? this.standardTemplates
                                             : _.union(this.standardTemplates, extras);

                var load = function(tpls, templates) {
                    var tplName = tpls.shift();

                    $http.get( tplDir + '/' + tplName + '.html').success(function(html) {
                        templates[tplName] = html;
                        tpls.length ? load(tpls, templates) : cb();
                    });
                }
               
                load(tpls, $scope.templates);
            },

            setConfigObject : function(configObjectName) {
                try {
                    var configObject = eval(configObjectName);
                } catch (err) {
                    return false;
                }
                return this.configObject = configObject;
            },

            findMeta : function(key) {
                var keys = UT.gridKey(key).split('/');
                var meta = angular.copy(this.configObject[keys.shift()]);

                for (var i=0 ; i<keys.length ; i++ )
                    meta = meta.children[keys[i]];

                return meta;
            },

            getAllColumns:  function(meta) { 
                var $return = [], tab = [], cols = [], line = {}, count = 0, undefCount = 0;
                var posMap = {};

                _(meta.columns).each( function(v,k) {
                    cols = v.split(':');
                    line = {};
                    if (_.isUndefined(cols[1]) || cols[1].substr(0,1) != '-') {
                        switch (cols.length) {
                            case 4  : line.labs = cols[3].split(',');
                            case 3  : line.type = cols[2];
                            case 2  : line.pos  = cols[1];
                            case 1  : line.name = cols[0]; break;
                            default : line = {};
                        }
                        if (_.isUndefined(line.type)) line.type = 'T';
                        if (line.type == 'S' && !_.isUndefined(selects[line.labs]))
                            line.labs = selects[line.labs];

                        if   (_.isUndefined(line.pos)) {
                            posMap[k] = undefCount;
                            count = 100 + undefCount++;
                        } else {
                            count = parseInt(isNaN(line.pos.substr(0,1))    ? line.pos.substr(1) 
                                                                            : line.pos) + 200;
                            posMap[k] = count - 200;
                        }

                        if (_.isUndefined(line.pos) || line.pos.substr(0,1) != '+') {
                            line.pos = k.toString();
                            tab.push(_.clone(line));
                        }

                        line.pos = k.toString();
                        $return[count] = angular.copy(line);
                    }
                });
                
                return {tab:tab, all:_($return).filter(function() { return true; }) };
            },

            getTabColumns:  function(meta) { 
                var $return = [], cols = [];

                _(meta.columns).each( function(v,k) {
                    cols = v.split(':');
                    if (_.isUndefined(cols[1]) || (cols[1].substr(0,1) != '-' && cols[1].substr(0,1) != '+')) 
                        $return.push(cols[0]);
                });
                return $return;
            },

            getMeta : function(key) {
                var meta = this.findMeta(key);

                if (_.isUndefined(meta)) return false;

                meta.columns = this.getAllColumns(meta);

                // Defaults START
                if (_.isUndefined(meta.autoHide))  meta.autoHide  = true;   
                if (_.isUndefined(meta.headHide))  meta.headHide  = false;
                if (_.isUndefined(meta.singleRow)) meta.singleRow = false;
                if (_.isUndefined(meta.autoAdd)  ) meta.autoAdd   = false;
                // Defaults END

                return meta;
            },

            getChildren: function(key) {
                return _.isUndefined(m = this.findMeta(key)) ? false : m.children; 
            }
        }
    })
;
