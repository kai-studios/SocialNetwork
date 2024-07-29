// middleware/adminMiddleware.js
function checkAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.redirect('/not-authorized');
    }
}

module.exports = checkAdmin;
