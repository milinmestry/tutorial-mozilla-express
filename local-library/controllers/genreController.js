var Genre = require('../models/genre');
var Book = require('../models/book');

var async = require('async');

// Display list of all Genre
exports.genre_list = function(req, res, next) {
  Genre.find()
    .sort([['name', 'ascending']])
    .exec(function(err, list_generes) {
      if (err) {
        return next(err);
      }
      // View render
      res.render('genre_list', {title: 'Genre List', genre_list: list_generes});
    });
};

// Display detail page for a specific Genre
exports.genre_detail = function(req, res, next) {
  async.parallel(
    {
      genre: function(callback) {
        Genre.findById(req.params.id).exec(callback);
      },
      genre_books: function(callback) {
        Book.find({'genre': req.params.id}).exec(callback);
      },
    }, function(err, results) {
      if (err) {
        return next(err);
      }
      // Success, render template
      res.render('genre_detail', {
        title: 'Genre Details', genre: results.genre
        , genre_books: results.genre_books
      });
    }
  );
};

// Display Genre create form on GET
exports.genre_create_get = function(req, res, next) {
  res.render('genre_form', {title: 'Create Genre'});
};

// Handle Genre create on POST
exports.genre_create_post = function(req, res, next) {
  // Validate name field
  req.checkBody('name', 'Genre name required.').notEmpty();

  // Trim and escape the name field
  req.sanitize('name').escape();
  req.sanitize('name').trim();

  // Run the validator
  var errors = req.validationErrors();

  // Create a Genre object
  var genre = new Genre(
    {name: req.body.name}
  );

  // If errors display the form again, passing previously entered values and errors.
  if (errors) {
    res.render('genre_form', {title: 'Create Genre', genre: genre, errors: errors});
    return;
  } else {
    // Check if Genre name is already exists.
    Genre.findOne({'name': new RegExp(req.body.name, 'i')})
      .exec(function(err, found_genre) {
        console.log('Genre found: ' + found_genre);
        if (err) {
          return next(err);
        }

        if (found_genre) {
          // Redirect to details page
          res.redirect(found_genre.url);
        } else {
          // Save the new Genre name
          genre.save(function(err) {
            if (err) {
              return next(err);
            }
            // res.redirect(genre.url);
            res.redirect(genre.list_url);
          });
        }
      });
  }
};

// Display Genre delete form on GET
exports.genre_delete_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Genre delete GET');
};

// Handle Genre delete on POST
exports.genre_delete_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Genre delete POST');
};

// Display Genre update form on GET
exports.genre_update_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Genre update GET');
};

// Handle Genre update on POST
exports.genre_update_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Genre update POST');
};
