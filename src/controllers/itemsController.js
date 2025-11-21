const Item = require('../models/item');
const { createItemSchema } = require('../utils/validator');

const AI = require('../services/aiService');

const createItem = async (req, res) => {
  try {
    const parsed = createItemSchema.parse(req.body);
    let submittedAt = new Date();
    if (parsed.date && parsed.time) {
      const [day, month, year] = parsed.date.split('/');
      const [hours, minutes] = parsed.time.split(':');
      submittedAt = new Date(year, month - 1, day, hours, minutes);
    }

    const aiResult = await AI.processItemDescription(parsed.description);

    const newItem = new Item({
      name: parsed.name,
      description: parsed.description,   // keep original
      summary: aiResult.summary,         // AI summary
      category: aiResult.category,
      tags: aiResult.tags,
      location: parsed.place,
      address: parsed.address || null,
      contact: parsed.contact,
      imageUrl: parsed.image || null,
      submittedAt,
    });

    await newItem.save();

    return res.status(201).json(newItem);
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: err.issues.map(e => e.message).join(', ') });
    }
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

const getAllItems = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const items = await Item.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json(items);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

const getItemById = async (req, res) => {
  try {
    const item = await Item.findOne({ id: req.params.id });
    if (!item) return res.status(404).json({ error: 'Item not found' });

    return res.status(200).json(item);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  createItem,
  getAllItems,
  getItemById,
};
