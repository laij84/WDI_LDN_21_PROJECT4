var Event = require('../models/event');

function eventIndex(req, res) {

  var params = {
    user: req.user._id
  };

  if(req.query.start) params.start = { $gte: req.query.start };
  if(req.query.end) params.end = { $lt: req.query.end };

  Event.find(params)
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
    .then(function(event) {
      res.status(200).json(event);
    })
    .catch(function(err) {
      console.log(err);
      res.status(500).json(err);
    });
}

function eventCreate(req, res) {

  req.body.user = req.user;

  Event.create(req.body)
    .then(function(event) {
      return Event.findById(event._id);
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
  console.log("updating event...");
  Event.findById(req.params.id)
    .then(function(event) {
      console.log(event.user);
      if(event.user != req.user._id) {
        throw new Error("Unauthorized User");
      }

      for(key in req.body) event[key] = req.body[key];
      return event.save();
    })
    .then(function(event) {
      console.log("event saved...");
      return Event.findById(event._id);
    })
    .then(function(event) {
      console.log("sending resposne...");
      return res.status(200).json(event);
    })
    .catch(function(err) {
      if(err.message === "Unauthorized User") {
        return res.status(401).json({ message: err.message });
      }
      return res.status(500).json(err);
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
