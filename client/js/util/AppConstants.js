var AppConstants = (function () {
function createInstance() {
    this.createCustomerUrl='/api/Customers';
    this.sendResetLinkUrl='/api/Customers/reset';
    this.resetPasswordUrl='/api/Customers/password-reset';
    this.loginUrl='/api/Customers/login';
    this.logoutUrl='/api/Customers/logout';
    this.searchVehicleUrl='/api/Vehicles/searchVehicle';
    this.createBooking='/api/Bookings/';
}


var instance;
return {
  name: "AppConstants",
  getInstance: function () {
    if (instance == undefined)
      instance = new createInstance();
    return instance;
  }
};
})();
