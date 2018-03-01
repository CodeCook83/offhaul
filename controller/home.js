/**
 * GET /
 */
exports.index = function (req, res) {
  res.render('home/index', {
    title: 'Home'
  })
}

/**
 * GET /about
 */
exports.about = function (req, res) {
  res.render('home/about', {
    title: 'About'
  });
}