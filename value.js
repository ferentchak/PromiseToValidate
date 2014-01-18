var Check = require('validator').check,
  Q = require('q'),
  _ = require('lodash');


var Value = function(field, input) {
    this.promise = Q([]);
    this.set(input, field);
};

Value.prototype.then = function () {
    if (!(this.input && this.field)) {
        var reject = Q.reject("Both the field and input are required inorder to validate");
        return reject.then.apply(reject, arguments);
    }
    return this.promise.then.apply(this.promise, arguments);
};

Value.prototype.set = function set(input,field) {
    this.input = input || this.input || {};
    this.field = field || this.field;
    return this;
};

Value.prototype.getValue = function(){
  return this.input[this.field];
};

Value.prototype.custom = function(customerValue, scope) {
    var that = this;
    function wrapper(errors) {
        var promise;
        if (_.isFunction(customerValue)) {
            customerValue = scope ? _.bind(customerValue, scope) : customerValue;
            promise = Q(customerValue(that.getValue()));
        } else {
            promise = customerValue;
        }
        return promise.then(function(e) {
            if (_.isArray(e)) {
                errors = errors.concat(e);
            } else if (_.isString(e)) {
                errors.push(e);
            }
            return Q(errors);
        });
    }
    this.promise = this.promise.then(wrapper);
    return this;
};

for (var name in new Check()) {
  (function(functionName) {
  Value.prototype[functionName] = function() {
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
  })(name); // jshint ignore:line
}

module.exports = function(field, input){
  return new Value(field, input);
};
