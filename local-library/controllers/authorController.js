var author = require('../models/author');

// Display list of all authors
exports.author_list = function(req, res) {
  res.send('NOT IMPLEMENTED: author list');
};

// Display detail page for a specific author
exports.author_detail = function(req, res) {
  res.send('NOT IMPLEMENTED: author detail ' + req.params.id);
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

