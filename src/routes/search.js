const express = require('express');
const router = express.Router();
const { searchLostItem } = require('../controllers/searchController');

router.post('/', searchLostItem); // POST /api/v1/search

module.exports = router;
