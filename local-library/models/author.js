var moment = require('moment');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var AuthorSchema = Schema(
  {
    first_name: {type: String, required: true, max: 100},
    family_name: {type: String, required: true, max: 100},
    date_of_birth: {type: Date},
    date_of_death: {type: Date},
  }
);

// Virtual for Author's full name
AuthorSchema
  .virtual('name')
  .get(function () {
    return this.family_name + ', ' + this.first_name;
  });


// Virtual for Author's URL
AuthorSchema
  .virtual('url')
  .get(function () {
    return '/catalog/author/' + this._id;
  });

// Virtual for Author's date_of_death
AuthorSchema
  .virtual('date_of_birth_formatted')
  .get(function () {
    return this.date_of_birth ? moment(this.date_of_birth).format('MMMM Do, YYYY') : 'N.A.';
  });

// Virtual for Author's date_of_death
AuthorSchema
  .virtual('date_of_death_formatted')
  .get(function () {
    return this.date_of_death ? moment(this.date_of_death).format('MMMM Do, YYYY') : 'N.A.';
  });

// Virtual for Author's lifespan
AuthorSchema
  .virtual('lifespan')
  .get(function () {
    var dob = this.date_of_birth ? moment(this.date_of_birth).format('MMMM Do, YYYY') : null;
    var dod = this.date_of_death ? moment(this.date_of_death).format('MMMM Do, YYYY') : null;

    if (dob === null && dod === null) {
      return '';
    } else {
      if (dod === null) {
        return '(' + dob + ')';
      } else {
        return '(' + dob + ' - ' + dod + ')';
      }
    }
  });

// export model
module.exports = mongoose.model('Author', AuthorSchema);
