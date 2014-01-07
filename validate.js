var Check = require('validator').check,
  Q = require('q'),
  _ = require('lodash');


var Validate = function(field, input) {
    this.promise = Q([]);
    this.set(input, field);
};

Validate.prototype.then = function () {
    if (!(this.input && this.field)) {
        var reject = Q.reject("Both the field and input are required inorder to validate");
        return reject.then.apply(reject, arguments);
    }
    return this.promise.then.apply(this.promise, arguments);
};

Validate.prototype.set = function set(input,field) {
    this.input = input || this.input || {};
    this.field = field || this.field;
    return this;
};

Validate.prototype.getValue = function(){
  return this.input[this.field];
};

Validate.prototype.custom = function(customerValidate, scope) {
    var that = this;
    function wrapper(errors) {
        var promise;
        if (_.isFunction(customerValidate)) {
            customerValidate = scope ? _.bind(customerValidate, scope) : customerValidate;
            promise = Q(customerValidate(that.getValue()));
        } else {
            promise = customerValidate;
        }
        return promise.then(function(e) {
            if (_.isArray(e)) {
                errors = errors.concat(e);
            } else if (e) {
                errors.push(e);
            }
            return Q(errors);
        });
    }
    this.promise = this.promise.then(wrapper);
    return this;
};

for (var v in new Check()) {
  (function() {
  var functionName = v;
  Validate.prototype[functionName] = function() {
    var args = arguments;
    this.custom(function(value){
      var error;
      try {
        var c = Check(value);
        c[functionName].apply(c, args);
      } catch (ex) {
        error = ex.message;      
      }
      return error;
    });
    return this;
    };
  })(); // jshint ignore:line
}

module.exports = function(field, input){
  return new Validate(field, input);
};
