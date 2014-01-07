# promise-to-validate

A promise based wrapper of [node-validator](https://github.com/chriso/node-validator)

## Install
`npm install promise-to-validate`

## Introduction

Validating is always a repetitive but important portion of developing any application. If your projects are anything like mine you end up spending too much of your time making sure that the input that you were given actually makes sense.

The goal of promise-to-validate is to make validation as simple and effortless as possible. It will support custom validators and allow you to make async validation requests to check your users' input.

### Usage
```
var Check = require('promise-to-validate').Check;
var Validate = require('promise-to-validate').Validate;

var input = {
  voltron: "made of cats",
  ducks: "MUST wear pants",
  number:null
};
Check(input)
.use(
  Validate("voltron").isInt().isNull(),
  Validate("number").isNull(),
  Validate("ducks")
    .isEmail()
    .custom(function(){
      return "Error";
    })
)
.then(function(errors){
  console.log(errors);
  var expected = { 
    voltron: [ 'Invalid integer', 'String is not empty' ],
    number: [],
    ducks: [ 'Invalid email', 'Error' ] 
  };
});

```


[![Build Status](https://travis-ci.org/ferentchak/PromiseToValidate.png?branch=master)](https://travis-ci.org/ferentchak/PromiseToValidate)

