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



// Validate Unique Genre
// GenreSchema.path('name').validate(function(v, fn) {
//   console.log('value=' + v);
//   // Make sure the Genre is not already exists
//   var GenreModel = mongoose.model('Genre');
//   GenreModel.findOne({'name': v.toLowerCase()}, function (err, genres) {
//     fn(err || genres.length === 0);
//   });
// }, 'Genre is already exists.');

// http://mongoosejs.com/docs/validation.html#built-in-validators
// http://mongoosejs.com/docs/api.html#model_Model.findOneAndUpdate
GenreSchema.path('name').validate(function (value, done) {
  console.log('{[GenreModel]} unique value = ' + value);
  var GenreModel = mongoose.model('Genre');
  console.log('{[GenreModel]} id = ' + this.id);
  GenreModel.count({ name: new RegExp(value, 'i') }, function (error, count) {
    console.log('{[GenreModel]} error = ' + error);
    console.log('{[GenreModel]} count = ' + count);
    // Return false if an error is thrown or count > 0
    done(!(error || count));
  });
}, 'Genre is already exists.');

// export model
module.exports = mongoose.model('Genre', GenreSchema);
