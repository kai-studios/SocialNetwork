// routes/admin.js
const express = require('express');
const router = express.Router();
const checkAdmin = require('../middleware/adminMiddleware');

router.get('/admin', checkAdmin, (req, res) => {
    res.render('admin', { user: req.user });
});

router.get('/firebase', checkAdmin, (req, res) => {
    res.render('firebase', { user: req.user });
});

router.get('/not-authorized', (req, res) => {
    res.render('not-authorized');
});

module.exports = router;
