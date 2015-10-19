App.onAppLoad(function(ngApp){
  ngApp.controller('travelController',['$scope','$window','$timeout','travelService','$routeParams','$route','$location','UserAuth',function($scope,$window,$timeout,travelService,$routeParams,$route,$location,UserAuth){
    var appConst=AppConstants.getInstance();
    $scope.displaySearchResults=false;
    if(UserAuth.isAuthenticated()){
      $scope.loginData={name:UserAuth.currentUserName,email:UserAuth.currentEmail};
      $scope.loginSuccessful=true;
    }
    $scope.searchVehicle=function(){
      if(!$('#startJourney').val() || !$('#endJourney').val()){
        alert("Please select the journey dates");
        return;
      }
      $scope.startJourney=new Date($('#startJourney').val()).toISOString();
      $scope.endJourney=new Date($('#endJourney').val()).toISOString();
      travelService.sendData(appConst.searchVehicleUrl,{"fromDate":$scope.startJourney,"toDate":$scope.endJourney}).then(function(response){
        $scope.vehicles=response.data;
        $scope.displaySearchResults=true;
        $timeout(function(){
          $window.scrollTo(0,$("#searchResult").offset().top);
        },1);
      })
    }
    $scope.number = 5;
    $scope.getNumber = function(num) {
    return new Array(num);
    }
    $scope.loginToggle=function(dataBody){
      $('#loginModal .modal-body').hide();
      $('.loginOption').removeClass('underline');
      $('.'+dataBody).show();
      $('.loginOption.'+dataBody).addClass('underline');
      $scope.success=false;
      $scope.failure=false;
    }
      var nowTemp = new Date();
      var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);
      $('#startJourney').datetimepicker()
      .on('changeDate', function(ev) {
        $('#endJourney')[0].focus();
      });
      $('#endJourney').datetimepicker().
      on('changeDate', function(ev) {
      });
      $scope.countries = {
          'India': {
              'Haryana': ['Pune', 'Mumbai', 'Nagpur', 'Akola'],
              'Uttar Pradesh': ['Indore', 'Bhopal', 'Jabalpur']
          }
      };

      $('.fancy-select.state').on('click','.options li',function(e){
        $scope.strState = document.getElementById("state").value;
        $scope.citiessource=$scope.countries['India'][$scope.strState];
        if(!$scope.$$phase)
          $scope.$digest();
        $('#city').fancySelect();
      })
      $timeout(function(){
        $('.custom-select').fancySelect();
      },100);
      $scope.signupNewUser=function(){
        var bdayString=$('#day').val()+" "+$('#month').val()+" "+$('#year').val();
        var bdayDate=new Date(bdayString);
        var customerObj={
          email:$scope.email,
          password:$scope.password,
          name:$scope.name,
          gender:$('#gender').val(),
          state:$('#state').val(),
          city:$('#city').val(),
          birthday:bdayDate
        }
        travelService.sendData(appConst.createCustomerUrl,customerObj).then(function(response){
          if(response.status==200){
            $scope.success=true;
            $scope.signUpMessage="Thank you for registering on Tripeygo, we have sent you an email verification link, please follow it to complete your registration.";
          }
          else if(response.status==422){
            $scope.failure=true;
            $scope.signUpMessage="Email Id already exists.";
          }
        })
      }
      $scope.forgotPassword=function(){
        $scope.forgot=true;
        $scope.loginToggle('forgotPassword-body');
      }
      $scope.sendResetLink=function(){
        var postObj={"email":$scope.resetEmail};
        travelService.sendData(appConst.sendResetLinkUrl,postObj).then(function(response){
            $scope.success=true;
            $scope.signUpMessage="We have sent you a password reset link. Please follow the link.";
        });
      }
      $scope.resetPassword=function(){
        var postObj={"password":$scope.newpassword};
        UserAuth.accessTokenId=$scope.accessToken;
        travelService.updateData(appConst.resetPasswordUrl,postObj).then(function(response){
          if(response.status==200){
            $scope.success=true;
            $scope.signUpMessage="Password Sucessfully reset, please login now.";
          }
        });
      }
      $scope.loginUser=function(){
        var postObj={"password":$scope.loginPassword,"email":$scope.loginEmail};
        travelService.sendData(appConst.loginUrl,postObj).then(function(response){
          if(response.status==200){
            $scope.success=true;
            $scope.signUpMessage="Login Sucessful";
            $scope.loginData=response.data;
            $scope.loginSuccessful=true;
            $('#loginModal').modal('hide');
            UserAuth.setUser($scope.loginData.id, $scope.loginData.userId, $scope.loginData.name,$scope.loginData.email);
            UserAuth.rememberMe = true;
            UserAuth.save();
            if(sessionStorage['acc']){
              $(sessionStorage['acc']).toggle();
              sessionStorage['acc']=null;
            }
          }
          else if(response.status==401){
            $scope.success=false;
            $scope.failure=true;
            $scope.signUpMessage="Invalid email or password.";
          }
        });
      }
      $scope.logoutUser=function(){
        travelService.sendData(appConst.logoutUrl,{},{}).then(function(response){
          $scope.loginSuccessful=false;
          UserAuth.clearUser();
          UserAuth.clearStorage();
        })
      }
      $scope.source=$location.search().source;
      $scope.accessToken=$location.search().access_token;
      if($scope.source){
        $('#loginModal').modal('show');
        if($scope.source=='reset'){
          $scope.forgot=true;
          $scope.loginToggle('passwordReset-body');
        }
        else if($scope.source=='login'){
          $scope.loginToggle('login-body');
        }
      }
      $('.modal').on('hidden.bs.modal', function(){
        $(this).find('form')[0].reset();
    });
    $scope.bookVehicle=function(){
      // if ($scope.bookingForm.$invalid)
      //   return;
      var postObj={
        name:$scope.loginData.name,
        email:$scope.loginData.email,
        phoneNumber:$('#bookingphone').val(),
        pickupLocation:$('#pickuplocation').val(),
        dropLocation:$('#dropLocation').val(),
        pickupCity:$('#pickupcity').val(),
        dropCity:$('#dropcity').val(),
        vehicleId:$scope.selectedVehicle.registrationnumber,
        drivername:$scope.selectedVehicle.drivername,
        bookedTill:$scope.endJourney,
        bookedFrom:$scope.startJourney,
        customerId:UserAuth.currentUserId
      }
      travelService.sendData(appConst.createBooking,postObj).then(function(response){
        console.log(response);
      })
      console.log(postObj)
    }
    $scope.displayDetails=function(event){
      var href=$(event.currentTarget).data('href');
      var index=$(event.currentTarget).data('index');
      $scope.selectedVehicle=$scope.vehicles[index];
      if(!UserAuth.isAuthenticated()){
        sessionStorage['acc']=href;
        $('#loginModal').modal('show');
        $scope.loginToggle('login-body');
      }
      else{
      $(href).toggle();
    }
    }
  }])
})
