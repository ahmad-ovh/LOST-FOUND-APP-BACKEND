const { z } = require('zod');

const createItemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  location: z.string().min(1, 'Location is required'),
  contact: z.string().min(1, 'Contact is required'),
  imageUrl: z.string().url().optional(),
});

module.exports = { createItemSchema };
