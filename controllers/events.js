var Event = require('../models/event');

function eventIndex(req, res) {
  Event.find()
    .then(function(events) {
      res.status(200).json(events)
    })
    .catch(function(err) {
      console.log(err);
      res.status(500).json(err);
    });
}

function eventShow(req, res) {
  Event.findById(req.params.id)
    .populate('director')
    .then(function(event) {
      res.status(200).json(event);
    })
    .catch(function(err) {
      console.log(err);
      res.status(500).json(err);
    });
}

function eventCreate(req, res) {
  Event.create(req.body)
    .then(function(event) {
      return Event.findById(event._id)
        .populate('director');
    })
    .then(function(event) {
      res.status(201).json(event);
    })
    .catch(function(err) {
      console.log(err);
      res.status(500).json(err);
    });
}

function eventUpdate(req, res) {
  Event.findById(req.params.id)
    .then(function(event) {
      for(key in req.body) event[key] = req.body[key];
      return event.save();
    })
    .then(function(event) {
      return Event.findById(event._id)
        .populate('director');
    })
    .then(function(event) {
      res.status(200).json(event);
    })
    .catch(function(err) {
      console.log(err);
      res.status(500).json(err);
    });
}

function eventDelete(req, res) {
  Event.findById(req.params.id)
    .then(function(event) {
      return event.remove();
    })
    .then(function() {
      res.status(204).end();
    })
    .catch(function(err) {
      console.log(err);
      res.status(500).json(err);
    });
}

module.exports = {
  index: eventIndex,
  show: eventShow,
  create: eventCreate,
  update: eventUpdate,
  delete: eventDelete
}
