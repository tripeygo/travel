var loopback = require('loopback');
var path = require('path');
module.exports = function(Booking) {
  Booking.beforeRemote('create',function(ctx,model,next){
    var vehicleId=ctx.req.body.vehicleId;
    console.log('vehicleId===',vehicleId)
    Booking.app.models.Vehicle.findById(vehicleId,function(err,vehicle){
      ctx.req.body.vendorId=vehicle.vendorId;
      ctx.req.body.bookingId=Math.random().toString(36).substr(2, 9);
      console.log(ctx.req.body);
      next();
    })
  });
  Booking.afterRemote('create',function(ctx,model,next){
    Booking.app.models.Vehicle.findById(model.vehicleId,function(err,vehicle){
      vehicle.bookedTill=model.bookedTill;
      vehicle.bookedFrom=model.bookedFrom;
      vehicle.save(function(err,savedVehicl){
        Booking.emit('vehicleBooked',model);
        next();

      })
    });
  })
  Booking.on('vehicleBooked',function(data){
    var options={
      to: data.email,
      from: 'contact@tripeygo.com',
      subject: 'Booking confirmation '+data.bookingId
    };
    options.template = path.resolve(path.join(__dirname, '..', '..', 'templates', 'bookingConfirm.ejs'));
    options.name=data.name;
    options.pickupLocation=data.pickupLocation;
    options.dropLocation=data.dropLocation;
    options.vehicleId=data.vehicleId;
    options.drivername=data.drivername;
    var template = loopback.template(options.template);
    options.html = template(options);
    console.log("hrt===",options.html);
    Booking.app.models.Email.send(options, function(err,response) {
      if (err) return console.log('> error sending booking confirmation email');
      console.log('> sending booking confirmation email to:', data.email);
      return response;
    });
  })
}
