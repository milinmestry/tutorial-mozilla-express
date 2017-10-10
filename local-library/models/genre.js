var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var GenreSchema = Schema({
  name: {type: String, required: true, min:3, max: 100, unique: true},
  description: {type: String, max: 500},
});

// Virtual for Genre URL
GenreSchema
  .virtual('url')
  .get(function () {
    return '/catalog/genre/' + this._id;
  });

// Virtual for Genre List
GenreSchema
  .virtual('url_list')
  .get(function () {
    return '/catalog/genres';
  });

// http://mongoosejs.com/docs/validation.html#built-in-validators
// http://mongoosejs.com/docs/api.html#model_Model.findOneAndUpdate
// GenreSchema.path('name').validate(function (value, done) {
//   var GenreModel = mongoose.model('Genre');
//
//   GenreModel.count({ name: new RegExp(value, 'i') }, function (error, count) {
//     // Return false if an error is thrown or count > 0
//     done(!(error || count));
//   });
// }, 'Genre is already exists.');

GenreSchema.query.isGenreExists = function (name, id) {
  console.log('isGenreExists:: name=' + name + ' , id=' + id);
  if (id !== undefined) {
    return this.count({ name: new RegExp(name, 'i'), _id: { $ne: id } });
  }

  return this.count({ name: new RegExp(name, 'i') });
};

// export model
module.exports = mongoose.model('Genre', GenreSchema);
