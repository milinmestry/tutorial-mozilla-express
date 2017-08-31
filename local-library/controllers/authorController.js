var Author = require('../models/author');
var Book = require('../models/book');

var async = require('async');
var mongoose = require('mongoose');


// Display list of all authors
exports.author_list = function(req, res, next) {
  Author.find()
    .sort([['family_name', 'ascending']])
    .exec(function(err, list_authors) {
      if (err) {
        return next(err);
      }
      // Render template
      res.render('author_list', {title: 'Author List', author_list: list_authors});
    });
};

// Display detail page for a specific author
exports.author_detail = function(req, res, next) {
  var id = mongoose.Types.ObjectId(req.params.id.trim());

  async.parallel({
    author: function(callback) {
      Author.findById(id).exec(callback);
    },
    authors_books: function(callback) {
      Book.find({'author': id}, 'title summary').exec(callback);
    }
  }, function(err, results) {
    if (err) {
      return next(err);
    }

    // Render template
    res.render('author_detail', {title: 'Author Detail', author: results.author
      , author_books: results.authors_books}
    );
  });
};

// Display author create form on GET
exports.author_create_get = function(req, res) {
  res.send('NOT IMPLEMENTED: author create GET');
};

// Display author create form on POST
exports.author_create_post = function(req, res) {
  res.send('NOT IMPLEMENTED: author create POST');
};

// Display author delete form on GET
exports.author_delete_get = function(req, res) {
  res.send('NOT IMPLEMENTED: author delete GET');
};

// Display author delete form on POST
exports.author_delete_post = function(req, res) {
  res.send('NOT IMPLEMENTED: author delete POST');
};

// Display author update form on GET
exports.author_update_get = function(req, res) {
  res.send('NOT IMPLEMENTED: author update GET');
};

// Display author update form on POST
exports.author_update_post = function(req, res) {
  res.send('NOT IMPLEMENTED: author update POST');
};
