const Place = require("../models/place.model");
const Tour = require("../models/tour.model");
const User = require("../models/user.model");

module.exports.save = (req, res, next) => {
  const tourId = req.params.id;
  const placeFromApi = req.body;
  const place = new Place({
    ...placeFromApi,
    openingHours: placeFromApi.opening_hours.weekday_text,
    address: placeFromApi.formatted_address,
    priceLevel: placeFromApi.price_level,
  });

  place
    .save()
    .then((p) => {
      Tour.findByIdAndUpdate(
        tourId,
        { $push: { places: p } },
        { runValidators: true, new: true, useFindAndModify: false }
      ).then((tour) => {
        console.log("tour", tour);
      });
      Tour.findByIdAndUpdate(
        tourId,
        { $set: { image: p.image } },
        { runValidators: true, new: true, useFindAndModify: false }
      ).then((tour) => {
        console.log("tour", tour);
      });

      res.json(p);
    })
    .catch((error) => {
      if (false) {
        User.find({ staff: true })
          .then((staffUsers) => {
            throw createError(404, "Tour not found");
          })
          .catch(next);
      } else {
        next(error);
      }
    });
};

module.exports.getPlaces = (req, res, next) => {
  const tourId = req.params.id;
  Tour.findById(tourId)
    .populate("places")
    .then((t) => {
      if (t) {
        //const placesInTour = tour.places;
        res.json(t.places);
      } else {
        console.log("Couldn´t update tour with list of places");
      }
    })
    .catch(next);
};

module.exports.list = (req, res, next) => {
  Place.find()
    .then((places) => {
      res.json(places);
    })
    .catch((e) => next(e));
};

// GET /places/:id
module.exports.getPlace = (req, res, next) => {
  Place.findById(req.params.id)
    .then((p) => {
      if (!p) {
        throw createError(404, "Tour not found");
      }
      res.json(p);
    })
    .catch(next);
};

module.exports.delete = (req, res, next) => {
  const tourId = req.body.tourId;
  Place.findByIdAndDelete(req.params.place).then((places) => {
    Tour.findByIdAndUpdate(
      tourId,
      {
        $pull: { places: req.params.place },
      },
      { runValidators: true, new: true, useFindAndModify: false }
    )
      .populate("places")
      .then((tour) => {
        if (tour) {
          // res.redirect(`/tours/form-2/added/${tour.id}`);
          res.json(tour);
        } else {
          console.log("Couldn´t update tour with list of places");
        }
      })
      .catch(next);
  });
};
