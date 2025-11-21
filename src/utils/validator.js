const { z } = require('zod');

const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/; // DD/MM/YYYY
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; // HH:MM (24h)

const createItemSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  location: z.string().min(1),
  contact: z.email(),

  date: z.string().regex(dateRegex, "Invalid date format DD/MM/YYYY").optional(),
  time: z.string().regex(timeRegex, "Invalid time format HH:MM").optional(),

  image: z.string().optional().nullable(), // base64 enc string atm, i hope..
  address: z.string().optional(),
});


module.exports = { createItemSchema };
