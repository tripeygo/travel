App.onAppLoad(function (ngApp) {
    ngApp.factory('UserAuth', function () {
      var props = ['accessTokenId', 'currentUserId','currentUserName','currentEmail','currentPhoneNumber'];
      var propsPrefix = '$UserAuth$';

      function UserAuth() {
        var self = this;
        props.forEach(function(name) {
          self[name] = load(name);
        });
        this.rememberMe = undefined;
      }
      UserAuth.prototype.save = function() {
        var self = this;
        var storage = this.rememberMe ? localStorage : sessionStorage;
        props.forEach(function(name) {
          save(storage, name, self[name]);
        });
      };

      UserAuth.prototype.setUser = function(accessTokenId, userId, name,email) {
        this.accessTokenId = accessTokenId;
        this.currentUserId = userId;
        this.currentUserName = name;
        this.currentEmail=email;
      }

      UserAuth.prototype.clearUser = function() {
        this.accessTokenId = null;
        this.currentUserId = null;
        this.currentUserName = null;
        this.currentEmail=null;
      }

      UserAuth.prototype.clearStorage = function() {
        props.forEach(function(name) {
          save(sessionStorage, name, null);
          save(localStorage, name, null);
        });
      };
      UserAuth.prototype.isAuthenticated=function(){
        return this.currentUserId!=null;
      }
      return new UserAuth();
      function save(storage, name, value) {
        var key = propsPrefix + name;
        if (value == null) value = '';
        storage[key] = value;
      }

      function load(name) {
        var key = propsPrefix + name;
        return localStorage[key] || sessionStorage[key] || null;
      }
    });
});
