App.onAppLoad(function (ngApp) {
    ngApp.config(['$routeProvider','$locationProvider',
        function ($routeProvider,$locationProvider) {
            $locationProvider.html5Mode(true);
            

        }]);
});
