const winston = require('winston');

const User = require('./user.model');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const JWT_SECRET = require('../../config/web')[process.env.NODE_ENV || 'dev']["JWT_SECRET"];

exports.generateToken = (userObj) => {
  return jwt.sign({
    id: userObj.id,
    name: userObj.name,
    email: userObj.email
  }, JWT_SECRET, {expiresIn: 3600});
};

exports.add = async (userObj) => {
  let user = new User();
  user.name = userObj.name;
  user.email = userObj.email;
  user.password = bcrypt.hashSync(userObj.password, 10);

  try {
    await user.save();
    return true;
  } catch (err) {
    winston.error('UserService: Error adding user');
    return false;
  }
};


exports.getLikedWorkshops = async (id) => {
  try {
    let user = await User.findById(id);
    return user.likedWorkshops;
  } catch (err) {
    winston.error(`User Service: Error getting liked workshops for user with ID ${id}` );
    return null ;
  }
};

exports.getDislikedWorkshops = async (id) => {
  try {
    let user = await User.findById(id);
    return user.dislikedWorkshops;
  } catch (err) {
    winston.error(`User Service: Error getting disliked workshops for user with ID ${id}` );
    return null ;
  }
};

exports.likeWorkshop = async (idUser, workshop) => {
  try {
    let user = await User.findById(idUser);
    //If we just save the workshop id - the schema will default the time to now
    user.likedWorkshops.push({workshopId:workshop._id});
    await user.save();
    return true;
  } catch (err) {
    winston.error(`User Service: updating liked workshops for user ${idUser}` );
    return false;
  }
};

exports.unlikeWorkshop = async (idUser, workshop) => {
  winston.debug(`User Service : Un-liking workshop ${workshop.name} by user ${idUser}`);

  try {
    let user = await User.findById(idUser);
    // check if the workshop is already in the array, if yes update only the time.
    for (let [index, el] of user.likedWorkshops.entries()) {
      if (el.workshopId.equals(workshop._id)) {
        winston.debug('Found Workshop to be removed !');
        user.likedWorkshops.splice(index,1);
        break;
      }
    }
    await user.save();
    return true;
  } catch (err) {
    winston.error(`User Service: Error in un-liking workshop ${idWorkshop} by user ${idUser}`);
    winston.debug(err);
    return false;
  }
};

exports.dislikeWorkshop = async (idUser, workshop) => {
  // Bonus: As a User, I can dislike a workshop, so it won’t be displayed within “Nearby WorkShops” list during the next 2 hours
  try {
    let user = await User.findById(idUser);
    //If we just save the workshop id - the schema will default the time to now
    user.dislikedWorkshops.push({workshopId:workshop._id});
    await user.save();
    return true;
  } catch (err) {
    winston.error(`User Service: updating disliked workshops for user ${idUser}` );
    return false;
  }
};