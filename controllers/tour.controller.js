const Tour = require("../models/tour.model");
const createError = require("http-errors");

module.exports.create = (req, res, next) => {
  const tour = new Tour({
    ...req.body,
    // creator: req.session.user.id,
  });

  tour
    .save()
    .then((t) => {
      res.json(t);
    })
    .catch((e) => next(e));
};

module.exports.list = (req, res, next) => {
  Tour.find()
    .then((tours) => {
      res.json(tours);
    })
    .catch((e) => next(e));
};

module.exports.listRegular = (req, res, next) => {
  Tour.find({ recommended: false })
    .then((tours) => {
      res.json(tours);
    })
    .catch((e) => next(e));
};

module.exports.listRecommended = (req, res, next) => {
  Tour.find({ recommended: true })
    .then((tours) => {
      res.json(tours);
    })
    .catch((e) => next(e));
};

module.exports.getTour = (req, res, next) => {
  Tour.findById(req.params.id)
    .populate("places")
    .then((t) => {
      if (!t) {
        throw createError(404, "Tour not found");
      }
      res.json(t);
    })
    .catch(next);
};

module.exports.delete = (req, res, next) => {
  Tour.findById(req.params.id)
    .then((t) => {
      if (!t) {
        throw createError(404, "Tour not found");
      } else {
        // if (t.creator != req.currentUser.id) {
        if (false) {
          throw createError(
            403,
            "You cannot delete products that aren't yours"
          );
        } else {
          res.json({});
        }
      }
    })
    .catch((e) => next(e));
};
