var chai = require('chai'),
    expect = chai.expect,
    value = require('../').value,
    check = require('../').check,
    _ = require('lodash');
describe('check', function() {
  it('should chain validators passed in as arguments', function(done) {
    check({a: 'Word', b: 'Word 2'})
    .where(
        value('a').isInt(),
        value('b').isInt()
    )
    .then(function(errorObject) {
      expect(errorObject).to.be.an('object');
      expect(errorObject.a.length, 'Error Count').to.equal(1);
      expect(errorObject.b.length, 'Error Count').to.equal(1);
    })
    .then(done, done);
  });

  it('should chain validators passed in as an array', function(done) {
    check({a: 'Word', b: 'Word 2'})
    .where([
      value('a').isInt(),
      value('b').isInt()
    ])
    .then(function(errorObject) {
      expect(errorObject.a.length, 'Error Count').to.equal(1);
      expect(errorObject.b.length, 'Error Count').to.equal(1);
    })
    .then(done, done);
  });

  it('should not include keys for valid inputs', function(done) {
    check({a: 'Word',b:9})
    .where(
      value('a').isInt(),
      value('b').isInt()
    )
    .then(function(errorObject) {
      expect(errorObject.a.length, 'Error Count').to.equal(1);
      expect(_.has(errorObject,'b'),'Key found').to.equal(false);
    })
    .then(done, done);
  });

  it('should not include an errorObject for completely valid inputs', function(done) {
    check({b:9})
    .where(
      value('b').isInt()
    )
    .then(function(errorObject) {
      expect(errorObject,'Error Object').to.equal(undefined);
      expect(_.has(errorObject,'b'),'Key found').to.equal(false);
    })
    .then(done, done);
  });

  it('should join errors based upon field name', function(done) {
    check({a: 'Word'})
    .where(
      value('a').isInt(),
      value('a').isInt()
    )
    .then(function(errorObject) {
      expect(errorObject.a.length, 'Error Count').to.equal(2);
    })
    .then(done, done);
  });
 
  it('should allow you to set the data after creation', function(done) {
    var c = check()
    .where(
      value('a').isInt(),
      value('a').isInt()
    );
    c.set({a: 'Word'});
    c.then(function(errorObject) {
      expect(errorObject.a.length, 'Error Count').to.equal(2);
    })
    .then(done, done);
  });

});
