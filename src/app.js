const express = require('express');
const cors = require('cors');
const morgan = require('morgan')
const itemRoutes = require('./routes/items');
const searchRoutes = require('./routes/search');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/v1/items', itemRoutes);
app.use('/api/v1/search', searchRoutes);

//Temporary Root Route
app.get('/', (req, res) => res.json({ status: 'No Route Specified, refer to documentation' }));
//Basic Health CHeck
app.get('/health', (req, res) => res.json({ status: 'Healthy' }));

module.exports = app;