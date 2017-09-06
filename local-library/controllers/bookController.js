var Book = require('../models/book');
var Author = require('../models/author');
var Genre = require('../models/genre');
var BookInstance = require('../models/bookinstance');

var async = require('async');

exports.index = function(req, res) {
  // res.send('NOT IMPLEMENTED: Site Home Page');
  async.parallel({
      book_count: function(callback) {
        Book.count(callback);
      },
      bookinstance_count: function(callback) {
        BookInstance.count(callback);
      },
      bookinstance_available_count: function(callback) {
        BookInstance.count({status: 'Available'}, callback);
      },
      author_count: function(callback) {
        Author.count(callback);
      },
      genre_count: function(callback) {
        Genre.count(callback);
      },
    }, function(err, results) {
      res.render('index', {title: 'Local Library Home', error: err, data: results});
    }
  );
};

// Display list of all books
exports.book_list = function(req, res, next) {
  Book.find({}, 'title author ')
    .populate('author')
    .exec(function(err, list_books) {
      if (err) {
        return next(err);
      }
      // Success
      res.render('book_list', {title: 'Book List', book_list: list_books});
    });
};

// Display detail page for a specific book
exports.book_detail = function(req, res, next) {
  var errors = [];
  if (req.query.message === 'noidel') {
    errors.push('Missing information on delete page, please try again.');
  }

  async.parallel({
    book: function(callback) {
      Book.findById(req.params.id)
        .populate('author')
        .populate('genre')
        .exec(callback);
    },
    book_instance: function(callback) {
      BookInstance.find({'book': req.params.id})
        // .populate('book')
        .exec(callback);
    },
  }, function(err, results) {
    if (err) {
      return next(err);
    }
    // Success, render template
    res.render('book_detail', {title: 'Book Detail'
      , book: results.book, book_instances: results.book_instance, errors: errors});
  });
};

// Display book create form on GET
exports.book_create_get = function(req, res, next) {
  // Get all authors and genres which is required for a book
  async.parallel({
    authors: function(callback) {
      Author.find(callback);
    },
    genres: function(callback) {
      Genre.find(callback);
    },
  }, function(err, results) {
    if (err) {
      return next(err);
    }
    res.render('book_form', {title: 'Create Book', authors: results.authors
      , genres: results.genres});
  });
};

// Handle book create on POST
exports.book_create_post = function(req, res, next) {
  req.checkBody('title', 'Book Title is required.').notEmpty();
  req.checkBody('author', 'Book Author is required.').notEmpty();
  req.checkBody('summary', 'Book Summary is required.').notEmpty();
  req.checkBody('isbn', 'Book ISBN is required.').notEmpty();

  req.sanitize('title').escape();
  req.sanitize('title').trim();
  req.sanitize('author').escape();
  req.sanitize('author').trim();
  req.sanitize('summary').escape();
  req.sanitize('summary').trim();
  req.sanitize('isbn').escape();
  req.sanitize('isbn').trim();
  req.sanitize('genre').escape();

  var book = new Book({
    title: req.body.title,
    author: req.body.author,
    summary: req.body.summary,
    isbn: req.body.isbn,
    genre: (typeof req.body.genre === 'undefined') ? [] : req.body.genre.split(','),
  });

  // console.log('Book: ' + book);

  var errors = req.validationErrors();
  if (errors) {
    async.parallel({
      authors: function(callback) {
        Author.find(callback);
      },
      genres: function(callback) {
        Genre.find(callback);
      },
    }, function(err, results) {
      if (err) {
        return next(err);
      }
      // Mark our selected genres as checked
      for (var i = 0; i < results.generes.length; i++) {
        if (book.generes.indexOf(results.generes[i]._id > -1)) {
          //Current genre is selected. Set "checked" flag.
          results.genres[i].checked = 'true';
        }
      }

      res.render('book_form', {title: 'Create Book', authors: results.authors
        , genres: results.genres, book: book, errors: errors});
    });
  } else {
    // Save the data
    book.save(function(err) {
      if (err) {
        return next(err);
      }
      res.redirect(book.url_list);
    });
  }
};

// Display book delete form on GET
exports.book_delete_get = function(req, res, next) {
  Book.findById(req.params.id, 'title')
    .exec(function(err, book) {
      if (err) {
        return next(err);
      }
      // Success
      res.render('book_delete', {title: 'Delete Book', book: book});
    });
};

// Handle book delete on POST
exports.book_delete_post = function(req, res) {
  req.checkBody('book_id', 'Book id must exists.').notEmpty();

  var errors = req.validationErrors();
  // console.log(' ERROR : ' + errors);
  if (errors) {
    var book = new Book({
      _id: req.params.id,
    });
    // Redirect to detail page
    res.redirect(book.url + '?message=noidel');
    return;
  }

  // Book has no book copy/copies, Delete object and return to book list page.
  Book.findByIdAndRemove(req.body.book_id, function deleteBook(err) {
    if (err) {
      return next(err);
    }
    var book = new Book();
    res.redirect(book.url_list);
  });
};

// Display book update form on GET
exports.book_update_get = function(req, res, next) {
  req.sanitize('id').escape().trim();

  // Get Book, Genre, Author for the form
  async.parallel({
    book: function(callback) {
      Book.findById(req.params.id).populate('genre').populate('author').exec(callback);
    },
    authors: function(callback) {
      Author.find().exec(callback);
    },
    genres: function(callback) {
      Genre.find().exec(callback);
    },
  }, function(err, results) {
    if (err) {
      return next(err);
    }

    // Mark selected genres as checked
    for (var i = 0; i < results.genres.length; i++) {
      for (var b = 0; b < results.book.genre.length; b++) {
        if (results.genres[i]._id.toString() == results.book.genre[b]._id.toString()) {
          results.genres[i].checked = 'true';
        }
      }
    }

    res.render('book_form', {title: 'Update Book', authors: results.authors
      , genres: results.genres, book: results.book});
  });
};

// Handle book update on POST
exports.book_update_post = function(req, res, next) {
  req.sanitize('id').escape().trim();

  req.checkBody('title', 'Book Title is required.').notEmpty();
  req.checkBody('author', 'Book Author is required.').notEmpty();
  req.checkBody('summary', 'Book Summary is required.').notEmpty();
  req.checkBody('isbn', 'Book ISBN is required.').notEmpty();


  req.sanitize('title').escape().trim();
  req.sanitize('author').escape().trim();
  req.sanitize('summary').escape().trim();
  req.sanitize('isbn').escape().trim();
  req.sanitize('genre').escape().trim();


  var book = new Book({
    _id: req.params.id, // This is required, or else new id will be assigned.
    title: req.body.title,
    author: req.body.author,
    summary: req.body.summary,
    isbn: req.body.isbn,
    genre: (typeof req.body.genre === 'undefined') ? [] : req.body.genre.split(','),
  });

  var errors = req.validationErrors();
  if (errors) {
    async.parallel({
      authors: function(callback) {
        Author.find(callback);
      },
      genres: function(callback) {
        Genre.find(callback);
      },
    }, function(err, results) {
      if (err) {
        return next(err);
      }
      // Mark our selected genres as checked
      for (var i = 0; i < results.generes.length; i++) {
        if (book.generes.indexOf(results.generes[i]._id > -1)) {
          // Current genre is selected. Set "checked" flag.
          results.genres[i].checked = 'true';
        }
      }

      res.render('book_form', {title: 'Update Book', authors: results.authors
        , genres: results.genres, book: book, errors: errors});
    });
  } else {
    // Save the data
    Book.findByIdAndUpdate(req.params.id, book, {}, function(err, thebook) {
      if (err) {
        return next(err);
      }
      res.redirect(thebook.url);
    });
  }
};