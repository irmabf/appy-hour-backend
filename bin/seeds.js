require("dotenv").config();
require("../config/db.config");
const User = require("../models/User.model");
const faker = require("faker");

const userIds = [];
const userN = 30;

Promise.all([User.deleteMany()])
  .then(() => {
    for (let i = 0; i < userN; i++) {
      const user = new User({
        email: faker.internet.email(),
        password: "1234567890",
        name: faker.name.findName(),
        address: faker.address.streetAddress(),
        image: faker.image.avatar(),
      });
      user
        .save()
        .then((u) => {
          console.log(u.email);
          userIds.push(u.id);
        })
        .catch((e) => console.log(e));
    }
  })
  .catch((e) => console.log(e));
