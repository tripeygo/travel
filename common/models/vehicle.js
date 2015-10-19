module.exports = function(Vehicle) {
  Vehicle.searchVehicle=function(details,cb){
    Vehicle.find({where:{
      or:[{bookedTill:{lt:details.fromDate}},{bookedFrom:null}]
    }},function(err,vehicles){
        if(err)
          return cb(err)
          return cb(null,vehicles);
      })
  }
  Vehicle.remoteMethod(
    'searchVehicle',
    {
      description: 'request password reset link',
      accepts: [
        {arg: 'details', type: 'object', description: 'journey details', http: {source: 'body'}}
      ],
      returns: {arg: 'data', type: Object, root: true},
      http: {verb: 'post', path: '/searchVehicle'}
    }
  );
};
