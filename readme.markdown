# promise-to-validate

## Install
`npm install promise-to-validate`

=======
## Introduction
Validating is always a repetitive but important portion of developing any application. If your projects are anything like mine you end up spending too much of your time making sure that the input that you were given actually makes sense.

The goal of promise-to-validate is to make validation as simple and effortless as possible. It will support custom validators and allow you to make async validation requests to check your users' input.

### Example
```
var check = require('promise-to-validate').check;
var value = require('promise-to-validate').value;

var input = {
  voltron: "made of cats",
  ducks: "MUST wear pants",
  number: null,
  int: 9
};
check(input)
.where(
  value("voltron").isInt().isNull(),
  value("number").isNull(),
  value("ducks")
    .isEmail()
    .custom(function(){
      return "Error";
    })
)
.valid(function(){
  //called if no invalid fields are found
})
.invalid(function(){
  //called if an invalid field is found
})
.then(function(errors){
  var expected = { 
    voltron: [ 'Invalid integer', 'String is not empty' ],
    ducks: [ 'Invalid email', 'Error' ]
  };
});
```
#### check

Check is a function used for chaining multiple fields on an input object. The check interface offers a few methods. Every method in check returns a reference to the current check object.

```
var check = require('promise-to-validate').check;

check(obj);
//builds a new checking object with the object to be validated to be set to obj.

check().set(obj)
// sets the object that is the target of validation to obj.


check(obj)
  .where([values]);
//Adds a list of value objects to the list of values with validation specification.


function success(errorObject){}
function fail(ex){}

check(obect).where[values]()
  .then(success,fail);
//success is called with an object containing a key with any fields that have invalid values.
//fail is only called when an exception is thrown inside a custom validator. 
```


#### value
The value object returns a builder that has a collection of validation methods. For a list of all of the validation functions supported you can see the underlying library [node-validator](https://github.com/chriso/validator.js/tree/316c6e62140b02f512cb7c3de57d4e407546fb71) proxied by the value class. 

### Install
`npm install promise-to-validate`

![VIM!]( http://www.vim.org/images/vim_on_fire.gif) [![Build Status](https://travis-ci.org/ferentchak/PromiseToValidate.png?branch=master)](https://travis-ci.org/ferentchak/PromiseToValidate) 
