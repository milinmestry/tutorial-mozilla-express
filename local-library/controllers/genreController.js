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
  var errors = [];
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
        title: 'Genre Details', genre: results.genre,
        genre_books: results.genre_books, errors: errors
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
            res.redirect(genre.url_list);
          });
        }
      });
  }
};

// Display Genre delete form on GET
exports.genre_delete_get = function(req, res, next) {
  async.parallel({
    genre: function(callback) {
      Genre.findById(req.params.id).exec(callback);
    },
    genres_books: function(callback) {
      Book.find({'genre': req.params.id}).exec(callback);
    },
  }, function(err, results) {
    if (err) {
      return next(err);
    }
    res.render('genre_delete', {title: 'Delete Genre', genre: results.genre
      , genre_books: results.genres_books});
  });
};

// Handle Genre delete on POST
exports.genre_delete_post = function(req, res, next) {
  req.checkBody('genre_id', 'Genre id must exists.').notEmpty();

  async.parallel({
    genre: function(callback) {
      Genre.findById(req.params.genre_id).exec(callback);
    },
    genres_books: function(callback) {
      Book.find({'genre': req.params.genre_id}, 'title summary').exec(callback);
    },
  }, function(err, results) {
    if (err) {
      return next(err);
    }
    // Success
    if (results.genres_books.length > 0) {
      // Genre has book(s), render in same way as in GET route.
      res.render('genre_delete', {title: 'Delete Genre', genre: results.genre
        , author_books: results.genres_books});
      return;
    } else {
      // Genre has no book(s), Delete object and return to author list page.
      Genre.findByIdAndRemove(req.body.genre_id, function deleteGenre(err) {
        if (err) {
          return next(err);
        }
        // res.redirect('/catalog/genres');
        var genre = new Genre();
        res.redirect(genre.url_list);
      });
    }
  });
};

// Display Genre update form on GET
exports.genre_update_get = function(req, res, next) {
  req.sanitize('id').escape().trim();

  Genre.findById(req.params.id).exec(function (err, genre) {
    if (err) {
      return next(err);
    }
    res.render('genre_form', { title: 'Update Genre', genre: genre });
  });
};

// Handle Genre update on POST
exports.genre_update_post_ORG = function(req, res, next) {
  async.parallel({
    genreFound: function(callback) {
      // No name is provided, just return -1
      if (req.body.name === '') {
        // https://stackoverflow.com/questions/20186081/understanding-node-js-async-parallel
        callback(null, -1);
      } else {
        Genre.find().isGenreExists(req.body.name, req.params.id).exec(callback);
      }
    },
  }, function(err, results) {
    if (err) {
      return next(err);
    }

    req.sanitize('id').escape().trim();
    req.checkBody('name', 'Genre name required.').notEmpty();
    req.sanitize('name').escape().trim();

    var errors = req.validationErrors();

    if (results.genreFound > 0) {
      errors = [{msg: 'Genre already exists!'}];
    }

    var genre = new Genre({
      _id: req.params.id,
      name: req.body.name
    });
// console.log('#234 ' + JSON.stringify(errors));
    if (errors) {
      res.render('genre_form', {title: 'Update Genre', genre: genre, errors: errors});
      return;
    } else {
      // Save the new Genre name
      Genre.findByIdAndUpdate(req.params.id, genre, {}, function(err, theGenre) {
        if (err) {
          return next(err);
        }
        res.redirect(theGenre.url);
      });
    }
  });
};

exports.genre_update_post = function(req, res, next) {
  req.sanitize('id').escape().trim();
  req.checkBody('name', 'Genre name required.').notEmpty(),
  req.checkBody('name', 'Genre already exists!')
    .exists()
    .custom((value) => {
      // console.log('#212 value=' + value);
      // console.log('#213 id=' + req.params.id);
      return Genre.find().isGenreExists(value, req.params.id).exec();
    });
  req.sanitize('name').escape().trim();

  var errors = req.validationErrors();

  var genre = new Genre({
    _id: req.params.id,
    name: req.body.name
  });

  if (errors) {
    res.render('genre_form', {title: 'Update Genre', genre: genre, errors: errors});
    return;
  } else {
    // Save the new Genre name
    Genre.findByIdAndUpdate(req.params.id, genre, {}, function(err, theGenre) {
      if (err) {
        return next(err);
      }
      res.redirect(theGenre.url);
    });
  }
};