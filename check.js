var Q = require('q'),
    _ = require('lodash');

var Check = function(input) {
  this.set(input);
  this.validators = [];
  this.deferred = new Q.defer();
};

Check.prototype.set = function(input){
  this.input = input;
  return this;
};

Check.prototype.where = Check.prototype.add = function(validators) {
  validators = (_.isArray(validators) ? validators : _.toArray(arguments)); 
  this.validators = this.validators.concat(validators);
  return this;
};

Check.prototype.then = function() {
  var validators = this.validators;
  var input = this.input;
  _.each(validators,function(v){
    v.set(input);
  });
  var promise = Q.all(_.clone(validators)).then(
    function(errors) {
      var results = {};
      var set = false;
      _.each(errors, function(value, key) {
        if(value.length){
          results[validators[key].field] = (results[validators[key].field] || []).concat(value);
          set=true;
        }
      });
      return Q(set?results:undefined);
    }
  );
  this.deferred.resolve();
  return this.deferred.promise.then(promise.then.apply(promise, arguments));
};

Check.prototype.invalid = function(callback){
  var that = this;
  this.then(function (error){
    if(error)
    {
      try{
        callback(error);
      }
      catch(ex){
        console.log('deferred');
        that.deferred.reject(ex.message);
      }
    }
  });
  return this;
};

Check.prototype.valid = function(callback){
  this.then(function (error){
    if(!error)
      try{
        callback();
      }
      catch(ex){
        that.promise = Q.reject(ex.message);
      }
  });
  return this;
};

module.exports = function(input){
  return new Check(input);
};
