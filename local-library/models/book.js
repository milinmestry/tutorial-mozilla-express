var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var BookSchema = Schema(
  {
    title: {type: String, required: true, max: 1000},
    author: {type: Schema.ObjectId, ref: 'Author', required: true},
    summary: {type: String, required: true, max: 3000},
    isbn: {type: String, required: true},
    genre: [{type: Schema.ObjectId, ref: 'Genre'}],
  }
);

// Virtual book url
BookSchema
.virtual('url')
.get(function () {
  return '/catalog/book/' + this._id;
});

// export model
module.exports = mongoose.model('Book', BookSchema);