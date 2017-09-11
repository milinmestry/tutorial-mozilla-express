var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var GenreSchema = Schema({
  name: {type: String, required: true, min:3, max: 100},
  description: {type: String, max: 500},
});

// Validate Unique Genre
// GenreSchema.path('name').validate(function(v, fn) {
//   console.log('value=' + v);
//   // Make sure the Genre is not already exists
//   var GenreModel = mongoose.model('Genre');
//   GenreModel.findOne({'name': v.toLowerCase()}, function (err, genres) {
//     fn(err || genres.length === 0);
//   });
// }, 'Genre is already exists.');

GenreSchema.path('name').validate(function (value, done) {
  console.log('unique value=' + value);
  Genre.count({ name: value.toLowerCase() }, function (error, count) {
    // Return false if an error is thrown or count > 0
    done(!(error || count));
  });
}, 'unique');

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

// export model
module.exports = mongoose.model('Genre', GenreSchema);
