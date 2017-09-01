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
exports.author_create_get = function(req, res, next) {
  res.render('author_form', {title: 'Create Author'});
};

// Display author create form on POST
exports.author_create_post = function(req, res, next) {
  req.checkBody('first_name', 'First name is required.').notEmpty();
  req.checkBody('family_name', 'Family name is required.').notEmpty();
  req.checkBody('family_name', 'Family name is required.').isAlpha();
  // req.checkBody('date_of_birth', 'Invalid date').optional({checkFalsy: true}).isDate();
  // req.checkBody('date_of_death', 'Invalid date').optional({checkFalsy: true}).isDate();

  req.sanitize('first_name').escape();
  req.sanitize('first_name').trim();
  req.sanitize('family_name').escape();
  req.sanitize('family_name').trim();
  req.sanitize('date_of_birth').toDate();
  req.sanitize('date_of_death').toDate();

  var errors = req.validationErrors();
  var author = new Author({
    first_name: req.body.first_name,
    family_name: req.body.family_name,
    date_of_birth: req.body.date_of_birth,
    date_of_death: req.body.date_of_death,
  });

  if (errors) {
    res.render('author_form', {title: 'Create Author', errors: errors, author: author});
    return;
  } else {
    // Save the form data into Database
    author.save(function(err) {
      if (err) {
        return next(err);
      }
      res.redirect(author.url_list);
    });
  }
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
