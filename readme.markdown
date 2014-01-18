# promise-to-validate

A promise based wrapper of [node-validator](https://github.com/chriso/validator.js/tree/316c6e62140b02f512cb7c3de57d4e407546fb71)

## Install
`npm install promise-to-validate`

## Introduction

Validating is always a repetitive but important portion of developing any application. If your projects are anything like mine you end up spending too much of your time making sure that the input that you were given actually makes sense.

The goal of promise-to-validate is to make validation as simple and effortless as possible. It will support custom validators and allow you to make async validation requests to check your users' input.

### Usage
```
var check = require('promise-to-validate').check;
var value = require('promise-to-validate').value;

var input = {
  voltron: "made of cats",
  ducks: "MUST wear pants",
  number:null
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
  console.log(errors);
  var expected = { 
    voltron: [ 'Invalid integer', 'String is not empty' ],
    ducks: [ 'Invalid email', 'Error' ] 
  };
});
```


[![Build Status](https://travis-ci.org/ferentchak/PromiseToValidate.png?branch=master)](https://travis-ci.org/ferentchak/PromiseToValidate)

