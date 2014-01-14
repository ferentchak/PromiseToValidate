var chai = require('chai'),
    expect = chai.expect,
    value = require('../').value,
    Q = require('q');
describe('value', function() {
  describe('basic validation', function() {
    it('should check if not an int', function(done) {
      value("a", {a: "Word"})
      .isInt()
      .then(function(errors) {
        expect(errors.length, "Error Count").to.equal(1);
      })
      .then(done, done);
    });

    it('should return no errors for valid input', function(done) {
      value('a', {a: 9})
      .isInt()
      .then(function(errors) {
        if(errors.length) console.log(errors);
        expect(errors.length, "Error Count").to.equal(0);
      })
      .then(done, done);
    });

    it('should allow the validation data to be added after object creation', function(done) {
      var v = value('a')
        .custom(function (value){
          expect(value,"Value not passed").to.equal("value");
          return "Expected";
        })
        .set({a: "value"})
        .then(function(errors) {
          expect(errors[0]).to.equal("Expected");
        })
        .then(done, done);
    });

    it('should error if no validation data is set', function(done) {
      value()
      .then(function() {
      done(new Error("Error function not passed to fail callback"));
      })
      .fail(function(error) {
        done();
      });
    });

    it('should validate multiple conditions ', function(done) {
      value("a", {a: ""})
      .isInt()
      .len(2, 100)
      .then(function(errors) {
          expect(errors.length).to.equal(2);
      })
      .then(done, done);
    });
  });

  describe('custom validator', function() {
    it('should allow chained asynchronous functions returning strings or arrays', function(done) {
      value("a", {a: 9})
      .isInt()
      .custom(function(value) {
        return Q(["Broken"]);
      })
      .custom(Q(["a", "b"]))
      .then(function(errors) {
        expect(errors.length, errors.length + " errors returned").to.equal(3);
        expect(errors[0]).to.equal("Broken");
      })
      .then(done, done);
    });
    it('should allow synchronous functions', function(done) {
      value("key", {key: "Tacos"})
      .custom(function(value) {
        expect(value).to.equal('Tacos');
        return ["Broken"];
      })
      .then(function(errors) {
        expect(errors.length).to.equal(1);
        expect(errors[0]).to.equal("Broken");
      })
      .then(done, done);
    });
    it('should allow scope to be passed with function', function(done) {
      value("a", {a: ""})
      .custom(function() {
        expect(this.test).to.equal("scope");
      }, {
        test: "scope"
      })
      .then(function(errors) {})
      .then(done, done);
    });
    it('should catch errors called and forward to error condition', function(done) {
      value("a", {a: ""})
      .custom(function() {
          throw (new Error("Expected to be thrown"));
      })
      .then(function() {
          done(new Error("Error function not passed to fail callback"));
      })
      .then(null,function(error) {
          done();
      });
    });
  });
});
