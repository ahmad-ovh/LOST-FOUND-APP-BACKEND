const mongoose = require('mongoose');
const Counter = require('./counter');

const itemSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  status: { type: String, enum: ['found', 'lost'], default: 'found' },
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String },
  tags: { type: [String], default: [] },
  location: { type: String, required: true },
  contact: { type: String, required: true },
  imageUrl: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
});

// Increment ID/index before save
itemSchema.pre('save', async function (next) {
  if (this.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { name: 'items' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.id = counter.seq;
  }
  next();
});

module.exports = mongoose.model('Item', itemSchema);
