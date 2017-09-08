var moment = require('moment');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var BookInstanceSchema = Schema(
  {
    book: {type: Schema.ObjectId, ref: 'Book', required: true},
    imprint: {type: String, required: true},
    status: {type: String, required: true,
      enum: ['Available', 'Maintenance', 'Loaned', 'Reserved'],
      default: 'Maintenance'
    },
    due_back: {type: Date, default: Date.now},
  }
);

// Virtual book url
BookInstanceSchema
  .virtual('url')
  .get(function () {
    return '/catalog/bookinstance/' + this._id;
  });

// Virtual book url
BookInstanceSchema
  .virtual('url_list')
  .get(function () {
    return '/catalog/bookinstances';
  });

// Virtual formatted Date
BookInstanceSchema
  .virtual('due_back_formatted')
  .get(function () {
    return moment(this.due_back).format('MMMM Do, YYYY');
  });

// Virtual formatted Date for web form
BookInstanceSchema
  .virtual('due_back_formatted_form')
  .get(function () {
    return moment(this.due_back).format('YYYY-MM-DD');
  });

// export model
module.exports = mongoose.model('BookInstance', BookInstanceSchema);
