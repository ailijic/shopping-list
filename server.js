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
    // sanitize the input and return clean object
    const messageObj = Sanitize()
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
      console.log(storage);
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

  // Create Exports for Testing
  exports.app = app;
  exports.storage = storage;
}
