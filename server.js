start();
function start() {
  "use strict";

  // Import Thinkful Code
  const mod = require('./rest_module.js');
  const storage = mod.storage;
  const app = mod.app;

  // Import Helper Modules
  // const express = require('express');
  const bodyParser = require('body-parser');
  const jsonParser = bodyParser.json();

  // Extend the Storage object to remove items
  storage.removeId = function (id) {
    let deleteMe = this.items.findIndex((valObj, index, array) => {
      if (valObj.id == id) {
        return true;
      }
    });
    this.items.splice(deleteMe, 1);
  };

  //Extend Storage object for PUT items
  storage.put = function (item) {
    const getIndex = function getIndex(id) {
      const equalToId = function equalToId(value, index, array) {
        return (value.id === id);
      }
      return storage.items.findIndex(equalToId);
    }

    const indexNotFound = -1;
    if (getIndex(item.id) === indexNotFound) {
      // add new record
      let newItem = this.add(item.name);
      newItem.id = item.id;
    } else {
      this.items[getIndex(item.id)].name = item.name;
    }
  }


  // CRUD Handlers
  // // GET defined in rest_module.js
  // // POST defined in rest_module.js

  // DELETE
  app.delete('/items/:id', jsonParser, (request, response) => {
    const id = parseInt(request.params.id);
    if (idExists(id)) {
      storage.removeId(id);
      return response.sendStatus(200);
    } else {
      return response.status(404).json({ message: "Id not found" });
    }
  });

  function idExists(id) {
    const IndexVal = storage.items.findIndex((valObj) => {
      if (valObj.id === id) {
        return true;
      }
    });
    const arrayIndexNotFound = -1;
    if (IndexVal === arrayIndexNotFound) {
      return false;
    } else {
      return true;
    }
  }

  // PUT
  // * If id is edited the server will respond with 200 OK
  //   and return the modified item via JSON
  // * Sanitize the user input and 
  //   give descriptive errors for the following:
  //   - Params :id must be an integer
  //   - The request.body must have an ['id'] and ['name'] property.
  //   - Strip out everything in the request except for .id and .name 
  //   - Params ID must match the ID in the body object (===)
  app.put('/items/:id', jsonParser, (request, response) => {
    let putObj = {
      status: undefined,
      retMsg: "",
      record: {}, // {id: id, name: String},
    };
    

    // Sanitize the input and return object with only Name & ID
    putObj = sanitize(request);

    putObj = (function setStatus() {
      switch (false) {
        case doesIdParamsMatchIdBody(request.params.id, request.body.id):
          putObj.status = 404;
          putObj.retMsg = 'Ids do not match';
          putObj.record = {message: putObj.retMsg};
          break;
        default:
          putObj.status = 200;
          putObj.retMsg = putObj.record;
      }
      return putObj;
    }) ();

    // UpdateDB
    if (putObj.status === 200) {
      storage.put(putObj.record);
    }
    
    // return response
    //    console.log(putObj);
    return response.status(putObj.status).json(putObj.retMsg);

    function doesIdParamsMatchIdBody (int1, int2) {
      if (int1 === int2) {
        return true;
      } else {
        return false;
      }
    }

    function sanitize(request) {
      const name = request.body.name;
      const id = request.body.id;
      let retString = '';
      switch (true) {
        case (name === undefined):
          console.log("ERR: Name undefined");
          putObj.status = 404;
          retString = "Message body missing name property";
          putObj.retMsg = {message: retString};
          break;
        case (typeof(name) !== 'string'):
          console.log("ERR: Name is not a string");
          putObj.status = 404;
          retString = "Name is not a string";
          putObj.retMsg = {message: retString};
          break;
        case (id === undefined):
          console.log("ERR: ID is undefined");
          putObj.status = 404;
          retString = "Message body ID is not defined";
          putObj.retMsg = {message: retString};
          break;
        case (typeof(id) !== "number"):
          console.log("ERR: ID is not a number");
          putObj.status = 404;
          retString = "ID is not a number";
          putObj.retMsg = {message: retString};
          break;
        default:
          putObj.record.name = name;
          putObj.record.id = id;
      }
      return putObj;
    }
  });

/*

    const id = parseInt(request.params.id);
    const messageBody = request.body;
    isMessageBodyMalformed(messageBody);
    if ( ! doesIdParamsMatchIdBody(id, messageBody.id)) {
        return response.status(404).json(
          { message: "ID in Params does not match ID in Message" });
    }
    if (idExists(id)) {
      const IndexVal = storage.items.findIndex((valObj) => {
        if (valObj.id === id) {
          return true;
        }
      });
      const record = storage.items[IndexVal];
      record.name = messageBody.name;
      return response.status(200).json(record);
    } else {
      const item = storage.add(request.body.name, id);
      // console.log(storage);
      return response.status(200).json(item);
    }

    function isMessageBodyMalformed (obj) {
      const nameExists = obj.hasOwnProperty("name");
      const idExists = obj.hasOwnProperty("id");
      const nameIsString = nameExists && typeof obj.name === "string";
      const goodMessage = nameExists && idExists && nameIsString;
      if (goodMessage) {
        return;
      } else {
        return response.status(404).json({ message:
          "Either, missing prop name, " +
          "missing prop id, or prop name is not a string."
        });
      }
    }
    function doesIdParamsMatchIdBody (int1, int2) {
      if (int1 === int2) {
        return true;
      } else {
        return false;
      }
    }

    return response.sendStatus(400).json({ message: "Something went wrong:" });
  });

*/

  // Create Exports for Testing
  exports.app = app;
  exports.storage = storage;
}
