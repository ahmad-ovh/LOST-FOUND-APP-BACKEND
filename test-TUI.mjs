import inquirer from 'inquirer';
import axios from 'axios';
import fs from 'fs';

const API_BASE = 'http://localhost:5000/api/v1';

const mainMenu = async () => {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'Choose an API action:',
      choices: [
        'Report Found Item (POST /items)',
        'Browse All Items (GET /items)',
        'Get Item by ID (GET /items/:id)',
        'Search Lost Item (POST /search)',
        'Exit',
      ],
    },
  ]);

  switch (action) {
    case 'Report Found Item (POST /items)':
      return createItem();
    case 'Browse All Items (GET /items)':
      return getAllItems();
    case 'Get Item by ID (GET /items/:id)':
      return getItemById();
    case 'Search Lost Item (POST /search)':
      return searchLostItem();
    case 'Exit':
      console.log('Goodbye!');
      process.exit(0);
  }
};

const createItem = async () => {
  const answers = await inquirer.prompt([
    { name: 'name', message: 'Item name:' },
    { name: 'description', message: 'Description:' },
    { name: 'place', message: 'Place where item was found:' },
    { name: 'contact', message: 'Contact (email):' },
    { name: 'date', message: 'Date (DD/MM/YYYY) (optional):', default: '' },
    { name: 'time', message: 'Time (HH:MM) (optional):', default: '' },
    { name: 'address', message: 'Address (optional):', default: '' },
    {
      name: 'imagePath',
      message: 'Path to image file (optional):',
      default: '',
    },
  ]);

  // Convert image to base64 if provided
  let imageBase64 = '';
  if (answers.imagePath) {
    try {
      const buffer = fs.readFileSync(answers.imagePath);
      const ext = answers.imagePath.split('.').pop();
      imageBase64 = `data:image/${ext};base64,${buffer.toString('base64')}`;
    } catch (err) {
      console.warn('⚠️ Could not read image file. Skipping image.');
    }
  }

  const payload = {
    name: answers.name,
    description: answers.description,
    place: answers.place,
    contact: answers.contact,
    date: answers.date || undefined,
    time: answers.time || undefined,
    address: answers.address || undefined,
    image: imageBase64 || undefined,
  };

  try {
    const res = await axios.post(`${API_BASE}/items`, payload);
    console.log('✅ Item created:', res.data);
  } catch (err) {
    console.error('❌ Error:', err.response?.data || err.message);
  }

  mainMenu();
};

const getAllItems = async () => {
  const answers = await inquirer.prompt([
    { name: 'page', message: 'Page number (optional):', default: 1 },
    { name: 'limit', message: 'Limit (optional):', default: 20 },
  ]);

  try {
    const res = await axios.get(`${API_BASE}/items`, { params: answers });
    console.log('📦 Items:');
    res.data.forEach((item) => {
      console.log(`- [${item.id}] ${item.name} (${item.location})`);
      if (item.image) console.log('  📷 Image available (base64)');
    });
  } catch (err) {
    console.error('❌ Error:', err.response?.data || err.message);
  }

  mainMenu();
};

const getItemById = async () => {
  const { id } = await inquirer.prompt([{ name: 'id', message: 'Item ID:' }]);

  try {
    const res = await axios.get(`${API_BASE}/items/${id}`);
    console.log('📄 Item:', res.data);
    if (res.data.image) console.log('📷 Image available (base64)');
  } catch (err) {
    console.error('❌ Error:', err.response?.data || err.message);
  }

  mainMenu();
};

const searchLostItem = async () => {
  const { query } = await inquirer.prompt([{ name: 'query', message: 'Lost item description:' }]);

  try {
    const res = await axios.post(`${API_BASE}/search`, { query });
    console.log('🔎 Search results:');
    res.data.forEach((result) => {
      console.log(`- [${result.item.id}] ${result.item.name} (Match: ${result.matchPercentage})`);
      if (result.item.image) console.log('  📷 Image available (base64)');
    });
  } catch (err) {
    console.error('❌ Error:', err.response?.data || err.message);
  }

  mainMenu();
};

// Start
mainMenu();
