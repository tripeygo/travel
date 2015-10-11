App.onAppLoad(function(ngApp){
  ngApp.controller('travelController',['$scope','$window','$timeout',function($scope,$window,$timeout){
    $scope.displaySearchResults=false;
    $scope.searchVehicle=function(){
      console.log("start===",$scope.startJourney);
      console.log("end===",$scope.endJourney);
      $scope.displaySearchResults=true;
      $timeout(function(){
        $window.scrollTo(0,$("#searchResult").offset().top);
      },1);
    }
    $scope.number = 5;
    $scope.getNumber = function(num) {
    return new Array(num);
    }
      var nowTemp = new Date();
      var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);
      $('#startJourney').datetimepicker()
      .on('changeDate', function(ev) {
        $scope.startJourney=ev.date.valueOf();
        $('#endJourney')[0].focus();
      });
      $('#endJourney').datetimepicker().
      on('changeDate', function(ev) {
        $scope.endJourney=ev.date.valueOf();
      });

  }])
})
