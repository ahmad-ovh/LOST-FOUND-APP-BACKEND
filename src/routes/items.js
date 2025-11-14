const express = require('express');
const router = express.Router();

const { createItem, getAllItems, getItemById } = require('../controllers/itemsController');

router.post('/', createItem);       // POST /api/v1/items
router.get('/', getAllItems);       // GET /api/v1/items
router.get('/:id', getItemById);    // GET /api/v1/items/:id

module.exports = router;
