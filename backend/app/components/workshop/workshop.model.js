
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const WorkshopSchema = new Schema({
  picture: {type: String, default: ''},
  name: {type: String, default: ''},
  email: {type: String},
  city: {type: String},
  location: {
    type: {type: String, default: 'Point'},
    coordinates: [Number]
  }
});
WorkshopSchema.set('toObject', { virtuals: true })
WorkshopSchema.set('toJSON', { virtuals: true })

WorkshopSchema.virtual('preferred')
.get(function() { return this._preferred; })
.set(function(pref) { this._preferred = pref; });

const Workshop = mongoose.model('Workshop', WorkshopSchema);

module.exports = Workshop;
