const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const petSchema = new Schema({
    name: {
        type: String,
        require: true,
    },
    type: {
        type: String,
        require: true,
    },
    breed: {
        type: String,
        require: true,
    },
    foodAllergies: {
        type: String,
        require: true,
    },
    congenitalDisease: {
        type: String,
        require: true,
    },
    image: {
        type: String,
        require: true,
    },
    description: String,
});

module.exports = mongoose.model("Pet", petSchema);

/*
ownerId
name
type (enum maybe)
breed
description
food allergies
congenital disease
image

{"_id":{"$oid":"6481d0bb39978b0a0231c418"},
  "ownerId":{"$oid":"6471d71b6c7bfa6eba972918"},
  "name": "Squishy",
  "type": "Cat",
  "breed": "Domestic Shorthair",
  "foodAllergies": "beef, chicken",
  "congenitalDisease": "none",
  "image": "https://img.youtube.com/vi/5jKZ9KGtee0/mqdefault.jpg"
}

https://img.youtube.com/vi/5jKZ9KGtee0/mqdefault.jpg
https://img.youtube.com/vi/sbS5RLB68bo/mqdefault.jpg
*/
