var Q = require('q'),
    _ = require('lodash');

var Check = function(input) {
  this.set(input);
  this.validators = [];
};

Check.prototype.set = function(input){
  this.input = input;
  return this;
};

Check.prototype.use = Check.prototype.add = function(validators) {
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
      _.each(errors, function(value, key) {
        results[validators[key].field] = (results[validators[key].field] || []).concat(value);
      });
      return Q(results);
    }
  );
  return promise.then.apply(promise, arguments);
};

module.exports = function(input){
  return new Check(input);
};
