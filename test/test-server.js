start();
function start() {
  "use strict";

  const chai = require('chai');
  const chaiHttp = require('chai-http');
  const server = require('../server.js');

  const should = chai.should();
  const app = server.app;
  const storage = server.storage;

  chai.use(chaiHttp);

  describe('Shopping List', function() {
    let id = null;
    it('should list items on GET', (done) => {
      chai.request(app)
        .get('/items')
        .end((err, res) => {
          id = res.body[0].id;
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body.should.have.length(3);
          res.body[0].should.be.a('object');
          res.body[0].should.have.property('id');
          res.body[0].should.have.property('name');
          res.body[0].id.should.be.a('number');
          res.body[0].name.should.be.a('string');
          res.body[0].name.should.equal('Broad beans');
          res.body[1].name.should.equal('Tomatoes');
          res.body[2].name.should.equal('Peppers');
          done();
        });
    });
    it('should add an item on POST', (done) => {
      chai.request(app)
        .post('/items')
        .send({'name': 'Kale'})
        .end((err, res) => {
          should.equal(err, null);
            res.should.have.status(201);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('name');
            res.body.should.have.property('id');
            res.body.name.should.be.a('string');
            res.body.id.should.be.a('number');
            res.body.name.should.equal('Kale');
            storage.items.should.be.a('array');
            storage.items.should.have.length(4);
            storage.items[3].should.be.a('object');
            storage.items[3].should.have.property('id');
            storage.items[3].should.have.property('name');
            storage.items[3].id.should.be.a('number');
            storage.items[3].name.should.be.a('string');
            storage.items[3].name.should.equal('Kale');
            done();
        });
    });
    it('should delete an item on DELETE', (done) => {
      const id = 2;
      const length = 3;
      chai.request(app)
        .delete('/items/' + id)
        .end((err, res) => {
            should.equal(err, null);
            res.should.have.status(200);
            res.should.not.be.json;
            res.body.should.be.a('object');
            res.body.should.deep.equal({});
            storage.items.should.be.a('array');
            storage.items.should.have.length(length);
            storage.items[id].should.be.a('object');
            storage.items[id].should.have.property('id');
            storage.items[id].should.have.property('name');
            storage.items[id].id.should.be.a('number');
            storage.items[id].name.should.be.a('string');
            storage.items[id].name.should.equal('Kale');
            done();
        });
    });
    it('should edit an item on put', (done) => {
      const id = 2;
      const length = 4;
      chai.request(app)
        .put('/items/' + id)
        .send({'name': 'Durian', 'id': id})
        .end((err, res) => {
            should.equal(err, null);
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('name');
            res.body.should.have.property('id');
            res.body.name.should.be.a('string');
            res.body.id.should.be.a('number');
            res.body.name.should.equal('Durian');
            storage.items.should.be.a('array');
            storage.items.should.have.length(length);
            storage.items[id].should.be.a('object');
            storage.items[id].should.have.property('id');
            storage.items[id].should.have.property('name');
            storage.items[id].id.should.be.a('number');
            storage.items[id].name.should.be.a('string');
            storage.items[id+1].name.should.equal('Durian');
            done();
        });
    });
    it('should POST to an ID that exists', (done) => {
      chai.request(app)
      .post('/items/')
      .send({'name': 'Peppers'})
      .end((err, res) => {
        should.equal(err, null);
        res.should.have.status(201);
        done();
      });
    });
    it('should not POST without body data', (done) => {
      chai.request(app)
      .post('/items/')
      .send({})
      .end((err, res) => {
        should.not.equal(err, null);
        res.should.have.status(400);
        done();
      });
    });
    it('should not POST with something other than valid JSON', (done) => {
      chai.request(app)
      .post('/items/')
      .send({'tom': '55'})
      .end((err, res) => {
        should.not.equal(err, null);
        res.should.have.status(400);
        done();
      });
    });
    it('should not PUT without an ID in the endpoint', (done) => {
      chai.request(app)
      .put('/items/')
      .send({'name': 'Soup', 'id': '5'})
      .end((err, res) => {
        should.not.equal(err, null);
        res.should.have.status(404);
        done();
      });
    });
    it('should not PUT with different ID in the endpoint than the body', (done) => {
      let id = 5;
      chai.request(app)
      .put('/items/' + (id+1))
      .send({'name': 'Soup', 'id': id})
      .end((err, res) => {
        should.equal(err, null);
        res.should.have.status(404);
        done();
      });
    });
    it("should not PUT to an ID that doesn't exist");
    it('should not PUT without body data');
    it('should not PUT with something other than valid JSON');
    it("should not DELETE an ID that doesn't exist");
    it('should not DELETE without an ID in the endpoint');
  });
}
