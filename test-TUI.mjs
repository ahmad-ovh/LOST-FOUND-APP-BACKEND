// Lazy created AI script for TUI based testing. [Tool]
import inquirer from 'inquirer';
import axios from 'axios';


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
    { name: 'location', message: 'Location:' },
    { name: 'contact', message: 'Contact (email/phone):' },
    { name: 'imageUrl', message: 'Image URL (optional):', default: '' },
  ]);

  try {
    const res = await axios.post(`${API_BASE}/items`, answers);
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
    console.log('📦 Items:', res.data);
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
  } catch (err) {
    console.error('❌ Error:', err.response?.data || err.message);
  }

  mainMenu();
};

const searchLostItem = async () => {
  const { query } = await inquirer.prompt([{ name: 'query', message: 'Lost item description:' }]);

  try {
    const res = await axios.post(`${API_BASE}/search`, { query });
    console.log('🔎 Search results:', res.data);
  } catch (err) {
    console.error('❌ Error:', err.response?.data || err.message);
  }

  mainMenu();
};

// Start
mainMenu();
