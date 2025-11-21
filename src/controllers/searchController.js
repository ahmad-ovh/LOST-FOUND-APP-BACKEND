const Item = require('../models/item');
const AI = require('../services/aiService');

const convertImageToBase64 = (image) => {
  if (!image || !image.data) return null;
  return `data:${image.contentType};base64,${image.data.toString('base64')}`;
};


const searchLostItem = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || query.trim() === '') {
      return res.status(400).json({ error: 'Search query cannot be empty.' });
    }

    const items = await Item.find({ status: 'found' });

    // remove unnecessary fields to cut down on api costs 🤪🤪
    const simplifiedItems = items.map(i => ({
      id: i.id,
      name: i.name,
      description: i.description,
      category: i.category,
      tags: i.tags,
    }));

    const matches = await AI.matchLostItem(query, simplifiedItems);

        // if you're seeing this, just know that my head hurt from this little thing. please spare me.. 🥲
    const results = matches
      .map(match => {
        const item = items.find(i => i.id === match.id);
        if (!item) return null;
        return {
          matchPercentage: match.matchPercentage,
          item: {
            id: item.id,
            status: item.status,
            name: item.name,
            description: item.description,
            category: item.category,
            tags: item.tags,
            location: item.location,
            contact: item.contact,
            image: item.image ? convertImageToBase64(item.image) : null,
            createdAt: item.createdAt,
          },
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.matchPercentage - a.matchPercentage);

    return res.status(200).json(results);
  } catch (err) {
    console.error('Search error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { searchLostItem };
