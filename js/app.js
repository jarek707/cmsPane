// GLOBAL Utility START
function SER(arg) { return JSON.stringify(arg); }
function LG()     { if (window.console) console.log(arguments);     }
function LGW()     { 
    if (window.console) {
        if (_.isFunction(window.console.warn)) {
            console.info(arguments[0]);
        } else {
            console.log(arguments);     
        }
    }
}
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

function contentPane($scope, lData) {
    $scope.saved = false;
    $scope.clearLocalStorage = function() {
        lData.clear();
        document.location = document.location;
    };

    $scope.dumpLocalStorage = function() {
        var loc = angular.copy(_(localStorage).omit('FirebugLite'));

        $.post('data/postLocStorage.php', {"data" : JSON.stringify(loc)})
            .success( function(retData) {
                $scope.saved = true;
                $scope.$digest();
                setTimeout( function() { $scope.saved = false;  $scope.$digest(); }, 2000);
        });
    }

    $scope.restoreLocalStorage = function() {
        var loc = angular.copy(_(localStorage).omit('FirebugLite'));
        $.get('data/getLocStorage.php').success(function(retData) {
            var data = JSON.parse(retData);
            _(data).each(function(v,k) { 
                localStorage[k] = v;
                document.location = document.location;
            });
        });
    }
}

var myApp = angular.module('app', ['app.services', 'app.directives', 'app.customDirectives']);

contentPane.$inject = ['$scope','lData'];
myApp.controller('contentPane', contentPane);

function leftPane() {}

function rightPane($scope) {
}
