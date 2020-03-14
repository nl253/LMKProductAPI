const express = require('express');
const router = express.Router();

router.get('/check-health', (req, res, next) => res.end('OK'));

module.exports = router;
