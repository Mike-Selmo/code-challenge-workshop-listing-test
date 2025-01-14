
const winston = require('winston');
const moment = require('moment');

const mongoose = require('mongoose');

const userService = require('../user/user.service');

const Workshop = require('./workshop.model');

exports.getById = async (id) => {
  try {
    winston.debug(`Workshop service getting by id ${id}`);
    return await Workshop.findById(id);
  } catch (err) {
    winston.error(`Workshop Service: Error getting workshop by id ${id}`);
    winston.debug(err);
    return false;
  }
}

exports.getNearby = async (id, longitude, latitude) => {
  try {
    winston.debug('Workshop service getting nearby workshops');
    // If coordinates are not specified just get the workshops as they are from the DB
    let workshops;
    if (longitude && latitude) {
      workshops = await Workshop.find(
        // Core Functionality: As a User, I can display the list of workshops sorted by distance
        {
          location:
          { $near :
             {
               $geometry: { type: "Point",  coordinates: [longitude, latitude] }
             }
          }
        }
      ).exec();
    } else {
      workshops = await Workshop.find();
    }

    // Get Special workshops ( liked & disliked )
    let likedWorkshops = await userService.getLikedWorkshops(id);
    let dislikedWorkshops = await userService.getDislikedWorkshops(id);
    let specialWorkshops = [...likedWorkshops, ...dislikedWorkshops];
    console.log(specialWorkshops);
    // If Liked || if Disliked less than two hours don't show
    for (let i = 0 ; i < workshops.length ; i++) {
      for (let sp of specialWorkshops) {
        if (workshops[i]._id.toString() === sp.workshopId.toString()) {
          if (sp.likedTime) {
            // Secondary Functionality: As a User, I can like a workshop, so it can be added to my preferred workshops
            workshops.splice(i, 1);
          } else if (sp.dislikedTime) {
            // Bonus: As a User, I can dislike a workshop, so it won’t be displayed within “Nearby WorkShops” list during the next 2 hours
            let hours = moment().diff(moment(sp.dislikedTime), 'hours');
            if( hours < 2){
              workshops.splice(i, 1);
            }
          }
        }
      }
    }
    return workshops;
  } catch (err) {
    winston.error('Workshop service Error: could not get nearby workshops');
    winston.debug(err);
    return false;
  }
};

exports.getPreferred = async (id) => {
  try {
  workshops = await Workshop.find();
  let likedWorkshops = await userService.getLikedWorkshops(id);
  respWorkshops = [];
  for (let i = 0 ; i < workshops.length ; i++) {
    for (let li of likedWorkshops) {
      if (workshops[i]._id.toString() === li.workshopId.toString()) {
        if (li.likedTime) {
          //Setting a virtual value for preferred to change front end like button
          workshops[i].set('preferred', true);
          respWorkshops.push(workshops[i]);
        }
      }
    }
  }
     return respWorkshops;
  } catch (err) {
    winston.error(`Workshop Service: Error getting preferred workshops`);
    winston.debug(err);
    return false;
  }
}
