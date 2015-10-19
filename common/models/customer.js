var loopback = require('loopback');
var path = require('path');
module.exports = function(Customer) {
  Customer.afterRemote('create', function(context, customer, next) {
    console.log('> user.afterRemote triggered');

    var options = {
      type: 'email',
      to: customer.email,
      from: 'contact@tripeygo.com',
      subject: 'Tripeygo Account Registration',
      redirect: '/?source=login',
      user: customer
    };

    customer.verify(options, function(err, response) {
      if (err) return next(err);
      return next();
    });
  });
  Customer.beforeRemote('passwordReset', function(ctx, model, next) {
    var accessToken=ctx.req.accessToken;
    ctx.req.body.userId=accessToken.userId;
    next();
  });
  Customer.passwordReset=function(details,cb){
    Customer.findById(details.userId,function(err,customer){
      customer.updateAttribute('password',details.password,function(err,savedCustomer){
          if(err)
            return cb(err)
          return cb(null,savedCustomer);
      })
    })
  }
  Customer.afterRemote('login',function(ctx,model,next){
    if(model.userId){
      Customer.findById(model.userId,function(err,customer){
        if(err)
          return next(err)
        model.name=customer.name;
        model.email=customer.email;
        return next();
      })
    }
    else{
      next();
    }
  });

  Customer.remoteMethod(
    'passwordReset',
    {
      description: 'request password reset link',
      accepts: [
        {arg: 'details', type: 'object', description: 'email', http: {source: 'body'}}
      ],
      returns: {arg: 'data', type: Object, root: true},
      http: {verb: 'put', path: '/password-reset'}
    }
  );
  Customer.on('resetPasswordRequest',function(data){
    var resetPassword=global.config.travelHost+'?access_token='+data.accessToken.id+'&source=reset';
    var options={
      to: data.email,
      from: 'contact@tripeygo.com',
      subject: 'Password reset'
    };
    options.template = path.resolve(path.join(__dirname, '..', '..', 'templates', 'reset-link.ejs'));
    options.resetPassword=resetPassword;
    var template = loopback.template(options.template);
    options.html = template(options);
    console.log("hrt===",options.html);
    Customer.app.models.Email.send(options, function(err,response) {
      if (err) return console.log('> error sending password reset email');
      console.log('> sending password reset email to:', data.email);
      return response;
    });
  })

};
