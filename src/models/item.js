const mongoose = require('mongoose');
const Counter = require('./counter');

const itemSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  status: { type: String, enum: ['found', 'lost'], default: 'found' },
  name: { type: String, required: true },
  description: { type: String, required: true }, // original description, saved just incase
  summary: { type: String }, // ai gen summary
  category: { type: String },
  tags: { type: [String], default: [] },
  location: { type: String , required: true}, 
  address: { type: String },  // self reminder: useless at the moment, incase GMAPS is implemented - just added for REST API structure

  contact: { type: String, required: true },
  imageUrl: { type: String, default: null },

  submittedAt: { type: Date },  // user inputted time & date merged
  createdAt: { type: Date, default: Date.now }, // when was report sent
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
