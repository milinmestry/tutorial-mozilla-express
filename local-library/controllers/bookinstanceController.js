var BookInstance = require('../models/bookinstance');
var Book = require('../models/book');

var async = require('async');


// Display list of all BookInstances
exports.bookinstance_list = function(req, res) {
  BookInstance.find()
    .populate('book')
    .exec(function(err, list_bookinstances) {
      if (err) {
        return next(err);
      }
      // Render the view
      res.render('bookinstance_list', {title: 'Book Instance List', bookinstance_list: list_bookinstances});
    });
};

// Display detail page for a specific BookInstance
exports.bookinstance_detail = function(req, res, next) {
  var errors = [];
  if (req.query.message === 'noidel') {
    errors.push('Missing information on delete page.');
  }
  console.log('error: ' + errors);

  BookInstance.findById(req.params.id)
    .populate('book')
    .exec(function(err, bookinstance){
      if (err) {
        return next(err);
      }
      // Render template
      res.render('bookinstance_detail', {title: 'Book Instance'
        , bookinstance: bookinstance, errors: errors});
    });
};

// Display BookInstance create form on GET
exports.bookinstance_create_get = function(req, res, next) {
  Book.find({}, 'title')
    .exec(function(err, books) {
      if (err) {
        return next(err);
      }
      // Render template
      res.render('bookinstance_form', {title: 'Create BookInstance', book_list: books});
    });
};

// Handle BookInstance create on POST
exports.bookinstance_create_post = function(req, res, next) {
  req.checkBody('book', 'Book must be specified.').notEmpty();
  req.checkBody('imprint', 'Imprint must be specified.').notEmpty();
  // req.checkBody('due_back', 'Due back has Invalid date.').optional({checkFalsy: true}).isDate();

  req.sanitize('book').escape();
  req.sanitize('book').trim();
  req.sanitize('imprint').escape();
  req.sanitize('imprint').trim();
  req.sanitize('status').escape();
  req.sanitize('status').trim();
  req.sanitize('due_back').toDate();

  var bookinstance = new BookInstance({
    book: req.body.book,
    imprint: req.body.imprint,
    status: req.body.status,
    due_back: req.body.due_back,
  });

  var errors = req.validationErrors();

  if (errors) {
    Book.find({}, 'title')
      .exec(function(err, books) {
        if (err) {
          return next(err);
        }
        // Render template
        res.render('bookinstance_form', {title: 'Create BookInstance'
          , book_list: books, bookinstance: bookinstance, errors: errors
          , selected_book: bookinstance._id});
      });
    return;
  } else {
    // Save the data
    bookinstance.save(function(err) {
      if (err) {
        return next(err);
      }
      res.redirect(bookinstance.url_list);
    });
  }

};

// Display BookInstance delete form on GET
exports.bookinstance_delete_get = function(req, res, next) {
  async.parallel({
    bookinstance: function(callback) {
      BookInstance.findById(req.params.id).populate('book').exec(callback);
    },
  }, function(err, results) {
    if (err) {
      return next(err);
    }
    res.render('bookinstance_delete', {title: 'Delete BookInstance'
      , bookinstance: results.bookinstance});
  });
};

// Handle BookInstance delete on POST
exports.bookinstance_delete_post = function(req, res, next) {
  req.checkBody('bookinstance_id', 'BookInstance id must exists.').notEmpty();

  var errors = req.getValidationResult();

  if (errors) {
    var bookinstance = new BookInstance({
      _id: req.params.id,
    });
    // Redirect to detail page
    res.redirect(bookinstance.url + '?message=noidel');
  }

  // BookInstance has no book(s), Delete object and return to author list page.
  BookInstance.findByIdAndRemove(req.body.bookinstance_id, function deleteBookInstance(err) {
    if (err) {
      return next(err);
    }
    var bookinstance = new BookInstance();
    res.redirect(bookinstance.url_list);
  });
};

// Display BookInstance update form on, next GET
exports.bookinstance_update_get = function(req, res) {
  res.send('NOT IMPLEMENTED: bookinstance update GET');
};

// Handle BookInstanceokinstance update on POST
exports.bookinstance_update_post = function(req, res) {
  res.send('NOT IMPLEMENTED: BookInstance update POST');
};
