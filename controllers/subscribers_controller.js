var express = require('express');
var authorization = require('../middleware/authorization');
var models = require('../models');
var Subscriber = models.Subscriber;

var subscribers = express.Router();
var route = '/products/:product/subscribers'

subscribers.use(route, authorization);

subscribers.route(route)
.get(function subscribersGET(req, res, next) {
  res.status(200).json({
    location: route,
    product: req.params.product
  });
})
.post(function subscribersPOST(req, res, next) {
  Subscriber.create(req.body)
  .then(function(s) {
    res.status(201).json(s);
  })
  .catch(function(err) {
    console.error('Subscriber failed to save.');
    res.status(400).json(err);
  });
});

var instanceRoute = '/products/:product/subscribers/:subscriber';

subscribers.use(instanceRoute, authorization);

subscribers.route(instanceRoute)
.delete(function subscribersDELETE(req, res, next) {
  Subscriber.destroy(req.params.subscriber)
  .then(function(s) {
    res.status(204);
  })
  .catch(function(err) {
    console.error('Failed to destroy row');
    res.status(500).json(err);
  })
});

module.exports = subscribers;
