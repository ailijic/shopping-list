"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

let Storage = { 
  add: function (name, id) {
    const idCool = id || this.setId
    let item = {name: name, id: idCool};
    this.items.push(item);
    this.setId = (idCool + 1) || (setId + 1);
    return item;
  },
};

// TODO Recreate object to use dic instead of array
let createStorage = function () {
  let storage = Object.create(Storage);
  storage.items = [];
  storage.setId = 1;
  return storage;
};

let storage = createStorage();

storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');
///////////////////////////////////////////////////
    console.log(storage);
//////////////////////////////////////////////////

storage.removeId = function (id) {
  let deleteMe = this.items.findIndex((valObj, index, array) => {
    if (valObj.id == id) {
      return true;
    }
  });
  this.items.splice(deleteMe, 1);
};

const app = express();
app.use(express.static('public'));

// CRUD Handlers
app.get('/items', (request, response) => {
  response.json(storage.items);
});

app.post('/items', jsonParser, (request, response) => {
  if ( !('name' in request.body)) {
    return response.sendStatus(400);
  }
  const item = storage.add(request.body.name);
  console.log(storage);
  response.status(201).json(item);
});

app.delete('/items/:id', jsonParser, (request, response) => {
  const id = parseInt(request.params.id);
  if (idExists(id)) {
    storage.removeId(id);
    return response.sendStatus(200);
  } else {
    return response.status(404).json({ message: "Id not found" });
  }
});
// !!! Not good use of memory !!!
app.put('/items/:id', jsonParser, (request, response) => {
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
    // console.log(storage);
    return response.status(200).json(record);
  } else {
    /*
    // ??? What is a functional way to do this ???
    while (storage.items.length < id-1) {
      storage.add("");
  }
    */
    const item = storage.add(request.body.name, id);
     console.log(storage);
    return response.status(200).json(item);
  }

  function isMessageBodyMalformed (obj) {
    const nameExists = obj.hasOwnProperty("name");
    const idExists = obj.hasOwnProperty("id");
// !!! IS THIS BAD CODE ??? !!!    
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

app.listen(process.env.PORT || 8080, process.env.IP);

function idExists (id) {
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
