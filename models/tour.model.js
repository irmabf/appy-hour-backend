const mongoose = require("mongoose");
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tour title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab maiores.",
    },
    city: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      default: "/img/tour-def-icon.svg",
    },
    recommended: {
      type: Boolean,
      default: false,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      //required: true,
      ref: "User",
    },
    // TO DO: Comprobacion de que el placeId debe ser unique
    places: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Place",
        },
      ],
      // unique: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
  { timestamps: true }
);

tourSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "tour",
  justOne: false,
});

tourSchema.post("remove", function (next) {
  Promise.all([Comment.deleteMany({ place: this._id })]).then(next);
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
