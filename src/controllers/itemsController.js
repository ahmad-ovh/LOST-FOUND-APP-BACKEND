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

    // base64 -> buffer
    let imageData = null;
    let contentType = null;

    if (parsed.image) {
      const matches = parsed.image.match(/^data:(.+);base64,(.+)$/);
      if (matches) {
        contentType = matches[1];
        imageData = Buffer.from(matches[2], "base64");
      }
    }

    const newItem = new Item({
      name: parsed.name,
      description: parsed.description,   // keep original
      summary: aiResult.summary,         // AI summary
      category: aiResult.category,
      tags: aiResult.tags,
      location: parsed.place,
      address: parsed.address || null,
      contact: parsed.contact,
      image: imageData
        ? { data: imageData, contentType }
        : undefined,
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

const convertImageToBase64 = (image) => {
  if (!image || !image.data) return null;
  return `data:${image.contentType};base64,${image.data.toString('base64')}`;
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

    const response = items.map(i => ({
      ...i.toObject(),
      image: convertImageToBase64(i.image),
    }));

    return res.status(200).json(response);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

const getItemById = async (req, res) => {
  try {
    const item = await Item.findOne({ id: req.params.id });
    if (!item) return res.status(404).json({ error: 'Item not found' });

    return res.status(200).json({
      ...item.toObject(),
      image: convertImageToBase64(item.image),
    });
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
