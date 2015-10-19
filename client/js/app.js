'use strict';
window.App = (function () {
    var _init, _appLoad = [];
    return {
        ngApp: angular.module("tripeygo", ['ngRoute']),
        init: function () {
            if (!_init) {
                _init = true;
                while(_appLoad.length != 0) _appLoad.splice(0, 1)[0](App.ngApp);
                    angular.bootstrap('#page-top', ['tripeygo']);
            }
        },
        onAppLoad: function (_fn) {
            _init && _fn(App.ngApp);
            !_init && _appLoad.push(_fn);
        },
        destroy:function(){
            $('#container').empty();
            _init=false;
        }
    }
})();
$(document).ready(function(){
  App.init();
})
