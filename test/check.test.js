var chai = require('chai'),
    expect = chai.expect,
    Validate = require('../').Validate,
    Check = require('../').Check,
    Q = require('q');

describe('Check', function() {
    it('should chain validators passed in as arguments', function(done) {
      Check({a: "Word", b: "Word 2"})
      .use(
          Validate("a").isInt(),
          Validate("b").isInt()
      )
      .then(function(errorObject) {
        expect(errorObject).to.be.an('object');
        expect(errorObject.a.length, "Error Count").to.equal(1);
        expect(errorObject.b.length, "Error Count").to.equal(1);
      })
      .then(done, done);
    });

    it('should chain validators passed in as an array', function(done) {
      Check({a: "Word", b: "Word 2"})
      .use(
        [
          Validate("a").isInt(),
          Validate("b").isInt()
        ]
      )
      .then(function(errorObject) {
        expect(errorObject.a.length, "Error Count").to.equal(1);
        expect(errorObject.b.length, "Error Count").to.equal(1);
      })
      .then(done, done);
    });

    it('should join errors based upon field name', function(done) {
      Check({a: "Word"})
      .use(
        Validate("a").isInt(),
        Validate("a").isInt()
      )
      .then(function(errorObject) {
        expect(errorObject.a.length, "Error Count").to.equal(2);
      })
      .then(done, done);
    });
   
    it('should allow you to set the data after creation', function(done) {
      var c = Check()
      .use(
        Validate("a").isInt(),
        Validate("a").isInt()
      );
      c.set({a: "Word"})
      .then(function(errorObject) {
        expect(errorObject.a.length, "Error Count").to.equal(2);
      })
      .then(done, done);
    });
});

