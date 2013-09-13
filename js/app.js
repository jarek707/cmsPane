// GLOBAL Utility START
function SER(arg) { return JSON.stringify(arg); }
function LG()     { if (window.console) console.log(arguments);     }
function LGE()    { 
    if (window.console)
        for (var i=0; i < arguments.length; i++ ) {
            console.log(arguments[i]);
        }
}
function LGS()    { if (window.console) console.log(JSON.stringify(arguments));     }
function LGT()    { 
    var args  = _.map(arguments, function(v,k) {return v});
    setTimeout(function() {if (window.console) console.log(args);}, args.pop()); 
}
function topMenu($scope) {
    $scope.lists = { a : 1, b : 2, c :3 }
}

function contentPane($scope, $routeParams, $http, gridDataSrv, config) {
    $scope.clearLocalStorage = function() {
        gridDataSrv.clear();
    };

    $scope.dumpLocalStorage = function() {
        LG ( localStorage );
        var loc = angular.copy(_(localStorage).omit('FirebugLite'));
        $.post('data/postLocStorage.php', {"data" : JSON.stringify(loc)}).success(function(retData) {
            LG( 'send', retData);
        });
    }

    $scope.restoreLocalStorage = function() {
        var loc = angular.copy(_(localStorage).omit('FirebugLite'));
        $.get('data/getLocStorage.php').success(function(retData) {
            var data = JSON.parse(retData);
            _(data).each(function(v,k) { 
                localStorage[k] = v;
            });
        });
    }
    //if ( _.isUndefined(localStorage['GRID:METADATA']) ) 
        //localStorage['GRID:METADATA'] = JSON.stringify(config.meta);
}

function leftPane() {}

function rightPane($scope) {
}
