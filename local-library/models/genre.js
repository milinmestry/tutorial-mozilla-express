var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var GenreSchema = Schema(
  {
    name: {type: String, required: true, min:3, max: 100},
    description: {type: String, max: 500},
  }
);


// Virtual for Author's URL
GenreSchema
.virtual('url')
.get(function () {
  return '/catalog/genre/' + this._id;
});

// export model
module.exports = mongoose.model('Genre', GenreSchema);