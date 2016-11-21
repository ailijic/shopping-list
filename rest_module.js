start();
function start() {
  "use strict";

  var bodyParser = require('body-parser');
  var jsonParser = bodyParser.json();
  var express = require('express');

  // Define class
  var Storage = {
    add: function(name) {
      var item = {name: name, id: this.setId};
      this.items.push(item);
      this.setId += 1;
      return item;
    } 
  };

  // Create class instance
  var createStorage = function() {
    var storage = Object.create(Storage);
    storage.items = [];
    storage.setId = 1;
    return storage;
  }

  // Initalize class instance
  var storage = createStorage();
  storage.add('Broad beans');
  storage.add('Tomatoes');
  storage.add('Peppers');

  // CRUD Handlers
  var app = express();
  app.use(express.static('public'));

  app.get('/items', function(request, response) {
      response.json(storage.items);
  });

  app.post('/items', jsonParser, function(request, response) {
    if (!('name' in request.body)) {
      return response.sendStatus(400);
    }
    var item = storage.add(request.body.name);
    response.status(201).json(item);
  });

  app.listen(process.env.PORT || 8080, process.env.IP);
}
